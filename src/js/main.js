"use strict";

import $ from 'jquery';

import { BigCalendar } from './big-calendar';
import { SmallCalendar } from './small-calendar';
import { EventPlugin } from './event-plugin';

let options = {
    period: 'week',
    line:   'day',
    column: 'hour',
    parent: 'big-calendar',
    id:     'big-calendar'
}

let secondOptions = {
    period:    'month',
    line:      'day',
    column:    'hour',
    parent:    'small-calendar',
    id:        'small-calendar',
    titleType: 'short'
}

let bigCalendar = new BigCalendar( options );
let newSmallCalendar = new BigCalendar( secondOptions );

let smallCalendar = new SmallCalendar();

let events = new EventPlugin();