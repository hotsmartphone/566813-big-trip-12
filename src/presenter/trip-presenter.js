import TripSortComponent, {SortType} from '../view/trip-sort-template.js';
import TripDayEventsComponent from '../view/trip-day-events-template.js';
import TripDayComponent from '../view/trip-day-template.js';
import TripDaysBoardComponent from '../view/trip-days-board-template.js';
// import EventItemComponent from '../view/event-item-template.js';
import NoEventsComponent from '../view/no-events-template.js';

import EventPresenter from './event-presenter.js';

import {RenderPosition, render, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';


const groupEvents = (event, container) => { // функция добавляет карточку в определенную группу - день
  const eventDate = new Date(event.dateFrom.getFullYear(), event.dateFrom.getMonth(), event.dateFrom.getDate());

  const addEvent = () => {
    container.push(
        {
          date: eventDate,
          events: new Array(event),
        }
    );
  };

  const foundElement = container.find((item) => {
    return item.date.getTime() === eventDate.getTime();
  });

  if (foundElement !== undefined) {
    container[container.indexOf(foundElement)].events.push(event);
  } else {
    addEvent(container);
  }
};

const groupAndSortEventsByDays = (eventsArr) => { // функция  принимает мааасив событий, сортирует и группирует по датам
  const groupedEvents = [];

  eventsArr.forEach((event) => groupEvents(event, groupedEvents));

  groupedEvents.sort((a, b) => { // сортируем в блоки событий по дате
    return a.date.getTime() - b.date.getTime();
  });

  groupedEvents.forEach((item) => { // в каждом блоке (дате) сортируем массив событий по дате начала
    item.events.sort((a, b) => {
      return a.dateFrom.getTime() - b.dateFrom.getTime();
    });
  });

  return groupedEvents; // на выходе получаем массив объектов с ключами "День" и "События" (этого дня), сортированные по дате
};

// const renderEvent = (dayEventsElement, event) => {
//   const replaceEventToEdit = () => {
//     replace(editEventComponent, eventItemComponent);
//   };
//
//   const replaceEditToEvent = () => {
//     replace(eventItemComponent, editEventComponent);
//   };
//
//   const onEscKeyDown = (evt) => {
//     const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
//
//     if (isEscKey) {
//       replaceEditToEvent();
//       document.removeEventListener(`keydown`, onEscKeyDown);
//     }
//   };
//
//   const eventItemComponent = new EventItemComponent(event);
//   eventItemComponent.setEditButtonClickHandler(() => {
//     replaceEventToEdit();
//     document.addEventListener(`keydown`, onEscKeyDown);
//   });
//
//   const editEventComponent = new NewEventComponent(event);
//   editEventComponent.setSubmitHandler((evt) => {
//     evt.preventDefault();
//     replaceEditToEvent();
//     document.removeEventListener(`keydown`, onEscKeyDown);
//   });
//
//   editEventComponent.setResetHandler((evt) => {
//     evt.preventDefault();
//     replaceEditToEvent();
//     document.removeEventListener(`keydown`, onEscKeyDown);
//   });
//
//   render(dayEventsElement, eventItemComponent, RenderPosition.BEFOREEND);
// };


// ФУНКЦИИ ПОКА УКАЗАЛ КАК МЕТОДЫ ПРЕЗЕНТЕРА
// const renderDay = (container, day, index) => { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события
//   render(container, new TripDayComponent(day, index), RenderPosition.BEFOREEND);
//   const currentDayEventsList = container.lastChild.querySelector(`.trip-events__list`);
//   day.events.forEach((event) => {
//     renderEvent(currentDayEventsList, event);
//   });
// };
//
// const renderEvents = (container, events, sortType) => { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события или отрисовывает список событий (зависит от выбранного типа сортировки)
//   if (sortType === SortType.DEFAULT) {
//     events.forEach((day, index) => {
//       renderDay(container, day, index);
//     });
//   } else {
//     render(container, new TripDayComponent(), RenderPosition.BEFOREEND);
//     const currentDayEventsList = container.lastChild.querySelector(`.trip-events__list`);
//
//     events.forEach((event) => renderEvent(currentDayEventsList, event));
//   }
// };

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const copiedEvents = events.slice();
  const getDurationEvent = (event) => {
    return (event.dateTo.getTime() - event.dateFrom.getTime());
  };

  switch (sortType) {
    case SortType.DEFAULT:
      sortedEvents = groupAndSortEventsByDays(events);
      break;

    case SortType.TIME:
      sortedEvents = copiedEvents.sort((a, b) => getDurationEvent(b) - getDurationEvent(a));
      break;

    case SortType.PRICE:
      sortedEvents = copiedEvents.sort((a, b) => b.price - a.price);
      break;
  }

  return sortedEvents;
};


class TripController {
  constructor(container) {
    this._container = container;
    this._containerHeadElement = container.querySelector(`h2`);

    this._eventPresenters = {};
    this._tripDayEventsComponents = [];
    this._tripDayComponents = [];

    this._events = null;
    this._sortedEvents = null;

    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysBoardComponent = new TripDaysBoardComponent();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._eventChangeHandler = this._eventChangeHandler.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice(); // "Резервная копия" массива событий

    if (events.length === 0 || !events) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
    } else {
      render(this._containerHeadElement, this._tripSortComponent, RenderPosition.AFTEREND);
      render(this._container, this._tripDaysBoardComponent, RenderPosition.BEFOREEND);

      let sortedEvents = getSortedEvents(events, SortType.DEFAULT);

      this._renderEvents(sortedEvents, SortType.DEFAULT);
    }
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _clearEventList() {
    Object
    .values(this._eventPresenters)
    .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};

    this._tripDayEventsComponents.forEach((component) => remove(component));
    this._tripDayComponents.forEach((component) => remove(component));
  }

  _sortTypeChangeHandler(sortType) {
    this._sortedEvents = getSortedEvents(this._events, sortType);
    this._clearEventList();
    this._renderEvents(this._sortedEvents, sortType);
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._eventChangeHandler, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _createDay(day, index) {
    const currentDayEventsList = new TripDayEventsComponent();
    const tripDayComponent = new TripDayComponent(day, index);

    this._tripDayEventsComponents.push(currentDayEventsList);
    this._tripDayComponents.push(tripDayComponent);

    render(this._tripDaysBoardComponent, tripDayComponent, RenderPosition.BEFOREEND);
    render(tripDayComponent, currentDayEventsList, RenderPosition.BEFOREEND);

    return currentDayEventsList;
  }

  _renderDay(day, index) { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события
    // const currentDayEventsList = new TripDayEventsComponent();////////////////// ДУБЛИРВОАНИЕ КОДА №1
    // const tripDayComponent = new TripDayComponent(day, index);
    //
    // render(this._tripDaysBoardComponent, tripDayComponent, RenderPosition.BEFOREEND);
    // render(tripDayComponent, currentDayEventsList, RenderPosition.BEFOREEND);
    const currentDayEventsList = this._createDay(day, index);

    day.events.forEach((event) => {
      this._renderEvent(currentDayEventsList, event);
    });
  }

  _renderEvents(events, sortType) { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события или отрисовывает список событий (зависит от выбранного типа сортировки)
    if (sortType === SortType.DEFAULT) {
      events.forEach((day, index) => {
        this._renderDay(day, index);
      });
    } else {
      // const currentDayEventsList = new TripDayEventsComponent();////////////////// ДУБЛИРВОАНИЕ КОДА №1
      // const tripDayComponent = new TripDayComponent();
      //
      // render(this._tripDaysBoardComponent, tripDayComponent, RenderPosition.BEFOREEND);
      // render(tripDayComponent, currentDayEventsList, RenderPosition.BEFOREEND);

      events.forEach((event) => this._renderEvent(this._createDay(), event));
    }
  }

  _eventChangeHandler(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvents = updateItem(this._sourcedEvents, updatedEvent);
    this._eventPresenters[updatedEvent.id].init(updatedEvent);
  }
}

export default TripController;
