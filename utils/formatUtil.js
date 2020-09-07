import moment from "moment";

export const DATE_SHOW_UI = "DD/MM/YYYY";
export const DATE_PARAM_REQ = "YYYY-MM-DD";

export const moneyToString = value =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const stringToMoney = value => value.replace(/\$\s?|(,*)/g, "");

export const numberToMoney = value =>
  value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";

export const dateToString = (date, format = DATE_SHOW_UI) =>
  moment(date).format(format);

export const dateToStringParamReq = date => {
  const dateMoment = moment(date);
  return dateMoment.isValid() ? dateMoment.format(DATE_PARAM_REQ) : "";
};

export const stringParamReqToDate = param => {
  const dateMoment = moment(param, DATE_PARAM_REQ);
  return dateMoment.isValid() ? dateMoment : null;
};

export const roundUpDouble = (num, n = 2) => {
  if (!num) {
    return 0;
  }
  const x = 10 ** n;
  return Math.round(num * x) / x;
};
