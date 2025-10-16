"use client";
import { BirthdayData } from "@/lib/birthday/types";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Home() {
  const router = useRouter();

  async function handleSubmit(form: FormEvent) {
    form.preventDefault();

    const nameInput = document.getElementById("name") as HTMLInputElement;
    const dateInput = document.getElementById("date") as HTMLInputElement;

    const name = nameInput.value;
    const date = new Date(dateInput.value);

    const res = await fetch("/api/birthday/create", {
      method: "POST",
      body: JSON.stringify({ name, date }),
    });

    const json = await res.json();
    const data = json.data as BirthdayData;

    router.push(`/${data.id}`);
  }
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-6xl font-bold">Birthday Countdown</h1>
      <p className="text-xl mt-3">
        A simple birthday countdown application built with Next.js, just to test
        Redis.
      </p>
      <form className="flex flex-col gap-2 mt-10" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          id="name"
          className="bg-zinc-900 w-96 py-2 px-3 rounded-lg border border-zinc-800 outline-none"
          required
        />
        <input
          type="date"
          id="date"
          className="bg-zinc-900 w-96 py-2 px-3 rounded-lg border border-zinc-800 outline-none"
          required
        />
        <input
          type="submit"
          value="Submit"
          className="bg-white text-black rounded-lg py-2 mt-3 transition hover:bg-zinc-200 cursor-pointer"
        />
      </form>
    </div>
  );
}
