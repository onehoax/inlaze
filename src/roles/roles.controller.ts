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
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
  @ApiConflictResponse({
    description: 'conflict response if role already exists in the db.',
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'update a role by id; the role must be present in in the role table; the new name must not conflict with existing ones.',
  })
  @ApiNotFoundResponse({
    description: 'not found response if role is not present in the role table.',
  })
  @ApiConflictResponse({
    description: 'conflict response if trying to update to existing name in db',
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
