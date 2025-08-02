import { Module } from '@nestjs/common';
import { MiniModule } from '../src/index';
import { UserModule } from './services/user/user.module';
import { NotificationModule } from './services/notification/notification.module';

@Module({
  imports: [
    MiniModule.forRoot({
      autoRegister: true,
    }),
    UserModule,
    NotificationModule,
  ],
})
export class ExampleAppModule {}
