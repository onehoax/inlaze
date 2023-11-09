import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: { userId: number }) {
    console.log('PAYLOAD: ' + payload);
    const user = await this.userService.findOne(payload.userId);
    console.log('USER: ' + user);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
