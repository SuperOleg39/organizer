"use strict";

import * as events from '../src/js/event-plugin';
import jsdom from 'jsdom';
import chai from 'chai';

const expect  = chai.expect;
const assert  = chai.assert;
chai.should();

let doc = jsdom.jsdom( '<!doctype html><html><body></body></html>' );
let win = doc.defaultView;
global.document = doc;
global.window   = win;
global.self     = global;
global.chai     = chai;
global.expect   = expect;


describe('events', () => {

    let data = {
        "title"         : "Событие 1",
        "startHour"     : 1,
        "startMinutes"  : "00",
        "length"        : 1.5,
        "day"           : 1,
        "date"          : 8,
        "month"         : 1
    }

    describe('#sum', () => {
        it('Возвращает сумму аргументов', () => {
            assert.equal(5, events.sum(3, 2));

            events.sum(3, 2).should.be.a('number');
            events.sum(3, 2).should.equal(5);

            expect( events.sum(3, 2) ).to.be.a('number');
            expect( events.sum(3, 2) ).to.equal(5);
        });
    });

    describe('#createEvent', () => {
        it('Создает DOM элемент', () => {
            events.createEvent( data ).should.have.property('nodeName');
        });
    });

});

