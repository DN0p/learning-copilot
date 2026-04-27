import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './sources.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Source])],
    controllers: [],
    providers: [],
    exports: [],
})
export class SourcesModule {}