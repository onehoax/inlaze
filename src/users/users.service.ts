import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(
      { id: id, is_deleted: false },
      updateUserDto,
    );
  }

  remove(id: number) {
    return this.userRepository.update(
      { id: id, is_deleted: false },
      { is_deleted: true },
    );
  }
}
