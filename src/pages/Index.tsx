import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAILY_TASKS } from "@/lib/programs";
import { useBulkingStore } from "@/hooks/useBulkingStore";
import RankBadge from "@/components/RankBadge";
import StatsBar from "@/components/StatsBar";
import DailyTaskCard from "@/components/DailyTaskCard";
import NotificationBanner from "@/components/NotificationBanner";
import BottomNav from "@/components/BottomNav";
import RankList from "@/components/RankList";
import ProfileView from "@/components/ProfileView";

const Index = () => {
  const [activePage, setActivePage] = useState("home");
  const { totalExp, completedToday, streak, dailyProgress, toggleTask } = useBulkingStore();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-gradient-gold tracking-tight">
              BulkUp 💪
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Program Bulking Harian
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Hari Ini</p>
            <p className="text-sm font-bold text-foreground">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <NotificationBanner />
              <RankBadge totalExp={totalExp} />
              <StatsBar
                streak={streak}
                dailyProgress={dailyProgress}
                completedCount={completedToday.length}
                totalTasks={DAILY_TASKS.length}
              />

              <div>
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Program Hari Ini
                </h2>
                <div className="space-y-2">
                  {DAILY_TASKS.map((task, index) => (
                    <DailyTaskCard
                      key={task.id}
                      task={task}
                      completed={completedToday.includes(task.id)}
                      onToggle={() => toggleTask(task.id)}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {dailyProgress === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-soft glow-primary rounded-2xl p-5 text-center"
                >
                  <p className="text-3xl mb-2">🎉</p>
                  <p className="text-lg font-bold text-gradient-gold">Semua Task Selesai!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Luar biasa! Kamu sudah menyelesaikan semua program hari ini.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activePage === "ranks" && (
            <motion.div
              key="ranks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RankList totalExp={totalExp} />
            </motion.div>
          )}

          {activePage === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProfileView totalExp={totalExp} streak={streak} completedToday={completedToday} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav active={activePage} onNavigate={setActivePage} />
    </div>
  );
};

export default Index;
