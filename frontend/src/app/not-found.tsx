import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary px-4">
      <h1 className="text-9xl font-bold text-accent mb-4 animate-pulse">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-primary-muted mb-8 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  );
}
