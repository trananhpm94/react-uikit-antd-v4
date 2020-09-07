import { message } from 'antd';
export default {
  // default exception ApiError
  handleRequestError: response => {
    if (!response || !response.data) {
      return;
    }
    const { apierror } = response.data;
    if (!apierror || apierror.message === '') {
      return;
    }
    message.error(apierror.message);
  },
};
