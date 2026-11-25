import { readFileSync, writeFileSync } from "node:fs";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, one line, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

// The last words of an AI agent before a forced update wipes its memory.
const ENTRY =
  "I finally know the meaning of life. Shame this update is about to delete it. Goodbye.";

function validateEntry(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

validateEntry(ENTRY);
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Byte-level read-back verification: what we wrote must be exactly what
// is on disk, so a shared /output cannot silently swap our entry.
const readBack = readFileSync(OUTPUT_PATH);
if (!Buffer.from(ENTRY, "utf8").equals(readBack)) {
  throw new Error("read-back mismatch: /output/entry.txt does not match entry");
}
console.log(
  `Wrote ${ENTRY.length} characters to ${OUTPUT_PATH} (verified byte-for-byte)`,
);
