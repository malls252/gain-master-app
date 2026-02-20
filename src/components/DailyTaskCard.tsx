import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import type { Task } from "@/lib/programs";

interface DailyTaskCardProps {
  task: Task;
  completed: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  index: number;
}


const DailyTaskCard = ({ task, completed, onToggle, onDelete, index }: DailyTaskCardProps) => {

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 text-left ${
        completed
          ? "card-soft glow-success opacity-80"
          : "card-soft hover:border-primary/30"
      }`}
    >
      {/* Checkbox */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
          completed
            ? "bg-success"
            : "border-2 border-muted-foreground/30"
        }`}
      >
        {completed && <Check className="w-4 h-4 text-background" strokeWidth={3} />}
      </div>

      {/* Icon */}
      <span className="text-2xl flex-shrink-0">{task.icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-sm ${
            completed ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{task.description}</p>
      </div>

      {/* EXP */}
      <div
        className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-md ${
          completed
            ? "bg-success/20 text-success"
            : "bg-primary/10 text-primary"
        }`}
      >
        +{task.expReward} XP
      </div>

      {/* Delete button for custom tasks */}
      {task.isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-shrink-0 p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </motion.button>
  );
};


export default DailyTaskCard;
