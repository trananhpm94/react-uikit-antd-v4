import produce from 'immer';

export const sealObject = (objDefault = {}, ...objValues) => {
  const objSealValue = Object.seal({ ...objDefault });

  objValues.forEach(objValue => {
    if (!objValue) return;
    Object.entries(objValue).forEach(([key, value]) => {
      try {
        objSealValue[key] = value;
      } catch (e) {}
    });
  });
  return objSealValue;
};

export default entityDefault => ({
  replaces: produce((state, entities = []) => {
    (entities || []).forEach(entity => {
      state.ids[entity.id] = sealObject(entityDefault, entity);
    });
  }),
  saves: produce((state, entities = []) => {
    (entities || []).forEach(entity => {
      state.ids[entity.id] = sealObject(entityDefault, state.ids[entity.id], entity);
    });
  }),
  deletes: produce((state, entities = []) => {
    (entities || []).forEach(entity => {
      delete state.ids[entity.id];
    });
  }),
});
