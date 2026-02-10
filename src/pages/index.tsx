// src/pages/index.tsx
import { GameGrid } from "@/components/game/GameGrid";
import { PLATFORM_REFERRAL_FEE } from "@/constants";
import RecentPlays from "@/components/game/RecentPlays/RecentPlays";
import { toast } from "sonner";
import { useReferral } from "gamba-react-ui-v2";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ArrowUpRight, Copy, BookOpen, Compass, MessageCircle, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const { copyLinkToClipboard } = useReferral();

  const handleCopyInvite = () => {
    if (!wallet.publicKey) {
      return walletModal.setVisible(true);
    }
    copyLinkToClipboard();
    toast.success(
      `Copied! Share your link to earn a ${PLATFORM_REFERRAL_FEE * 100}% fee when players use this platform`,
    );
  };

  const quickLinks = [
    {
      icon: Code2,
      label: "Build your own",
      href: "https://github.com/BankkRoll/Gamba-V2-Next.js",
    },
    {
      icon: BookOpen,
      label: "Gamba Docs",
      href: "https://gamba.so/docs",
    },
    {
      icon: Compass,
      label: "Explorer",
      href: "https://explorer.gamba.so",
    },
    {
      icon: MessageCircle,
      label: "Discord",
      href: "https://discord.com/invite/HSTtFFwR",
    },
  ];

  return (
    <>
      <div className="relative mx-auto flex flex-col gap-8 mt-20 pb-16 px-4 transition-all duration-300 ease-in-out sm:px-6 md:max-w-7xl">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
          {/* Ambient glow effects */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-ambient-glow pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gold/10 rounded-full blur-[100px] animate-ambient-glow pointer-events-none" style={{ animationDelay: "4s" }} />

          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
              {/* Left content */}
              <div className="flex-1 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Live on Solana
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                  Welcome to Gamba
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                  The gambleFi protocol with end-to-end tools for on-chain
                  degeneracy on Solana.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
                  <Button
                    onClick={handleCopyInvite}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Referral Link
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                    Earn {PLATFORM_REFERRAL_FEE * 100}% on each play via your referral
                  </p>
                </div>
              </div>

              {/* Right quick links */}
              <div className="grid grid-cols-2 gap-3 lg:w-[280px] shrink-0">
                {quickLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => window.open(link.href)}
                    className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-surface-elevated p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/60 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Games</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <GameGrid />
        </section>

        {/* Recent Plays Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Recent Plays</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <RecentPlays />
        </section>
      </div>
    </>
  );
}
