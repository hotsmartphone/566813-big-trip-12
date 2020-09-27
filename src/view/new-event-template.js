import {TRANSFER_EVENT_TYPES, ACTIVITY_EVENT_TYPES} from "../const.js";
import SmartComponent from "./smart-component.js";
import {cities, typesWithOffers} from "../mock/point.js";
import {formatDateAndTime} from "../utils/common.js";
import {destinations} from '../mock/point.js';

const createTypesMarkup = (types, currentType) => {
  return types
  .map((type) => {
    const typeUpperCaseFirstLit = type[0].toUpperCase() + type.slice(1);
    return `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeUpperCaseFirstLit}</label>
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
    return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
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
        <button class="event__reset-btn" type="reset">Delete</button>

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

class NewEvent extends SmartComponent {
  constructor(event) {
    super();

    this._data = NewEvent.parseEventToData(event);
    this._callback = {};
    this._callback.formSubmit = null;
    this._callback.formReset = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._rollUpButtonClickHandler = this._rollUpButtonClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewEventTemplate(this._data);
  }

  restoreHandlers() { // не хватает хэндлера удаления
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.formSubmit);
    this.setRollUpButtonClickHandler(this._callback.formReset);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, this._favoriteButtonClickHandler);

    this.getElement()
      .querySelectorAll(`.event__type-group`)
      .forEach((group) => group.addEventListener(`change`, this._typeChangeHandler));

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(NewEvent.parseDataToEvent(this._data));
  }

  setSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
      .addEventListener(`submit`, this._formSubmitHandler);
  }


  setResetHandler(handler) {
    this.getElement()
      .addEventListener(`reset`, handler);
  }

  _rollUpButtonClickHandler(evt) {
    this._callback.formReset(evt);
  }

  setRollUpButtonClickHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollUpButtonClickHandler);
  }

  // setFavoriteButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.event__favorite-checkbox`)
  //     .addEventListener(`change`, handler);
  // }

  // setTypeChangeHandler(handler) {
  //   this.getElement().querySelectorAll(`.event__type-group`)
  //     .forEach((group) => group.addEventListener(`change`, handler)
  //     );
  // }
  //
  // setDestinationChangeHandler(handler) {
  //   this.getElement().querySelector(`.event__input--destination`)
  //     .addEventListener(`change`, handler);
  // }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _typeChangeHandler(evt) {
    this.updateData({
      type: evt.target.value,
      offers: [] // При смене типа события нужно убрать доп. опции, так как пользователь их еще не отметил
    });
  }

  _destinationChangeHandler(evt) {
    const changedDestination = destinations.find((item) => item.name === evt.target.value);
    if (changedDestination === undefined) {
      return;
    }
    this.updateData({
      destination: destinations.find((item) => item.name === evt.target.value)
    });
  }

  reset(event) {
    this.updateData(
        NewEvent.parseEventToData(event)
    );
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          type: event.type,
          destination: Object.assign({}, event.destination),
          offers: event.offers.slice(),
          dateFrom: event.dateFrom,
          dateTo: event.dateTo,
          price: event.price,
          isFavorite: event.isFavorite,
        }
    );
  }

  static parseDataToEvent(data) {
    return Object.assign(
        {},
        data
    );
  }
}

export default NewEvent;
