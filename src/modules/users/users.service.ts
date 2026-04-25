import { ConflictException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { User } from "./users.entity"
import { CreateUserDto } from "./dto/user"
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>) { }

    async create(userData: CreateUserDto) {
        const isUserExist = await this.usersRepository.findOneBy({ email: userData.email })
        if (isUserExist) {
            throw new ConflictException('User with this email already exists')
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt)

        const newUser : User = await this.usersRepository.save({ ...userData, password: hashedPassword })
        return newUser
    }
}