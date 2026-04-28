import { Body, Controller, Post, HttpCode, HttpStatus, Ip, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/user";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() createUserDto: CreateUserDto, @Ip() ip: string, @Headers('user-agent') userAgent: string) {
        return this.authService.register(createUserDto, ip, userAgent);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto, @Ip() ip: string, @Headers('user-agent') userAgent: string) {
        return this.authService.login(loginDto.email, loginDto.password, ip, userAgent);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@Body() refreshDto: { refreshToken: string }, @Ip() ip: string, @Headers('user-agent') userAgent: string) {
        return this.authService.refreshTokens(refreshDto.refreshToken, ip, userAgent);
    }
}