import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const API_BASE_URL ="http://localhost:3000";

type Options = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

export async function fetchApi<T = any>(
  path: string,
  { method = "GET", body = null, headers = {} }: Options = {}
): Promise<{ data?: T; error?: string; status?: number }> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${path}`, options);

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        error: json?.error || "Une erreur est survenue",
        status: res.status,
      };
    }

    return { data: json as T };
  } catch (err) {
    console.error(err)
    return { error: "Impossible de joindre le serveur" };
  }
}
