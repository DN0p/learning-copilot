import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/user";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() userData: CreateUserDto) {
        return this.usersService.create(userData);
    }
}