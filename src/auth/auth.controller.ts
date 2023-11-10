import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    description:
      'login as a user with email and passowrd; returns a JWT which you can then attach to request headers for endpoints that require authentication.',
  })
  @ApiNotFoundResponse({
    description:
      'not found response if user with email is not found in the db.',
  })
  @ApiUnauthorizedResponse({
    description:
      'unauthorizes response if passowrd does not match for email in the db.',
  })
  @ApiBadRequestResponse({
    description: 'bad request response if criteria in description is not met.',
  })
  @ApiOkResponse({
    type: AuthEntity,
    description:
      'returns a JWT which you can then attach to request headers for endpoints that require authentication.',
  })
  async login(@Body() { email, password }: LoginDto) {
    const authEntity = await this.authService.login(email, password);
    return authEntity;
  }
}
