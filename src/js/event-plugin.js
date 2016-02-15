"use strict";

export function sum(a, b) {
    return a + b;
}

export class EventPlugin {
           constructor() {
               initialization();
               document.addEventListener('dblclick', addNewEventToCalendar)
           }
       }

function checktypeOfCalendar() {
    let container = document.getElementById( 'big-calendar' );
    let contClass = container.className;

    switch ( contClass ) {
        case "month-table":
            return 'month';
        case "week-table":
            return 'week';
        case "workweek-table":
            return 'week';
        default:
            throw new Error("Календарь не определен");
    }
}

function initialization() {
    getEventsData( 'data/events.json' );
}

function addNewEventToCalendar(e) {
    if ( !e.target.classList.contains('date-container') ) return;

    let data = newEventData(e);

    foreachEvents( data );
}

function getEventsData( url ) {

    fetch( url )
        .then(function( response ) {
            if ( response.status !== 200 ) {
                console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                return;
            }

            response.json().then(function( data ) {
                foreachEvents( data.events );
            });
        })
        .catch(function( err ) {
            console.log('Fetch Error', err);
        });
}

function foreachEvents( data ) {
    let layout = document.querySelector( '.big-calendar-layout' );
    let events = [];
    let event, parent, options;

    for (let i = 0; i < data.length; i++) {
        event   = createEvent( data[ i ] || data );
        parent  = getEventParent( data[ i ] || data );

        if ( !!parent ) {
            options = getEventOptions( parent );

            event.parent = parent;

            addEventOptions( event, options );
            events.push( event );
            layout.appendChild( event );
        }
    }

    dragEvent( event, parent );

    if ( checktypeOfCalendar() === 'week' ) {
        resizeEvent( events, parent );
    }

    window.addEventListener('resize', resizeAllEvents)

}

function newEventData(e) {
    let data = {};
    let date = new Date();

    data.startHour    = e.target.getAttribute('hour')    || date.getHours();
    data.startMinutes = e.target.getAttribute('minutes') || '00';
    data.length       = 1;
    data.day          = e.target.getAttribute('day')     || date.getDay();
    data.date         = e.target.getAttribute('date')    || date.getDate();
    data.month        = e.target.getAttribute('month')   || date.getMonth();
    data.title        = 'Новое событие';

    return data;
}

export function createEvent( data ) {
    let event = document.createElement( 'div' );

    event.className = 'event-container';
    event.innerHTML = data.title;

    event.setAttribute( 'startHour',    data.startHour );
    event.setAttribute( 'startMinutes', data.startMinutes );
    event.setAttribute( 'length',       data.length );
    event.setAttribute( 'day',          data.day );
    event.setAttribute( 'date',         data.date );
    event.setAttribute( 'month',        data.month );

    return event;
}

function getEventParent( data ) {
    let container = document.getElementById( 'big-calendar' );
    let selectorWeek  = `.date-container[hour='${data.startHour}'][minutes='${data.startMinutes}'][date='${data.date}'][day='${data.day}']`;
    let selectorMonth = `.date-container[month='${data.month}'][date='${data.date}']`;
    let parent;

    if ( checktypeOfCalendar() === 'month' ) {
        parent  = container.querySelector( selectorMonth );
    } else if ( checktypeOfCalendar() === 'week' ) {
        parent  = container.querySelector( selectorWeek );
    }

    return parent;
}

function getEventOptions( parent ) {
    let width   = parent.offsetWidth;
    let height  = parent.offsetHeight;
    let posX    = parent.offsetLeft;
    let posY    = parent.offsetTop;
    let options = new Map();

    options.set('width',  width)
    options.set('height', height)
    options.set('posX',   posX)
    options.set('posY',   posY)

    return options;
}

function addEventOptions( event, options ) {
    event.style.width  = `${options.get( 'width' )}px`;
    event.style.height = `${options.get( 'height' ) * 2 * event.getAttribute( 'length' )}px`;
    event.style.left   = `${options.get( 'posX' )}px`;
    event.style.top    = `${options.get( 'posY' )}px`;

    if ( checktypeOfCalendar() === 'month' ) {
        event.style.height = `${options.get( 'height' )}px`;
    }

    return event;
}

function dragEvent( element, parent ) {
    let container  = document.getElementById( 'big-calendar' );
    let model      = container.querySelectorAll( '.date-container' );
    let modelFirst = model[0];
    let modelLast  = model[model.length- 1];
    let dragObject = {};

    function findTarget( element ) {
        for (let k = 0; k < model.length; k++) {
            if ( model[ k ].offsetLeft >= (element.offsetLeft - (element.offsetWidth * 0.5))
                 && model[ k ].offsetTop <= element.offsetTop + 5
                 && model[ k ].offsetTop >= element.offsetTop - 5 )
            {
                return model[ k ];
            }
        }
    }

    function onMouseDown(e) {
        if (e.which !== 1) return;

        let elem = e.target;

        if (elem.className !== element.className) return;

        dragObject.elem   = elem;
        dragObject.posX   = e.pageX;
        dragObject.posY   = e.pageY;
        dragObject.width  = elem.offsetWidth;
        dragObject.height = elem.offsetHeight;
    }

    function onMouseMove(e) {
        if (!dragObject.elem) return;

        let target      = findTarget( dragObject.elem );
        let stepX       = target.offsetWidth;
        let stepY       = target.offsetHeight;
        let elemOption  = dragObject.elem.getBoundingClientRect();

        if (e.pageX > elemOption.left + elemOption.width)
        {
            let newOffsetX = dragObject.elem.offsetLeft;

            dragObject.posX += stepX;
            newOffsetX      += stepX;

            if (e.target.hasAttribute( 'date' )) {
                newOffsetX = e.target.offsetLeft;
                dragObject.elem.style.width = `${e.target.offsetWidth}px`;
            }

            if ( newOffsetX <= modelLast.offsetLeft + modelLast.offsetWidth - 10 ) {
                dragObject.elem.style.left = `${newOffsetX}px`;
            }
        }
         else if (e.pageX < elemOption.left)
        {
            let newOffsetX = dragObject.elem.offsetLeft;

            dragObject.posX -= stepX;
            newOffsetX      -= stepX;

            if (e.target.hasAttribute( 'date' )) {
                newOffsetX = e.target.offsetLeft;
                dragObject.elem.style.width = `${e.target.offsetWidth}px`;
            }

            if ( newOffsetX >= modelFirst.offsetLeft - 10 ) {
                dragObject.elem.style.left = `${newOffsetX}px`;
            }
        }


        if (e.pageY > elemOption.top + stepY)
        {
            let newOffsetY = dragObject.elem.offsetTop;

            dragObject.posY += stepY;
            newOffsetY += stepY;

            if ( newOffsetY + dragObject.height <= modelLast.offsetTop + modelLast.offsetHeight + 10 ) {
                dragObject.elem.style.top = `${newOffsetY}px`;
            }
        }
         else if (e.pageY < elemOption.top)
        {
            let newOffsetY = dragObject.elem.offsetTop;

            dragObject.posY -= stepY;
            newOffsetY -= stepY;

            if ( newOffsetY >= modelFirst.offsetTop - 10 ) {
                dragObject.elem.style.top = `${newOffsetY}px`;
            }
        }

        dragObject.lastTarget = target;
    }

    function onMouseUp(e) {
        if (!dragObject.elem) return;

        let lastTarget = findTarget( dragObject.elem );
        let elem       = dragObject.elem;

        if ( dragObject.lastTarget ) {
            elem.parent = lastTarget;

            elem.setAttribute( 'startHour',    lastTarget.getAttribute( 'hour' )    || elem.getAttribute( 'hour' ));
            elem.setAttribute( 'startMinutes', lastTarget.getAttribute( 'minutes' ) || elem.getAttribute( 'minutes' ));
            elem.setAttribute( 'day',          lastTarget.getAttribute( 'day' )     || elem.getAttribute( 'day' ));
            elem.setAttribute( 'date',         lastTarget.getAttribute( 'date' )    || elem.getAttribute( 'date' ));
            elem.setAttribute( 'month',        lastTarget.getAttribute( 'month' )   || elem.getAttribute( 'month' ));

        }

        dragObject = {};
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}


function resizeEvent( elements, parent ) {
    let container  = document.getElementById( 'big-calendar' );
    let model      = container.querySelectorAll( '.date-container' );
    let modelFirst = model[0];
    let modelLast  = model[model.length- 1];
    let resizeObject = {};
    let element;
    let ancor;

    if ( elements.length === 0 ) return;

    for ( let i = 0; i < elements.length; i++ ) {
        ancor = document.createElement( 'div' );
        ancor.className = 'resize-ancor';

        elements[ i ].appendChild( ancor );
    }

    function onMouseDown(e) {
        if (e.which != 1) return;

        let elem = e.target.parentElement;

        if (elem.className !== ancor.parentElement.className) return;

        resizeObject.elem   = elem;
        resizeObject.height = elem.offsetHeight;
    }

    function onMouseMove(e) {
        if (!resizeObject.elem) return;

        let step = modelFirst.offsetHeight;
        let elemOption = resizeObject.elem.children[0].getBoundingClientRect();

        if (e.pageY > elemOption.top + step)
        {
            let newHeight = resizeObject.elem.offsetHeight;

            resizeObject.height += step;
            newHeight += step;

            if ( newHeight + resizeObject.elem.offsetTop <= modelLast.offsetTop + modelLast.offsetHeight + 10 ) {
                resizeObject.elem.setAttribute( 'length', (+resizeObject.elem.getAttribute( 'length' ) + 0.5) );
                resizeObject.elem.style.height = `${newHeight}px`;
            }
        }
         else if (e.pageY < elemOption.top)
        {
            let newHeight = resizeObject.elem.offsetHeight;

            resizeObject.height -= step;
            newHeight -= step;

            if ( newHeight >= modelFirst.offsetTop - 10 ) {
                resizeObject.elem.setAttribute( 'length', (+resizeObject.elem.getAttribute( 'length' ) - 0.5) );
                resizeObject.elem.style.height = `${newHeight}px`;
            }
        }
    }

    function onMouseUp(e) {
        if (!resizeObject.elem) return;

        resizeObject = {};
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

function resizeAllEvents() {
    let events = document.querySelectorAll( '.event-container' );
    let event, parent, options;

    for ( let i = 0; i < events.length; i++ ) {
        event   = events[ i ];
        parent  = event.parent;
        options = getEventOptions( parent );

        addEventOptions( events[ i ], options )
    }
}