import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { createUserDto } from "./dto/user";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() userData: createUserDto) {
        return this.usersService.create(userData)
    }
}