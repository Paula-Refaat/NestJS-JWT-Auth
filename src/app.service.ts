import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async register(data: any): Promise<User> {
    return await this.userRepository.save(data);
  }

  async findOne(condition:any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: condition,
      select: ['id', 'password', 'name', 'email'],
    });
    return user;
  }
}
