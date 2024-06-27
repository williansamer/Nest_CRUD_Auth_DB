import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TaskModule, 
    UsersModule, 
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
