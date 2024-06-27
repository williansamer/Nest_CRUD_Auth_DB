import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.registerAsync({
    global: true,
    imports: [],
    useFactory: async (configService: ConfigService)=> ({
      secret: configService.get('JWT_SECRET_TOKEN'),
      signOptions: { expiresIn: +configService.get('EXPIRATION_TIME') } //o sinal de '+' serve para converter para 'Number' de um modo implícito
    }),
    inject: [ConfigService]
  }), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
