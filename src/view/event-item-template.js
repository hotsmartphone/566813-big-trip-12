import {ACTIVITY_EVENT_TYPES} from "../const.js";
import AbstractComponent from "./abstract-component.js";
import {castTimeFormat, formatTime} from "../utils/common.js";

const DISPLAYED_OFFERS_COUNT = 3;

const createOffersMurkup = (offers) => {
  offers = offers.slice(0, DISPLAYED_OFFERS_COUNT);
  const createOfferTemplate = (offer) => {
    return (
      `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
     </li>`
    );
  };

  const offerList = offers
    .map((offer) => createOfferTemplate(offer))
    .join(`\n`);

  return (
    `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
      ${offerList}
  </ul>`
  );
};

const createEventItemTemplate = (event) => {
  const {type, destination, offers, dateFrom, dateTo, price} = event;

  const withPrepositionIn = ACTIVITY_EVENT_TYPES.includes(type);
  const offersMarkup = offers.length > 0 ? createOffersMurkup(offers) : ``;
  const timeFrom = formatTime(dateFrom);
  const timeTo = formatTime(dateTo);

  const getEventDuration = () => { // функция вычилсяет продолжительность (дней, часов и минут) данного события
    const dateDiff = dateTo - dateFrom;
    const minutesFrom = dateFrom.getMinutes();
    const minutesTo = dateTo.getMinutes();
    const duration = {
      days: castTimeFormat(Math.floor(dateDiff / (1000 * 3600 * 24))),
      hours: castTimeFormat(Math.floor(dateDiff / (1000 * 3600)) % 24),
      minutes: castTimeFormat(minutesTo > minutesFrom ? minutesTo - minutesFrom : minutesTo - minutesFrom + 60), // для правильного подсчета, так как пользователь будет видеть только часы и минуты
    };

    if (Number(duration.days) === 0) { // вычисляет строку, в заивисимости от продолжительности события
      if (Number(duration.hours) === 0) {
        return (`${duration.minutes}M`); // если событие длилось несколько минут (меньше часа)
      } else {
        return (`${duration.hours}H ${duration.minutes}M`); // если событие длилось меньше дня, но больше часа
      }
    } else {
      return (`${duration.days}D ${duration.hours}H ${duration.minutes}M`); // если событие длилось больше дня
    }
  };

  const durationTime = getEventDuration();

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${withPrepositionIn ? `in` : `to`} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom.toISOString()}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo.toISOString()}">${timeTo}</time>
          </p>
          <p class="event__duration">${durationTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        ${offersMarkup}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

class EventItem extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createEventItemTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}

export default EventItem;
