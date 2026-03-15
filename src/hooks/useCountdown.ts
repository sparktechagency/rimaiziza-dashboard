// hooks/useCountdown.ts
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

const OTP_DURATION_SECONDS = 180; // ← only define it once here

interface UseCountdownReturn {
  timeLeft: number;
  finished: boolean;
  start: () => void;
  reset: () => void;
}

export const useCountdown = ({
  storageKey = "otpExpiry",
  onFinish,
}: {
  storageKey?: string;
  onFinish?: () => void;
}): UseCountdownReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Load or initialize on mount
  useEffect(() => {
    const storedEnd = Cookies.get(storageKey);

    if (storedEnd) {
      const end = parseInt(storedEnd, 10);
      const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000));

      if (remaining > 0) {
        endTimeRef.current = end;
        setTimeLeft(remaining);
        setFinished(false);
      } else {
        Cookies.remove(storageKey);
        setFinished(true);
        setTimeLeft(0);
      }
    }
    // If no cookie → do NOT auto-start — wait for explicit .start()
  }, [storageKey]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0 || !endTimeRef.current) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      if (!endTimeRef.current) return;

      const remaining = Math.floor((endTimeRef.current - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        setTimeLeft(0);
        setFinished(true);
        Cookies.remove(storageKey);
        onFinish?.();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [storageKey, onFinish, timeLeft]); // timeLeft in deps helps when we jump-start

  const start = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const end = Date.now() + OTP_DURATION_SECONDS * 1000;
    endTimeRef.current = end;
    Cookies.set(storageKey, end.toString(), { expires: 1 / 24 }); // ~1 hour cookie is enough

    setTimeLeft(OTP_DURATION_SECONDS);
    setFinished(false);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    endTimeRef.current = null;
    Cookies.remove(storageKey);
    setTimeLeft(0);
    setFinished(false);
  };

  return { timeLeft, finished, start, reset };
};