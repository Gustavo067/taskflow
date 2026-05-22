import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST ?? 'smtp.ethereal.email',
  port: Number(process.env.MAIL_PORT ?? 587),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

@Processor('mail')
export class MailProcessor {

  @Process('task-assigned')
  async handleTaskAssigned(job: Job) {
    const { to, assigneeName, taskTitle } = job.data;
    await transporter.sendMail({
      from: '"TaskFlow" <no-reply@taskflow.com>',
      to,
      subject: `Nova tarefa atribuída: ${taskTitle}`,
      html: `
        <h2>Olá, ${assigneeName}!</h2>
        <p>A tarefa <strong>${taskTitle}</strong> foi atribuída a você.</p>
        <p>Acesse o TaskFlow para ver os detalhes.</p>
      `,
    });
    console.log(`📧 [task-assigned] E-mail enviado para ${to}`);
  }

  @Process('status-changed')
  async handleStatusChanged(job: Job) {
    const { to, assigneeName, taskTitle, from, toStatus } = job.data;
    await transporter.sendMail({
      from: '"TaskFlow" <no-reply@taskflow.com>',
      to,
      subject: `Status atualizado: ${taskTitle}`,
      html: `
        <h2>Olá, ${assigneeName}!</h2>
        <p>A tarefa <strong>${taskTitle}</strong> teve seu status alterado.</p>
        <p><strong>${from}</strong> → <strong>${toStatus}</strong></p>
      `,
    });
    console.log(`📧 [status-changed] E-mail enviado para ${to}`);
  }

  @Process('due-date-reminder')
  async handleDueDateReminder(job: Job) {
    const { to, assigneeName, taskTitle, dueDate } = job.data;
    await transporter.sendMail({
      from: '"TaskFlow" <no-reply@taskflow.com>',
      to,
      subject: `Lembrete: ${taskTitle} vence em breve`,
      html: `
        <h2>Olá, ${assigneeName}!</h2>
        <p>A tarefa <strong>${taskTitle}</strong> vence em 
        <strong>${new Date(dueDate).toLocaleDateString('pt-BR')}</strong>.</p>
      `,
    });
    console.log(`📧 [due-date-reminder] E-mail enviado para ${to}`);
  }
}