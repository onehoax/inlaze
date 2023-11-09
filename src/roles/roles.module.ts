import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => UsersModule)],
  exports: [TypeOrmModule],
})
export class RolesModule {}
