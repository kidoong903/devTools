import type { Locale } from "@/lib/i18n";

type GuideSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  summary: string;
  intro: string[];
  sections: GuideSection[];
  relatedTools: string[];
};

const guideArticles: GuideArticle[] = [
  {
    slug: "how-to-format-json-safely",
    title: "How to format JSON safely before sharing logs or payloads",
    description:
      "Learn when to format JSON, how to spot invalid syntax, and what to remove before sharing API responses or webhook payloads.",
    summary:
      "A practical guide to formatting JSON, checking syntax errors, and removing sensitive values before you paste payloads into tickets or chat.",
    intro: [
      "JSON formatters are often treated like tiny utilities, but the reason developers keep opening them is simple: a raw payload is hard to read, harder to review, and easy to share unsafely.",
      "When an API response arrives on one line, or a webhook body contains nested objects and arrays, formatting it first makes debugging faster. It also helps you catch small syntax issues such as trailing commas, missing quotes, or broken braces before the payload moves into another tool."
    ],
    sections: [
      {
        title: "When formatting JSON actually helps",
        paragraphs: [
          "Formatting is most useful when you need to inspect structure, not just values. Nested objects, repeated arrays, and long string fields become much easier to scan once indentation is applied.",
          "It is especially helpful when debugging API responses, validating configuration files, comparing webhook payloads, or preparing a sample response for documentation."
        ],
        bullets: [
          "Review nested response bodies from REST or GraphQL APIs.",
          "Clean up copied JSON from logs before sharing it internally.",
          "Validate whether a payload is real JSON or just a JavaScript object string."
        ]
      },
      {
        title: "Common mistakes to check before you share it",
        paragraphs: [
          "A formatter can tell you when the JSON is invalid, but it cannot decide whether the content is safe to share. That part still needs a quick human review.",
          "Before you paste a payload into chat, email, or a bug ticket, check whether it includes tokens, session identifiers, internal URLs, customer email addresses, or other fields that should be masked."
        ],
        bullets: [
          "Remove access tokens, cookies, API keys, and authorization headers.",
          "Mask email addresses, phone numbers, and user IDs where possible.",
          "Shorten large arrays if only one or two items matter for the example."
        ]
      },
      {
        title: "Format first, then minify only when needed",
        paragraphs: [
          "Pretty formatting and minifying solve different problems. Formatting helps people read and review. Minifying helps reduce size when you need a compact payload for transport or storage.",
          "For most debugging tasks, start with formatted output. Use minified output only when you have a specific reason to keep the payload short."
        ]
      }
    ],
    relatedTools: ["json-formatter", "text-diff-checker"]
  },
  {
    slug: "jwt-decoder-claims-guide",
    title: "JWT decoder basics: what header, payload, exp, and sub really mean",
    description:
      "A practical JWT guide for developers who need to inspect token claims, expiry times, audiences, and signatures during auth debugging.",
    summary:
      "Use this guide to understand what a JWT decoder shows you, which claims are commonly checked in development, and why decoding is not the same as verification.",
    intro: [
      "JWT decoders are useful because auth bugs are usually not about the token looking broken. They are about one field being unexpected: the audience is wrong, the subject is missing, the issued-at time is stale, or the token has already expired.",
      "A decoder lets you inspect the token structure quickly, but it is important to remember that reading a token is not the same as validating it. You can decode an invalid or tampered token just fine if the payload is still parseable."
    ],
    sections: [
      {
        title: "The three JWT parts",
        paragraphs: [
          "A JWT consists of header, payload, and signature. The header usually tells you the algorithm and token type. The payload contains claims, which are the values your application reads. The signature is used to verify integrity.",
          "When you are debugging, the payload is usually the part you inspect first, but header values such as alg can also matter when tokens are issued by multiple services."
        ]
      },
      {
        title: "Claims developers check most often",
        paragraphs: [
          "The most frequently checked claims are exp, iat, nbf, sub, iss, and aud. These fields tell you whether the token is still valid in time, who issued it, who it belongs to, and which application is meant to accept it.",
          "If a token works in one environment and fails in another, aud and iss are often the first values worth checking."
        ],
        bullets: [
          "exp: the expiration time, usually stored as a Unix timestamp in seconds.",
          "iat: when the token was issued.",
          "sub: the subject, often a user or service identifier.",
          "aud: the intended audience, such as a client ID or API name."
        ]
      },
      {
        title: "Decoding is not signature verification",
        paragraphs: [
          "A browser-based decoder is excellent for inspection, but it should not be treated as proof that the token is trustworthy.",
          "To verify authenticity, your application or backend still needs to validate the signature with the correct key and enforce claim checks such as issuer, audience, and expiration."
        ]
      }
    ],
    relatedTools: ["jwt-decoder"]
  },
  {
    slug: "regex-flags-examples",
    title: "Regex tester guide: how g, i, m, and s change your matches",
    description:
      "Understand regex flags with simple developer-focused examples, including global matches, case-insensitive searches, multiline anchors, and dot-all behavior.",
    summary:
      "A short regex guide that explains what the common flags do, when match groups help, and how to avoid patterns that look correct but still miss your target text.",
    intro: [
      "Regular expressions become easier once you stop treating them as one large piece of punctuation and start checking them one decision at a time: pattern, flags, test text, and match groups.",
      "In practice, many regex bugs are caused by the correct pattern being combined with the wrong flag. A search can fail not because the expression is invalid, but because line breaks, case handling, or global matching changed the result."
    ],
    sections: [
      {
        title: "What the common flags change",
        paragraphs: [
          "The g flag finds all matches instead of stopping after the first one. The i flag ignores case differences. The m flag changes how start and end anchors behave across multiple lines. The s flag allows the dot character to match line breaks.",
          "If your pattern seems right but the result count is wrong, start by checking flags before rewriting the whole expression."
        ]
      },
      {
        title: "Why match groups matter",
        paragraphs: [
          "Capture groups help when you want only part of the matched text. For example, you may want the value after a key, the domain inside a URL, or the username part of an email address.",
          "Groups are also useful when you later turn a tested regex into replacement or parsing logic inside an application."
        ]
      },
      {
        title: "Practical tips for safer testing",
        paragraphs: [
          "Use small sample text first. Once the pattern behaves correctly on a focused example, move to a larger real-world string. This makes it much easier to tell whether the expression is too broad or too strict.",
          "If a pattern matches too much, replace greedy segments with more specific character classes or boundaries. If it matches too little, inspect line breaks and escaping first."
        ],
        bullets: [
          "Test one example that should match and one that should fail.",
          "Turn flags on and off one by one instead of guessing.",
          "Check capture groups before copying the regex into application code."
        ]
      }
    ],
    relatedTools: ["regex-tester", "text-diff-checker"]
  }
];

export function getGuideArticles(_locale: Locale) {
  return guideArticles;
}

export function getGuideBySlug(slug: string, _locale: Locale) {
  return guideArticles.find((article) => article.slug === slug);
}

export function getGuideSlugs() {
  return guideArticles.map((article) => article.slug);
}

export function getGuidesForTool(toolSlug: string, _locale: Locale) {
  return guideArticles.filter((article) => article.relatedTools.includes(toolSlug));
}