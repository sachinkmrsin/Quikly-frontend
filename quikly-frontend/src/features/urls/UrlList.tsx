import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Trash2, BarChart3, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUrls, useDeleteUrl } from "@/hooks/useUrls";
import { copyToClipboard, buildShortUrl, formatDate } from "@/lib/utils";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { Url } from "@/types/url";

function UrlList() {
  const [page, setPage] = useState(0);
  const limit = 10;
  const { data, isLoading, isError, error } = useUrls({
    limit,
    offset: page * limit,
  });
  const deleteMutation = useDeleteUrl();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (shortCode: string) => {
    await copyToClipboard(buildShortUrl(shortCode));
    setCopied(shortCode);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = (shortCode: string) => {
    if (confirm("Are you sure you want to delete this URL?")) {
      deleteMutation.mutate(shortCode);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p className="text-center text-destructive">{error.message}</p>;
  if (!data?.data.length)
    return <p className="text-center text-muted-foreground py-8">No URLs yet. Create your first one!</p>;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Short URL</TableHead>
            <TableHead className="hidden md:table-cell">Original URL</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead className="w-[140px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((url: Url) => (
            <TableRow key={url.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <a
                    href={buildShortUrl(url.shortCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {url.shortCode}
                  </a>
                  {url.expiresAt && new Date(url.expiresAt) < new Date() && (
                    <Badge variant="destructive">expired</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="max-w-[300px] truncate block text-muted-foreground">
                  {url.originalUrl}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{url.clickCount}</Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                {formatDate(url.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(url.shortCode)}>
                    {copied === url.shortCode ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/stats/${url.shortCode}`}>
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(url.shortCode)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {page * limit + 1}–{Math.min((page + 1) * limit, data.pagination.total)} of{" "}
          {data.pagination.total}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.pagination.hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UrlList;
