import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateSourceDto } from "./dto/create-source.dto";
import { DetectorService } from "./detectors/detector.service";
import { SourceTypes } from "./enums/source-types.enum";

@Injectable()
export class SourcesService {
    constructor(private readonly detectorService: DetectorService) { }

    async create(file: Express.Multer.File | string,) {
        const sourceType = await this.detectorService.detect(file);
        if (sourceType === SourceTypes.UNKNOWN) {
            throw new BadRequestException('Unsupported file type');
        }

        return {
            message: 'Source created successfully',
            source: sourceType,
        };
    }
}