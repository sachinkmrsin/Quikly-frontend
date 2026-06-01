import { Link, useLocation } from "react-router-dom";
import { Zap, LayoutDashboard, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Header() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Link2 },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Quikly</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to={item.path} className={cn("gap-2")}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
