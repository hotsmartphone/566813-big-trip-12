import TripInfoComponent from './view/trip-info-template.js';
import TripInfoMainComponent from './view/trip-info-main-template.js';
import TripInfoCostComponent from './view/trip-info-cost-template.js';
import ViewMenuComponent from './view/view-menu-template.js';
import TripFiltersComponent from './view/trip-filters-template.js';

import TripPresenter from './presenter/trip-presenter.js';

import {generateEvents} from './mock/point.js';
import {RenderPosition, render} from './utils/render.js';

const POINT_TRIP_COUNT = 20;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const menuControls = tripControls.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);

const events = generateEvents(POINT_TRIP_COUNT);

const tripInfoComponent = new TripInfoComponent();

render(tripMain, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new TripInfoMainComponent(events), RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new TripInfoCostComponent(events), RenderPosition.BEFOREEND);

render(menuControls, new ViewMenuComponent(), RenderPosition.AFTEREND);
render(tripControls, new TripFiltersComponent(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripEvents);
tripPresenter.init(events);
