import { useLocalStorage } from "./useLocalStorage";
import { DAILY_TASKS } from "@/lib/programs";

interface BulkingState {
  totalExp: number;
  completedToday: string[];
  lastDate: string;
  streak: number;
}

const getToday = () => new Date().toISOString().split("T")[0];

export function useBulkingStore() {
  const [state, setState] = useLocalStorage<BulkingState>("bulking-state", {
    totalExp: 0,
    completedToday: [],
    lastDate: getToday(),
    streak: 0,
  });

  const today = getToday();

  // Reset daily tasks if new day
  const effectiveState: BulkingState =
    state.lastDate !== today
      ? { ...state, completedToday: [], lastDate: today }
      : state;

  const toggleTask = (taskId: string) => {
    const task = DAILY_TASKS.find((t) => t.id === taskId);
    if (!task) return;

    const isCompleted = effectiveState.completedToday.includes(taskId);

    if (isCompleted) {
      setState({
        ...effectiveState,
        totalExp: Math.max(0, effectiveState.totalExp - task.expReward),
        completedToday: effectiveState.completedToday.filter((id) => id !== taskId),
      });
    } else {
      const newCompleted = [...effectiveState.completedToday, taskId];
      const allDone = newCompleted.length === DAILY_TASKS.length;
      setState({
        ...effectiveState,
        totalExp: effectiveState.totalExp + task.expReward,
        completedToday: newCompleted,
        streak: allDone ? effectiveState.streak + 1 : effectiveState.streak,
        lastDate: today,
      });
    }
  };

  const dailyProgress =
    DAILY_TASKS.length > 0
      ? (effectiveState.completedToday.length / DAILY_TASKS.length) * 100
      : 0;

  return {
    ...effectiveState,
    toggleTask,
    dailyProgress,
  };
}
