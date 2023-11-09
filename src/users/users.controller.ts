import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'records affected' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateUserDto);
    return result;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'records affected' })
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(+id);
    return result;
  }
}
