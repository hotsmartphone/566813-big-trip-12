import NewEventComponent from '../view/new-event-template.js';
import EventItemComponent from '../view/event-item-template.js';

import {RenderPosition, render, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

class EventPresenter {
  constructor(eventListContainer) {
    console.log(eventListContainer);
    this._eventListContainer = eventListContainer;

    this._eventComponent = null;
    this._editEventComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._editButtonClickHandler = this._editButtonClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._resetHandler = this._resetHandler.bind(this);
    this._rollUpButtonClickHandler = this._rollUpButtonClickHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventItemComponent(this._event);
    this._editEventComponent = new NewEventComponent(this._event);

    this._eventComponent.setEditButtonClickHandler(this._editButtonClickHandler);
    this._editEventComponent.setSubmitHandler(this._editButtonClickHandler);
    this._editEventComponent.setResetHandler(this._resetHandler);
    this._editEventComponent.setRollUpButtonClickHandler(this._rollUpButtonClickHandler);

    if (this.prevEventComponent === null || this.prevEditEventComponent === null) {
      render(this._eventListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._eventListContainer.getElement().contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._eventListContainer.getElement().contains(prevEditEventComponent.getElement())) {
      replace(this._editEventComponent, prevEditEventComponent);
    }

    remove(prevEventComponent);
    remove(prevEditEventComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
  }

  _replaceEventToEdit() {
    replace(this._editEventComponent, this._eventComponent);
  }

  _replaceEditToEvent() {
    replace(this._eventComponent, this._editEventComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      evt.preventDefault();
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _editButtonClickHandler() {
    this._replaceEventToEdit();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _submitHandler() {
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _resetHandler(evt) {
    evt.preventDefault();
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _rollUpButtonClickHandler(evt) {
    evt.preventDefault();
    this._replaceEditToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _favoriteButtonClickHandler() {///////////////////////////////////

  }
}

export default EventPresenter;
