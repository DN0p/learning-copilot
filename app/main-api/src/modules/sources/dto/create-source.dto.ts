import { IsOptional, IsString, MaxLength } from "class-validator";
import { MAX_TEXT_LENGTH } from "../constants";

export class CreateSourceDto {
  @IsOptional()
  @IsString()
  @MaxLength(MAX_TEXT_LENGTH)
  content: string;
}
