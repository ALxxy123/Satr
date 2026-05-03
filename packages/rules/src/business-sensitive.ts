import { defineRule } from "@satr-labs/core";
import type { SatrRule } from "@satr-labs/core";

export const businessSensitiveRules: SatrRule[] = [
  defineRule({
    id: "business.salary",
    name: "Salary or Payroll Keyword",
    description: "Detects salary, payroll, bonus, and related Arabic business keywords.",
    type: "business_sensitive",
    severity: "medium",
    confidence: "low",
    patterns: [
      {
        regex: "\\b(?:salary|salaries|payroll|bonus)\\b|(?:راتب|رواتب|مكافأة|مستحقات)",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:BUSINESS_SENSITIVE]",
    },
    recommendation: "Review compensation-related context before sharing.",
    tags: ["business-sensitive", "business", "salary", "payroll", "arabic"],
    examples: ["employee salary", "راتب الموظف"],
  }),
  defineRule({
    id: "business.contract",
    name: "Contract or Legal Keyword",
    description: "Detects contract, agreement, legal, and related Arabic keywords.",
    type: "business_sensitive",
    severity: "medium",
    confidence: "low",
    patterns: [
      {
        regex: "\\b(?:contract|agreement|legal)\\b|(?:عقد|اتفاقية)",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:BUSINESS_SENSITIVE]",
    },
    recommendation: "Review contract or legal context before sharing.",
    tags: ["business-sensitive", "business", "contract", "legal", "arabic"],
    examples: ["contract draft", "مسودة عقد"],
  }),
  defineRule({
    id: "business.employee_data",
    name: "Employee or Customer Data Keyword",
    description: "Detects employee, staff, customer, client, and related Arabic keywords.",
    type: "business_sensitive",
    severity: "medium",
    confidence: "low",
    patterns: [
      {
        regex: "\\b(?:employee|staff|customer|client)\\b|(?:موظف|عضو فريق|عميل)",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:BUSINESS_SENSITIVE]",
    },
    recommendation: "Review people or customer data before sharing.",
    tags: ["business-sensitive", "business", "employee", "customer", "arabic"],
    examples: ["customer list", "بيانات عميل"],
  }),
  defineRule({
    id: "business.invoice",
    name: "Invoice Keyword",
    description: "Detects invoice and related Arabic financial keywords.",
    type: "business_sensitive",
    severity: "medium",
    confidence: "low",
    patterns: [
      {
        regex: "\\b(?:invoice|invoices)\\b|(?:فاتورة)",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:BUSINESS_SENSITIVE]",
    },
    recommendation: "Review invoice context before sharing.",
    tags: ["business-sensitive", "business", "invoice", "arabic"],
    examples: ["invoice total", "رقم الفاتورة"],
  }),
  defineRule({
    id: "business.bank_account",
    name: "Bank Account Keyword",
    description: "Detects bank account, IBAN, and related Arabic keywords.",
    type: "business_sensitive",
    severity: "medium",
    confidence: "low",
    patterns: [
      {
        regex: "\\b(?:bank account|iban)\\b|(?:حساب بنكي|آيبان)",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:BUSINESS_SENSITIVE]",
    },
    recommendation: "Review bank account context before sharing.",
    tags: ["business-sensitive", "business", "bank", "iban", "arabic"],
    examples: ["bank account details", "حساب بنكي"],
  }),
  defineRule({
    id: "business.confidential",
    name: "Confidential Keyword",
    description: "Detects confidential, private, and related Arabic sensitivity keywords.",
    type: "business_sensitive",
    severity: "medium",
    confidence: "low",
    patterns: [
      {
        regex: "\\b(?:confidential|private)\\b|(?:سري|خاص|بيانات حساسة)",
        flags: "gi",
      },
    ],
    redaction: {
      strategy: "full",
      placeholder: "[REDACTED:BUSINESS_SENSITIVE]",
    },
    recommendation: "Review confidential context before sharing.",
    tags: ["business-sensitive", "business", "confidential", "arabic"],
    examples: ["confidential memo", "ملف سري"],
  }),
];
