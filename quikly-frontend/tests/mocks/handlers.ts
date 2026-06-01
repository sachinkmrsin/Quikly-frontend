import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/shorten", async ({ request }) => {
    const body = (await request.json()) as { originalUrl: string; customCode?: string };
    return HttpResponse.json({
      success: true,
      data: {
        id: "test-id-1",
        shortCode: body.customCode || "abc1234",
        originalUrl: body.originalUrl,
        shortUrl: `http://localhost:3000/${body.customCode || "abc1234"}`,
        createdAt: new Date().toISOString(),
        expiresAt: null,
      },
    });
  }),

  http.post("/shorten/bulk", async ({ request }) => {
    const body = (await request.json()) as { urls: Array<{ originalUrl: string }> };
    return HttpResponse.json({
      success: true,
      data: {
        results: body.urls.map((u, i) => ({
          success: true,
          data: {
            id: `test-id-${i}`,
            shortCode: `code${i}`,
            originalUrl: u.originalUrl,
            shortUrl: `http://localhost:3000/code${i}`,
            createdAt: new Date().toISOString(),
            expiresAt: null,
          },
        })),
        summary: {
          total: body.urls.length,
          succeeded: body.urls.length,
          failed: 0,
        },
      },
    });
  }),

  http.get("/api/urls", () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: "test-id-1",
          shortCode: "abc1234",
          originalUrl: "https://example.com/long-url",
          createdAt: new Date().toISOString(),
          expiresAt: null,
          clickCount: 42,
          lastAccessedAt: new Date().toISOString(),
        },
      ],
      pagination: {
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      },
    });
  }),

  http.get("/api/urls/top", () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: "test-id-1",
          shortCode: "abc1234",
          originalUrl: "https://example.com/long-url",
          createdAt: new Date().toISOString(),
          expiresAt: null,
          clickCount: 100,
          lastAccessedAt: new Date().toISOString(),
        },
      ],
    });
  }),

  http.get("/stats/:shortCode", ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: "test-id-1",
        shortCode: params.shortCode,
        originalUrl: "https://example.com/long-url",
        shortUrl: `http://localhost:3000/${params.shortCode}`,
        createdAt: new Date().toISOString(),
        expiresAt: null,
        clickCount: 42,
        lastAccessedAt: new Date().toISOString(),
      },
    });
  }),

  http.delete("/:shortCode", () => {
    return HttpResponse.json({ success: true, data: null });
  }),

  http.post("/api/maintenance/cleanup", () => {
    return HttpResponse.json({ success: true, data: { deleted: 5 } });
  }),

  http.get("/health", () => {
    return HttpResponse.json({ status: "ok" });
  }),
];
