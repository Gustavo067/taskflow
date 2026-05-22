import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import type { TaskStatus } from '../task.entity';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'in_review', 'done'])
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;  // ✅ estava faltando aqui
}