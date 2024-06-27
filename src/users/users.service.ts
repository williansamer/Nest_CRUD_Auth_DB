import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dtos/users.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync, compareSync } from 'bcrypt';

@Injectable()
export class UsersService {

    private readonly usersBD: UserDto[] = [];
    async createUser(user: UserDto): Promise<UserDto> {
        let userAlreadyExists = await this.usersBD.filter((item) => item.username === user.username);

        if (userAlreadyExists.length) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        user.id = uuid();
        user.password = bcryptHashSync(user.password, 10);
        this.usersBD.push(user);

        return user;
    }

    async findOne(username: string): Promise<any> {
        let user = await this.usersBD.find(item=>item.username === username);

        if (!user) {
            throw new UnauthorizedException;
        }

        return user;
    }
}
