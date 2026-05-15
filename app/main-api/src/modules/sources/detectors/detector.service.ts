import { Injectable } from "@nestjs/common";
import { FileDetector } from "./file.detector";
import { TextDetector } from "./text.detector";
import { UrlDetector } from "./url.detector";
import { SourceTypes } from "../enums/source-types.enum";
import { ITypeValidator } from "./interfaces/type-validator.interface";


@Injectable()
export class DetectorService {
    private detectors: ITypeValidator[];

    constructor() {
        this.detectors = [new FileDetector(), new UrlDetector(), new TextDetector(), ]
    }

    async detect(data: any): Promise<SourceTypes> {
        let fileType = SourceTypes.UNKNOWN
        for (const detector of this.detectors) {
            if (detector.canHandle(data)) {
                fileType = await detector.detectType(data);
                break;
            }
        }
        return fileType
    }
}