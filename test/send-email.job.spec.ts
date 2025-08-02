import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailJob } from '../examples/services/notification/jobs/send-email.job';

describe('SendEmailJob Example', () => {
  let job: SendEmailJob;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendEmailJob],
    }).compile();

    job = module.get<SendEmailJob>(SendEmailJob);
  });

  it('should be defined', () => {
    expect(job).toBeDefined();
  });

  it('should send email successfully', async () => {
    const data = {
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'This is a test email',
    };

    const result = await job.handle(data);
    
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(result.timestamp).toBeInstanceOf(Date);
  });
});
