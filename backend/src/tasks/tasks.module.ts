import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { DueDateWorker } from './due-date.scheduler';
import { Task } from './task.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    BullModule.registerQueue({ name: 'mail' }),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, DueDateWorker],
})
export class TasksModule {}