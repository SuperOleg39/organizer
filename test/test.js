"use strict";

import * as events from '../src/js/event-plugin';
import assert from 'assert';

console.log(events.getEventsData);

describe('events', () => {

    describe('#sum', () => {
        it('Должна вернуть сумму аргументов', () => {
            assert.equal(5, events.sum(3, 2));
        });
    });

});

