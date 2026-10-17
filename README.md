# next-late-run

A sentence that lands after the budget is not a run. Tool time is added in code. Past the budget, the sentence is dropped.

[![ci](https://github.com/maitreyouss/next-late-run/actions/workflows/ci.yml/badge.svg)](https://github.com/maitreyouss/next-late-run/actions/workflows/ci.yml)

## Stack

TypeScript, React, Next.js, Zod, Vitest. The model client is the Vercel AI SDK. The timed tool is one MCP tool, `spend`. Node 22.

## Run

```bash
npm install
cp .env.example .env.local
npm run check
npm run dev
```

`DEMO=true` is the public setting. The model stays local, with or without a key. `npm run check` is format, lint, types, and tests. CI runs that, then the production build.

One address can replay 60 runs an hour. A live key lowers that to 20. The count stays in the memory of the process and starts again when the process does.

## The frozen case

Two spends, 900 ms and 800 ms, against a 1 500 ms budget. No sentence.

Without a key, a local planner replays that case and may still write the sentence. The run drops it. The eval does not call the network.

## Page

Two actions replay a run. Late: 900 ms and 800 ms, no sentence. In budget: 400 ms and 500 ms, the sentence stays. Each replay shows the spends, the sum, and the 1 500 ms budget.

## License

[MIT](LICENSE)
