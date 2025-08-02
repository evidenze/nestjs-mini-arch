import { Module } from '@nestjs/common';
import { SendEmailJob } from './jobs/send-email.job';

@Module({
  providers: [SendEmailJob],
  exports: [SendEmailJob],
})
export class NotificationModule {}
