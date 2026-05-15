import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CreateSourceDto } from "./dto/create-source.dto";
import { SourcesService } from "./sources.service";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('sources')
export class SourcesController {
    constructor(private readonly sourcesService: SourcesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateSourceDto) {
        const dataForDetection = file || dto.content;
        if (!dataForDetection) {
            throw new BadRequestException('No file or content provided')
        }
        return this.sourcesService.create(dataForDetection);
    }
}
