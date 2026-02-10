// src/components/layout/Footer.tsx

import { FOOTER_LINKS, FOOTER_TWITTER_LINK } from "../../constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-card">
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
      <div className="relative w-full max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://gamba.so/"
            className="flex items-center gap-3 group"
          >
            <img src="/logo.svg" className="h-8 transition-transform duration-300 group-hover:scale-105" alt="Gamba Logo" />
            <span className="text-sm font-medium text-muted-foreground">Powered by Gamba Protocol</span>
          </a>
          <nav>
            <ul className="flex flex-wrap items-center gap-6">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              <a href={FOOTER_TWITTER_LINK.href} className="hover:text-foreground transition-colors duration-200">
                {FOOTER_TWITTER_LINK.title}
              </a>
            </span>
            <span className="text-xs text-muted-foreground">
              Built on Solana
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
