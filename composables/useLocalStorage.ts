const useLocalStorage = <T>(key: string) => {
  const getItem = (): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const setItem = (value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeItem = (): void => {
    localStorage.removeItem(key);
  };

  return { getItem, setItem, removeItem };
};

export default useLocalStorage;
