import { Zap } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Quikly URL Shortener</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with React + Vite
        </p>
      </div>
    </footer>
  );
}

export default Footer;
