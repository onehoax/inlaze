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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    description: 'create a new role; the role must be new (name).',
  })
  @ApiBadRequestResponse({
    description: 'bad request response if criteria in description is not met.',
  })
  @ApiCreatedResponse({ type: Role })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return role;
  }

  @Get()
  @ApiOperation({
    description: 'get all roles.',
  })
  @ApiOkResponse({ type: Role, isArray: true })
  async findAll() {
    const roles = await this.rolesService.findAll();
    return roles;
  }

  @Get(':id')
  @ApiOperation({
    description: 'get a single role by id.',
  })
  @ApiNotFoundResponse({
    description: 'not found response if role is not present in the role table.',
  })
  @ApiOkResponse({ type: Role })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.rolesService.findOne(id);

    if (!role)
      throw new NotFoundException(`Role with id: ${id} does not exist.`);

    return role;
  }

  @Patch(':id')
  @ApiOperation({
    description:
      'update a role by id; the role must be present in in the role table; the new name must not conflict with existing ones.',
  })
  @ApiNotFoundResponse({
    description: 'not found response if role is not present in the role table.',
  })
  @ApiBadRequestResponse({
    description: 'bad request response if criteria in description is not met.',
  })
  @ApiOkResponse({ description: 'records affected' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const result = await this.rolesService.update(id, updateRoleDto);

    if (result.affected === 0)
      throw new NotFoundException(`Role with id: ${id} does not exist.`);

    return result.affected;
  }

  @Delete(':id')
  @ApiOperation({
    description:
      'soft delete a role by id; the role must be present in in the role table.',
  })
  @ApiNotFoundResponse({
    description: 'not found response if role is not present in the role table.',
  })
  @ApiBadRequestResponse({
    description: 'bad request response if criteria in description is not met.',
  })
  @ApiOkResponse({ description: 'records affected' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.rolesService.remove(id);

    if (result.affected === 0)
      throw new NotFoundException(`Role with id: ${id} does not exist.`);

    return result.affected;
  }
}
