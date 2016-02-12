"use strict";

import $ from 'jquery';

import { BigCalendar } from './big-calendar';
import { SmallCalendar } from './small-calendar';
import { EventPlugin } from './event-plugin';

let options = {
    period: 'week',
    line:   'day',
    column: 'hour',
    id:     'big-calendar'
}

let bigCalendar = new BigCalendar( options );

let smallCalendar = new SmallCalendar();

let events = new EventPlugin();