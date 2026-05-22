import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne
} from 'typeorm';
import { User } from '../users/user.entity';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'todo' })
  status: TaskStatus;

  @Column({ default: 'medium' })
  priority: TaskPriority;

  @Column({ nullable: true })
  dueDate: Date;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('jsonb', { default: [] })
  history: { from: string; to: string; date: Date; }[];

  @ManyToOne(() => User, { nullable: true, eager: true })
  assignee: User;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}