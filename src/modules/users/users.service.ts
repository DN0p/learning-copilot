import { ConflictException, Injectable } from "@nestjs/common";
import { Repository, EntityManager } from "typeorm";
import * as bcrypt from 'bcrypt'
import { User } from "./users.entity"
import { CreateUserDto } from "./dto/user"
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>) { }

    async create(userData: CreateUserDto, manager?: EntityManager) {
        const isUserExist = manager ? await manager.findOne(User, { where: { email: userData.email } }) : await this.usersRepository.findOneBy({ email: userData.email })
        if (isUserExist) {
            throw new ConflictException('User with this email already exists')
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt)

        const newUser = manager
            ? await manager.save(User, { ...userData, password: hashedPassword })
            : await this.usersRepository.save({ ...userData, password: hashedPassword });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
}