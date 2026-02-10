// src/components/game/RecentPlays/RecentPlays.tsx
import { GambaTransaction } from "gamba-core-v2";
import { GambaUi } from "gamba-react-ui-v2";
import { RecentPlay } from "@/utils/RecentPlay";
import { ShareModal } from "./ShareModal";
import { TimeDiff } from "@/utils/TimeDiff";
import { useRecentPlays } from "../../../hooks/useRecentPlays";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_PLATFORM_CREATOR as string,
);

export default function RecentPlays() {
  const events = useRecentPlays(true);
  const [selectedGame, setSelectedGame] =
    useState<GambaTransaction<"GameSettled"> | null>(null);
  const PLATFORM_EXPLORER_URL = `https://explorer.gamba.so/platform/${PLATFORM_CREATOR_ADDRESS.toString()}`;

  return (
    <div className="w-full relative flex flex-col gap-2">
      {selectedGame && (
        <ShareModal
          event={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
      {events.length > 0
        ? events.map((tx, index) => (
            <button
              key={tx.signature + "-" + index}
              onClick={() => setSelectedGame(tx)}
              className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-surface-elevated hover:border-primary/20 transition-all duration-200 justify-between group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <RecentPlay event={tx} />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                <TimeDiff time={tx.time} />
              </span>
            </button>
          ))
        : Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-14 w-full rounded-lg animate-Skeleton border border-border"
            />
          ))}

      <Button
        variant="outline"
        onClick={() => window.open(PLATFORM_EXPLORER_URL)}
        className="mt-2 w-full border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Platform Explorer
      </Button>
    </div>
  );
}
