import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DATABASE_HOST || "localhost",
            port: Number(process.env.DATABASE_PORT || 5432),
            username: process.env.DATABASE_USER || "user",
            password: process.env.DATABASE_PASSWORD || "password",
            database: process.env.DATABASE_NAME || "database name",
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
})

export class DatabaseModule {}