import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/users.entity";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User)
    private usersRepository: Repository<User>) { }

    
}