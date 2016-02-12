

import bc from './big-calendar';
import sc from './small-calendar';
import ep from './event-plugin';


let options = {
    period: 'week',
    line:   'day',
    column: 'hour',
    id:     'big-calendar'
}

let bigCalendar = new BigCalendar.Calendar( options );

let events = new EventPlugin.Events();