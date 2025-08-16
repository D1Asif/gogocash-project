import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const user = await this.usersService.create(email, password, name);

    const { password: _, ...safe } = user;
    return safe;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);
    const payload = { sub: String(user.id), email: user.email };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token };
  }
}
