import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('mail')
export class MailProcessor {

  @Process('task-assigned')
  async handleTaskAssigned(job: Job) {
    const { to, assigneeName, taskTitle } = job.data;
    console.log(`📧 [task-assigned] Para: ${to} | Tarefa: "${taskTitle}" atribuída a ${assigneeName}`);
  }

  @Process('status-changed')
  async handleStatusChanged(job: Job) {
    const { to, assigneeName, taskTitle, from, to: toStatus } = job.data;
    console.log(`📧 [status-changed] Para: ${to} | "${taskTitle}" movida de ${from} → ${toStatus}`);
  }

  @Process('due-date-reminder')
  async handleDueDateReminder(job: Job) {
    const { to, assigneeName, taskTitle, dueDate } = job.data;
    console.log(`📧 [due-date-reminder] Para: ${to} | "${taskTitle}" vence em ${dueDate}`);
  }
}