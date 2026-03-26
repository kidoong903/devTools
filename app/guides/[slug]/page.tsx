import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePageContent } from "@/components/guide-page-content";
import { getGuideBySlug, getGuideSlugs } from "@/lib/guide-articles";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug, "en");

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/guides/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/guides/${article.slug}`
    }
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  if (!getGuideBySlug(slug, "en")) {
    notFound();
  }

  return <GuidePageContent slug={slug} />;
}