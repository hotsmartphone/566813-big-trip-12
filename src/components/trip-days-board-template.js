import AbstractComponent from "./abstract-component.js";

const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

class TripDaysBoard extends AbstractComponent {
  getTemplate() {
    return createTripDaysTemplate();
  }
}

export default TripDaysBoard;
