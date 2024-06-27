import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from './dtos/auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
    private jwtTimeToExpire: number;

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService) {
            this.jwtTimeToExpire = +this.configService.get<number>('EXPIRATION_TIME');
        }
    async signIn(username: string, password: string): Promise<JwtDto> {
        let user = await this.userService.findOne(username);

        if (!user || !compareSync(password, user.password)) {
            throw new UnauthorizedException;
        }

        const payload = {sub: user.id, username: user.username};

        var token = await this.jwtService.signAsync(payload);

        return{
            token,
            expiresIn: this.jwtTimeToExpire
        }
    }
}
