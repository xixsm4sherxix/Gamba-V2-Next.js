// src/utils/RecentPlay.tsx
import { BPS_PER_WHOLE, GambaTransaction } from "gamba-core-v2";
import { TokenValue, useTokenMeta } from "gamba-react-ui-v2";

import { GAMES } from "@/games";

export const extractMetadata = (event: GambaTransaction<"GameSettled">) => {
  const [version, gameId, ...rest] = event.data.metadata.split(":");
  const game = GAMES.find((x) => x.id.toLowerCase() === gameId.toLowerCase());

  if (game) {
    return {
      game: game,
      gameNameFallback: game?.meta?.name,
      isFallback: false,
    };
  } else {
    const gameNameFallback = gameId || "Unknown";
    const gameIdFallback = gameId || "unknownGame";
    return {
      game: {
        id: gameIdFallback,
        meta: {
          background: "#fff",
          name: gameNameFallback,
          image: "/logo.png",
          description: `unknown game: ${gameIdFallback}`,
          volatility: 0,
        },
      },
      gameNameFallback,
      isFallback: true,
    };
  }
};

export function RecentPlay({
  event,
}: {
  event: GambaTransaction<"GameSettled">;
}) {
  const data = event.data;
  const token = useTokenMeta(data.tokenMint);

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE;
  const wager = data.wager.toNumber();
  const payout = multiplier * wager;
  const profit = payout - wager;

  const { game, gameNameFallback, isFallback } = extractMetadata(event);

  return (
    <div className="flex items-center justify-between w-full gap-3 md:gap-5">
      {/* Game icon */}
      <div className="flex items-center gap-2.5 shrink-0">
        {!isFallback ? (
          <img
            src={`/games/${game.id}/logo.png`}
            alt={`${game?.meta?.name}`}
            className="h-10 w-10 rounded-lg object-cover ring-1 ring-border"
          />
        ) : (
          <img
            src="/logo.svg"
            alt={`${gameNameFallback}`}
            className="h-10 w-10 rounded-lg object-contain p-1 bg-muted ring-1 ring-border"
          />
        )}
      </div>

      {/* Player address */}
      <div className="text-xs font-mono text-muted-foreground hidden sm:block">
        {`${data.user.toBase58().substring(0, 4)}...${data.user.toBase58().slice(-4)}`}
      </div>

      {/* Win/Loss label */}
      <div className={`text-xs font-semibold uppercase tracking-wider ${profit >= 0 ? "text-primary" : "text-destructive"}`}>
        {profit >= 0 ? "WON" : "LOST"}
      </div>

      {/* Amount */}
      <div
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-semibold ${
          profit > 0
            ? "bg-primary/10 text-primary border border-primary/20"
            : "bg-muted text-muted-foreground border border-border"
        }`}
      >
        {token.image ? (
          <img
            src={token.image}
            alt="Token"
            width={18}
            height={18}
            className="rounded-full shrink-0"
          />
        ) : (
          <span className="inline-flex items-center justify-center w-[18px] h-[18px] border border-muted-foreground rounded-full text-[10px] font-medium text-muted-foreground">
            {token.symbol}
          </span>
        )}
        <TokenValue amount={Math.abs(profit)} mint={data.tokenMint} />
      </div>

      {/* Multiplier */}
      <div className="hidden md:flex flex-col items-center">
        {profit > 0 && (
          <span className="text-xs font-medium text-muted-foreground">
            ({multiplier.toFixed(2)}x)
          </span>
        )}
        {data.jackpotPayoutToUser.toNumber() > 0 && (
          <span className="text-xs font-bold text-gold flex items-center gap-1">
            +<TokenValue
              mint={data.tokenMint}
              amount={data.jackpotPayoutToUser.toNumber()}
            />
          </span>
        )}
      </div>
    </div>
  );
}
