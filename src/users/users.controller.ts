import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() user: UserDto) {
    return this.usersService.createUser(user);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    let result = await this.usersService.findOne(username);

    return result;
  }
}
