export type Severity = "low" | "medium" | "high" | "critical";

export type Confidence = "low" | "medium" | "high";

export type RuleType =
  | "secret"
  | "pii"
  | "financial"
  | "legal"
  | "employee_data"
  | "auth"
  | "cloud"
  | "business_sensitive"
  | "custom";

export type SatrAction = "report" | "redact" | "block";

export type RedactionStrategy = "full" | "partial" | "mask" | "hash" | "remove";

export type RulePattern = {
  regex: string;
  flags?: string;
};

export type RedactionConfig = {
  strategy: RedactionStrategy;
  placeholder?: string;
  preserveStart?: number;
  preserveEnd?: number;
};

export type SatrRule = {
  id: string;
  name: string;
  description?: string;
  type: RuleType;
  severity: Severity;
  confidence: Confidence;
  patterns: RulePattern[];
  redaction?: RedactionConfig;
  recommendation?: string;
  tags?: string[];
  examples?: string[];
  enabled?: boolean;
};

export type SatrIssue = {
  ruleId: string;
  type: RuleType;
  severity: Severity;
  confidence: Confidence;
  message: string;
  match: string;
  redactedMatch?: string;
  start: number;
  end: number;
  line?: number;
  column?: number;
  path?: string;
  filePath?: string;
  recommendation?: string;
  tags: string[];
};

export type ScanStats = {
  scannedChars: number;
  rulesMatched: number;
  durationMs: number;
};

export type ScanResult<TOutput = string> = {
  safe: boolean;
  riskScore: number;
  issues: SatrIssue[];
  output?: TOutput;
  stats: ScanStats;
};

export type RuleSelector = string | SatrRule;

export type ScanOptions = {
  rules?: RuleSelector[];
  customRules?: SatrRule[];
  ruleRegistry?: SatrRule[];
  action?: SatrAction;
  locale?: string;
  severityThreshold?: Severity;
  redaction?: {
    defaultStrategy?: RedactionStrategy;
  };
};

export type SatrConfig = ScanOptions & {
  ignore?: string[];
  maxFileSize?: string | number;
  concurrency?: number;
  output?: {
    format?: "table" | "json";
    file?: string;
  };
};
