import { Injectable } from '@nestjs/common';
import { Job, MiniJob } from '../../../../src/index';

export interface CreateUserJobData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable()
@MiniJob('CreateUser')
export class CreateUserJob extends Job {
  async handle(data: CreateUserJobData): Promise<any> {
    console.log(`Creating user: ${data.email}`);
    
    // Simulate user creation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = {
      id: `user_${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date(),
    };
    
    console.log(`User created with ID: ${user.id}`);
    
    return user;
  }
}
