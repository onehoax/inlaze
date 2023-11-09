import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // if role is not null, check that the role exists
    if (createUserDto.role.id !== null) {
      const role = await this.roleRepository.findOne({
        where: {
          id: createUserDto.role.id,
          is_deleted: false,
        },
      });

      if (role) return this.userRepository.save(createUserDto);
      else
        throw new NotFoundException(
          `Role with id: ${createUserDto.role.id} does not exits.`,
        );
    } else {
      return this.userRepository.save(createUserDto);
    }
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
    // if role is not null, check that the role exists
    if (updateUserDto.role.id !== null) {
      const role = await this.roleRepository.findOne({
        where: {
          id: updateUserDto.role.id,
          is_deleted: false,
        },
      });

      if (role)
        return this.userRepository.update(
          { id: id, is_deleted: false },
          updateUserDto,
        );
      else
        throw new NotFoundException(
          `Role with id: ${updateUserDto.role.id} does not exits.`,
        );
    } else {
      return this.userRepository.update(
        { id: id, is_deleted: false },
        updateUserDto,
      );
    }
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
