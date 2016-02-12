export default (function( globalContext, libraryName ){
    "use strict";

    let libraryContext = {};


    (function( moduleName ) {


        /**
         * Map stores current date
         * @type {Map}
         */
        let map = new Map();

        map.set('today',   new Date())
           .set('year',    map.get('today').getFullYear())
           .set('month',   map.get('today').getMonth())
           .set('day',     map.get('today').getDate())
           .set('weekday', map.get('today').getDay())
           .set('newDate', new Date())

        /** * @type {Symbol} - Private const period */
        const $period = Symbol( "Calendar::Period" );
        /** * @type {Symbol} - Private const line */
        const $line   = Symbol( "Calendar::Line" );
        /** * @type {Symbol} - Private const column */
        const $column = Symbol( "Calendar::Column" );
        /** * @type {Symbol} - Private const id */
        const $id     = Symbol( "Calendar::Id" );
        /** * @type {Symbol} - Private const result */
        const $result = Symbol( "Calendar::Result" );


        /** Class create a Calendar */
        class Calendar {
            /**
             * Create a new Calendar
             * @param  {Object} options
             */
            constructor( options ) {
                handleInputArguments( options );

                this[ $period ] = 'workweek';
                this[ $line ]   = 'day';
                this[ $column ] = 'hour';
                this[ $id ]     = 'calendar';
                this[ $result ] = [];

                this.period = options.period;
                this.line   = options.line;
                this.column = options.column;
                this.id     = options.id;
                this.result = switchPeriod.call( this );

                this.titleList = getTitleList.call( this );
                this.hourList  = getHourList();

                createTable.call( this );
            }

            /**
             * Get the period value
             * @return {string} period - calendar period
             */
            get period() {
                return this[ $period ];
            }
            /**
             * Get the line value
             * @return {string} line - calendar title (first tr)
             */
            get line() {
                return this[ $line ];
            }
            /**
             * Get the column value
             * @return {string} column - calendar title (first td)
             */
            get column() {
                return this[ $column ];
            }
            /**
             * Get the id value
             * @return {string} id - calendar table id
             */
            get id() {
                return this[ $id ];
            }
            /**
             * Get the result value
             * @return {Array}
             */
            get result() {
                return this[ $result ];
            }

            /**
             * Set the period value
             * @param  {string} value - new value from constructor options
             * @return {string} period - calendar period
             */
            set period( value ) {
                if ( value ) {
                    this[ $period ] = value;
                }
            }
            /**
             * Set the line value
             * @param  {string} value - new value from constructor options
             * @return {string} line - calendar title (first tr)
             */
            set line( value ) {
                if ( value ) {
                    this[ $line ] = value;
                }
            }
            /**
             * Set the column value
             * @param  {string} value - new value from constructor options
             * @return {string} column - calendar title (first td)
             */
            set column( value ) {
                if ( value ) {
                    this[ $column ] = value;
                }
            }
            /**
             * Set the id value
             * @param  {string} value - new value from constructor options
             * @return {string} id - calendar table id
             */
            set id( value ) {
                if ( value ) {
                    this[ $id ] = value;
                }
            }
            /**
             * Set the result value
             * @param  {Array} value
             * @return {Array} result
             */
            set result( value ) {
                if ( value ) {
                    this[ $result ] = value;
                }
            }
        }

        /**
         * @return {Array} days - array of Days from Period
         */
        function switchPeriod() {
            switch ( this.period ) {
                case 'month':
                    return getDaysInMonth( map.get('today'), map.get('year'), map.get('month') );
                case 'week':
                    return getDaysInWeek( map.get('today'), 6 );
                case 'workweek':
                    return getDaysInWeek( map.get('today'), 4 );
                default:
                    throw new Error("Неверный период");
            }
        }

        /**
         * Check input Options
         * @param  {Object} args - Options object
         */
        function handleInputArguments( args ) {
            for (const i in args) {
                switch ( i ) {
                    case 'period':
                        break;
                    case 'line':
                        break;
                    case 'column':
                        break;
                    case 'id':
                        break;
                    default:
                        throw new Error("Неверный агрумент");
                }
            }
        }

        /**
         * Create a Table and switch period
         */
        function createTable() {
            let container   = document.querySelector('.big-calendar');
            let table       = document.createElement('table');
            table.id        = this.id;
            table.className = `${this.period}-table`;

            switch ( this.period ) {
                case 'workweek':
                    createWeekTable( table, this.titleList, this.hourList, this.result );
                    checkCurrentTimeAndAppendMark( table, 'hour-td', 'time-arrow' );
                    checkCurrentTimeAndAppendMark( table, 'current-day', 'time-line' );
                    break;
                case 'week':
                    createWeekTable( table, this.titleList, this.hourList, this.result );
                    checkCurrentTimeAndAppendMark( table, 'hour-td', 'time-arrow' );
                    checkCurrentTimeAndAppendMark( table, 'current-day', 'time-line' );
                    break;
                case 'month':
                    createMonthTable( table, this.result, this.titleList );
                    break;
                default:
                    throw new Error("Период повторно не верен!");
            }

            container.className += ` ${this.period}-container`;
            container.appendChild( table );
        }

        /**
         * Get current time, create and append Mark at respective positions
         * @param  {[type]} table     - parent Table
         * @param  {[type]} tdClass   - parent Td
         * @param  {[type]} markClass - class name for Mark
         */
        function checkCurrentTimeAndAppendMark( table, tdClass, markClass ) {
            let id, topPos;
            let td      = table.querySelectorAll( `.${tdClass}` );
            let hours   = map.get('today').getHours();
            let minutes = map.get('today').getMinutes();

            let oldArrow    = table.querySelector( `.${markClass}` );
            let arrow       = document.createElement('div');
            arrow.className = markClass;

            if ( minutes === 0 )
            {
                id = hours * 2;
                topPos = 0;
            }
             else if ( minutes < 30 )
            {
                id = hours * 2;
                topPos = 100 / 30 * minutes;
            }
             else if ( minutes === 30 )
            {
                id = hours * 2 + 1;
                topPos = 0;
            }
             else if ( minutes > 30 )
            {
                id = hours * 2 + 1;
                topPos = 100 / 30 * (minutes - 30);
            }

            arrow.style.top = `${topPos}%`;

            td[ id ].className += ' current-time';
            td[ id ].appendChild( arrow );
        }

        /**
         * Create a Table structure in a Week and WorkWeek period
         * @param  {Object} table     - parent Table
         * @param  {Object} titleList - List of date and work day
         * @param  {Array}  hourList  - Array of hours of the day
         */
        function createWeekTable( table, titleList, hourList, days ) {
            let trAmount = hourList.hours.length;
            let tdAmount = titleList[0].length;
            let titleTr  = document.createElement('tr');
            let emptyTd  = document.createElement('td');

            titleTr.appendChild( emptyTd );
            table.appendChild( titleTr );
            for (let i = 0; i < trAmount; i++) {
                let tr       = document.createElement('tr');
                let td       = document.createElement('td');
                td.className = 'hour-td';
                if ( hourList.minutes[ i ] === '00' ) {
                    td.innerHTML = `<span>${hourList.time[ i ]}</span>`;
                }

                tr.appendChild( td );
                tr.setAttribute( 'hour', hourList.hours[ i ] );
                tr.setAttribute( 'minutes', hourList.minutes[ i ] );

                addEventsToTd(tr, tdAmount, titleList[0], days);

                table.appendChild( tr );
            }

            for (let j = 0; j < tdAmount; j++) {
                let td       = document.createElement('td');
                td.className = 'clearfix';
                td.innerHTML = `<span class="pull-left">${titleList[1][ j ]}</span> <span class="pull-right">${titleList[0][ j ]}</span>`;

                if ( titleList[0][ j + 1 ] === map.get('day') ) {
                    td.className += ' title-current-day'
                }

                titleTr.appendChild( td );
            }
        }

        /**
         * Create a Table structure in a Month period
         * @param  {Object} table     - parent Table
         * @param  {Array}  days      - Array of days
         * @param  {Object} titleList - List of date and work day
         */
        function createMonthTable( table, days, titleList ) {
            let check    = 1;
            let titleTr  = document.createElement('tr');
            let tr;

            for (let j = 0; j < 7; j++) {
                let td       = document.createElement('td');
                td.innerHTML = `${titleList[1][ j ]}`;

                titleTr.appendChild( td );
            }

            table.appendChild( titleTr );

            for ( let i = 0; i < days.length; i++ ) {
                let day = days[ i ].getDate();  // day of the Month
                let dayInWeek = days[ i ].getDay();  // day of the week number (Sunday is '0')
                let td = document.createElement('td');

                // Create Tr first, then create new Tr after new Sunday
                if ( check === 1 ) {
                    tr = document.createElement('tr');
                    table.appendChild( tr );

                    // if ( dayInWeek > 1 ) {  // If day is Tuesday and more, create empty Td
                    //     appendEmptyTd( tr, (dayInWeek - 1) );
                    // } else if ( dayInWeek === 0 ) { // If day is Sunday, create six empty Td
                    //     appendEmptyTd( tr, 6 );
                    // }

                    // Stop create Tr
                    check = 0;
                }

                td.className = 'date-container';
                td.setAttribute('date',  days[i].getDate());
                td.setAttribute('month', days[i].getMonth());

                // Append Td width day of the Month
                if ( days[ i ].getMonth() !== map.get('month') ) {
                    td.className += ' other-month';
                } else {
                }

                td.innerHTML = `<span class="date-wrap">${day}</span>`;

                // Check current day
                if ( days[ i ].getDate() === map.get('day')
                     && days[ i ].getMonth() === map.get('month')
                     && days[ i ].getFullYear() === map.get('year') )
                {
                    td.className += ' current-day'
                }

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

        /**
         * Append empty Td to Table
         * @param  {Object} tr  - parent Tr
         * @param  {number} max - how much Td append to Tr
         */
        // function appendEmptyTd( tr, max ) {
        //     for (let j = 0; j < max; j++) {
        //         let emptyTd = document.createElement('td');
        //         tr.appendChild( emptyTd );
        //     }
        // }

        /**
         * Append Td to Table
         * @todo Add events with Td
         * @param {Object} tr     - parent Tr
         * @param {number} amount - how much Td append to Tr
         */
        function addEventsToTd( tr, amount, date, days ) {
            for (let i = 0; i < amount; i++) {
                let td = document.createElement('td');

                td.className = 'date-container';
                td.setAttribute('hour',    tr.getAttribute('hour'));
                td.setAttribute('minutes', tr.getAttribute('minutes'));
                td.setAttribute('day',     days[i].getDay());
                td.setAttribute('date',    days[i].getDate());

                if ( date[ i ] === map.get('day') ) {
                    td.className += ' current-day'
                }

                tr.appendChild( td );
            }
        }

        /**
         * Get list of Title (tr title)
         * @return {Object} titleList
         */
        function getTitleList() {
            let dayList     = [];
            let workDayList = [];
            let weekDay     = ['Воскресенье', 'Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];

            for (let i = 0; i < this.result.length; i++) {
                let day     = this.result[ i ].getDate();
                let workDay = this.result[ i ].getDay();

                dayList.push( day );
                workDayList.push( weekDay[ this.result[ i ].getDay() ] );
            }

            return [ dayList, workDayList ];
        }

        /**
         * Get list of Hours (td title)
         * @return {Array} hourList
         */
        function getHourList() {
            let d = new Date();
            let timeList     = {};
            let hoursList    = [];
            let minutesList  = [];
            let showTimeList = [];

            d.setHours(0);
            d.setMinutes(0);

            for (let i = 0; i < 48; i++) {
                let hours   = d.getHours() === 0 ? '00' : d.getHours();
                let minutes = d.getMinutes() === 0 ? '00' : d.getMinutes();
                let showTime    = `${hours}:${minutes}`;

                hoursList.push( hours );
                minutesList.push( minutes );
                showTimeList.push( showTime );

                timeList['hours'] = hoursList;
                timeList['minutes'] = minutesList;
                timeList['time'] = showTimeList;

                d.setMinutes(d.getMinutes() + 30);
            }
            console.log(timeList)

            return timeList;
        }

        /**
         * @param  {Object} today - current new Date() object
         * @return {Array}  days - array of Days from Month
         */
        function getDaysInMonth( today ) {
            let date = today;
            let days = [];

            date.setDate( 1 );

            if ( date.getDay() !== 1 ) {
                let count = date.getDay() - 1;
                date.setDate( date.getDate() - count );

                for ( let i = 0; i < count; i++ ) {
                    days.push( new Date( date ) );
                    date.setDate( date.getDate() + 1);
                }
            }

            while ( date.getMonth() === map.get('month') ) {
                days.push( new Date( date ) );
                date.setDate( date.getDate() + 1 );
            }

            if ( date.getDay() < 7 && date.getDay() > 1 ) {
                let count = 7 - date.getDay();

                for ( let i = 0; i <= count; i++ ) {
                    days.push( new Date( date ) );
                    date.setDate( date.getDate() + 1 );
                }
            } else if (date.getDay() === 0) {
                days.push( new Date( date ) );
            }

            return days;
        }

        /**
         * @param  {Object} today - current new Date() object
         * @param  {number} amount - index of last day a period (work week - five days, week - seven days)
         * @return {Array} days - array of Days from Week
         */
        function getDaysInWeek( today, amount ) {
            let date = today;
            let days = [];

            date.setDate( date.getDate() - date.getDay() );

            for (let i = 0; i <= amount; i++) {
                date.setDate( date.getDate() + 1 );
                days.push( new Date( date ) );
            }

            return days;
        }


        libraryContext[ moduleName ] = Calendar;

    })( "Calendar" );

    globalContext[ libraryName ] = libraryContext;

})( window, 'BigCalendar' )