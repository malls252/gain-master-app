export interface Task {
  id: string;
  title: string;
  description: string;
  expReward: number;
  category: "meal" | "workout" | "rest" | "supplement";
  icon: string;
}

export const DAILY_TASKS: Task[] = [
  {
    id: "breakfast",
    title: "Sarapan Tinggi Protein",
    description: "Makan 4 telur + oatmeal + pisang",
    expReward: 15,
    category: "meal",
    icon: "🍳",
  },
  {
    id: "morning-snack",
    title: "Snack Pagi",
    description: "Protein shake + kacang almond 30g",
    expReward: 10,
    category: "meal",
    icon: "🥤",
  },
  {
    id: "workout",
    title: "Latihan Beban",
    description: "Push/Pull/Legs split - 60 menit",
    expReward: 25,
    category: "workout",
    icon: "🏋️",
  },
  {
    id: "lunch",
    title: "Makan Siang",
    description: "Nasi + dada ayam 200g + sayur",
    expReward: 15,
    category: "meal",
    icon: "🍗",
  },
  {
    id: "afternoon-snack",
    title: "Snack Sore",
    description: "Roti gandum + selai kacang + susu",
    expReward: 10,
    category: "meal",
    icon: "🥜",
  },
  {
    id: "dinner",
    title: "Makan Malam",
    description: "Nasi + ikan salmon + brokoli",
    expReward: 15,
    category: "meal",
    icon: "🐟",
  },
  {
    id: "supplement",
    title: "Suplemen Harian",
    description: "Creatine 5g + Multivitamin",
    expReward: 10,
    category: "supplement",
    icon: "💊",
  },
  {
    id: "sleep",
    title: "Tidur 7-9 Jam",
    description: "Tidur sebelum jam 23:00",
    expReward: 20,
    category: "rest",
    icon: "😴",
  },
];

export const CATEGORY_LABELS: Record<Task["category"], string> = {
  meal: "Nutrisi",
  workout: "Latihan",
  rest: "Istirahat",
  supplement: "Suplemen",
};
