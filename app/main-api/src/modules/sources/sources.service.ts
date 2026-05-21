import { BadRequestException, Injectable } from "@nestjs/common";
import { DetectorService } from "./detectors/detector.service";
import { SourceTypes } from "./enums/source-types.enum";

@Injectable()
export class SourcesService {
    constructor(private readonly detectorService: DetectorService) { }

    async create(data: Express.Multer.File | string, userId?: string) {
        const sourceType = await this.detectorService.detect(data);
        if (sourceType === SourceTypes.UNKNOWN) {
            throw new BadRequestException('Unsupported file type');
        }

        return {
            message: 'Source created successfully',
            source: sourceType,
            userId,
        };
    }
}