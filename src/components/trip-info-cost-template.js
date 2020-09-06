import AbstractComponent from "./abstract-component.js";

const createTripCostTemplate = (events) => {
  const cost = events.reduce((sum, item) => sum + item.price, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

class TripInfoCost extends AbstractComponent {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createTripCostTemplate(this._events);
  }
}

export default TripInfoCost;
