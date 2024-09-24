import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from './user.entity';
import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
  ) {}

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

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    let user = await this.appService.findOne(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalid email or password');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    user = plainToInstance(User, user);
    return {
      message: 'success',
      user,
      token: jwt,
    };
  }
}
