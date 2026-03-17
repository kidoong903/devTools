"use client";

import { useLanguage } from "@/components/language-provider";

type StaticPageKind = "about" | "contact" | "privacy";

type StaticPageContentProps = {
  kind: StaticPageKind;
};

type StaticPageCopy = {
  eyebrow: string;
  title: string;
  body: string[];
};

const pageCopy = {
  en: {
    about: {
      eyebrow: "About",
      title: "About BbalRang Tools",
      body: [
        "BbalRang Tools is a lightweight collection of browser-based developer utilities.",
        "It is built to make common tasks like formatting JSON, decoding JWTs, testing regex patterns, and checking text differences quicker and easier."
      ]
    },
    contact: {
      eyebrow: "Contact",
      title: "Contact",
      body: [
        "This site does not currently provide a separate contact channel.",
        "If a contact method is added later, this page will be updated."
      ]
    },
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy Policy",
      body: [
        "This site does not directly collect personal information such as names, email addresses, or account details.",
        "Most tool inputs are processed in your browser. Basic technical data such as access logs, cookies, or advertising-related data may be handled by hosting, analytics, or advertising services.",
        "If Google AdSense or similar services are used, they may use cookies or similar technologies according to their own policies."
      ]
    }
  },
  ko: {
    about: {
      eyebrow: "소개",
      title: "BbalRang Tools 소개",
      body: [
        "BbalRang Tools는 브라우저에서 바로 사용할 수 있는 가벼운 개발자 도구 모음입니다.",
        "JSON 정리, JWT 디코딩, 정규식 테스트, 텍스트 diff 확인처럼 자주 하는 작업을 더 빠르고 편하게 처리할 수 있도록 만들었습니다."
      ]
    },
    contact: {
      eyebrow: "문의",
      title: "문의 안내",
      body: [
        "현재 이 사이트는 별도의 문의 채널을 운영하지 않습니다.",
        "추후 문의 방법이 추가되면 이 페이지에서 안내할 예정입니다."
      ]
    },
    privacy: {
      eyebrow: "개인정보",
      title: "개인정보처리방침",
      body: [
        "이 사이트는 이름, 이메일, 계정 정보와 같은 개인정보를 직접 수집하지 않습니다.",
        "대부분의 도구 입력값은 브라우저 안에서 처리됩니다. 다만 접속 로그, 쿠키, 광고 관련 정보 등 기본적인 기술 정보는 호스팅, 분석, 광고 서비스에서 처리될 수 있습니다.",
        "Google AdSense와 같은 외부 광고 서비스를 사용하는 경우, 해당 서비스는 자체 정책에 따라 쿠키 또는 유사 기술을 사용할 수 있습니다."
      ]
    }
  },
  ch: {
    about: {
      eyebrow: "关于",
      title: "关于 BbalRang Tools",
      body: [
        "BbalRang Tools 是一组可直接在浏览器中使用的轻量级开发者工具。",
        "它用于更快、更轻松地完成 JSON 格式化、JWT 解码、正则测试和文本 diff 检查等常见任务。"
      ]
    },
    contact: {
      eyebrow: "联系",
      title: "联系",
      body: [
        "本网站目前不提供单独的联系渠道。",
        "如果之后增加联系方式，本页会同步更新。"
      ]
    },
    privacy: {
      eyebrow: "隐私",
      title: "隐私政策",
      body: [
        "本网站不会直接收集姓名、邮箱地址或账户信息等个人信息。",
        "大多数工具输入都在浏览器中处理。但访问日志、Cookie 或广告相关技术数据，可能会由托管、分析或广告服务处理。",
        "如果使用 Google AdSense 或类似服务，这些服务可能会根据其自身政策使用 Cookie 或类似技术。"
      ]
    }
  },
  jp: {
    about: {
      eyebrow: "概要",
      title: "BbalRang Tools について",
      body: [
        "BbalRang Tools は、ブラウザですぐ使える軽量な開発者向けツール集です。",
        "JSON の整形、JWT のデコード、正規表現のテスト、テキスト diff の確認といった日常的な作業を、より速く手軽に行えるように作られています。"
      ]
    },
    contact: {
      eyebrow: "お問い合わせ",
      title: "お問い合わせ",
      body: [
        "現在、このサイトでは専用のお問い合わせ窓口を設けていません。",
        "今後連絡方法を追加する場合は、このページで案内します。"
      ]
    },
    privacy: {
      eyebrow: "プライバシー",
      title: "プライバシーポリシー",
      body: [
        "このサイトでは、氏名、メールアドレス、アカウント情報などの個人情報を直接収集していません。",
        "ほとんどの入力はブラウザ内で処理されます。ただし、アクセスログ、Cookie、広告関連の技術情報などは、ホスティング、分析、広告サービスによって処理される場合があります。",
        "Google AdSense などの外部サービスを利用する場合、それらのサービスは独自のポリシーに基づいて Cookie などの技術を使用することがあります。"
      ]
    }
  }
} satisfies Record<"en" | "ko" | "ch" | "jp", Record<StaticPageKind, StaticPageCopy>>;

export function StaticPageContent({ kind }: StaticPageContentProps) {
  const { locale } = useLanguage();
  const content = pageCopy[locale][kind];

  return (
    <div className="page-wrap">
      <section className="section-block static-page">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        {content.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}

