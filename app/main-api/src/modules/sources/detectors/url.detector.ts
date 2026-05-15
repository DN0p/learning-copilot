import { SourceTypes } from "../enums/source-types.enum";
import { ITypeValidator } from "./interfaces/type-validator.interface";

export class UrlDetector implements ITypeValidator {
    canHandle(data: any): boolean {
        return typeof data === 'string' && /^https?:\/\//.test(data);
    }

    detectType(): SourceTypes {
        return SourceTypes.URL;
    }
}