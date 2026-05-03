import type { ScanResult } from "./types";

export class SatrError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SatrError";
  }
}

export class SatrBlockedError extends SatrError {
  public readonly result: ScanResult<unknown>;

  constructor(result: ScanResult<unknown>) {
    super("Satr blocked the operation because sensitive data was detected.");
    this.name = "SatrBlockedError";
    this.result = result;
  }
}

export class SatrConfigError extends SatrError {
  constructor(message: string) {
    super(message);
    this.name = "SatrConfigError";
  }
}

export class SatrRuleError extends SatrError {
  constructor(message: string) {
    super(message);
    this.name = "SatrRuleError";
  }
}
