import NewEventComponent from '../view/new-event-template.js';
import EventItemComponent from '../view/event-item-template.js';

import {RenderPosition, render, replace, remove} from '../utils/render.js';


const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

class EventPresenter {
  constructor(eventListContainer, changeData, changeMode) {

    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._editButtonClickHandler = this._editButtonClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._resetHandler = this._resetHandler.bind(this);

    this._rollUpButtonHandle = this._rollUpButtonHandle.bind(this);
    // this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    // this._typeChangeHandler = this._typeChangeHandler.bind(this);////////
    // this._destinationChangeHandler = this._destinationChangeHandler.bind(this);//////////////
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventItemComponent(this._event);
    this._editEventComponent = new NewEventComponent(this._event);

    this._eventComponent.setEditButtonClickHandler(this._editButtonClickHandler);
    this._editEventComponent.setSubmitHandler(this._submitHandler);
    this._editEventComponent.setResetHandler(this._resetHandler);
    this._editEventComponent.setRollUpButtonClickHandler(this._rollUpButtonHandle);
    // this._editEventComponent.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    // this._editEventComponent.setTypeChangeHandler(this._typeChangeHandler);//////////////////////////////////////////////
    // this._editEventComponent.setDestinationChangeHandler(this._destinationChangeHandler);////////////

    if (prevEventComponent === null || prevEditEventComponent === null) {
      render(this._eventListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._editEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _resetEditEvent(evt) {
    evt.preventDefault();
    this._editEventComponent.reset(this._event);
    this._replaceEditToEvent();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._resetEditEvent(evt);
    }
  }

  _editButtonClickHandler() {
    this._replaceEventToEdit();
  }

  _submitHandler(event) {
    this._changeData(event);
    this._replaceEditToEvent();
  }

  _resetHandler(evt) { // нужен ли дайннй хэндлер?????????
    this._resetEditEvent(evt);
  }

  _rollUpButtonHandle(evt) {
    this._resetEditEvent(evt);
  }

  // _favoriteButtonClickHandler() {
  //   const updatedEvent = Object.assign(
  //       {},
  //       this._event,
  //       {
  //         isFavorite: !this._event.isFavorite
  //       }
  //   );
  //   this._changeData(updatedEvent);
  // }

  // _typeChangeHandler(evt) {//////////////////////////////////
  //   const updatedEvent = Object.assign(
  //       {},
  //       this._event,
  //       {
  //         type: evt.target.value,
  //         offers: [] // При смене типа события нужно убрать доп. опции, так как пользователь их еще не отметил
  //       }
  //   );
  //   this._changeData(updatedEvent);
  // }

  // _destinationChangeHandler(evt) {
  //   const changedDestination = destinations.find((item) => item.name === evt.target.value);
  //   if (changedDestination === undefined) {
  //     return;
  //   }
  //   const updatedEvent = Object.assign(
  //       {},
  //       this._event,
  //       {
  //         destination: destinations.find((item) => item.name === evt.target.value)
  //       }
  //   );
  //   this._changeData(updatedEvent);
  // }
}

export default EventPresenter;
