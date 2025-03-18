export default function Footer() {
    return (
      <footer className="relative z-10 border-t border-[hsl(var(--primary))]/10 bg-[hsl(var(--background))]/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          © {new Date().getFullYear()} <span className="gradient-text font-semibold">OnlineShoppAR</span>. All rights
          reserved.
        </div>
      </footer>
    )
  }
  
  