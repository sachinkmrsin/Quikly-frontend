import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2, Upload, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateBulkUrls } from "@/hooks/useUrls";

const schema = z.object({
  urls: z
    .array(
      z.object({
        originalUrl: z.string().url("Invalid URL"),
        customCode: z.string().optional().or(z.literal("")),
      })
    )
    .min(1, "Add at least one URL")
    .max(100, "Maximum 100 URLs per batch"),
});

type FormData = z.infer<typeof schema>;

function BulkCreateForm() {
  const [showResults, setShowResults] = useState(false);
  const mutation = useCreateBulkUrls();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      urls: [{ originalUrl: "", customCode: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "urls",
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        urls: data.urls.map((u) => ({
          originalUrl: u.originalUrl,
          customCode: u.customCode || undefined,
        })),
      },
      { onSuccess: () => setShowResults(true) }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Create URLs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="https://example.com/long-url"
                    {...register(`urls.${index}.originalUrl`)}
                  />
                  {errors.urls?.[index]?.originalUrl && (
                    <p className="text-xs text-destructive">
                      {errors.urls[index]?.originalUrl?.message}
                    </p>
                  )}
                </div>
                <div className="w-32 space-y-1">
                  <Input
                    placeholder="Custom code"
                    {...register(`urls.${index}.customCode`)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {errors.urls && typeof errors.urls.message === "string" && (
            <p className="text-sm text-destructive">{errors.urls.message}</p>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ originalUrl: "", customCode: "" })}
              disabled={fields.length >= 100}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add URL
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Upload className="h-4 w-4 mr-1" />
              )}
              Create {fields.length} URL{fields.length > 1 ? "s" : ""}
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">{mutation.error.message}</p>
          )}

          {showResults && mutation.data && (
            <div className="space-y-3 rounded-md border p-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {mutation.data.summary.succeeded} succeeded
                </span>
                {mutation.data.summary.failed > 0 && (
                  <span className="flex items-center gap-1 text-destructive">
                    <XCircle className="h-4 w-4" />
                    {mutation.data.summary.failed} failed
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => { reset(); setShowResults(false); }}>
                Create more
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default BulkCreateForm;
