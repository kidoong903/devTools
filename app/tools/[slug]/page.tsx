import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageContent } from "@/components/tool-page-content";
import { getToolBySlug, toolDefinitions } from "@/lib/tool-definitions";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return toolDefinitions.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {};
  }

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `/tools/${tool.slug}`
    }
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolPageContent tool={tool} />;
}
