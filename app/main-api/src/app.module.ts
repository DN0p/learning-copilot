import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './config/database.config';
import { SourcesModule } from './modules/sources/sources.module';


@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, SourcesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
