import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'mail' }),
  ],
  providers: [MailProcessor],
})
export class MailModule {}