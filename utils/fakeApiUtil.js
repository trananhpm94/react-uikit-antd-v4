export const later = (value, delay = 1500) =>
  new Promise(resolve => setTimeout(resolve, delay, value));

export const fakeApi = (value, delay = 1500) => () =>
  new Promise(resolve => setTimeout(resolve, delay, value));

export const fakeApiList = (value, delay = 1500) => () =>
  new Promise(resolve =>
    setTimeout(resolve, delay, {
      data: { content: value },
    })
  );
