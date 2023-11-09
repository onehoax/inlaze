import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/entities/role.entity';
import { DeepPartial } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({ required: true })
  full_name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({ required: true, type: Number, example: { id: 1 } })
  role: DeepPartial<Role>;
}
