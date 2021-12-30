let count = 0; // We assume this method is good enough.

export const generateUniqueId = (): number => {
  return count++;
};
