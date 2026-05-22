import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async create(data: { email: string; name: string; password: string }) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async findAll() {
  return this.usersRepo.find({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
}

