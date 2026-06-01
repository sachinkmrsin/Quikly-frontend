import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlList from "@/features/urls/UrlList";
import BulkCreateForm from "@/features/bulk/BulkCreateForm";
import { useCleanupExpired } from "@/hooks/useUrls";

function DashboardPage() {
  const [tab, setTab] = useState("urls");
  const cleanupMutation = useCleanupExpired();

  const handleCleanup = () => {
    if (confirm("Delete all expired URLs? This cannot be undone.")) {
      cleanupMutation.mutate();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your shortened URLs</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCleanup}
          disabled={cleanupMutation.isPending}
        >
          {cleanupMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Trash2 className="h-4 w-4 mr-1" />
          )}
          Cleanup Expired
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="urls">All URLs</TabsTrigger>
          <TabsTrigger value="bulk">
            <Plus className="h-4 w-4 mr-1" />
            Bulk Create
          </TabsTrigger>
        </TabsList>
        <TabsContent value="urls">
          <Card>
            <CardHeader>
              <CardTitle>Your URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <UrlList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulk">
          <BulkCreateForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardPage;
