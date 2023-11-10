import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // step 1: fetch a user with the given email
    const user = await this.userRepository.findOne({ where: { email: email } });

    // if no user is found, throw an error
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);

    // step 2: check if the password is correct
    const isPwdValid = await bcrypt.compare(password, user.password);

    // if password does not match, throw an error
    if (!isPwdValid) throw new UnauthorizedException('Invalid password');

    // step 3: generate a JWT containing the user's id and
    return {
      accessToken: this.jwtService.sign(
        { userId: user.id }, // { secret: process.env.JWT_SECRET },
      ),
    };
  }
}
