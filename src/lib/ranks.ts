export interface Rank {
  name: string;
  minExp: number;
  maxExp: number;
  color: string;
  icon: string;
  image: string;
}

export const RANKS: Rank[] = [
  { name: "Bronze", minExp: 0, maxExp: 100, color: "var(--rank-bronze)", icon: "🥉", image: "/bronze.png" },
  { name: "Silver", minExp: 100, maxExp: 300, color: "var(--rank-silver)", icon: "🥈", image: "/silver.png" },
  { name: "Gold", minExp: 300, maxExp: 600, color: "var(--rank-gold)", icon: "🥇", image: "/gold.png" },
  { name: "Platinum", minExp: 600, maxExp: 1000, color: "var(--rank-platinum)", icon: "💎", image: "/platinum.png" },
  { name: "Diamond", minExp: 1000, maxExp: 1500, color: "var(--rank-diamond)", icon: "👑", image: "/diamond.png" },
  { name: "Master", minExp: 1500, maxExp: 9999, color: "var(--rank-master)", icon: "🔥", image: "/master.png" },
];

export function getCurrentRank(exp: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (exp >= RANKS[i].minExp) return RANKS[i];
  }
  return RANKS[0];
}

export function getExpProgress(exp: number): number {
  const rank = getCurrentRank(exp);
  const expInRank = exp - rank.minExp;
  const rankRange = rank.maxExp - rank.minExp;
  return Math.min((expInRank / rankRange) * 100, 100);
}

export function getExpToNextRank(exp: number): number {
  const rank = getCurrentRank(exp);
  return rank.maxExp - exp;
}
