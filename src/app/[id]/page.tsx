"use client";
import { BirthdayData } from "@/lib/birthday/types";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function BirthdayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [birthdayData, setBirthdayData] = useState<BirthdayData>();
  const [countdown, setCountdown] = useState("00:00:00:00");

  const router = useRouter();

  useEffect(() => {
    async function handleRequest() {
      const res = await fetch(`/api/birthday/view/${id}`);
      if (!res.ok) return router.push("/");

      const json = await res.json();
      const data = json.data;

      console.debug("[BirthdayData fetched]", data);
      setBirthdayData(data);
    }

    handleRequest();
  }, [id, router]);

  useEffect(() => {
    if (!birthdayData) return;

    const [year, month, day] = birthdayData.date
      .toString()
      .split("T")[0]
      .split("-")
      .map(Number);

    const birth = new Date(year, month - 1, day);
    const now = new Date();

    const nextBirthday = new Date(
      now.getFullYear(),
      birth.getMonth(),
      birth.getDate(),
    );

    if (nextBirthday.getTime() < now.getTime()) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    console.debug("[Setup countdown - FIXED]", {
      now: now.toString(),
      birth: birth.toString(),
      nextBirthday: nextBirthday.toString(),
    });

    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextBirthday.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("🎉 Happy Birthday!");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
      const minutes = Math.floor((totalSeconds / 60) % 60);
      const seconds = totalSeconds % 60;

      const formattedDays = String(days).padStart(2, "0");
      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      console.debug("[Tick]", { days, hours, minutes, seconds });
      setCountdown(
        `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [birthdayData]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {birthdayData ? (
        new Date(birthdayData.date) >= new Date() ? (
          <>
            <h1 className="text-6xl font-bold">{countdown}</h1>
            <h2 className="text-2xl">
              Remaining for {birthdayData.name}
              {"`"}s birthday
            </h2>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Happy Birthday{" "}
              <span className="underline">{birthdayData.name}</span> 🎉
            </h1>
            <h2 className="text-2xl">
              {new Date(birthdayData.date).getMonth() +
                "/" +
                new Date(birthdayData.date).getDate() +
                "/" +
                new Date(birthdayData.date).getFullYear()}
            </h2>
          </>
        )
      ) : null}
    </div>
  );
}
