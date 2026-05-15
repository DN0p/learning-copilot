import { SourceTypes } from "../enums/source-types.enum";
import { ITypeValidator } from "./interfaces/type-validator.interface";
import { fileTypeFromBuffer } from 'file-type';

export class FileDetector implements ITypeValidator {
    canHandle(data: any): boolean {
        return Buffer.isBuffer(data) || (data && Buffer.isBuffer(data.buffer));
    }

    async detectType(data: any): Promise<SourceTypes> {
        const buffer = Buffer.isBuffer(data) ? data : data.buffer;
        if (!buffer) {
            return SourceTypes.UNKNOWN;
        }
        const type = await fileTypeFromBuffer(buffer);

        if (type?.mime.startsWith('audio/')) return SourceTypes.VOICE;
        if (type?.mime === 'application/pdf') return SourceTypes.PDF;

        return SourceTypes.UNKNOWN;
    }
}

