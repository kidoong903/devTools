import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-wrap not-found">
      <p className="eyebrow">404</p>
      <h1>Tool not found</h1>
      <p>The page you requested is not available in this MVP.</p>
      <Link href="/">Back to home</Link>
    </div>
  );
}
