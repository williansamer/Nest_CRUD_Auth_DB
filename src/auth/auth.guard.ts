import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecretToken: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.jwtSecretToken = this.configService.get('JWT_SECRET_TOKEN');
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecretToken
      })

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException;
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
