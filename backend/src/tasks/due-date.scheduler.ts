import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Task } from './task.entity';

@Injectable()
export class DueDateWorker {
    private readonly logger = new Logger(DueDateWorker.name);

    constructor(
        @InjectRepository(Task)
        private tasksRepo: Repository<Task>,
        @InjectQueue('mail') private mailQueue: Queue,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async checkDueDates() {
        this.logger.log('Verificando tarefas próximas do vencimento...');

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tasks = await this.tasksRepo.find({
            where: {
                dueDate: Between(today, tomorrow),
            },
            relations: {
                assignee: true,
            },
        });

        for (const task of tasks) {
            if (!task.assignee || task.status === 'done') continue;

            await this.mailQueue.add('due-date-reminder', {
                to: task.assignee.email,
                assigneeName: task.assignee.name,
                taskTitle: task.title,
                dueDate: task.dueDate,
            });

            this.logger.log(`Lembrete enfileirado para: ${task.assignee.email}`);
        }
    }
}