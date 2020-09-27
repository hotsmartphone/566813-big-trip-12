import {SHORT_MONTH_NAMES} from "../const.js";

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDateAndTime = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = (date.getFullYear() - 2000).toString();

  return `${day}/${month}/${year} ${formatTime(date)}`;
};

const getShortDate = (fullDate) => {
  return (SHORT_MONTH_NAMES[fullDate.getMonth()].toUpperCase() + ` ` + fullDate.getDate());
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export {
  castTimeFormat,
  formatTime,
  formatDateAndTime,
  getShortDate,
  updateItem
};
