import {TRANSFER_EVENT_TYPES, ACTIVITY_EVENT_TYPES} from "../const.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {cities, typesWithOffers} from "../mock/point.js";
import {formatDateAndTime} from "../utils/common.js";

const createTypesMarkup = (types, currentType) => {
  return types
  .map((type) => {
    const lowerCaseType = type.toLowerCase();
    return `<div class="event__type-item">
          <input id="event-type-${lowerCaseType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${lowerCaseType}" ${currentType === type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${lowerCaseType}" for="event-type-${lowerCaseType}-1">${type}</label>
        </div>`;
  })
  .join(`\n`);
};

const createDestinationNamesMarkup = (names) => {
  return names
  .map((name) => {
    return `<option value="${name}"></option>`;
  })
  .join(`\n`);
};

const createPhotosMarkup = (photos) => {
  const photosList = photos
  .map((photo) => {
    return `<img class="event__photo" src="${photo}" alt="Event photo">`;
  })
  .join(`\n`);

  return (
    `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${photosList}
        </div>
      </div>`
  );
};

const createOffersMarkUp = (currentType, currentOffers) => { // функция принимает на вход тип конкретного события и его доп. опции
  const currentTypeWithOffers = typesWithOffers.find((item) => { // вычисляет тип события с набором всех возможных доп.опций (не данного события). Нужно для последующего сравнения.
    return item.type === currentType;
  });

  const createOfferMarkup = (offer) => {
    const kindOfTitle = offer.title.split(` `).pop(); // вычисляет тип доп.опции по окончанию ее названия

    const isChecked = currentOffers // проверяет, если данная обция среди опций, указанных в конкретном событии
    .map(JSON.stringify)
    .includes(JSON.stringify(offer));

    return (`<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${kindOfTitle}-1" type="checkbox" name="event-offer-${kindOfTitle}" ${isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${kindOfTitle}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`
    );
  };

  return currentTypeWithOffers.offers // возвращает разметку ВСЕХ возможных опций для данного типа. Отмечает найденные в событии опции.
  .map(createOfferMarkup)
  .join(`\n`);
};

const createNewEventTemplate = (event) => {
  const {type, destination, offers, dateFrom, dateTo, price, isFavorite} = event;

  const transferEventsMarkup = createTypesMarkup(TRANSFER_EVENT_TYPES, type);
  const activityEventsMarkup = createTypesMarkup(ACTIVITY_EVENT_TYPES, type);
  const photosMarkup = destination.pictures ? createPhotosMarkup(destination.pictures) : ``;
  const offersMarkUp = offers ? createOffersMarkUp(type, offers) : ``;
  const destinationNamesMarkup = createDestinationNamesMarkup(cities);

  const formatedDateFrom = dateFrom instanceof Date ? formatDateAndTime(dateFrom) : formatDateAndTime(new Date());
  const formatedDateTo = dateTo instanceof Date ? formatDateAndTime(dateTo) : formatDateAndTime(new Date());

  const withPrepositionIn = ACTIVITY_EVENT_TYPES.includes(type);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? type : `Bus`}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferEventsMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityEventsMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type ? type : `Bus`} ${withPrepositionIn ? `in` : `to`}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationNamesMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatedDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatedDateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>

      </header>
      ${offers || (destination.description || destination.pictures) ? // Если есть доп. опции или описание места или картинки места - покажет раздел с деталями.
      `<section class="event__details">
        ${offers ? // Если есть раздел с доп. опциями - покажет его, если нет - ничего.
      `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
              ${offersMarkUp}
              </div>
            </section>`
      : ``
    }

            ${destination.description || destination.pictures ? // Если есть раздел с описанием - покажет его, если нет - ничего.
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>
            ${photosMarkup}
          </section>`
      : ``
    }
      </section>`
      : ``
    }
    </form>`
  );
};

class NewEvent extends AbstractSmartComponent {
  constructor(event) {
    super();

    this._event = event;
    this._submitHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createNewEventTemplate(this._event);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement()
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setResetHandler(handler) {
    this.getElement()
      .addEventListener(`reset`, handler);

    this._resetHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._rollupButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);

    this._setFavoriteButtonClickHandler = handler;
  }

  reset() {
    this.rerender();
  }

  _subscribeOnEvents() {
    this.setResetHandler(this._resetHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._setFavoriteButtonClickHandler);
  }
}

export default NewEvent;