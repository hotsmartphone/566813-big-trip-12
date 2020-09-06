import AbstractComponent from "./abstract-component.js";
import {getShortDate} from "../utils/common.js";

const createDayInfoTemplate = (day, index) => {
  const shortDate = getShortDate(day.date);

  return (
    `<span class="day__counter">${index + 1}</span>
    <time class="day__date" datetime="${day.date.toISOString()}">${shortDate}</time>`
  );
};

const createTripDayTemplate = (day, index) => {
  const dayInfoTemplate = day ? createDayInfoTemplate(day, index) : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoTemplate}
      </div>
        <ul class="trip-events__list"></ul>
      </li>`
  );
};

class TripDay extends AbstractComponent {
  constructor(day, index) {
    super();

    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._index);
  }
}

export default TripDay;
