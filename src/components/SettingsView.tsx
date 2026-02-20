import { motion } from "framer-motion";
import { Plus, Trash2, Calendar, Flame, Utensils, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_LABELS, CATEGORY_ICONS, type Task, type CustomFood, type MealPlan, type FoodItem } from "@/lib/programs";
import { useState } from "react";

interface SettingsViewProps {
  customTasks: Task[];
  customFoods: CustomFood[];
  mealPlans: MealPlan[];
  onAddTask: (title: string, description: string, category: Task["category"], expReward: number, icon?: string) => void;
  onRemoveTask: (taskId: string) => void;
  onAddFood: (name: string, description: string, icon?: string, calories?: number, protein?: number, carbs?: number, fat?: number, portion?: string, timing?: string) => void;
  onRemoveFood: (foodId: string) => void;
  onAddMealPlan: (name: string, foods: FoodItem[]) => void;
  onRemoveMealPlan: (planId: string) => void;
}

export default function SettingsView({
  customTasks,
  customFoods,
  mealPlans,
  onAddTask,
  onRemoveTask,
  onAddFood,
  onRemoveFood,
  onAddMealPlan,
  onRemoveMealPlan,
}: SettingsViewProps) {
  // Meal Plan Form State
  const [planName, setPlanName] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [currentFoodName, setCurrentFoodName] = useState("");
  const [currentFoodCalories, setCurrentFoodCalories] = useState("");
  const [currentFoodPortion, setCurrentFoodPortion] = useState("");



  // Add food item to current list
  const handleAddFoodItem = () => {
    if (!currentFoodName.trim() || !currentFoodCalories.trim() || !currentFoodPortion.trim()) return;

    const newItem: FoodItem = {
      id: `temp-${Date.now()}`,
      name: currentFoodName,
      calories: parseInt(currentFoodCalories),
      portion: currentFoodPortion,
    };

    setFoodItems([...foodItems, newItem]);
    setCurrentFoodName("");
    setCurrentFoodCalories("");
    setCurrentFoodPortion("");
  };

  // Remove food item from current list
  const handleRemoveFoodItem = (id: string) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  // Save meal plan
  const handleSaveMealPlan = () => {
    if (!planName.trim() || foodItems.length === 0) return;

    onAddMealPlan(planName, foodItems);

    // Reset form
    setPlanName("");
    setFoodItems([]);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-soft rounded-2xl p-5 text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl mb-3">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Kelola Jadwal</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Atur jadwal makan dan aktivitas harian
        </p>
      </motion.div>

      {/* Meal Plan Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 p-4 bg-card border rounded-2xl"
      >
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Utensils className="w-4 h-4 text-primary" />
          Tambah Jadwal Makan
        </h3>

        {/* Step 1: Plan Name */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">1. Nama Jadwal Makan</Label>
          <Input
            placeholder="Contoh: Makan Siang, Sarapan Protein, dll"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="h-10 text-sm"
          />
        </div>

        {/* Step 2: Food Items */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">2. Daftar Makanan</Label>

          {/* Add Food Item Form */}
          <div className="p-3 bg-muted/50 rounded-xl space-y-2">
            <Input
              placeholder="Nama makanan (contoh: Nasi putih)"
              value={currentFoodName}
              onChange={(e) => setCurrentFoodName(e.target.value)}
              className="h-9 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Kalori"
                value={currentFoodCalories}
                onChange={(e) => setCurrentFoodCalories(e.target.value)}
                className="h-9 text-sm"
              />
              <Input
                placeholder="Porsi (contoh: 200g, 1 piring)"
                value={currentFoodPortion}
                onChange={(e) => setCurrentFoodPortion(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button
              onClick={handleAddFoodItem}
              disabled={!currentFoodName.trim() || !currentFoodCalories.trim() || !currentFoodPortion.trim()}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Tambah Makanan
            </Button>
          </div>

          {/* Food Items List */}
          {foodItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {foodItems.length} makanan ditambahkan:
              </p>
              <div className="space-y-1">
                {foodItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.calories} kcal • {item.portion}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFoodItem(item.id)}
                      className="p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg">
                <span className="text-xs font-medium">Total Kalori:</span>
                <span className="text-sm font-bold text-primary">
                  {foodItems.reduce((sum, item) => sum + item.calories, 0)} kcal
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveMealPlan}
          disabled={!planName.trim() || foodItems.length === 0}
          className="w-full h-10 text-sm font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Simpan Jadwal Makan
        </Button>
      </motion.div>



      {/* Saved Meal Plans List */}
      {mealPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-bold px-1 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Jadwal Makan Tersimpan ({mealPlans.length})
          </h3>
          <div className="space-y-2">
            {mealPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 bg-card border rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">{plan.name}</p>
                  <button
                    onClick={() => onRemoveMealPlan(plan.id)}
                    className="p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 mb-2">
                  {plan.foods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">• {food.name}</span>
                      <span className="text-muted-foreground">{food.calories} kcal ({food.portion})</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <span className="text-xs font-medium text-orange-700 flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Total
                  </span>
                  <span className="text-sm font-bold text-orange-700">{plan.totalCalories} kcal</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}



      {mealPlans.length === 0 && customTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-muted-foreground bg-muted/30 rounded-2xl"
        >
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">Belum ada jadwal</p>
          <p className="text-xs mt-1 opacity-70">Tambahkan jadwal baru di atas</p>
        </motion.div>
      )}
    </div>
  );
}
