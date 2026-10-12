# next-late-run

A sentence that lands after the budget is not a run. Tool time is added in code. Past the budget, the sentence is dropped.

[![ci](https://github.com/maitreyouss/next-late-run/actions/workflows/ci.yml/badge.svg)](https://github.com/maitreyouss/next-late-run/actions/workflows/ci.yml)

## Stack

TypeScript, React, Next.js, Zod, Vitest. The model call will use the Vercel AI SDK. The timed tool will be one MCP tool, `spend`.

## Run

```bash
npm install
npm test
npm run dev
```

## The frozen case

Two spends, 900 ms and 800 ms, against a 1 500 ms budget. No sentence.

## License

[MIT](LICENSE)
