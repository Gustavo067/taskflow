import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
    @InjectQueue('mail') private mailQueue: Queue,
    private usersService: UsersService,
  ) {}

  async findAll() {
    return this.tasksRepo.find();
  }

  async findOne(id: string) {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async create(dto: CreateTaskDto, createdById: string) {
    const createdBy = await this.usersService.findById(createdById);
    const assignee = dto.assigneeId
      ? await this.usersService.findById(dto.assigneeId)
      : undefined;  // ✅ undefined em vez de null

    const task = this.tasksRepo.create({
      ...dto,
      createdBy,
      assignee,
      history: [],
    });

    const saved = await this.tasksRepo.save(task);  // ✅ save retorna Task, não Task[]

    if (assignee) {
      await this.mailQueue.add('task-assigned', {
        to: assignee.email,
        assigneeName: assignee.name,
        taskTitle: saved.title,
      });
    }

    return saved;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    const previousStatus = task.status;

    if (dto.assigneeId) {
      task.assignee = await this.usersService.findById(dto.assigneeId);
    }

    if (dto.status && dto.status !== previousStatus) {
      task.history = [
        ...task.history,
        { from: previousStatus, to: dto.status, date: new Date() },
      ];

      if (task.assignee) {
        await this.mailQueue.add('status-changed', {
          to: task.assignee.email,
          assigneeName: task.assignee.name,
          taskTitle: task.title,
          from: previousStatus,
          toStatus: dto.status,  // ✅ sem "to" duplicado
        });
      }
    }

    Object.assign(task, dto);
    return this.tasksRepo.save(task);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);
    return { message: 'Tarefa removida com sucesso' };
  }
}