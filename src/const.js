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

const TRANSFER_EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const ACTIVITY_EVENT_TYPES = [`check-in`, `sightseeing`, `restaurant`];
const EVENT_TYPES = TRANSFER_EVENT_TYPES.concat(ACTIVITY_EVENT_TYPES);

export {SHORT_MONTH_NAMES, TRANSFER_EVENT_TYPES, ACTIVITY_EVENT_TYPES, EVENT_TYPES};
