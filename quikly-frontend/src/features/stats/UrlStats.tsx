import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  MousePointerClick,
  Timer,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrlStats, useDeleteUrl } from "@/hooks/useUrls";
import { copyToClipboard, buildShortUrl, formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

function UrlStats() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { data, isLoading, isError, error } = useUrlStats(shortCode!);
  const deleteMutation = useDeleteUrl();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = async () => {
    if (!data) return;
    await copyToClipboard(buildShortUrl(data.shortCode));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (!data) return;
    if (confirm("Are you sure you want to delete this URL?")) {
      deleteMutation.mutate(data.shortCode, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error.message}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const isExpired = data.expiresAt && new Date(data.expiresAt) < new Date();

  const stats = [
    {
      label: "Total Clicks",
      value: data.clickCount.toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "Created",
      value: formatDate(data.createdAt),
      icon: Calendar,
    },
    {
      label: "Last Accessed",
      value: data.lastAccessedAt ? formatDate(data.lastAccessedAt) : "Never",
      icon: Clock,
    },
    {
      label: "Expires",
      value: data.expiresAt ? formatDate(data.expiresAt) : "Never",
      icon: Timer,
    },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{data.shortCode}</h1>
            {isExpired && <Badge variant="destructive">expired</Badge>}
          </div>
          <a
            href={data.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
          >
            {data.originalUrl}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UrlStats;
