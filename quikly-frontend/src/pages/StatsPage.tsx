import ErrorBoundary from "@/components/common/ErrorBoundary";
import UrlStats from "@/features/stats/UrlStats";

function StatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorBoundary>
        <UrlStats />
      </ErrorBoundary>
    </div>
  );
}

export default StatsPage;
