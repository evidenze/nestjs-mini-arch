import { Module } from '@nestjs/common';
import { CreateUserJob } from './jobs/create-user.job';
import { UserRegistrationFeature } from './features/user-registration.feature';

@Module({
  providers: [
    CreateUserJob,
    UserRegistrationFeature,
  ],
  exports: [
    CreateUserJob,
    UserRegistrationFeature,
  ],
})
export class UserModule {}
