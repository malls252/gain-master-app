import { motion } from "framer-motion";
import { RANKS, getCurrentRank } from "@/lib/ranks";

interface RankListProps {
  totalExp: number;
}

const RankList = ({ totalExp }: RankListProps) => {
  const currentRank = getCurrentRank(totalExp);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-foreground">Semua Rank</h2>
      {RANKS.map((rank, i) => {
        const isCurrent = rank.name === currentRank.name;
        const isUnlocked = totalExp >= rank.minExp;

        return (
          <motion.div
            key={rank.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`card-soft rounded-xl p-4 flex items-center gap-4 ${isCurrent ? "glow-primary border-primary/30" : ""
              } ${!isUnlocked ? "opacity-40" : ""}`}
          >
            <div className="w-16 h-16 flex-shrink-0">
              <img src={rank.image} alt={rank.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <p className={`font-bold ${isCurrent ? "text-gradient-gold" : "text-foreground"}`}>
                {rank.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {rank.minExp} - {rank.maxExp} EXP
              </p>
            </div>
            {isCurrent && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                SAAT INI
              </span>
            )}
            {isUnlocked && !isCurrent && (
              <span className="text-xs font-medium text-success">✓</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default RankList;
