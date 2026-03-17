import type { Locale } from "@/lib/i18n";
import type { ToolKind } from "@/lib/tool-definitions";

type GuideSection = {
  title: string;
  items: string[];
};

type GuideFaq = {
  question: string;
  answer: string;
};

type ToolGuide = {
  sections: GuideSection[];
  faqs: GuideFaq[];
};

const guideLabels = {
  en: {
    whenToUse: "When to use it",
    types: "Types and modes",
    notes: "What to check",
    faq: "FAQ"
  },
  ko: {
    whenToUse: "언제 쓰는 도구인가요?",
    types: "타입과 모드 설명",
    notes: "볼 때 체크할 포인트",
    faq: "자주 보는 질문"
  }
} as const;

function labels(locale: Locale) {
  return locale === "ko" ? guideLabels.ko : guideLabels.en;
}

export function getToolGuide(kind: ToolKind, locale: Locale): ToolGuide {
  const l = labels(locale);

  if (locale === "ko") {
    switch (kind) {
      case "json":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "API 응답이나 설정 파일 JSON이 한 줄로 뭉쳐 있어서 읽기 어려울 때 씁니다.",
                "JSON 문법이 맞는지 빠르게 확인하고 싶을 때 유용합니다.",
                "로그나 웹훅 payload를 공유 전에 보기 좋게 정리할 때 자주 씁니다."
              ]
            },
            {
              title: l.types,
              items: [
                "Format은 들여쓰기와 줄바꿈을 넣어서 사람이 읽기 쉽게 정리합니다.",
                "Minify는 공백과 줄바꿈을 제거해서 전송용이나 복사용으로 줄여줍니다.",
                "JSON에서 object는 중괄호 {}, array는 대괄호 [] 형태를 의미합니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "키 이름과 문자열은 반드시 큰따옴표를 써야 합니다.",
                "마지막 항목 뒤에 쉼표가 있으면 에러가 납니다.",
                "민감한 데이터는 공유 전에 값이 포함되어 있는지 확인하세요."
              ]
            }
          ],
          faqs: [
            { question: "자바스크립트 객체와 JSON은 같은가요?", answer: "비슷하지만 완전히 같지는 않습니다. JSON은 더 엄격해서 키와 문자열에 큰따옴표가 필요합니다." },
            { question: "포맷만 해도 검증이 되나요?", answer: "네. 이 도구는 포맷 과정에서 JSON 파싱이 되지 않으면 에러를 보여줍니다." }
          ]
        };
      case "base64":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "텍스트를 Base64 문자열로 바꿔서 전송하거나 저장할 때 씁니다.",
                "토큰, 간단한 바이너리 조각, data URL 일부를 확인할 때 자주 사용합니다.",
                "인코딩된 값을 사람이 읽을 수 있는 텍스트로 되돌릴 때도 유용합니다."
              ]
            },
            {
              title: l.types,
              items: [
                "Encode는 일반 텍스트를 Base64로 바꿉니다.",
                "Decode는 Base64 문자열을 다시 텍스트로 복원합니다.",
                "Base64는 암호화가 아니라 단순 인코딩이라 원문 복원이 가능합니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "한글이나 이모지처럼 UTF-8 문자가 포함되면 인코딩/디코딩 결과를 함께 확인하는 게 좋습니다.",
                "URL-safe Base64는 +, / 대신 -, _ 를 쓰는 경우가 있습니다.",
                "민감한 값이라면 Base64라고 해서 안전한 것은 아닙니다."
              ]
            }
          ],
          faqs: [
            { question: "Base64는 보안 기능인가요?", answer: "아니요. 읽기 어려운 문자열로 바꾸는 것뿐이라 복호화 없이 바로 복원할 수 있습니다." },
            { question: "왜 디코딩이 깨질 수 있나요?", answer: "입력값이 잘린 경우나 URL-safe 형식처럼 다른 변형을 쓰는 경우가 많습니다." }
          ]
        };
      case "url":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "쿼리 문자열이나 path 일부에 공백, 한글, 특수문자가 들어갈 때 씁니다.",
                "로그에 찍힌 퍼센트 인코딩 값을 사람이 읽을 수 있게 복원할 때 유용합니다.",
                "링크 생성기나 리다이렉트 URL을 다룰 때 자주 사용합니다."
              ]
            },
            {
              title: l.types,
              items: [
                "Encode는 공백과 특수문자를 URL에서 안전한 형태로 바꿉니다.",
                "Decode는 %20, %2F 같은 값을 원래 문자로 되돌립니다.",
                "URL 전체와 query parameter 값은 인코딩 위치가 다를 수 있습니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "전체 URL을 인코딩할지, 파라미터 값만 인코딩할지 먼저 구분하세요.",
                "이미 인코딩된 값을 다시 Encode하면 이중 인코딩이 됩니다.",
                "공백은 %20으로 보일 수도 있고, 일부 환경에서는 + 로 처리되기도 합니다."
              ]
            }
          ],
          faqs: [
            { question: "왜 / 나 ? 까지 바뀌나요?", answer: "전체 문자열을 인코딩하면 URL 구조 문자인 /, ?, & 도 함께 변환될 수 있습니다." },
            { question: "한글 URL도 꼭 인코딩해야 하나요?", answer: "브라우저가 처리해주기도 하지만, API나 서버 로그에서는 인코딩된 값으로 다루는 경우가 많습니다." }
          ]
        };
      case "timestamp":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "로그 시간, DB 값, 토큰 만료 시간처럼 Unix timestamp를 확인할 때 씁니다.",
                "초 단위인지 밀리초 단위인지 헷갈릴 때 빠르게 구분할 수 있습니다.",
                "사람이 읽는 날짜를 timestamp로 바꿔서 테스트 데이터 만들 때도 유용합니다."
              ]
            },
            {
              title: l.types,
              items: [
                "10자리 정도 숫자는 보통 초 단위 Unix time 입니다.",
                "13자리 정도 숫자는 밀리초 단위 timestamp인 경우가 많습니다.",
                "날짜 문자열을 넣으면 초와 밀리초 두 형태로 함께 변환해 보여줍니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "UTC 기준인지 로컬 시간 기준인지 항상 함께 보세요.",
                "백엔드와 프론트에서 초/밀리초 단위를 다르게 쓰는 경우가 흔합니다.",
                "토큰 exp 값은 보통 초 단위입니다."
              ]
            }
          ],
          faqs: [
            { question: "10자리와 13자리는 뭐가 다른가요?", answer: "보통 10자리는 초, 13자리는 밀리초입니다. 1000배 차이가 납니다." },
            { question: "왜 시간이 몇 시간 어긋나 보이나요?", answer: "UTC와 로컬 시간대를 다르게 보고 있을 가능성이 큽니다." }
          ]
        };
      case "jwt":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "로그인 토큰의 header, payload 내용을 빠르게 확인할 때 씁니다.",
                "exp, iat, sub, aud 같은 클레임 값을 눈으로 점검할 때 유용합니다.",
                "개발 환경에서 토큰 구조가 맞는지 디버깅할 때 자주 사용합니다."
              ]
            },
            {
              title: l.types,
              items: [
                "JWT는 header.payload.signature 세 부분으로 구성됩니다.",
                "header에는 alg, typ 같은 메타 정보가 들어갑니다.",
                "payload에는 사용자 정보나 만료 시간 같은 클레임이 들어가고, signature는 서명값입니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "디코딩이 된다고 해서 서명이 검증된 것은 아닙니다.",
                "민감한 토큰은 외부에 공유하지 않는 것이 좋습니다.",
                "exp는 보통 Unix timestamp 초 단위로 들어옵니다."
              ]
            }
          ],
          faqs: [
            { question: "디코딩과 검증은 다른가요?", answer: "네. 디코딩은 내용을 읽는 것이고, 검증은 서명이 정상인지 확인하는 단계입니다." },
            { question: "signature도 해석되나요?", answer: "아니요. 이 도구에서는 signature를 원문 문자열로만 보여줍니다." }
          ]
        };
      case "uuid":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "테스트 데이터용 id, fixture, mock API 응답을 만들 때 씁니다.",
                "DB 키나 리소스 식별자를 임시로 여러 개 생성할 때 유용합니다.",
                "한 번에 많은 개수를 내려받아 샘플 데이터로 쓸 수도 있습니다."
              ]
            },
            {
              title: l.types,
              items: [
                "현재 도구는 UUID v4 형태를 생성합니다.",
                "v4는 랜덤 기반 UUID라 예측하기 어렵고 테스트용으로 많이 씁니다.",
                "1개에서 50개까지는 화면에 바로 보여주고, 그 이상은 다운로드 전용으로 처리합니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "UUID는 고유성을 위한 식별자이지 순서를 보장하지는 않습니다.",
                "대량 생성은 파일로 내려받는 쪽이 훨씬 보기 편합니다.",
                "서비스 정책에 따라 UUID 버전 요구사항이 다를 수 있습니다."
              ]
            }
          ],
          faqs: [
            { question: "왜 많이 생성하면 화면에 안 보이나요?", answer: "출력창 가독성과 브라우저 성능을 위해 51개 이상은 다운로드 전용으로 보여줍니다." },
            { question: "UUID는 완전히 중복이 없나요?", answer: "실무적으로는 매우 낮은 확률이지만, 이론적으로 0은 아닙니다." }
          ]
        };
      case "hash":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "문자열의 해시값을 확인하거나 비교할 때 씁니다.",
                "간단한 무결성 체크나 테스트용 해시 생성에 유용합니다.",
                "문서나 텍스트 입력이 바뀌었는지 빠르게 확인할 때 자주 사용합니다."
              ]
            },
            {
              title: l.types,
              items: [
                "SHA-256은 현재 가장 일반적으로 많이 쓰는 해시 중 하나입니다.",
                "SHA-1은 오래된 환경 호환용으로 볼 수 있지만 신규 보안 용도에는 권장되지 않습니다.",
                "해시는 원문으로 되돌리는 복호화 개념이 아니라, 입력을 고정 길이 값으로 바꾸는 방식입니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "보안 용도라면 단순 해시만으로 비밀번호를 저장하면 안 됩니다.",
                "입력이 한 글자만 달라도 결과가 완전히 달라집니다.",
                "같은 입력이면 항상 같은 해시가 나옵니다."
              ]
            }
          ],
          faqs: [
            { question: "해시는 다시 원문으로 복원할 수 있나요?", answer: "아니요. 해시는 복호화용이 아니라 비교와 검증용입니다." },
            { question: "SHA-1도 써도 되나요?", answer: "호환 목적은 가능하지만, 신규 보안 설계라면 보통 SHA-256 이상을 권장합니다." }
          ]
        };
      case "regex":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "로그, 텍스트, 코드 조각에서 특정 패턴이 잡히는지 확인할 때 씁니다.",
                "캡처 그룹과 매치 위치를 빠르게 보면서 정규식을 다듬을 때 유용합니다.",
                "폼 검증, 문자열 추출, 치환 로직을 만들기 전에 테스트하기 좋습니다."
              ]
            },
            {
              title: l.types,
              items: [
                "g는 전체 매치를 찾는 global 플래그입니다.",
                "i는 대소문자를 구분하지 않는 ignore case 플래그입니다.",
                "m은 여러 줄에서 ^와 $를 줄 단위로 해석하고, s는 줄바꿈도 하나의 문자처럼 처리합니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "캡처 그룹은 괄호 () 로 묶은 부분이 별도로 추출된 값입니다.",
                "패턴이 너무 넓으면 원하지 않는 텍스트까지 함께 잡힐 수 있습니다.",
                "g 플래그 유무에 따라 매치 결과 개수와 동작이 달라질 수 있습니다."
              ]
            }
          ],
          faqs: [
            { question: "매치가 없는데 패턴이 틀린 건가요?", answer: "패턴 자체가 맞아도 플래그 설정이나 줄바꿈 처리 방식 때문에 결과가 없을 수 있습니다." },
            { question: "캡처 그룹은 어디에 쓰나요?", answer: "매치된 텍스트 중 일부만 다시 꺼내 쓰거나 치환할 때 자주 사용합니다." }
          ]
        };
      case "diff":
        return {
          sections: [
            {
              title: l.whenToUse,
              items: [
                "두 텍스트 버전이 어떻게 달라졌는지 빠르게 비교할 때 씁니다.",
                "설정 파일, 응답 본문, 문서 초안 차이를 확인할 때 유용합니다.",
                "코드가 아닌 일반 문자열 비교가 필요할 때 가볍게 쓰기 좋습니다."
              ]
            },
            {
              title: l.types,
              items: [
                "Added는 오른쪽에만 새로 생긴 줄입니다.",
                "Removed는 왼쪽에는 있지만 오른쪽에는 없는 줄입니다.",
                "Changed는 같은 위치의 줄이 서로 다를 때 표시하고, Unchanged는 동일한 줄 수를 뜻합니다."
              ]
            },
            {
              title: l.notes,
              items: [
                "현재 비교는 줄 단위 중심이라 문자 단위 하이라이트는 하지 않습니다.",
                "줄 순서가 크게 바뀌면 변경으로 많이 보일 수 있습니다.",
                "빠른 확인용으로는 좋고, 복잡한 병합 작업은 전용 diff 도구가 더 정확합니다."
              ]
            }
          ],
          faqs: [
            { question: "왜 이동한 줄도 changed처럼 보이나요?", answer: "이 도구는 줄 순서를 기준으로 비교해서, 위치가 달라지면 이동도 변경처럼 보일 수 있습니다." },
            { question: "코드 diff와 완전히 같나요?", answer: "아니요. 간단한 텍스트 비교용이라 Git diff 같은 알고리즘보다는 더 가볍습니다." }
          ]
        };
    }
  }

  switch (kind) {
    case "json":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it when JSON is hard to read in a single line.", "It is helpful for checking API payloads and config files.", "You can quickly tell whether the input is valid JSON."] },
          { title: l.types, items: ["Format adds indentation for readability.", "Minify removes whitespace for compact output.", "Objects use {}, and arrays use []."] },
          { title: l.notes, items: ["JSON keys and strings must use double quotes.", "Trailing commas will cause an error.", "Review sensitive values before sharing formatted output."] }
        ],
        faqs: [
          { question: "Is JSON the same as a JavaScript object?", answer: "Not exactly. JSON is stricter and requires double-quoted keys and strings." },
          { question: "Does formatting also validate the input?", answer: "Yes. Invalid JSON will fail during parsing and show an error." }
        ]
      };
    case "base64":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it to encode text into Base64 or decode it back.", "It is useful for tokens, payload snippets, and quick debugging.", "It also helps when checking text hidden inside encoded values."] },
          { title: l.types, items: ["Encode converts plain text into Base64.", "Decode restores a Base64 string back to text.", "Base64 is encoding, not encryption."] },
          { title: l.notes, items: ["UTF-8 characters can affect the visible output.", "Some systems use URL-safe Base64 with - and _.", "Do not treat Base64 as a security feature."] }
        ],
        faqs: [
          { question: "Is Base64 secure?", answer: "No. It only changes representation and can be reversed easily." },
          { question: "Why can decoding fail?", answer: "The input may be truncated or use a different Base64 variant." }
        ]
      };
    case "url":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it when query strings contain spaces or special characters.", "It helps decode escaped URLs from logs or redirects.", "It is common when building links or callback URLs."] },
          { title: l.types, items: ["Encode makes characters safe for URLs.", "Decode restores percent-encoded text.", "Encoding a full URL is different from encoding only a parameter value."] },
          { title: l.notes, items: ["Check whether you are encoding the full URL or just one part.", "Encoding an already encoded value creates double encoding.", "Spaces may appear as %20 or + depending on the system."] }
        ],
        faqs: [
          { question: "Why do / and ? also change?", answer: "They are encoded too when you encode the whole string." },
          { question: "Do non-English URLs need encoding?", answer: "Often yes, especially in APIs, redirects, and logs." }
        ]
      };
    case "timestamp":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it for log times, database values, and token expiration timestamps.", "It helps tell seconds and milliseconds apart.", "It is also useful for generating test values from readable dates."] },
          { title: l.types, items: ["About 10 digits usually means seconds.", "About 13 digits usually means milliseconds.", "Date strings can be converted to both seconds and milliseconds."] },
          { title: l.notes, items: ["Always confirm whether you are reading UTC or local time.", "Frontend and backend code often use different units.", "JWT exp values are usually in seconds."] }
        ],
        faqs: [
          { question: "What is the difference between 10 and 13 digits?", answer: "Ten digits are usually seconds, while thirteen digits are milliseconds." },
          { question: "Why does the time look shifted?", answer: "You may be comparing UTC with your local timezone." }
        ]
      };
    case "jwt":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it to inspect token headers and payloads quickly.", "It is useful when checking exp, iat, sub, aud, and similar claims.", "It helps during authentication debugging."] },
          { title: l.types, items: ["A JWT has header, payload, and signature sections.", "The header usually contains alg and typ.", "The payload contains claims, while the signature is the signed value."] },
          { title: l.notes, items: ["Decoding is not the same as verifying the signature.", "Avoid sharing real production tokens.", "Expiration values are usually Unix time in seconds."] }
        ],
        faqs: [
          { question: "Is decoding the same as verification?", answer: "No. Decoding only reads the token, while verification checks the signature." },
          { question: "Is the signature interpreted too?", answer: "No. This tool shows the signature as raw text only." }
        ]
      };
    case "uuid":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it for fixture ids, mock data, and temporary identifiers.", "It is handy when you need many unique ids quickly.", "You can also download large batches for test datasets."] },
          { title: l.types, items: ["This tool generates UUID v4 values.", "Version 4 UUIDs are random-based and common in app development.", "Counts above 50 switch to download-only output."] },
          { title: l.notes, items: ["UUIDs are for identification, not ordering.", "Large batches are easier to handle through download.", "Some systems require a specific UUID version, so check your requirements."] }
        ],
        faqs: [
          { question: "Why are large batches not shown on screen?", answer: "The UI limits direct output to keep the page readable and responsive." },
          { question: "Can UUIDs collide?", answer: "In practice the chance is extremely low, but not mathematically zero." }
        ]
      };
    case "hash":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it when you need a quick hash of a string.", "It is useful for integrity checks and test data.", "It also helps compare whether two inputs are identical."] },
          { title: l.types, items: ["SHA-256 is the stronger and more common modern choice.", "SHA-1 may still appear in legacy systems but is not recommended for new security-sensitive use.", "A hash maps input to a fixed-length value and is not reversible."] },
          { title: l.notes, items: ["Do not store passwords with a plain hash alone.", "Even a tiny input change creates a very different result.", "The same input always creates the same hash."] }
        ],
        faqs: [
          { question: "Can a hash be turned back into the original text?", answer: "No. Hashes are for comparison and integrity, not decryption." },
          { question: "Should I still use SHA-1?", answer: "Only for compatibility needs. For new security-related uses, prefer SHA-256 or better." }
        ]
      };
    case "regex":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it to test whether a pattern matches text before writing code.", "It is useful for checking capture groups and match positions.", "It helps with validation, extraction, and search rules."] },
          { title: l.types, items: ["g finds all matches in the text.", "i ignores letter case.", "m changes how ^ and $ work across multiple lines, and s lets dot match line breaks."] },
          { title: l.notes, items: ["Capture groups are values wrapped in parentheses.", "A broad pattern can match more than you expect.", "Flag combinations can change the result a lot."] }
        ],
        faqs: [
          { question: "Why is there no match even though the pattern looks right?", answer: "Flags, line breaks, or greedy matching may still prevent the expected result." },
          { question: "What are capture groups for?", answer: "They let you extract or reuse specific parts of a match." }
        ]
      };
    case "diff":
      return {
        sections: [
          { title: l.whenToUse, items: ["Use it to compare two text versions quickly.", "It is useful for config files, API responses, and plain text drafts.", "It is a lightweight option when a full git diff is unnecessary."] },
          { title: l.types, items: ["Added means the line exists only on the right side.", "Removed means the line exists only on the left side.", "Changed means both sides have a line at that position but the content differs."] },
          { title: l.notes, items: ["This tool compares by line order, not deep move detection.", "A moved line may appear as a change rather than a move.", "For complex merges, a dedicated diff tool will still be more accurate."] }
        ],
        faqs: [
          { question: "Why does a moved line still look changed?", answer: "This view compares line positions directly, so moves are not detected separately." },
          { question: "Is this the same as a git diff?", answer: "No. It is a simpler text comparison meant for quick checks." }
        ]
      };
  }

  return fallbackGuide;
}

const fallbackGuide: ToolGuide = {
  sections: [],
  faqs: []
};




