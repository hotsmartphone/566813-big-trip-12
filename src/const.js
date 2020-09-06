const SHORT_MONTH_NAMES = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];

const TRANSFER_EVENT_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
const ACTIVITY_EVENT_TYPES = [`Check-in`, `Sightseeing`, `Restaurant`];
const EVENT_TYPES = TRANSFER_EVENT_TYPES.concat(ACTIVITY_EVENT_TYPES);

export {SHORT_MONTH_NAMES, TRANSFER_EVENT_TYPES, ACTIVITY_EVENT_TYPES, EVENT_TYPES};
