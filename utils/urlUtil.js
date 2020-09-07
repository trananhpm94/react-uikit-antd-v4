export const createQueryParams = (params = {}, prefix = "?") => {
  Object.keys(params).forEach(field => {
    if (!params[field] || params[field] === "") delete params[field];
  });
  return `${prefix}${new URLSearchParams(params).toString()}`;
};

export const getSearchFromHref = () => {
  const { href } = window.location;
  const indexSearch = href.indexOf("?");
  if (indexSearch === -1) {
    return "";
  }
  return href.substring(indexSearch);
};

export const getHrefNoQueryParams = () => {
  const { href } = window.location;
  const indexSearch = href.indexOf("?");
  if (indexSearch === -1) {
    return href;
  }
  return href.substring(0, indexSearch);
};

export const getQueryParams = search => {
  let searchQuery = search;
  if (!searchQuery) {
    searchQuery = getSearchFromHref();
  }
  const params = new URLSearchParams(searchQuery) || {};
  const paramObj = {};
  Array.from(params.keys()).forEach(value => {
    paramObj[value] = params.get(value);
  });
  return paramObj;
};

export const updateQueryParams = (params = {}) => {
  const queryParams = createQueryParams({
    _time: new Date().getTime(),
    ...params
  });
  const hrefNoQueryParams = getHrefNoQueryParams();
  window.location.href = hrefNoQueryParams + queryParams;
};

export const udpateQueryParams = (params = {}) => {
  return updateQueryParams(params);
};



