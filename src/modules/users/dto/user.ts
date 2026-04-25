import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class CreateUserDto{
    @IsEmail({}, {message: 'Not correct email format'})
    @IsNotEmpty({ message: 'Email is required' })
    email: string

    @IsString()
    @MinLength(8, {message: 'Min length 8'})
    @IsNotEmpty({ message: 'Email is required' })
    password: string
}