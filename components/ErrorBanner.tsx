'use client';

export default function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
      {message}
    </div>
  );
}
