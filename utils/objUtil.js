export const isPlainObject = (o) => {
  return o === null || Array.isArray(o) || typeof o == 'function' ? false : typeof o == 'object';
};

export const pick = (sourceObject, keys) => {
  if (!sourceObject) {
    return sourceObject;
  }
  const newObject = {};
  (keys || []).forEach((key) => {
    if (typeof key === 'string') {
      newObject[key] = sourceObject[key];
    } else if (isPlainObject(key)) {
      Object.entries(key).forEach(([oldKey, newKey]) => {
        newObject[newKey] = sourceObject[oldKey];
      });
    } else if (Array.isArray(key) && key.length === 2) {
      newObject[key[1]] = sourceObject[key[0]];
    }
  });
  return newObject;
};
