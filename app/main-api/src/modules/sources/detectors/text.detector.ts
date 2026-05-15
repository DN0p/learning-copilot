import { SourceTypes } from "../enums/source-types.enum";
import { ITypeValidator } from "./interfaces/type-validator.interface";
import { MAX_TEXT_LENGTH } from "../constants";

export class TextDetector implements ITypeValidator {
    canHandle(data: any): boolean {
        return typeof data === 'string' && !data.startsWith('http') && data.length > 0 && data.length <= MAX_TEXT_LENGTH;
    }

    detectType(): SourceTypes {
        return SourceTypes.TEXT;
    }
}