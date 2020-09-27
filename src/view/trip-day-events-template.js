import AbstractComponent from "./abstract-component.js";

const createTripDayEventsTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

class TripDayEventsComponent extends AbstractComponent {
  getTemplate() {
    return createTripDayEventsTemplate();
  }
}

export default TripDayEventsComponent;
