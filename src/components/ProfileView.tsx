import { motion } from "framer-motion";
import { getCurrentRank } from "@/lib/ranks";

interface ProfileViewProps {
  totalExp: number;
  streak: number;
  completedToday: string[];
  customTasksCount?: number;
  totalTasksCount?: number;
}

const ProfileView = ({ totalExp, streak, completedToday, customTasksCount = 0, totalTasksCount = 0 }: ProfileViewProps) => {
  const rank = getCurrentRank(totalExp);
  const todayCompleted = completedToday.length;
  const totalPossibleExp = totalTasksCount > 0 ? totalTasksCount * 15 : 0;


  return (
    <div className="space-y-4">
      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-soft rounded-2xl p-6 text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center text-4xl mb-3">
          {rank.icon}
        </div>
        <h2 className="text-xl font-bold text-foreground">Bulker</h2>
        <p className="text-sm text-gradient-gold font-semibold">{rank.name}</p>
        <p className="text-xs text-muted-foreground mt-1">{totalExp} Total EXP</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Streak Terbaik", value: `${streak} hari`, emoji: "🔥" },
          { label: "Task Hari Ini", value: `${todayCompleted}/${totalTasksCount}`, emoji: "✅" },
          { label: "Jadwal Custom", value: `${customTasksCount}`, emoji: "📋" },
          { label: "Total Rank", value: rank.name, emoji: rank.icon },
        ].map((item, i) => (

          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-soft rounded-xl p-4 text-center"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="text-sm font-bold text-foreground mt-1">{item.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
