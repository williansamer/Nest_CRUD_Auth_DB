import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
