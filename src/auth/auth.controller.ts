import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Get('login')
  async signIn(
    @Body('username') username:string,
    @Body('password') password:string,
  ) {
    let responseToken = await this.authService.signIn(username, password);

    return responseToken;
  }
}
