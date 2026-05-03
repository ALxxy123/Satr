export {
  DEFAULT_MAX_FILE_SIZE_BYTES,
  DEFAULT_TEXT_EXTENSIONS,
  isProbablyBinaryFile,
  isSupportedTextFile,
  parseMaxFileSize,
} from "./fileUtils";
export { DEFAULT_IGNORE_PATTERNS, readIgnoreFile, shouldIgnorePath } from "./ignore";
export { scanDirectory } from "./scanDirectory";
export { scanFile } from "./scanFile";

export type { DirectoryScanResult, ScanDirectoryOptions } from "./scanDirectory";
export type { FileScanResult, ScanFileOptions } from "./scanFile";
