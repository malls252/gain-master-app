import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils } from "lucide-react";
import { useBulkingStore } from "@/hooks/useBulkingStore";
import RankBadge from "@/components/RankBadge";
import StatsBar from "@/components/StatsBar";
import NotificationBanner from "@/components/NotificationBanner";
import BottomNav from "@/components/BottomNav";
import RankList from "@/components/RankList";
import ProfileView from "@/components/ProfileView";
import SettingsView from "@/components/SettingsView";

const Index = () => {
  const [activePage, setActivePage] = useState<"home" | "ranks" | "profile" | "settings">("home");

  const {
    totalExp,
    completedToday,
    streak,
    dailyProgress,
    toggleTask,
    allTasks,
    customTasks,
    customFoods,
    mealPlans,
    addTask,
    removeTask,
    addCustomFood,
    removeCustomFood,
    addMealPlan,
    removeMealPlan,
    isNewDay,
    completeDay,
    isDayCompleted
  } = useBulkingStore();

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
                totalTasks={allTasks.length}
              />

              {/* New Day Notification */}
              {isNewDay && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-soft bg-primary/5 border-primary/20 rounded-xl p-4 text-center"
                >
                  <p className="text-sm font-semibold text-primary">🌅 Hari Baru!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Jadwal telah direset. Semangat untuk hari ini!
                  </p>
                </motion.div>
              )}

              {/* Meal Plans Section */}
              {mealPlans.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Jadwal Makan
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {mealPlans.length} jadwal
                    </span>
                  </div>

                  <div className="space-y-2">
                    {mealPlans.map((plan, index) => {
                      const isCompleted = completedToday.includes(plan.id);
                      return (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`card-soft p-4 rounded-xl transition-all duration-300 ${isCompleted ? "opacity-60 grayscale-[0.5]" : ""
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleTask(plan.id)}
                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isCompleted
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground/50 hover:border-primary"
                                  }`}
                              >
                                {isCompleted && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                              </button>
                              <p className={`text-sm font-semibold text-foreground ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                                {plan.name}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full flex items-center gap-1">
                              {plan.totalCalories} kcal
                              <span className="text-orange-400">•</span>
                              <span className="text-orange-700">+{plan.expReward || 50} EXP</span>
                            </span>
                          </div>

                          {/* Food Items List */}
                          <div className="space-y-1 pl-8">
                            {plan.foods.map((food, foodIndex) => (
                              <div key={food.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">
                                    {foodIndex + 1}
                                  </span>
                                  {food.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {food.calories} kcal • {food.portion}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-6 pb-8">
                <button
                  onClick={completeDay}
                  disabled={isDayCompleted}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${isDayCompleted
                    ? "bg-green-600/20 text-green-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-[0.98]"
                    }`}
                >
                  {isDayCompleted ? (
                    <span className="flex items-center justify-center gap-2">
                      🎉 Target Hari Ini Selesai!
                    </span>
                  ) : (
                    "Selesai Hari Ini 🎯"
                  )}
                </button>
                {!isDayCompleted && (
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Klik tombol ini jika semua target makan sudah tercapai untuk menambah streak!
                  </p>
                )}
              </div>


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
              <ProfileView
                totalExp={totalExp}
                streak={streak}
                completedToday={completedToday}
                customTasksCount={customTasks.length}
                totalTasksCount={allTasks.length}
              />
            </motion.div>
          )}

          {activePage === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SettingsView
                customTasks={customTasks}
                customFoods={customFoods}
                mealPlans={mealPlans}
                onAddTask={addTask}
                onRemoveTask={removeTask}
                onAddFood={addCustomFood}
                onRemoveFood={removeCustomFood}
                onAddMealPlan={addMealPlan}
                onRemoveMealPlan={removeMealPlan}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav active={activePage} onNavigate={setActivePage} />
    </div>
  );
};

export default Index;
