export const groupBy = (source, key) => {
  return source.reduce((rv, item) => {
    (rv[item[key]] = rv[item[key]] || []).push(item);
    return rv;
  }, {});
};

export const distinctByKey = (array, key) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

export const toObj = (source, key) => {
  return source.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
};

export const insertAt = (array, index, ...elements) => {
  const newArray = [...array];
  if (!array) return newArray;
  newArray.splice(index, 0, ...elements);
  return newArray;
}

export const deleteAt = (array = [], index) => {
  return array.filter((item, i) => i !== index)
}