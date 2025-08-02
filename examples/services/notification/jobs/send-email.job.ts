import { Injectable } from '@nestjs/common';
import { Job, MiniJob } from '../../../../src/index';

export interface SendEmailJobData {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
@MiniJob('SendEmail')
export class SendEmailJob extends Job {
  async handle(data: SendEmailJobData): Promise<any> {
    console.log(`Sending email to: ${data.to}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Body: ${data.body}`);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = {
      success: true,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
    
    console.log(`Email sent successfully: ${result.messageId}`);
    
    return result;
  }
}
