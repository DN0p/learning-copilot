import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Auth } from "./auth.entity";
import { UsersModule } from "../users/users.module";
import { User } from "../users/users.entity";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        TypeOrmModule.forFeature([User, Auth]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})

export class AuthModule {}