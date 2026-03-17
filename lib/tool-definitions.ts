export type ToolKind =
  | "json"
  | "base64"
  | "url"
  | "timestamp"
  | "jwt"
  | "uuid"
  | "hash"
  | "regex"
  | "diff";

export type ToolDefinition = {
  slug: string;
  name: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  intro: string;
  kind: ToolKind;
  placeholder: string;
  order: number;
  featured: boolean;
  details: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const toolDefinitions: ToolDefinition[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortDescription: "Format, validate, and minify JSON in one screen.",
    seoTitle: "JSON Formatter Online | Format, Validate, and Minify JSON",
    seoDescription: "Format JSON, validate syntax, and minify payloads instantly in your browser. Fast JSON formatter for API responses, logs, and config files.",
    keywords: ["json formatter", "json validator", "json minify", "format json online"],
    intro: "Format and validate JSON directly in the browser.",
    kind: "json",
    placeholder: '{\n  "project": "bbalrang",\n  "safe": true\n}',
    order: 1,
    featured: true,
    details: [],
    faqs: []
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode JWT header and payload instantly.",
    seoTitle: "JWT Decoder Online | Decode Header and Payload",
    seoDescription: "Decode JWT tokens in your browser and inspect header, payload, and signature text. Useful for auth debugging and claim checks.",
    keywords: ["jwt decoder", "decode jwt", "jwt token viewer", "jwt payload decoder"],
    intro: "Paste a JWT and inspect the decoded header and payload.",
    kind: "jwt",
    placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldm1pbnQiLCJpYXQiOjE1MTYyMzkwMjJ9.signature",
    order: 2,
    featured: true,
    details: [],
    faqs: []
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    shortDescription: "Test regex patterns and match groups quickly.",
    seoTitle: "Regex Tester Online | Test Patterns and Match Groups",
    seoDescription: "Test regular expressions with sample text, quick flag toggles, match indexes, and capture groups. Fast regex tester for debugging patterns.",
    keywords: ["regex tester", "regular expression tester", "regex flags", "regex match tester"],
    intro: "Check matches, groups, and flags without opening another tool.",
    kind: "regex",
    placeholder: "(foo|bar)\\d+",
    order: 3,
    featured: true,
    details: [],
    faqs: []
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate UUID v4 values for tests and fixtures.",
    seoTitle: "UUID Generator Online | Generate UUID v4",
    seoDescription: "Generate one or many UUID v4 values in your browser. Useful for mock data, test fixtures, and temporary identifiers.",
    keywords: ["uuid generator", "uuid v4", "generate uuid", "uuid online"],
    intro: "Create UUIDs for test data, ids, and fixtures.",
    kind: "uuid",
    placeholder: "1",
    order: 4,
    featured: true,
    details: [],
    faqs: []
  },
  {
    slug: "text-diff-checker",
    name: "Text Diff Checker",
    shortDescription: "Compare two text blocks and review line changes.",
    seoTitle: "Text Diff Checker Online | Compare Text Side by Side",
    seoDescription: "Compare two text blocks line by line and review added, removed, changed, and unchanged lines in a clean diff view.",
    keywords: ["text diff checker", "compare text online", "diff checker", "line diff tool"],
    intro: "See added, removed, and changed lines side by side.",
    kind: "diff",
    placeholder: "left text\nright text",
    order: 5,
    featured: false,
    details: [],
    faqs: []
  },
  {
    slug: "base64-tool",
    name: "Base64 Encode/Decode",
    shortDescription: "Encode text to Base64 or decode it back.",
    seoTitle: "Base64 Encode Decode Tool | Base64 Online",
    seoDescription: "Encode plain text to Base64 or decode Base64 back to readable text in your browser. Fast Base64 utility for developers.",
    keywords: ["base64 encode", "base64 decode", "base64 online", "base64 tool"],
    intro: "Encode or decode Base64 without leaving the page.",
    kind: "base64",
    placeholder: "hello bbalrang",
    order: 6,
    featured: false,
    details: [],
    faqs: []
  },
  {
    slug: "url-encode-decode",
    name: "URL Encode/Decode",
    shortDescription: "Encode query strings or decode escaped URLs.",
    seoTitle: "URL Encode Decode Online | Encode Query Strings",
    seoDescription: "Encode query parameters and special characters for URLs, or decode escaped URLs back to readable text.",
    keywords: ["url encode", "url decode", "query string encode", "percent decode"],
    intro: "Convert text to a URL-safe value and decode it again.",
    kind: "url",
    placeholder: "name=kim minsu&topic=adsense tools",
    order: 7,
    featured: false,
    details: [],
    faqs: []
  }
];

export function getToolBySlug(slug: string) {
  return toolDefinitions.find((tool) => tool.slug === slug);
}

export function getOrderedTools() {
  return [...toolDefinitions].sort((left, right) => left.order - right.order);
}

export function getFeaturedTools() {
  return getOrderedTools().filter((tool) => tool.featured);
}

