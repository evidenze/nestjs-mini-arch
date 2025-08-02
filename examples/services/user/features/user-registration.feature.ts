import { Injectable } from '@nestjs/common';
import { Feature, LucidFeature } from 'nest-lucid';
import { CreateUserJob, CreateUserJobData } from '../jobs/create-user.job';
import { SendEmailJob } from '../../notification/jobs/send-email.job';

export interface UserRegistrationFeatureData {
  user: CreateUserJobData;
  sendWelcomeEmail?: boolean;
}

@Injectable()
@LucidFeature('UserRegistration')
export class UserRegistrationFeature extends Feature {
  async handle(data: UserRegistrationFeatureData): Promise<any> {
    console.log('Starting user registration process...');
    
    try {
      // Step 1: Create the user
      const user = await this.runJob(CreateUserJob, data.user);
      
      // Step 2: Send welcome email if requested
      if (data.sendWelcomeEmail !== false) {
        await this.runJob(SendEmailJob, {
          to: user.email,
          subject: 'Welcome to our platform!',
          body: `Hello ${user.firstName}, welcome to our platform!`,
        });
      }
      
      console.log('User registration completed successfully');
      
      return {
        success: true,
        user,
        welcomeEmailSent: data.sendWelcomeEmail !== false,
      };
    } catch (error) {
      console.error('User registration failed:', error.message);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }
}
