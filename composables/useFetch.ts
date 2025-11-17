import useStorage from "./useLocalStorage";

const BASE_URL = "https://p.y-any.org:2223/api";

const useFetch = () => {
  const { getItem } = useStorage<string>("token");

  const getHeaders = async () => {
    const token = await getItem();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const handleResponse = async <T>(response: Response): Promise<T | undefined> => {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error: ${response.status} - ${text}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    return undefined;
  };

  const GET = async <T>(endpoint: string): Promise<T | undefined> => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, { method: "GET", headers });
    return handleResponse<T>(res);
  };

  const POST = async <TBody, TRes = TBody>(endpoint: string, body: TBody): Promise<TRes | undefined> => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<TRes>(res);
  };

  const PATCH = async <TBody, TRes = TBody>(endpoint: string, body: TBody): Promise<TRes | undefined> => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<TRes>(res);
  };

  const PUT = async <TBody, TRes = TBody>(endpoint: string, body: TBody): Promise<TRes | undefined> => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<TRes>(res);
  };

  const DELETE = async (endpoint: string): Promise<void> => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    await handleResponse(res);
  };

  return { GET, POST, PATCH, PUT, DELETE };
};

export default useFetch;
