import redis from "../redis";
import { BirthdayCreateData, BirthdayData } from "./types";

export async function createBirthday(
  data: BirthdayCreateData,
): Promise<BirthdayData | false> {
  const code = crypto.randomUUID();

  const birthdayData: BirthdayData = {
    id: code,
    name: data.name,
    date: new Date(data.date),
  };

  const birthday = await redis.set(
    `birthday:${code}`,
    JSON.stringify(birthdayData),
  );

  if (!birthday) return false;

  return birthdayData;
}
