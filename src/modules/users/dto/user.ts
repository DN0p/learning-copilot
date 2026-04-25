import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    @IsEmail({}, {message: 'Not correct email format'})
    email: string

    @IsString()
    @MinLength(8, {message: 'Min length 8'})
    password: string
}