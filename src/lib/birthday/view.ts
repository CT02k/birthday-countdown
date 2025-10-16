import redis from "../redis";
import { BirthdayData } from "./types";

export async function viewBirthday(id: string): Promise<BirthdayData | false> {
  const birthday = await redis.get(`birthday:${id}`);

  if (!birthday) return false;

  return JSON.parse(birthday);
}
