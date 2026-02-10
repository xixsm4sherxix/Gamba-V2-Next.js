// src/components/game/GameCard.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GameBundle } from "gamba-react-ui-v2";
import { ArrowRight } from "lucide-react";

interface GameCardProps {
  game: GameBundle;
  key?: string | number;
}

export function GameCard({ game }: GameCardProps) {
  const router = useRouter();
  const small = router.pathname !== "/";
  const imagePath = `/games/${game.id}/logo.png`;

  return (
    <Link href={`/play/${game.id}`} passHref>
      <div
        className="cursor-pointer game-card w-full bg-cover bg-center text-foreground font-bold text-2xl group"
        style={{
          aspectRatio: small ? "1 / 0.5" : "1 / 0.65",
          backgroundColor: game.meta.background,
          borderRadius: "0.75rem",
        }}
      >
        <div
          className="background absolute top-0 left-0 w-full h-full bg-repeat"
          style={{
            backgroundImage: "url(/stuff.png)",
            backgroundSize: "100px",
          }}
        />
        <div
          className="image absolute top-0 left-0 w-full h-full bg-no-repeat bg-center bg-contain"
          style={{ backgroundImage: `url(${imagePath})` }}
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="play absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 rounded-b-lg">
          <span className="text-sm font-semibold text-foreground drop-shadow-lg">
            {game.meta.name}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:translate-x-0.5">
            Play
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
