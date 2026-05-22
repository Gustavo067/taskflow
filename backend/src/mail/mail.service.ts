import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail') private mailQueue: Queue,
  ) {}

  async sendTaskAssigned(to: string, assigneeName: string, taskTitle: string) {
    await this.mailQueue.add('task-assigned', { to, assigneeName, taskTitle });
  }

async sendStatusChanged(to: string, assigneeName: string, taskTitle: string, from: string, toStatus: string) {
  await this.mailQueue.add('status-changed', { 
    to, 
    assigneeName, 
    taskTitle, 
    from, 
    toStatus
  });
}

  async sendDueDateReminder(to: string, assigneeName: string, taskTitle: string, dueDate: Date) {
    await this.mailQueue.add('due-date-reminder', { to, assigneeName, taskTitle, dueDate });
  }
}