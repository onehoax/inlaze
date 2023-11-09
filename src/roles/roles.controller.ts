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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiCreatedResponse({ type: Role })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return role;
  }

  @Get()
  @ApiOkResponse({ type: Role, isArray: true })
  async findAll() {
    const roles = await this.rolesService.findAll();
    return roles;
  }

  @Get(':id')
  @ApiOkResponse({ type: Role })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const role = await this.rolesService.findOne(id);

    if (!role)
      throw new NotFoundException(`Role with id: ${id} does not exist.`);

    return role;
  }

  @Patch(':id')
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
  @ApiOkResponse({ description: 'records affected' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.rolesService.remove(id);

    if (result.affected === 0)
      throw new NotFoundException(`Role with id: ${id} does not exist.`);

    return result.affected;
  }
}
