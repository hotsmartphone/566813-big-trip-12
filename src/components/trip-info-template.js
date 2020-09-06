import AbstractComponent from "./abstract-component.js";

const createTripInfoTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info"></section>`
  );
};

class TripInfo extends AbstractComponent {
  getTemplate() {
    return createTripInfoTemplate();
  }
}

export default TripInfo;
