import produce from 'immer';

export default {
  name: 'compModalHook',
  state: {},
  reducers: {
    showModal: produce((state, id = '', data = {}) => {
      if (!state[id]) {
        state[id] = { visible: false, data: {} };
      }
      state[id].visible = true;
      state[id].data = data;
    }),
    hiddenModal: produce((state, id = '', data = {}) => {
      if (!state[id]) {
        state[id] = {};
      }
      state[id].visible = false;
      state[id].data = data;
    }),
  },
};
