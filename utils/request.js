import axios from 'axios';
import { getConfig } from 'react-uikit/utils/uikitConfig';

const requestConfig = getConfig('utils/request');

export const HOST_API = process.env.REACT_APP_HOST_API || window.location.origin;

export const getHeaderAuthorization = token => {
  const t = !token ? window.localStorage.getItem('app.token') : token;
  return { authorization: `Bearer ${t}` };
};

const handleRequestError = (response, props) => {
  if (props.handleRequestError) {
    props.handleRequestError(response);
    return;
  }
  requestConfig.handleRequestError(response);
};

export const request = async ({
  host = false,
  url = '',
  method = 'get',
  params,
  data,
  headers = {},
  ...props
}) => {
  try {
    const result = await axios({
      url: `${host ? host : HOST_API}${url}`,
      method,
      data,
      params,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...getHeaderAuthorization(),
        ...headers,
      },
      ...props,
    });
    return result;
  } catch (err) {
    console.error('err', err);
    const { response } = err;
    if (response && response.status === 401) {
      window.localStorage.setItem('app.token', '');
    }
    handleRequestError(response, props);
    throw err;
  }
};

export const requestDownload = async ({
  defaultFileName = 'fileDownload',
  headers = {},
  ...props
}) => {
  try {
    const res = await request({
      ...props,
      responseType: 'blob',
      headers: {
        Accept: '*/*',
        ...headers,
      },
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');

    link.href = url;
    let fileName = defaultFileName;
    if (res.headers && res.headers['content-disposition']) {
      const contentDisposition = res.headers['content-disposition'];
      const indexFileName = contentDisposition.indexOf('filename=');
      if (indexFileName >= 0) {
        fileName = contentDisposition.substring(indexFileName, contentDisposition.length);
        fileName = fileName.replace('filename="', '');
        fileName = fileName.replace('filename=', '');
      }
      let indexLastFilename = fileName.indexOf(`"`);
      indexLastFilename = indexLastFilename === -1 ? fileName.length : indexLastFilename;
      fileName = fileName.substring(0, indexLastFilename);
    }
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    return res;
  } catch (err) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        err.response.data = JSON.parse(reader.result);
        handleRequestError(err.response, props);
        resolve(Promise.reject(err));
      };
      reader.onerror = () => {
        reject(err);
      };
      reader.readAsText(err.response.data);
    });
  }
};
