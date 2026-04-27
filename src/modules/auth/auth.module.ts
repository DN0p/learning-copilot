import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [UsersModule, PassportModule.register({ defaultStrategy: 'jwt' }),],
    controllers: [],
    providers: [AuthService],
})

export class AuthModule {}