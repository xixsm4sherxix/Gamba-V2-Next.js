"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ClipboardCopy, LogOut, Settings, User, Zap } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  GambaPlatformContext,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useReferral,
  useTokenBalance,
} from "gamba-react-ui-v2"
import { PLATFORM_REFERRAL_FEE, TOKENLIST } from "@/constants"
import React, { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useUserStore } from "@/hooks/useUserStore"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export default function Header() {
  const context = React.useContext(GambaPlatformContext)
  const { connected, publicKey, disconnect, wallet, connecting } = useWallet()
  const walletModal = useWalletModal()
  const pool = useCurrentPool()
  const token = useCurrentToken()
  const balance = useTokenBalance()
  const { copyLinkToClipboard } = useReferral()

  const [showBonusHelp, setShowBonusHelp] = useState(false)
  const [showJackpotHelp, setShowJackpotHelp] = useState(false)

  const { isPriorityFeeEnabled, priorityFee, set } = useUserStore()
  const [newPriorityFee, setNewPriorityFee] = useState(priorityFee)

  const handleSetPriorityFee = useCallback(() => {
    try {
      set({ priorityFee: newPriorityFee })
      toast.success(`Priority fee set to ${newPriorityFee}`)
    } catch (error) {
      toast.error("Error setting priority fee")
      console.error("Error setting priority fee:", error)
    }
  }, [newPriorityFee, set])

  const handleSetToken = (token: any) => {
    try {
      if (token && token.poolAuthority) {
        context.setPool(token.mint, token.poolAuthority)
      } else {
        context.setPool(token.mint)
      }
      toast.success(`Token set to ${token.name}`)
    } catch (error) {
      toast.error("Error setting token")
    }
  }

  const copyInvite = () => {
    if (!publicKey) {
      return walletModal.setVisible(true)
    }
    copyLinkToClipboard()
    toast.success(
      `Copied! Share your link to earn a ${PLATFORM_REFERRAL_FEE * 100}% fee when players use this platform`,
    )
  }

  const truncateString = (s: string, startLen = 4, endLen = startLen) =>
    s ? `${s.slice(0, startLen)}...${s.slice(-endLen)}` : ""

  const handleConnect = useCallback(() => {
    walletModal.setVisible(true)
  }, [walletModal])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="mx-auto flex items-center justify-between px-4 py-3 max-w-7xl">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" passHref>
              <div className="flex items-center gap-2 cursor-pointer group">
                <img alt="Gamba logo" src="/logo.svg" className="h-8 transition-transform duration-300 group-hover:scale-105" />
              </div>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bonus / Jackpot Help Dialogs */}
            <Dialog open={showBonusHelp} onOpenChange={setShowBonusHelp}>
              <DialogContent className="glass-strong border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">You have a bonus!</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">
                  You have{" "}
                  <b className="text-primary">
                    <TokenValue amount={balance.bonusBalance} />
                  </b>{" "}
                  worth of free plays. This bonus will be applied automatically when you play.
                </p>
              </DialogContent>
            </Dialog>

            <Dialog open={showJackpotHelp} onOpenChange={setShowJackpotHelp}>
              <DialogContent className="glass-strong border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">{token.name} Jackpot Details</DialogTitle>
                </DialogHeader>
                {pool.jackpotBalance > 0 && (
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-primary font-bold text-sm uppercase tracking-wide">
                    <Zap className="h-3.5 w-3.5" />
                    <TokenValue amount={pool.jackpotBalance} />
                  </div>
                )}
                <div className="mt-4 space-y-3">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The Jackpot grows with each game played, funded by fees from unsuccessful attempts to win it. Winning
                    the jackpot not only grants substantial rewards but also recycles a tiny portion of the winnings back
                    into the main liquidity pool, sustaining the games economy.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Pool Fee</div>
                      <div className="text-sm font-semibold text-foreground mt-1">{pool.poolFee}%</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Liquidity</div>
                      <div className="text-sm font-semibold text-foreground mt-1"><TokenValue amount={Number(pool.liquidity)} /></div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Min Wager</div>
                      <div className="text-sm font-semibold text-foreground mt-1"><TokenValue amount={pool.minWager} /></div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Max Payout</div>
                      <div className="text-sm font-semibold text-foreground mt-1"><TokenValue amount={pool.maxPayout} /></div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <a
                        href={`https://explorer.gamba.so/pool/${pool.publicKey.toString()}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Pool on Explorer
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Jackpot badge */}
            {pool.jackpotBalance > 0 && (
              <button
                onClick={() => setShowJackpotHelp(true)}
                className="hidden md:inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs uppercase font-bold tracking-wide text-primary transition-all duration-200 hover:bg-primary/20 hover:border-primary/40"
              >
                <Zap className="h-3 w-3" />
                <TokenValue amount={pool.jackpotBalance} />
              </button>
            )}

            {/* Bonus badge */}
            {balance.bonusBalance > 0 && (
              <button
                onClick={() => setShowBonusHelp(true)}
                className="hidden md:inline-flex items-center gap-1 cursor-pointer rounded-lg bg-gold/10 border border-gold/20 px-3 py-1.5 text-xs uppercase font-bold tracking-wide text-gold transition-all duration-200 hover:bg-gold/20"
              >
                +<TokenValue amount={balance.bonusBalance} />
              </button>
            )}

            {/* Wallet / Connect */}
            {connected ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-border bg-surface-elevated hover:bg-muted text-foreground">
                    <div className="flex items-center gap-2">
                      {token && (
                        <>
                          <img className="w-5 h-5 rounded-full ring-1 ring-border" src={token.image || "/placeholder.svg"} alt="Token" />
                          <span className="font-semibold text-sm">
                            <TokenValue amount={balance.balance} />
                          </span>
                          {balance.bonusBalance > 0 && (
                            <span className="text-xs text-primary">
                              +<TokenValue amount={balance.bonusBalance} />
                            </span>
                          )}
                        </>
                      )}
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[460px] glass-strong border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Wallet & Settings
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5">
                    {/* Wallet info */}
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">Connected Wallet</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{truncateString(publicKey?.toString() || "", 8, 8)}</p>
                      </div>
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src={wallet?.adapter.icon} alt="Wallet Icon" />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">WL</AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Balance */}
                    <div className="rounded-lg bg-muted/30 p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Balance</p>
                      <div className="flex items-center gap-2">
                        <img className="w-7 h-7 rounded-full ring-1 ring-border" src={token.image || "/placeholder.svg"} alt="Token" />
                        <p className="text-2xl font-bold text-foreground">
                          <TokenValue amount={balance.balance} />
                          {balance.bonusBalance > 0 && (
                            <span className="text-sm ml-1.5 text-primary font-medium">
                              (+<TokenValue amount={balance.bonusBalance} /> Bonus)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Token list */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Select Token</p>
                      <ScrollArea className="h-[180px] rounded-lg border border-border bg-muted/20 p-2">
                        <div className="space-y-1">
                          {Object.values(TOKENLIST).map((tk, index) => (
                            <button
                              key={index}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all duration-200 hover:bg-muted/60 group"
                              onClick={() => handleSetToken(tk)}
                            >
                              <img
                                className="w-8 h-8 rounded-full ring-1 ring-border group-hover:ring-primary/30 transition-all"
                                src={tk.image || "/placeholder.svg"}
                                alt={tk.symbol}
                              />
                              <div>
                                <div className="text-sm font-medium text-foreground">{tk.symbol}</div>
                                <div className="text-xs text-muted-foreground">{tk.name}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Priority Fee */}
                    <div className="rounded-lg bg-muted/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Priority Fee</p>
                          <p className="text-xs text-muted-foreground">Speed up transactions</p>
                        </div>
                        <Switch
                          checked={isPriorityFeeEnabled}
                          onCheckedChange={(checked) => {
                            set({ isPriorityFeeEnabled: checked })
                            if (checked) {
                              toast.success("Priority fee enabled")
                            } else {
                              toast.error("Priority fee disabled")
                            }
                          }}
                        />
                      </div>
                      {isPriorityFeeEnabled && (
                        <div className="space-y-2 pt-1">
                          <label className="text-xs text-muted-foreground">Microlamports</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={newPriorityFee}
                              onChange={(e) => {
                                const parsedValue = Number.parseInt(e.target.value, 10)
                                if (!isNaN(parsedValue)) {
                                  setNewPriorityFee(parsedValue)
                                }
                              }}
                              className="bg-muted/50 border-border text-foreground"
                            />
                            <Button onClick={handleSetPriorityFee} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                              Set
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Referral */}
                    <div className="rounded-lg bg-muted/30 p-4 space-y-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Referral Link</p>
                      <div className="flex gap-2">
                        <Input value={`${window.location.origin}?code=${publicKey?.toString() || ""}`} readOnly className="bg-muted/50 border-border text-foreground text-xs font-mono" />
                        <Button onClick={copyInvite} variant="outline" size="sm" className="border-border text-foreground hover:bg-muted shrink-0">
                          <ClipboardCopy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <DialogClose asChild>
                        <Link href="/profile" passHref legacyBehavior>
                          <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-muted">
                            <User className="h-4 w-4 mr-1.5" />
                            Profile
                          </Button>
                        </Link>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                          onClick={() => disconnect()}
                        >
                          <LogOut className="h-4 w-4 mr-1.5" />
                          Disconnect
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
