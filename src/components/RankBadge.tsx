import { motion } from "framer-motion";
import { getCurrentRank, getExpProgress, getExpToNextRank, RANKS } from "@/lib/ranks";

interface RankBadgeProps {
  totalExp: number;
}

const RankBadge = ({ totalExp }: RankBadgeProps) => {
  const rank = getCurrentRank(totalExp);
  const progress = getExpProgress(totalExp);
  const toNext = getExpToNextRank(totalExp);
  const rankIndex = RANKS.findIndex((r) => r.name === rank.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-soft rounded-2xl p-5"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-24 h-24 flex items-center justify-center">
          <img src={rank.image} alt={rank.name} className="w-full h-full object-contain filter drop-shadow-lg" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Rank Saat Ini
          </p>
          <h2 className="text-xl font-bold text-gradient-gold">{rank.name}</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-primary">{totalExp}</p>
          <p className="text-xs text-muted-foreground">Total EXP</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary progress-bar-glow"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {rank.name} {rankIndex < RANKS.length - 1 ? `→ ${RANKS[rankIndex + 1].name}` : "(MAX)"}
        </span>
        <span className="text-xs font-medium text-primary">
          {toNext > 0 ? `${toNext} EXP lagi` : "MAX RANK!"}
        </span>
      </div>
    </motion.div>
  );
};

export default RankBadge;
