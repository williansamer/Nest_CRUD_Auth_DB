import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dtos/users.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync, compareSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createUser(user: UserDto): Promise<UserDto> {
        let userAlreadyExists = await this.userRepository.findOne({
            where: {username: user.username}
        })

        if (userAlreadyExists) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        const dbUser = new UserEntity();
        dbUser.username = user.username;
        dbUser.password = bcryptHashSync(user.password, 10);

        await this.userRepository.save([dbUser])

        return this.mapUserEntity(dbUser)
    }

    async findOne(username: string): Promise<UserDto> {
        let user = await this.userRepository.findOne({
            where: {username}
        });

        if (!user) {
            throw new UnauthorizedException;
        }

        return user;
    }

    private mapUserEntity(user: UserDto) {
        return {
            id: user.id,
            username: user.username,
            password: user.password
        }
    }
}
