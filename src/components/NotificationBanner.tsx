import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

const NotificationBanner = () => {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
      if (Notification.permission === "default") {
        setShow(true);
      }
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        scheduleReminders();
      }
      setShow(false);
    }
  };

  const scheduleReminders = () => {
    // Schedule periodic reminders using service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SCHEDULE_REMINDERS",
      });
    }

    // Also show an immediate confirmation
    new Notification("BulkUp 💪", {
      body: "Notifikasi aktif! Kami akan mengingatkanmu untuk program bulking.",
      icon: "/pwa-192x192.png",
    });
  };

  if (!show || permission === "granted") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="card-soft rounded-xl p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Aktifkan Notifikasi</p>
          <p className="text-xs text-muted-foreground">Agar kami bisa mengingatkanmu</p>
        </div>
        <button
          onClick={requestPermission}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg"
        >
          Aktifkan
        </button>
        <button onClick={() => setShow(false)} className="text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBanner;
