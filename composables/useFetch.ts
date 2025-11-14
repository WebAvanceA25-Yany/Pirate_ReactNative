import useLocalStorage from "./useLocalStorage";

const baseurl = 'https://p.y-any.org:2223/api';

//use Fetach
const useFetch = () => {
  const { getItem: getToken } = useLocalStorage<string>("token");

  const getHeaders = () => {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
     console.log("Headers envoyés :", headers);
    return headers;
  };

  const GET = async <T>(url: string): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, { headers: getHeaders() });
      return handleResponse<T>(response);
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  };

  const POST = async <T, T1 = T>(url: string, body: T): Promise<T1 | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return handleResponse<T1>(response);
    } catch (error) {
      console.error('Error posting:', error);
      throw error;
    }
  };

  const DELETE = async (url: string): Promise<void> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting:', error);
      throw error;
    }
  };

  const PATCH = async <T>(url: string, body: T): Promise<void | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error patching:', error);
      throw error;
    }
  };

  const PUT = async <T, T1 = T>(url: string, body: T): Promise<T1 | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return handleResponse<T1>(response);
    } catch (error) {
      console.error('Error putting:', error);
      throw error;
    }
  };

  async function handleResponse<T>(response: Response): Promise<T | undefined> {
    if (!response.ok) {
      if (response.status === 500) throw new Error('Internal server error');
      if (response.status === 404) return undefined as T;
      if (response.status === 400) throw new Error("Ton payload n'est pas bon");
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        return (await response.json()) as T;
      } catch (err) {
        console.warn("Réponse vide ou JSON invalide :", err);
        return undefined;
      }
    }

    return undefined;
  }

  return { GET, POST, PATCH, DELETE, PUT };
};

export default useFetch;
