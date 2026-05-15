import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './sources.entity';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';
import { DetectorService } from './detectors/detector.service';

@Module({
    imports: [TypeOrmModule.forFeature([Source])],
    controllers: [SourcesController],
    providers: [SourcesService, DetectorService],
    exports: [DetectorService],
})
export class SourcesModule {}