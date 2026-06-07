import { parseFileSize } from '../../common/utils/parse-file-size';

export const MAX_TEXT_LENGTH = Number(process.env.MAX_TEXT_LENGTH ?? 50000);
export const MAX_FILE_SIZE_BYTES = parseFileSize(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
