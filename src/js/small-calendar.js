"use strict";

export class SmallCalendar {
           // Initialize Calendar
           constructor() {
               createTable(getCurrentMonth() );
               addEvents();
           }
       }

// Get a current date
let map = new Map();

map.today   = new Date();
map.year    = map.today.getFullYear();
map.month   = map.today.getMonth();
map.day     = map.today.getDate();
map.newDate = new Date();  // for swich current Month

// Add events to button - switch next and prev Month
function addEvents() {
    let buttonPrev = document.getElementById( 'sc-prev-month' );
    let buttonNext = document.getElementById( 'sc-next-month' );
    buttonPrev.addEventListener("click", () => {
        createTable( getPrevMonth() );
    })
    buttonNext.addEventListener("click", () => {
        createTable( getNextMonth() );
    })
}

// return array of Days of the current Month
function getCurrentMonth() {
    appendTitle();
    return getDaysInMonth(map.month, map.year)
}

// return array of Days of the prev Month
function getPrevMonth() {
    map.newDate.setMonth(map.newDate.getMonth() - 1);
    appendTitle();
    return getDaysInMonth(map.newDate.getMonth(), map.newDate.getFullYear())
}

// return array of Days of the next Month
function getNextMonth() {
    map.newDate.setMonth(map.newDate.getMonth() + 1);
    appendTitle();
    return getDaysInMonth(map.newDate.getMonth(), map.newDate.getFullYear())
}

// Append title to table (Month and Year)
function appendTitle() {
    let monthTitle = document.getElementById( 'sc-month' );
    let yearTitle  = document.getElementById( 'sc-year' );
    let month = ['Январь','Февраль','Апрель','Март','Май','Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

    monthTitle.innerHTML = month[ map.newDate.getMonth() ];
    yearTitle.innerHTML  = map.newDate.getFullYear();
}

// Find a Table, create and append Tbody, if we have old Tbody - replace by a new
function createTable( days ) {
    let table    = document.getElementById('small-calendar');
    let tbody    = document.createElement('tbody');
    let oldTbody = table.getElementsByTagName('tbody');
    if ( oldTbody.length > 0 ) {
        table.replaceChild(tbody, oldTbody[0])
    } else {
        table.appendChild( tbody );
    }
    appendDaysToTable( days, tbody );
}

// Each Days array from getDaysInMonth() function, create and append Td
function appendDaysToTable( days, tbody ) {
    let check = 1;
    let tr;
    for ( let i = 0; i < days.length; i++ ) {
        let day = days[ i ].getDate();  // day of the Month
        let dayInWeek = days[ i ].getDay();  // day of the week number (Sunday is '0')
        let td = document.createElement('td');

        // Create Tr first, then create new Tr after new Sunday
        if ( check === 1 ) {
            tr = document.createElement('tr');
            tbody.appendChild( tr );

            if ( dayInWeek > 1 ) {  // If day is Tuesday and more, create empty Td
                appendEmptyTd( tr, (dayInWeek - 1) );
            } else if ( dayInWeek === 0 ) { // If day is Sunday, create six empty Td
                appendEmptyTd( tr, 6 );
            }

            // Stop create Tr
            check = 0;
        }

        // Append Td width day of the Month
        td.innerHTML = day;
        tr.appendChild( td );
        // Find current day of the Month
        if ( day === map.day
             && map.month === map.newDate.getMonth()
             && map.year === map.newDate.getFullYear() )
        {
            td.className += " current-day";
        }
        // Start create Tr
        if ( dayInWeek === 0 ) {
            check = 1;
        }
    }
}

// Append empty Td to Calendar
function appendEmptyTd( tr, max ) {
    for (let j = 0; j < max; j++) {
        let emptyTd = document.createElement('td');
        tr.appendChild( emptyTd );
    }
}

// return array of Days
function getDaysInMonth( month, year ) {
    let date = new Date( year, month, 1 );
    let days = [];
    while ( date.getMonth() === month ) {
        days.push( new Date( date ) );
        date.setDate( date.getDate() + 1 );
    }
    return days;
}