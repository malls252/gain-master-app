export interface Task {
  id: string;
  title: string;
  description: string;
  expReward: number;
  category: "meal" | "workout" | "rest" | "supplement";
  icon: string;
  isCustom?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  portion: string;
}

export interface MealPlan {
  id: string;
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  expReward: number;
}

// ... (skipping unchanged parts if possible, but replace_file_content needs contiguous block? I'll do separate blocks if needed or just one big block if they are close. They are somewhat close but interface is line 18 and func is line 99. Better to use multi_replace or just 2 calls. I'll use multi_replace_file_content for this file.)

export interface CustomFood {
  id: string;
  name: string;
  description: string;
  icon: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  portion?: string;
  timing?: string;
}



export interface CustomTask extends Task {
  isCustom: true;
  createdAt: string;
}


export const DAILY_TASKS: Task[] = [
  // Default tasks removed - now only user custom tasks will be displayed
];


export const CATEGORY_LABELS: Record<Task["category"], string> = {
  meal: "Nutrisi",
  workout: "Latihan",
  rest: "Istirahat",
  supplement: "Suplemen",
};

export const CATEGORY_ICONS: Record<Task["category"], string> = {
  meal: "🍽️",
  workout: "🏋️",
  rest: "😴",
  supplement: "💊",
};

// Generate unique ID for custom tasks
export const generateTaskId = () => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create a new custom task
export const createCustomTask = (
  title: string,
  description: string,
  category: Task["category"],
  expReward: number = 10,
  icon?: string
): CustomTask => ({
  id: generateTaskId(),
  title,
  description,
  category,
  expReward,
  icon: icon || CATEGORY_ICONS[category],
  isCustom: true,
  createdAt: new Date().toISOString(),
});

// Create a food item
export const createFoodItem = (
  name: string,
  calories: number,
  portion: string
): FoodItem => ({
  id: `fooditem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  calories,
  portion,
});

// Create a meal plan
export const createMealPlan = (
  name: string,
  foods: FoodItem[],
  expReward: number = 15
): MealPlan => ({
  id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  foods,
  totalCalories: foods.reduce((sum, f) => sum + f.calories, 0),
  expReward,
});

// Create a new custom food with detailed nutrition
export const createCustomFood = (
  name: string,
  description: string,
  icon: string = "🍽️",
  calories?: number,
  protein?: number,
  carbs?: number,
  fat?: number,
  portion?: string,
  timing?: string
): CustomFood => ({
  id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  description,
  icon,
  calories,
  protein,
  carbs,
  fat,
  portion,
  timing,
});

// Calculate total nutrition for multiple foods
export const calculateTotalNutrition = (foods: CustomFood[]) => {
  return foods.reduce((total, food) => ({
    calories: total.calories + (food.calories || 0),
    protein: total.protein + (food.protein || 0),
    carbs: total.carbs + (food.carbs || 0),
    fat: total.fat + (food.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
};

// Format nutrition display
export const formatNutrition = (food: CustomFood) => {
  const parts: string[] = [];
  if (food.calories) parts.push(`${food.calories} kcal`);
  if (food.protein) parts.push(`${food.protein}g protein`);
  if (food.carbs) parts.push(`${food.carbs}g karbo`);
  if (food.fat) parts.push(`${food.fat}g lemak`);
  if (food.portion) parts.push(`Porsi: ${food.portion}`);
  return parts.join(" • ");
};



// Default food templates for meal tasks
export const DEFAULT_FOODS: CustomFood[] = [
  { id: "food-1", name: "Telur + Oatmeal", description: "4 telur + oatmeal + pisang", icon: "🍳", calories: 450, protein: 25 },
  { id: "food-2", name: "Protein Shake", description: "Whey protein + almond 30g", icon: "🥤", calories: 250, protein: 30 },
  { id: "food-3", name: "Dada Ayam + Nasi", description: "Dada ayam 200g + nasi + sayur", icon: "🍗", calories: 600, protein: 45 },
  { id: "food-4", name: "Roti Gandum + Selai", description: "Roti gandum + selai kacang + susu", icon: "🥜", calories: 400, protein: 15 },
  { id: "food-5", name: "Ikan Salmon", description: "Salmon 150g + brokoli + nasi", icon: "🐟", calories: 550, protein: 35 },
];
