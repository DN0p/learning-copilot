import { SourceTypes } from "../../enums/source-types.enum";

export interface ITypeValidator {
    canHandle(data: any): boolean;

    detectType(data: any): Promise<SourceTypes> | SourceTypes;
}