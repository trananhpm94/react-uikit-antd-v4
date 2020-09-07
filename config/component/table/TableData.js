export default {
  getPageIndexForSevice: page => page - 1, // page begin 1
  handleGetDataResponse: res => ({
    content: res.data.content,
    total: res.data.totalElements,
  }),
};
