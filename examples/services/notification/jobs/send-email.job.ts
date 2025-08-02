import { Injectable } from '@nestjs/common';
import { Job, LucidJob } from '../../../src';

export interface SendEmailJobData {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

@Injectable()
@LucidJob('SendEmail')
export class SendEmailJob extends Job {
  async handle(data: SendEmailJobData): Promise<any> {
    console.log(`Sending email to ${data.to}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Body: ${data.body}`);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
  }
}
