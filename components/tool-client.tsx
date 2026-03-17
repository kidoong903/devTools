"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import type { ToolDefinition } from "@/lib/tool-definitions";

type ToolClientProps = {
  tool: ToolDefinition;
};

type ToolMode = "primary" | "secondary";

type TransformResult = {
  result: string;
  helper: string;
  error: string;
};

type UuidPreviewResult = TransformResult & {
  fullResult: string;
  count: number;
  downloadOnly: boolean;
};

type RegexMatch = {
  index: number;
  value: string;
  groups: string[];
};

type DiffRow = {
  status: "added" | "removed" | "changed";
  leftLine?: string;
  rightLine?: string;
  leftNumber?: number;
  rightNumber?: number;
};

const regexFlagOptions = ["g", "i", "m", "s"] as const;
const defaultRegexPattern = "(foo|bar)\\d+";
const defaultRegexFlags = "g";
const defaultRegexText = "foo12 and bar34\nfoo99";
const defaultDiffLeft = "line 1\nline 2\nline 3";
const defaultDiffRight = "line 1\nline 2 changed\nline 3\nline 4";

function getTimestampLabel() {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ];
  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0")
  ];

  return `${parts.join("")}_${time.join("")}`;
}

function getDownloadMeta(tool: ToolDefinition, mode: ToolMode) {
  const stamp = getTimestampLabel();

  switch (tool.kind) {
    case "json":
      return { fileName: `${stamp}.${mode === "primary" ? "formatted" : "minified"}.json`, mimeType: "application/json;charset=utf-8" };
    case "jwt":
      return { fileName: `${stamp}.json`, mimeType: "application/json;charset=utf-8" };
    case "uuid":
      return { fileName: `${stamp}.txt`, mimeType: "text/plain;charset=utf-8" };
    case "hash":
      return { fileName: `${stamp}.${mode === "primary" ? "sha256" : "sha1"}.txt`, mimeType: "text/plain;charset=utf-8" };
    case "regex":
    case "diff":
      return { fileName: `${stamp}.json`, mimeType: "application/json;charset=utf-8" };
    default:
      return { fileName: `${stamp}.txt`, mimeType: "text/plain;charset=utf-8" };
  }
}

function utf8ToBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function base64ToUtf8(value: string) {
  return decodeURIComponent(escape(atob(value)));
}

function formatJson(value: string, mode: ToolMode) {
  if (!value.trim()) return "";
  const parsed = JSON.parse(value);
  return mode === "primary" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
}

function convertTimestamp(value: string, invalidTimestamp: string, invalidTimestampInput: string, timestampTopHelp: string, timestampBottomHelp: string) {
  const trimmed = value.trim();
  if (!trimmed) return { result: "", helper: "" };
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) {
    const timestamp = trimmed.length <= 10 ? numeric * 1000 : numeric;
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) throw new Error(invalidTimestamp);
    return { result: `${date.toISOString()}\n${date.toLocaleString()}`, helper: timestampTopHelp };
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) throw new Error(invalidTimestampInput);
  return { result: `${Math.floor(date.getTime() / 1000)}\n${date.getTime()}`, helper: timestampBottomHelp };
}

function decodeJwtPart(part: string, invalidBase64Json: string) {
  try {
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = base64ToUtf8(padded);
    return JSON.parse(decoded);
  } catch {
    throw new Error(invalidBase64Json);
  }
}

function decodeJwt(value: string, invalidJwt: string, invalidBase64Json: string, helper: string) {
  const parts = value.trim().split(".");
  if (parts.length !== 3) throw new Error(invalidJwt);
  const header = decodeJwtPart(parts[0], invalidBase64Json);
  const payload = decodeJwtPart(parts[1], invalidBase64Json);
  return { result: JSON.stringify({ header, payload, signature: parts[2] }, null, 2), helper };
}

function fallbackUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function createUuid(uuidUnsupported: string) {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  if (typeof Math.random === "function") return fallbackUuid();
  throw new Error(uuidUnsupported);
}

function generateUuids(value: string, invalidUuidCount: string, singleHelp: string, batchHelp: string, uuidUnsupported: string, downloadOnlyMessage: string): UuidPreviewResult {
  const count = Number.parseInt(value.trim() || "1", 10);
  if (!Number.isInteger(count) || count < 1 || count > 100000) throw new Error(invalidUuidCount);
  const fullList = Array.from({ length: count }, () => createUuid(uuidUnsupported));
  const fullResult = fullList.join("\n");
  const helper = count === 1 ? singleHelp : batchHelp;
  if (count <= 50) {
    return { result: fullResult, fullResult, count, downloadOnly: false, helper, error: "" };
  }
  return { result: downloadOnlyMessage, fullResult, count, downloadOnly: true, helper, error: "" };
}

async function createHash(value: string, algorithm: "SHA-256" | "SHA-1", unsupported: string) {
  if (!globalThis.crypto?.subtle) throw new Error(unsupported);
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest(algorithm, bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function analyzeRegex(pattern: string, flags: string, text: string, invalidRegex: string) {
  try {
    const uniqueFlags = Array.from(new Set(flags.split("").filter(Boolean))).join("");
    const scanFlags = uniqueFlags.includes("g") ? uniqueFlags : `${uniqueFlags}g`;
    const scanRegex = new RegExp(pattern, scanFlags);
    const matches: RegexMatch[] = [];
    let match: RegExpExecArray | null;

    while ((match = scanRegex.exec(text)) !== null) {
      matches.push({ index: match.index, value: match[0], groups: match.slice(1) });
      if (match[0] === "") {
        scanRegex.lastIndex += 1;
      }
    }

    return {
      flags: uniqueFlags,
      matches
    };
  } catch {
    throw new Error(invalidRegex);
  }
}

function buildDiffRows(leftText: string, rightText: string) {
  const leftLines = leftText.split(/\r?\n/);
  const rightLines = rightText.split(/\r?\n/);
  const length = Math.max(leftLines.length, rightLines.length);
  const rows: DiffRow[] = [];
  let added = 0;
  let removed = 0;
  let changed = 0;
  let unchanged = 0;

  for (let index = 0; index < length; index += 1) {
    const leftLine = leftLines[index];
    const rightLine = rightLines[index];

    if (leftLine === rightLine) {
      if (leftLine !== undefined) unchanged += 1;
      continue;
    }

    if (leftLine === undefined && rightLine !== undefined) {
      added += 1;
      rows.push({ status: "added", rightLine, rightNumber: index + 1 });
      continue;
    }

    if (rightLine === undefined && leftLine !== undefined) {
      removed += 1;
      rows.push({ status: "removed", leftLine, leftNumber: index + 1 });
      continue;
    }

    changed += 1;
    rows.push({
      status: "changed",
      leftLine,
      rightLine,
      leftNumber: index + 1,
      rightNumber: index + 1
    });
  }

  return { rows, added, removed, changed, unchanged };
}

function legacyCopy(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function ToolClient({ tool }: ToolClientProps) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [input, setInput] = useState(tool.placeholder);
  const [mode, setMode] = useState<ToolMode>("primary");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [asyncResult, setAsyncResult] = useState<TransformResult | null>(null);
  const [uuidCount, setUuidCount] = useState("1");
  const [regexPattern, setRegexPattern] = useState(defaultRegexPattern);
  const [regexFlags, setRegexFlags] = useState(defaultRegexFlags);
  const [regexText, setRegexText] = useState(defaultRegexText);
  const [diffLeft, setDiffLeft] = useState(defaultDiffLeft);
  const [diffRight, setDiffRight] = useState(defaultDiffRight);

  function resetToolState() {
    setInput(tool.placeholder);
    setMode("primary");
    setCopyError("");
    setCopied(false);
    setAsyncResult(null);
    setUuidCount("1");
    setRegexPattern(defaultRegexPattern);
    setRegexFlags(defaultRegexFlags);
    setRegexText(defaultRegexText);
    setDiffLeft(defaultDiffLeft);
    setDiffRight(defaultDiffRight);
  }

  function clearToolState() {
    setCopyError("");
    setCopied(false);

    if (["json", "base64", "url", "jwt"].includes(tool.kind)) {
      setInput("");
    }

    if (tool.kind === "uuid") {
      setUuidCount("");
    }

    if (tool.kind === "regex") {
      setRegexPattern("");
      setRegexFlags("");
      setRegexText("");
    }

    if (tool.kind === "diff") {
      setDiffLeft("");
      setDiffRight("");
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    resetToolState();
  }, [tool.slug, tool.placeholder]);

  useEffect(() => {
    let cancelled = false;

    async function runAsync() {
      if (tool.kind !== "hash") {
        setAsyncResult(null);
        return;
      }

      try {
        const result = await createHash(input, mode === "primary" ? "SHA-256" : "SHA-1", String(t("hashUnsupported")));
        if (!cancelled) {
          setAsyncResult({ result, helper: mode === "primary" ? String(t("hashSha256Help")) : String(t("hashSha1Help")), error: "" });
        }
      } catch (error) {
        if (!cancelled) {
          setAsyncResult({ result: "", helper: "", error: error instanceof Error ? error.message : String(t("unknownConversion")) });
        }
      }
    }

    void runAsync();
    return () => {
      cancelled = true;
    };
  }, [input, mode, t, tool.kind]);

  const uuidGenerated = useMemo(() => {
    if (tool.kind !== "uuid" || !isMounted) return null;
    try {
      return generateUuids(uuidCount, String(t("invalidUuidCount")), String(t("uuidSingleHelp")), String(t("uuidBatchHelp")), String(t("uuidUnsupported")), String(t("uuidDownloadOnly")));
    } catch (error) {
      return { result: "", fullResult: "", count: 0, downloadOnly: false, helper: "", error: error instanceof Error ? error.message : String(t("unknownConversion")) };
    }
  }, [isMounted, tool.kind, uuidCount, t]);

  const regexAnalysis = useMemo(() => {
    if (tool.kind !== "regex") return null;
    if (!regexPattern.trim()) return { matches: [], error: "", flags: regexFlags };
    try {
      return { ...analyzeRegex(regexPattern, regexFlags, regexText, String(t("invalidRegex"))), error: "" };
    } catch (error) {
      return { matches: [], error: error instanceof Error ? error.message : String(t("unknownConversion")), flags: regexFlags };
    }
  }, [regexFlags, regexPattern, regexText, t, tool.kind]);

  const diffAnalysis = useMemo(() => {
    if (tool.kind !== "diff") return null;
    return buildDiffRows(diffLeft, diffRight);
  }, [diffLeft, diffRight, tool.kind]);

  const transformed = useMemo<TransformResult>(() => {
    if (tool.kind === "hash") return asyncResult ?? { result: "", helper: "", error: "" };
    if (tool.kind === "uuid") return uuidGenerated ?? { result: "", helper: "", error: "" };
    if (tool.kind === "regex") {
      const regexJson = regexAnalysis?.matches ? JSON.stringify(regexAnalysis.matches, null, 2) : "";
      return { result: regexJson, helper: String(t("regexHelp")), error: regexAnalysis?.error ?? "" };
    }
    if (tool.kind === "diff") {
      const diffJson = diffAnalysis ? JSON.stringify(diffAnalysis.rows, null, 2) : "";
      return { result: diffJson, helper: String(t("diffHelp")), error: "" };
    }

    try {
      if (tool.kind === "json") return { result: formatJson(input, mode), helper: mode === "primary" ? String(t("jsonPrettyHelp")) : String(t("jsonMinifyHelp")), error: "" };
      if (tool.kind === "base64") return { result: mode === "primary" ? utf8ToBase64(input) : base64ToUtf8(input.trim()), helper: mode === "primary" ? String(t("base64EncodeHelp")) : String(t("base64DecodeHelp")), error: "" };
      if (tool.kind === "url") return { result: mode === "primary" ? encodeURIComponent(input) : decodeURIComponent(input), helper: mode === "primary" ? String(t("urlEncodeHelp")) : String(t("urlDecodeHelp")), error: "" };
      if (tool.kind === "timestamp") {
        const timestamp = convertTimestamp(input, String(t("invalidTimestamp")), String(t("invalidTimestampInput")), String(t("timestampTopHelp")), String(t("timestampBottomHelp")));
        return { result: timestamp.result, helper: timestamp.helper, error: "" };
      }
      if (tool.kind === "jwt") {
        const jwt = decodeJwt(input, String(t("invalidJwt")), String(t("invalidBase64Json")), String(t("jwtHelp")));
        return { result: jwt.result, helper: jwt.helper, error: "" };
      }
      return { result: "", helper: "", error: "" };
    } catch (error) {
      return { result: "", helper: "", error: error instanceof Error ? error.message : String(t("unknownConversion")) };
    }
  }, [asyncResult, diffAnalysis, input, mode, regexAnalysis, t, tool.kind, uuidGenerated]);

  const labels = {
    json: [String(t("format")), String(t("minify"))],
    base64: [String(t("encode")), String(t("decode"))],
    url: [String(t("encode")), String(t("decode"))],
    hash: [String(t("sha256")), String(t("sha1"))]
  } as const;

  const showModeButtons = ["json", "base64", "url", "hash"].includes(tool.kind);
  const hintText =
    tool.kind === "timestamp" ? String(t("supportsTimestamp")) :
    tool.kind === "jwt" ? String(t("supportsJwt")) :
    tool.kind === "uuid" ? String(t("supportsUuid")) :
    tool.kind === "regex" ? String(t("supportsRegex")) :
    tool.kind === "diff" ? String(t("supportsDiff")) : "";

  const copyText =
    tool.kind === "uuid" && uuidGenerated?.downloadOnly ? "" :
    tool.kind === "uuid" ? uuidGenerated?.fullResult ?? transformed.result :
    transformed.result;

  function toggleRegexFlag(flag: typeof regexFlagOptions[number]) {
    setRegexFlags((current) => {
      const nextFlags = current.includes(flag)
        ? current.replaceAll(flag, "")
        : `${current}${flag}`;

      return Array.from(new Set(nextFlags.split("").filter(Boolean))).join("");
    });
  }

  async function handleCopy() {
    if (!copyText) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
      } else {
        legacyCopy(copyText);
      }
      setCopyError("");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopyError(String(t("copyFailed")));
    }
  }

  function handleDownload() {
    const downloadText = tool.kind === "uuid" ? uuidGenerated?.fullResult ?? "" : transformed.result;
    if (!downloadText) return;
    const { fileName, mimeType } = getDownloadMeta(tool, mode);
    const blob = new Blob([downloadText], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  const actionButtons = (
    <>
      <button onClick={resetToolState} type="button">{String(t("sample"))}</button>
      <button onClick={clearToolState} type="button">{String(t("clear"))}</button>
      <button onClick={handleDownload} type="button">{String(t("download"))}</button>
      <button onClick={handleCopy} type="button" className="copy-button" disabled={!copyText}>{copied ? String(t("copied")) : String(t("copyOutput"))}</button>
    </>
  );

  if (tool.kind === "uuid") {
    return (
      <section className="tool-panel">
        <div className="tool-actions">
          <div className="tool-mode-group"><div className="timestamp-hint">{hintText}</div></div>
          <div className="tool-utility-group">{actionButtons}</div>
        </div>
        <div className="editor-grid">
          <label className="editor-card uuid-config-card">
            <span className="panel-label">{String(t("uuidCountLabel"))}</span>
            <div className="uuid-config">
              <span className="uuid-config-label">{hintText}</span>
              <input className="uuid-count-input" inputMode="numeric" value={uuidCount} onChange={(event) => setUuidCount(event.target.value)} />
            </div>
          </label>
          <div className="editor-card">
            <div className="output-head"><span className="panel-label">{String(t("output"))}</span></div>
            <pre>{transformed.result || String(t("outputPlaceholder"))}</pre>
            {transformed.helper ? <p className="helper-text">{transformed.helper}</p> : null}
            {transformed.error ? <p className="error-text">{transformed.error}</p> : null}
            {copyError ? <p className="error-text">{copyError}</p> : null}
          </div>
        </div>
      </section>
    );
  }

  if (tool.kind === "regex") {
    const hasRegexIssue = Boolean(regexAnalysis?.error) || (regexAnalysis?.matches.length ?? 0) === 0;

    return (
      <section className="tool-panel">
        <div className="tool-actions">
          <div className="tool-mode-group"><div className="timestamp-hint">{hintText}</div></div>
          <div className="tool-utility-group">{actionButtons}</div>
        </div>
        <div className="regex-layout">
          <div className="regex-controls">
            <label className="editor-card regex-field regex-primary-field">
              <span className="panel-label">{String(t("pattern"))}</span>
              <input value={regexPattern} onChange={(event) => setRegexPattern(event.target.value)} />
              <p className="helper-text">Example: ^foo\\d+$</p>
            </label>
          </div>
          <div className="regex-flag-pills">
            {regexFlagOptions.map((flag) => (
              <button
                key={flag}
                type="button"
                className={regexFlags.includes(flag) ? "active" : ""}
                onClick={() => toggleRegexFlag(flag)}
              >
                {String(t(
                  flag === "g" ? "regexGlobal" :
                  flag === "i" ? "regexIgnoreCase" :
                  flag === "m" ? "regexMultiline" :
                  "regexDotAll"
                ))}
              </button>
            ))}
          </div>
          <div className="editor-grid">
            <label className="editor-card">
              <span className="panel-label">{String(t("testText"))}</span>
              <textarea value={regexText} onChange={(event) => setRegexText(event.target.value)} spellCheck={false} />
            </label>
            <div className="editor-card regex-results-card">
              <div className="output-head"><span className="panel-label">{String(t("matches"))}</span></div>
              {!regexAnalysis?.error && regexAnalysis ? (
                <div className={`regex-summary-card ${hasRegexIssue ? "status-alert" : "status-ok"}`}>
                  <span>{String(t("matches"))}</span>
                  <strong>{regexAnalysis.matches.length}</strong>
                </div>
              ) : null}
              {regexAnalysis?.error ? <p className="error-text status-banner">{regexAnalysis.error}</p> : null}
              {!regexAnalysis?.error && regexAnalysis && regexAnalysis.matches.length === 0 ? <p className="helper-text status-banner status-banner-alert">{String(t("noMatches"))}</p> : null}
              <div className="regex-results-list">
                {regexAnalysis?.matches.map((match, index) => (
                  <article key={`${match.index}-${index}`} className="regex-match-card">
                    <strong>{match.value}</strong>
                    <span>index: {match.index}</span>
                    {match.groups.length > 0 ? <pre>{JSON.stringify(match.groups, null, 2)}</pre> : null}
                  </article>
                ))}
              </div>
              {transformed.helper ? <p className="helper-text">{transformed.helper}</p> : null}
              {copyError ? <p className="error-text">{copyError}</p> : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (tool.kind === "diff") {
    return (
      <section className="tool-panel">
        <div className="tool-actions">
          <div className="tool-mode-group"><div className="timestamp-hint">{hintText}</div></div>
          <div className="tool-utility-group">{actionButtons}</div>
        </div>
        <div className="editor-grid">
          <label className="editor-card">
            <span className="panel-label">{String(t("leftText"))}</span>
            <textarea value={diffLeft} onChange={(event) => setDiffLeft(event.target.value)} spellCheck={false} />
          </label>
          <label className="editor-card">
            <span className="panel-label">{String(t("rightText"))}</span>
            <textarea value={diffRight} onChange={(event) => setDiffRight(event.target.value)} spellCheck={false} />
          </label>
        </div>
        <div className="diff-layout">
          <div className="diff-summary-grid">
            <article className="diff-summary-card status-added"><span>{String(t("added"))}</span><strong>{diffAnalysis?.added ?? 0}</strong></article>
            <article className="diff-summary-card status-alert"><span>{String(t("removed"))}</span><strong>{diffAnalysis?.removed ?? 0}</strong></article>
            <article className="diff-summary-card status-alert"><span>{String(t("changed"))}</span><strong>{diffAnalysis?.changed ?? 0}</strong></article>
            <article className="diff-summary-card status-neutral"><span>{String(t("unchanged"))}</span><strong>{diffAnalysis?.unchanged ?? 0}</strong></article>
          </div>
          <div className="editor-card diff-list-card">
            <div className="output-head"><span className="panel-label">{String(t("diffSummary"))}</span></div>
            <div className="diff-list diff-list-head">
              <div className="diff-row diff-row-head">
                <div className="diff-cell diff-meta">L#</div>
                <div className="diff-cell">Left</div>
                <div className="diff-cell diff-meta">R#</div>
                <div className="diff-cell">Right</div>
              </div>
            </div>
            <div className="diff-list">
              {diffAnalysis && diffAnalysis.rows.length === 0 ? <p className="helper-text status-banner status-banner-ok">{String(t("noDifferences"))}</p> : null}
              {diffAnalysis?.rows.map((row, index) => (
                <article key={`${row.status}-${index}`} className={`diff-row diff-${row.status}`}>
                  <div className="diff-cell diff-meta">{row.leftNumber ?? "-"}</div>
                  <div className="diff-cell">{row.leftLine ?? ""}</div>
                  <div className="diff-cell diff-meta">{row.rightNumber ?? "-"}</div>
                  <div className="diff-cell">{row.rightLine ?? ""}</div>
                </article>
              ))}
            </div>
            {transformed.helper ? <p className="helper-text">{transformed.helper}</p> : null}
            {copyError ? <p className="error-text">{copyError}</p> : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tool-panel">
      <div className="tool-actions">
        <div className="tool-mode-group">
          {showModeButtons && tool.kind in labels ? (
            <>
              <button className={mode === "primary" ? "active" : ""} onClick={() => setMode("primary")} type="button">{labels[tool.kind as keyof typeof labels][0]}</button>
              <button className={mode === "secondary" ? "active" : ""} onClick={() => setMode("secondary")} type="button">{labels[tool.kind as keyof typeof labels][1]}</button>
            </>
          ) : null}
          {hintText ? <div className="timestamp-hint">{hintText}</div> : null}
        </div>
        <div className="tool-utility-group">{actionButtons}</div>
      </div>
      <div className="editor-grid">
        <label className="editor-card">
          <span className="panel-label">{String(t("input"))}</span>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
        </label>
        <div className="editor-card">
          <div className="output-head"><span className="panel-label">{String(t("output"))}</span></div>
          <pre>{transformed.result || String(t("outputPlaceholder"))}</pre>
          {transformed.helper ? <p className="helper-text">{transformed.helper}</p> : null}
          {transformed.error ? <p className="error-text">{transformed.error}</p> : null}
          {copyError ? <p className="error-text">{copyError}</p> : null}
        </div>
      </div>
    </section>
  );
}

