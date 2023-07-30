export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export function jsonResponse<TBody>(
  body: TBody,
  options?: { statusCode?: number; headers?: Record<string, string> },
): HttpResponse {
  return {
    statusCode: options?.statusCode || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...options?.headers,
    },
    body: JSON.stringify(body),
  };
}

export function jsonError(message: string, statusCode: number) {
  return jsonResponse({ statusCode, message }, { statusCode });
}
