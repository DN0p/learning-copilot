import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Users } from "./users.entity"
import { CreateUserDto } from "./dto/user"
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(Users)
     private usersRepository: Repository<Users>) {}

    async create(userData: CreateUserDto) {
        return await this.usersRepository.save(userData)
    }
}