import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link2, Scissors, Check, Copy, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateShortUrl } from "@/hooks/useUrls";
import { copyToClipboard, buildShortUrl } from "@/lib/utils";

const schema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  customCode: z
    .string()
    .regex(/^[0-9A-Za-z]{1,10}$/, "Only alphanumeric, max 10 chars")
    .optional()
    .or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

function ShortenForm() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const mutation = useCreateShortUrl();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      originalUrl: "",
      customCode: "",
      expiresAt: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        originalUrl: data.originalUrl,
        customCode: data.customCode || undefined,
        expiresAt: data.expiresAt || undefined,
      },
      { onSuccess: () => reset() }
    );
  };

  const handleCopy = async (shortCode: string) => {
    await copyToClipboard(buildShortUrl(shortCode));
    setCopied(shortCode);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Shorten a URL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">URL to shorten</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="originalUrl"
                  placeholder="https://example.com/very-long-url"
                  className="pl-10"
                  {...register("originalUrl")}
                />
              </div>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Shorten"}
              </Button>
            </div>
            {errors.originalUrl && (
              <p className="text-sm text-destructive">{errors.originalUrl.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Advanced options
          </button>

          {showAdvanced && (
            <div className="grid gap-4 rounded-md border p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customCode">Custom code (optional)</Label>
                <Input id="customCode" placeholder="my-link" {...register("customCode")} />
                {errors.customCode && (
                  <p className="text-sm text-destructive">{errors.customCode.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires at (optional)</Label>
                <Input id="expiresAt" type="datetime-local" {...register("expiresAt")} />
              </div>
            </div>
          )}

          {mutation.isError && <p className="text-sm text-destructive">{mutation.error.message}</p>}

          {mutation.isSuccess && mutation.data && (
            <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <a
                href={buildShortUrl(mutation.data.shortCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-sm font-medium text-primary hover:underline"
              >
                {buildShortUrl(mutation.data.shortCode)}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(mutation.data.shortCode)}
              >
                {copied === mutation.data.shortCode ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default ShortenForm;
