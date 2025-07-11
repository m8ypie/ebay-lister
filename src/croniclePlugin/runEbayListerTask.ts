#!/usr/bin/env -S deno run --check -A --env-file
import "jsr:@std/dotenv/load";
import { readAll } from "@std/io/read-all";
import { run } from "../main.ts";
type CronicleInput = {
  id: string;
  hostname: string;
  command: string;
  event: string;
  now: number;
  log_file: string;
  params: {
    myparam1: string;
    myparam2: string;
  };
};

type CronicleOutput = {
  complete: number;
  code: number;
};

try {
  const stdin = new TextDecoder().decode(await readAll(Deno.stdin));

  console.log("Cronicle input:", stdin);
  await run();
  const encoder = new TextEncoder();
  const data = encoder.encode(`{ "complete": 1, "code": 0 }\n`);
  await Deno.stdout.write(data); // 11
} catch (err) {
  console.error("Error during listing process:", err);

  const encoder = new TextEncoder();
  const data = encoder.encode(`{ "complete": 0, "code": 1 }\n`);
  await Deno.stdout.write(data); // 11
} finally {
  Deno.exit(0);
}
