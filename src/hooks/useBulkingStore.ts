import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { DAILY_TASKS, createCustomTask, createCustomFood, createMealPlan, createFoodItem, type Task, type CustomFood, type CustomTask, type MealPlan, type FoodItem } from "@/lib/programs";
import { toast } from "sonner";

interface BulkingState {
  totalExp: number;
  completedToday: string[];
  lastDate: string;
  streak: number;
  customTasks: CustomTask[];
  customFoods: CustomFood[];
  mealPlans: MealPlan[];
  completedDates: Record<string, string[]>;
  dayCompleted: Record<string, boolean>;
}

export function useBulkingStore() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);

  const getToday = () => new Date().toISOString().split("T")[0];
  const today = getToday();

  // Local state (for optimistic UI)
  const [state, setState] = useState<BulkingState>({
    totalExp: 0,
    completedToday: [],
    lastDate: today,
    streak: 0,
    customTasks: [],
    customFoods: [],
    mealPlans: [],
    completedDates: {},
    dayCompleted: {},
  });

  // Fetch data from Supabase
  useEffect(() => {
    if (!session?.user) {
      console.log("No user session, skipping data fetch");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = session.user.id;
        console.log("Fetching data for user:", userId);

        // 1. Profiles
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();

        // 2. Meal Plans
        const { data: meals } = await supabase.from("meal_plans").select("*").eq("user_id", userId);

        // 3. Custom Tasks
        const { data: tasks } = await supabase.from("custom_tasks").select("*").eq("user_id", userId);

        // 4. Custom Foods
        const { data: foods } = await supabase.from("custom_foods").select("*").eq("user_id", userId);

        // 5. Daily Progress (Today)
        const { data: progress } = await supabase.from("daily_progress").select("*").eq("user_id", userId).eq("date", today).single();

        setState(prev => ({
          ...prev,
          totalExp: profile?.total_exp || 0,
          streak: profile?.streak || 0,
          mealPlans: meals?.map((m: any) => ({
            ...m,
            foods: typeof m.foods === 'string' ? JSON.parse(m.foods) : m.foods
          })) || [],
          customTasks: tasks?.map((t: any) => ({
            ...t,
            expReward: t.exp_reward,
            isCustom: true
          })) || [],
          customFoods: foods || [],
          completedToday: progress?.completed_item_ids || [],
          dayCompleted: progress?.is_day_completed ? { [today]: true } : {},
          lastDate: today
        }));

      } catch (error) {
        console.error("Error fetching data:", error);
        // Don't get stuck in loading state on error
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, today]);

  // Derived state
  const allTasks: Task[] = [...DAILY_TASKS, ...state.customTasks];

  // ACTIONS

  const toggleTask = async (taskId: string) => {
    if (!session?.user) return;
    const userId = session.user.id;

    // Check if it's a task or meal
    const task = allTasks.find((t) => t.id === taskId);
    const meal = !task ? state.mealPlans.find(m => m.id === taskId) : null;
    if (!task && !meal) return;

    const isCompleted = state.completedToday.includes(taskId);
    let newCompletedToday, newTotalExp;

    if (isCompleted) {
      // Uncheck
      newCompletedToday = state.completedToday.filter((id) => id !== taskId);
      const reward = task ? task.expReward : (meal?.expReward || 15);
      newTotalExp = Math.max(0, state.totalExp - reward);
    } else {
      // Check
      newCompletedToday = [...state.completedToday, taskId];
      const reward = task ? task.expReward : (meal?.expReward || 15);
      newTotalExp = state.totalExp + reward;
    }

    // Optimistic Update
    setState(prev => ({
      ...prev,
      completedToday: newCompletedToday,
      totalExp: newTotalExp
    }));

    // DB Update
    // 1. Update Profile (EXP)
    await supabase.from("profiles").update({ total_exp: newTotalExp }).eq("id", userId);

    // 2. Update Daily Progress
    const { data: existingProgress } = await supabase.from("daily_progress").select("id").eq("user_id", userId).eq("date", today).single();

    if (existingProgress) {
      await supabase.from("daily_progress").update({ completed_item_ids: newCompletedToday }).eq("id", existingProgress.id);
    } else {
      await supabase.from("daily_progress").insert({
        user_id: userId,
        date: today,
        completed_item_ids: newCompletedToday,
        is_day_completed: false
      });
    }
  };

  const completeDay = async () => {
    if (!session?.user || state.dayCompleted[today]) return;
    const userId = session.user.id;

    const newStreak = state.streak + 1;

    // Optimistic Update
    setState(prev => ({
      ...prev,
      streak: newStreak,
      dayCompleted: { ...prev.dayCompleted, [today]: true }
    }));

    // DB Update
    // 1. Profile (Streak)
    await supabase.from("profiles").update({ streak: newStreak }).eq("id", userId);

    // 2. Daily Progress (is_day_completed)
    const { data: existingProgress } = await supabase.from("daily_progress").select("id").eq("user_id", userId).eq("date", today).single();

    if (existingProgress) {
      await supabase.from("daily_progress").update({ is_day_completed: true }).eq("id", existingProgress.id);
    } else {
      await supabase.from("daily_progress").insert({
        user_id: userId,
        date: today,
        completed_item_ids: state.completedToday,
        is_day_completed: true
      });
    }
    toast.success("Hari selesai! Streak bertambah 🔥");
  };

  const addTask = async (title: string, description: string, category: Task["category"], expReward: number = 10, icon?: string) => {
    if (!session?.user) return null;
    const userId = session.user.id;
    const newTask = createCustomTask(title, description, category, expReward, icon);

    // Optimistic
    setState(prev => ({ ...prev, customTasks: [...prev.customTasks, newTask] }));

    // DB
    await supabase.from("custom_tasks").insert({
      title, description, category, exp_reward: expReward, icon, user_id: userId
    });
    return newTask;
  };

  const removeTask = async (taskId: string) => {
    if (!session?.user) return;

    // Optimistic
    setState(prev => ({ ...prev, customTasks: prev.customTasks.filter(t => t.id !== taskId) }));

    // DB
    await supabase.from("custom_tasks").delete().eq("id", taskId);
  };

  const addMealPlan = async (name: string, foods: FoodItem[]) => {
    if (!session?.user) return null;
    const userId = session.user.id;
    const newPlan = createMealPlan(name, foods);

    // Optimistic
    setState(prev => ({ ...prev, mealPlans: [...prev.mealPlans, newPlan] }));

    // DB
    const { data, error } = await supabase.from("meal_plans").insert({
      name, foods: JSON.stringify(foods), total_calories: newPlan.totalCalories, exp_reward: newPlan.expReward, user_id: userId
    }).select().single();

    if (data) {
      // Replace optimistic plan with real one to get UUID
      setState(prev => ({
        ...prev,
        mealPlans: prev.mealPlans.map(p => p.id === newPlan.id ? { ...p, id: data.id } : p)
      }));
    }
    return newPlan;
  };

  const removeMealPlan = async (planId: string) => {
    if (!session?.user) return;
    setState(prev => ({ ...prev, mealPlans: prev.mealPlans.filter(p => p.id !== planId) }));
    await supabase.from("meal_plans").delete().eq("id", planId);
  };

  const addCustomFood = async (name: string, description: string, icon?: string, calories?: number, protein?: number, carbs?: number, fat?: number, portion?: string, timing?: string) => {
    if (!session?.user) return;
    const newFood = createCustomFood(name, description, icon, calories, protein, carbs, fat, portion, timing);
    setState(prev => ({ ...prev, customFoods: [...prev.customFoods, newFood] }));
    await supabase.from("custom_foods").insert({
      user_id: session.user.id, name, description, calories, protein, carbs, fat, portion, timing
    });
    return newFood;
  };

  const removeCustomFood = async (foodId: string) => {
    setState(prev => ({ ...prev, customFoods: prev.customFoods.filter(f => f.id !== foodId) }));
    await supabase.from("custom_foods").delete().eq("id", foodId);
  };

  const addFoodToPlan = async (planId: string, food: FoodItem) => {
    const plan = state.mealPlans.find(p => p.id === planId);
    if (!plan || !session?.user) return;

    const newFood = createFoodItem(food.name, food.calories, food.portion);
    const updatedFoods = [...plan.foods, newFood];
    const newTotal = updatedFoods.reduce((sum, f) => sum + f.calories, 0);

    setState(prev => ({
      ...prev,
      mealPlans: prev.mealPlans.map(p => p.id === planId ? { ...p, foods: updatedFoods, totalCalories: newTotal } : p)
    }));

    await supabase.from("meal_plans").update({
      foods: JSON.stringify(updatedFoods),
      total_calories: newTotal
    }).eq("id", planId);
  };

  const removeFoodFromPlan = async (planId: string, foodId: string) => {
    const plan = state.mealPlans.find(p => p.id === planId);
    if (!plan || !session?.user) return;

    const updatedFoods = plan.foods.filter(f => f.id !== foodId);
    const newTotal = updatedFoods.reduce((sum, f) => sum + f.calories, 0);

    setState(prev => ({
      ...prev,
      mealPlans: prev.mealPlans.map(p => p.id === planId ? { ...p, foods: updatedFoods, totalCalories: newTotal } : p)
    }));

    await supabase.from("meal_plans").update({
      foods: JSON.stringify(updatedFoods),
      total_calories: newTotal
    }).eq("id", planId);
  };

  const getCompletedForDate = (date: string) => {
    if (date === today) return state.completedToday;
    return state.completedDates[date] || [];
  };

  const dailyProgress =
    allTasks.length > 0
      ? (state.completedToday.length / allTasks.length) * 100
      : 0;

  return {
    ...state,
    allTasks,
    toggleTask,
    addTask,
    removeTask,
    addCustomFood,
    removeCustomFood,
    addMealPlan,
    removeMealPlan,
    addFoodToPlan,
    removeFoodFromPlan,
    getCompletedForDate,
    dailyProgress,
    isNewDay: false,
    completeDay,
    isDayCompleted: !!state.dayCompleted?.[today],
    loading
  };
}
