import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    // check that a role with the same name doesn't exist yet
    const name = createRoleDto.name;
    const role = await this.roleRepository.findOne({
      where: { name: name, is_deleted: false },
    });

    // if exists then there is a conflict
    if (role !== null)
      throw new ConflictException(
        `Role with name: ${name} already exists in the db.`,
      );

    return this.roleRepository.save(createRoleDto);
  }

  findAll() {
    return this.roleRepository.find({ where: { is_deleted: false } });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // check that a role with the same name doesn't exist yet
    const role = await this.roleRepository.findOne({
      where: { name: updateRoleDto.name, is_deleted: false },
    });

    // if exists then there is a conflict
    if (role !== null)
      throw new ConflictException(
        `Role with name: ${role.name} already exists in the db.`,
      );

    return this.roleRepository.update(
      { id: id, is_deleted: false },
      updateRoleDto,
    );
  }

  async remove(id: number) {
    // check if the role to be deleted exists
    const role = await this.roleRepository.findOne({
      where: { id, is_deleted: false },
    });

    // if role exists
    if (role) {
      // update app_user set roleId = null where roleId = id;
      // set the roleId to null in app_user where roleId = id,
      // because this roleId can no longer be referenced
      this.userRepository.update(
        { role: { id: role.id } },
        { role: { id: null } },
      );

      const deletedRole = await this.roleRepository.findOne({
        where: { name: role.name, is_deleted: true },
      });

      // if there is an existing role with the same name
      // that was logically deleted before, delete it physically
      // so that there won't be a unique key constraint violation (name, is_deleted)
      // when soft-deleting this one
      if (deletedRole) await this.roleRepository.delete(deletedRole.id);

      // finally, perform the soft-delete
      return this.roleRepository.update(
        { id: id, is_deleted: false },
        { is_deleted: true },
      );
    } else {
      // if role doesn't exists, throw the corresponding exception
      throw new NotFoundException(`Role with id: ${id} does not exist.`);
    }
  }
}
