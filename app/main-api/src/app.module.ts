import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './config/database.config';
import { SourcesModule } from './modules/sources/sources.module';
import { JwtUserIdPipe } from './common/pipes/jwt-user-id.pipe';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, SourcesModule],
  controllers: [AppController],
  providers: [AppService, JwtUserIdPipe],
})
export class AppModule {}
