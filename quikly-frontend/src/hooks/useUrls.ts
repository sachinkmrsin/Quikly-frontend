import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  CreateUrlDto,
  BulkCreateUrlDto,
  UrlResponse,
  BulkUrlResponse,
  UrlStatsResponse,
  PaginatedResponse,
  PaginationParams,
  Url,
} from "@/types/url";

const urlKeys = {
  all: ["urls"] as const,
  lists: () => [...urlKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...urlKeys.lists(), params] as const,
  top: (limit?: number) => [...urlKeys.all, "top", limit] as const,
  stats: (code: string) => [...urlKeys.all, "stats", code] as const,
};

export function useCreateShortUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateUrlDto): Promise<UrlResponse> => {
      const res = await api.post<{ success: boolean; data: UrlResponse }>(
        "/shorten",
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urlKeys.lists() });
      queryClient.invalidateQueries({ queryKey: urlKeys.top() });
    },
  });
}

export function useCreateBulkUrls() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BulkCreateUrlDto): Promise<BulkUrlResponse> => {
      const res = await api.post<{ success: boolean; data: BulkUrlResponse }>(
        "/shorten/bulk",
        data
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urlKeys.lists() });
    },
  });
}

export function useUrls(params: PaginationParams = {}) {
  return useQuery({
    queryKey: urlKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Url>> => {
      const res = await api.get<PaginatedResponse<Url>>("/api/urls", {
        params,
      });
      return res.data;
    },
  });
}

export function useTopUrls(limit = 10) {
  return useQuery({
    queryKey: urlKeys.top(limit),
    queryFn: async (): Promise<Url[]> => {
      const res = await api.get<{ success: boolean; data: Url[] }>(
        "/api/urls/top",
        { params: { limit } }
      );
      return res.data.data;
    },
  });
}

export function useUrlStats(shortCode: string) {
  return useQuery({
    queryKey: urlKeys.stats(shortCode),
    queryFn: async (): Promise<UrlStatsResponse> => {
      const res = await api.get<UrlStatsResponse>(
        `/stats/${shortCode}`
      );
      return res.data;
    },
    enabled: !!shortCode,
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shortCode: string): Promise<void> => {
      await api.delete(`/${shortCode}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urlKeys.all });
    },
  });
}

export function useCleanupExpired() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post("/api/maintenance/cleanup");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: urlKeys.all });
    },
  });
}
