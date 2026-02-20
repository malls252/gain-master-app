import { Dumbbell, Trophy, User, Settings } from "lucide-react";

interface BottomNavProps {
  active: "home" | "ranks" | "profile" | "settings";
  onNavigate: (page: "home" | "ranks" | "profile" | "settings") => void;
}


const BottomNav = ({ active, onNavigate }: BottomNavProps) => {
  const items: { id: "home" | "ranks" | "profile" | "settings"; icon: typeof Dumbbell; label: string }[] = [
    { id: "home", icon: Dumbbell, label: "Program" },
    { id: "ranks", icon: Trophy, label: "Rank" },
    { id: "settings", icon: Settings, label: "Kelola" },
    { id: "profile", icon: User, label: "Profil" },
  ];

  return (

    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border">
      <div className="max-w-lg mx-auto flex justify-around py-2 pb-safe">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}

            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
              active === item.id
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >

            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
