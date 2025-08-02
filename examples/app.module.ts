import { Module } from '@nestjs/common';
import { LucidModule } from 'nest-lucid';
import { UserModule } from './services/user/user.module';
import { NotificationModule } from './services/notification/notification.module';

@Module({
  imports: [
    LucidModule.forRoot({
      autoRegister: true,
    }),
    UserModule,
    NotificationModule,
  ],
})
export class ExampleAppModule {}
