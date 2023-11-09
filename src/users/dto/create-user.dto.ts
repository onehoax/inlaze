import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';
import { DeepPartial } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  full_name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  phone: string;

  @ApiProperty({ required: true, type: Number, example: { id: 1 } })
  @IsObject()
  @IsNotEmptyObject()
  role: DeepPartial<Role>;
}
