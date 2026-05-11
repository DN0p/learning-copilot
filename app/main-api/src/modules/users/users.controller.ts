import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/user";
import { AuthService } from "../auth/auth.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    // @Post()
    // @HttpCode(HttpStatus.CREATED)
    // create(@Body() userData: CreateUserDto) {
    //     return this.authService.register(userData);
    // }
}