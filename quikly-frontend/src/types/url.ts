export interface Url {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
  lastAccessedAt: string | null;
}

export interface CreateUrlDto {
  originalUrl: string;
  customCode?: string;
  expiresAt?: string;
}

export interface BulkCreateUrlDto {
  urls: Array<{
    originalUrl: string;
    customCode?: string;
    expiresAt?: string;
  }>;
}

export interface UrlResponse {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface BulkUrlResponse {
  results: Array<
    { success: true; data: UrlResponse } | { success: false; error: string; originalUrl: string }
  >;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

export interface UrlStatsResponse extends Url {
  shortUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}
