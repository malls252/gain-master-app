import { motion } from "framer-motion";
import { Flame, Target, Zap } from "lucide-react";

interface StatsBarProps {
  streak: number;
  dailyProgress: number;
  completedCount: number;
  totalTasks: number;
}

const StatsBar = ({ streak, dailyProgress, completedCount, totalTasks }: StatsBarProps) => {
  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: `${streak} hari`,
      accent: streak > 0,
    },
    {
      icon: Target,
      label: "Hari Ini",
      value: `${completedCount}/${totalTasks}`,
      accent: completedCount === totalTasks,
    },
    {
      icon: Zap,
      label: "Progress",
      value: `${Math.round(dailyProgress)}%`,
      accent: dailyProgress === 100,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="card-soft rounded-xl p-3 text-center"
        >
          <stat.icon
            className={`w-5 h-5 mx-auto mb-1 ${
              stat.accent ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="text-sm font-bold text-foreground">{stat.value}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
