import AbstractComponent from "./abstract-component.js";
import {castTimeFormat, getShortDate} from "../utils/common.js";

const getTripDateRange = (from, to) => { // функция анализирует даты и выводит строку в соответствующем формате
  if ((from - to) === 0) {
    return getShortDate(from); // если путешествие длится один день - выводит в формате "MAY 18"
  } else if (from.getMonth() === to.getMonth()) {
    return `${getShortDate(from)}&nbsp;&mdash;&nbsp;${castTimeFormat(to.getDate())}`; // если путешествие происходит в одном месяце - выводит в формате "MAY 18 - 23"
  } else {
    return `${getShortDate(from)}&nbsp;&mdash;&nbsp;${getShortDate(to)}`; // если путешествие в разные месяцы - выводит в формате "MAY 18 - JUN 02"
  }
};

const createTripInfoTemplate = (events) => {
  if (!events || (events.length === 0)) {
    return ` `;
  }

  const sortedByDateEvents = events
    .slice()
    .sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());

  const eventFrom = sortedByDateEvents[0];
  const eventTo = sortedByDateEvents[sortedByDateEvents.length - 1];

  const date = events ? getTripDateRange(eventFrom.dateFrom, eventTo.dateTo) : ``;
  const destinationFrom = eventFrom.destination.name; // берет город из первого события
  const destinationTo = eventTo.destination.name; // берет город из последнего события

  const intermediateDestinations = new Set();

  sortedByDateEvents.forEach((item) => { // вычисляет, есть ли в путешествии другие города, кроме начального и конечного. Сохраняет их в множество
    if ((item.destination.name !== destinationFrom) && (item.destination.name !== destinationTo)) {
      intermediateDestinations.add(item.destination.name);
    }
  });

  let middleDestination = ``;

  if (intermediateDestinations.size === 1) { // добавит промежуточный город в заголовок, если он один
    middleDestination = Array.from(intermediateDestinations)[0];
  } else if (intermediateDestinations.size > 1) { // добавит три точки, если промежуточных городов несколько
    middleDestination = `...`;
  }

  return (
    `<div class="trip-info__main">
        <h1 class="trip-info__title">${destinationFrom} &mdash; ${middleDestination ? middleDestination + ` &mdash; ` : ``}${destinationTo}</h1>

        <p class="trip-info__dates">${date}</p>
      </div>`
  );
};

class TripInfoMain extends AbstractComponent {
  constructor(events, sortedEvents) {
    super();

    this._events = events;
    this._sortedEvents = sortedEvents;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events, this._sortedEvents);
  }
}

export default TripInfoMain;
