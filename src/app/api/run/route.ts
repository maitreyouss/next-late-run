import { z } from "zod";

import { replay } from "@/lib/replay";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  case: z.enum(["late", "fit"]),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Unreadable request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "The case must be late or fit." }, { status: 400 });
  }

  return Response.json(await replay(parsed.data.case));
}
