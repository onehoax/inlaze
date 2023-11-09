import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    description:
      'create a new user; the user must be new (email); if role.id is not null, its value must be present in the role table.',
  })
  @ApiBadRequestResponse({
    description: 'bad request response if criteria in description is not met.',
  })
  @ApiNotFoundResponse({
    description: 'not found response if role is not present in the role table.',
  })
  @ApiCreatedResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Get()
  @ApiOperation({
    description: 'get all users.',
  })
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get(':id')
  @ApiOperation({
    description: 'get a single user by id.',
  })
  @ApiNotFoundResponse({
    description:
      'not found response if user is not present in the app_user table.',
  })
  @ApiOkResponse({ type: User })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} does not exist.`);

    return user;
  }

  @Patch(':id')
  @ApiOperation({
    description:
      'update a user by id; the user must be present in in the app_user table; the new email must not conflict with existing ones; if role.id is not null, its value must be present in the role table.',
  })
  @ApiNotFoundResponse({
    description:
      'not found response if user/role are not present in their respective tables.',
  })
  @ApiBadRequestResponse({
    description: 'bad request response if criteria in description is not met.',
  })
  @ApiOkResponse({ description: 'records affected' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.update(id, updateUserDto);

    if (result.affected === 0)
      throw new NotFoundException(`User with id: ${id} does not exist.`);

    return result.affected;
  }

  @Delete(':id')
  @ApiOperation({
    description:
      'soft delete a user by id; the user must be present in in the app_user table.',
  })
  @ApiNotFoundResponse({
    description:
      'not found response if user is not present in the app_user table.',
  })
  @ApiBadRequestResponse({
    description: 'bad request response if criteria in description is not met.',
  })
  @ApiOkResponse({ description: 'records affected' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.remove(id);

    if (result.affected === 0)
      throw new NotFoundException(`User with id: ${id} does not exist.`);

    return result.affected;
  }
}
