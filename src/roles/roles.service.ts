import { Injectable } from '@nestjs/common';
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

  create(createRoleDto: CreateRoleDto) {
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

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(
      { id: id, is_deleted: false },
      updateRoleDto,
    );
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (role) {
      await this.userRepository.update(
        { role: { id: role.id } },
        { role: { id: null } },
      );

      const deletedRole = await this.roleRepository.findOne({
        where: { name: role.name, is_deleted: true },
      });

      if (deletedRole) await this.roleRepository.delete(deletedRole.id);
    }

    return this.roleRepository.update(
      { id: id, is_deleted: false },
      { is_deleted: true },
    );
  }
}
