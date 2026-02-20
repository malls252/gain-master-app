import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_LABELS, CATEGORY_ICONS, type Task, type CustomFood } from "@/lib/programs";

interface TaskManagerProps {
  customTasks: Task[];
  customFoods: CustomFood[];
  onAddTask: (title: string, description: string, category: Task["category"], expReward: number, icon?: string) => void;
  onRemoveTask: (taskId: string) => void;
  onAddFood: (name: string, description: string, icon?: string, calories?: number, protein?: number) => void;
  onRemoveFood: (foodId: string) => void;
}

type ScheduleItem = {
  id: string;
  type: "task" | "food";
  title: string;
  description: string;
  icon: string;
  category?: Task["category"];
  expReward?: number;
  calories?: number;
  protein?: number;
  createdAt: string;
};

export default function TaskManager({
  customTasks,
  customFoods,
  onAddTask,
  onRemoveTask,
  onAddFood,
  onRemoveFood,
}: TaskManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Task["category"]>("meal");
  const [icon, setIcon] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [isFood, setIsFood] = useState(false);

  const getExpReward = (cat: Task["category"]) => {
    switch (cat) {
      case "workout": return 25;
      case "rest": return 20;
      case "meal": return 15;
      case "supplement": return 10;
      default: return 15;
    }
  };

  const expReward = getExpReward(category);

  const scheduleItems: ScheduleItem[] = [
    ...customTasks.map(task => ({
      id: task.id,
      type: "task" as const,
      title: task.title,
      description: task.description,
      icon: task.icon,
      category: task.category,
      expReward: task.expReward,
      createdAt: (task as any).createdAt || new Date().toISOString(),
    })),
    ...customFoods.map(food => ({
      id: food.id,
      type: "food" as const,
      title: food.name,
      description: food.description,
      icon: food.icon,
      calories: food.calories,
      protein: food.protein,
      createdAt: new Date().toISOString(),
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAdd = () => {
    if (!title.trim() || !description.trim()) return;

    if (isFood || category === "meal") {
      onAddFood(title, description, icon || "🍽️", calories ? parseInt(calories) : undefined, protein ? parseInt(protein) : undefined);
    } else {
      onAddTask(title, description, category, expReward, icon || undefined);
    }

    setTitle("");
    setDescription("");
    setCategory("meal");
    setIcon("");
    setCalories("");
    setProtein("");
    setIsFood(false);
  };

  const handleRemove = (item: ScheduleItem) => {
    if (item.type === "task") {
      onRemoveTask(item.id);
    } else {
      onRemoveFood(item.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
          <Plus className="w-3 h-3" />
          Kelola Jadwal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Kelola Jadwal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
            <h3 className="text-sm font-semibold">Tambah Jadwal Baru</h3>
            
            <div className="space-y-2">
              <Label className="text-xs">Nama Jadwal</Label>
              <Input
                placeholder="Contoh: Makan Siang / Latihan Dada"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Deskripsi Detail</Label>
              <Textarea
                placeholder="Contoh: Nasi 200g + dada ayam 150g + brokoli"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[60px] text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Kategori</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v as Task["category"]); setIsFood(v === "meal"); }}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-sm">
                        {CATEGORY_ICONS[key as Task["category"]]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Icon (Emoji)</Label>
                <Input
                  placeholder={isFood ? "🍽️" : "🏋️"}
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="h-9 text-sm text-center"
                  maxLength={2}
                />
              </div>
            </div>

            {isFood && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Kalori</Label>
                  <Input type="number" placeholder="0" value={calories} onChange={(e) => setCalories(e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Protein (g)</Label>
                  <Input type="number" placeholder="0" value={protein} onChange={(e) => setProtein(e.target.value)} className="h-9 text-sm" />
                </div>
              </div>
            )}

            {!isFood && (
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-primary/10 rounded-lg">
                  <Label className="text-xs font-medium">EXP Reward</Label>
                  <span className="text-sm font-bold text-primary">{expReward} XP</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {category === "workout" && "Latihan beban = 25 XP"}
                  {category === "rest" && "Istirahat/Tidur = 20 XP"}
                  {category === "supplement" && "Suplemen = 10 XP"}
                </p>
              </div>
            )}

            <Button onClick={handleAdd} disabled={!title.trim() || !description.trim()} className="w-full h-9 text-sm font-semibold">
              <Plus className="w-4 h-4 mr-1" />
              Tambah ke Jadwal
            </Button>
          </div>

          {scheduleItems.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold px-1 flex items-center justify-between">
                <span>Jadwal Saya ({scheduleItems.length})</span>
                <span className="text-[10px] font-normal text-muted-foreground">
                  {customTasks.length} aktivitas • {customFoods.length} makanan
                </span>
              </h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {scheduleItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 p-3 bg-card border rounded-xl"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {item.category && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium">
                            {CATEGORY_LABELS[item.category]}
                          </span>
                        )}
                        {item.type === "food" && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">
                            Makanan
                          </span>
                        )}
                        {item.expReward && (
                          <span className="text-[10px] text-primary font-semibold">+{item.expReward} XP</span>
                        )}
                        {item.calories && <span className="text-[10px] text-muted-foreground">{item.calories} kcal</span>}
                        {item.protein && <span className="text-[10px] text-muted-foreground">{item.protein}g protein</span>}
                      </div>
                    </div>
                    <button onClick={() => handleRemove(item)} className="p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada jadwal</p>
              <p className="text-xs mt-1">Tambahkan jadwal baru di atas</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
