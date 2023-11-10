import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // check that a user with the same email doesn't exist yet
    const email = createUserDto.email;
    const user = await this.userRepository.findOne({
      where: { email: email, is_deleted: false },
    });

    // if exists then there is a conflict
    if (user !== null)
      throw new ConflictException(
        `User with email: ${email} already exists in the db.`,
      );

    // if role is not null, check that the role exists
    if (createUserDto.role.id !== null) {
      const role = await this.roleRepository.findOne({
        where: {
          id: createUserDto.role.id,
          is_deleted: false,
        },
      });

      if (!role)
        throw new NotFoundException(
          `Role with id: ${createUserDto.role.id} does not exits.`,
        );
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find({
      relations: { role: true },
      where: {
        is_deleted: false,
      },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      relations: { role: true },
      where: {
        id: id,
        is_deleted: false,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const email = updateUserDto.email;
    if (email !== undefined) {
      // check that a user with the same email doesn't exist yet
      const user = await this.userRepository.findOne({
        where: { email: updateUserDto.email, is_deleted: false },
      });

      // if exists then there is a conflict
      if (user !== null)
        throw new ConflictException(
          `User with email: ${user.email} already exists in the db.`,
        );
    }

    // if role is not null, check that the role exists
    if (updateUserDto.role !== undefined) {
      if (updateUserDto.role.id !== undefined) {
        const role = await this.roleRepository.findOne({
          where: {
            id: updateUserDto.role.id,
            is_deleted: false,
          },
        });

        if (!role)
          throw new NotFoundException(
            `Role with id: ${updateUserDto.role.id} does not exits.`,
          );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.userRepository.update(
      { id: id, is_deleted: false },
      updateUserDto,
    );
  }

  async remove(id: number) {
    // check if the role to be deleted exists
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
    });

    // if user exists
    if (user) {
      // update app_user set roleId = null where id = id;
      // set the roleId to null in app_user for this user
      // because this user is deleted
      this.userRepository.update(id, { role: { id: null } });

      const deletedUser = await this.userRepository.findOne({
        where: { email: user.email, is_deleted: true },
      });

      // if there is an existing user with the same email
      // that was logically deleted before, delete it physically
      // so that there won't be a unique key constraint violation (email, is_deleted)
      // when soft-deleting this one
      if (deletedUser) await this.userRepository.delete(deletedUser.id);

      // finally, perform the soft-delete
      return this.userRepository.update(
        { id: id, is_deleted: false },
        { is_deleted: true },
      );
    } else {
      // if role doesn't exists, throw the corresponding exception
      throw new NotFoundException(`User with id: ${id} does not exist.`);
    }
  }
}
