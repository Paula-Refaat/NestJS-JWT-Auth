import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from './user.entity';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.appService.register({
      name,
      email,
      password: hashedPassword,
    });
    return plainToInstance(User, user); // This will exclude the password
  }
}
