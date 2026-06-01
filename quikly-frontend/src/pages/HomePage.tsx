import { Link } from "react-router-dom";
import { Zap, ArrowRight, BarChart3, Link2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShortenForm from "@/features/shorten/ShortenForm";
import { useTopUrls } from "@/hooks/useUrls";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function HomePage() {
  const { data: topUrls, isLoading } = useTopUrls(5);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate short URLs instantly with our optimized backend.",
    },
    {
      icon: BarChart3,
      title: "Click Analytics",
      description: "Track every click with detailed statistics and insights.",
    },
    {
      icon: Shield,
      title: "Reliable & Secure",
      description: "Built with rate limiting and caching for maximum uptime.",
    },
  ];

  return (
    <div className="space-y-16 py-12">
      <section className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Shorten your URLs with{" "}
            <span className="text-primary flex items-center justify-center gap-2">
              <Zap className="h-10 w-10 sm:h-12 sm:w-12" />
              Quikly
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform long, unwieldy URLs into short, memorable links. Track clicks, set expiration
            dates, and more.
          </p>
        </div>
      </section>

      <section>
        <ShortenForm />
      </section>

      {topUrls && topUrls.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Top Links</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <div className="space-y-3">
                    {topUrls.map((url) => (
                      <div
                        key={url.id}
                        className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <Link
                              to={`/stats/${url.shortCode}`}
                              className="font-medium hover:underline"
                            >
                              {url.shortCode}
                            </Link>
                            <p className="text-sm text-muted-foreground truncate">
                              {url.originalUrl}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{url.clickCount} clicks</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Why Quikly?</h2>
        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardContent className="pt-6 space-y-3">
                <feature.icon className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to manage your links?</h2>
        <Button size="lg" asChild>
          <Link to="/dashboard" className="gap-2">
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

export default HomePage;
