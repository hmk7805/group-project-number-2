
const calendar = {

    init: function() {

        this.setCalendarClicks();

        this.datePickerInit();

        this.setDateHeadings( moment() );

        this.activateDateHeadings();

        this.pullUserInfoToTheFrontEnd();
    },

    setCalendarClicks: function() {
        $("table").on("click", "*", function(e) {

            if ( $(e.target).hasClass( "top-left" ) ) {
                calendar.flipAllHours()
            } 

            if ( $(e.target).hasClass( "hour" ) ) {
                calendar.flipHourRow(e.target);
            }
        
            if ( $(e.target).hasClass( "day-head" ) ) {
                calendar.flipDayCellColor( e.target );
            }
            
            if ( $( e.target ).hasClass("hour-tag") ) {
                calendar.setHourCellColor( e.target );
            }
        });

        const clearButton = (document.getElementsByClassName('btn btn-circle btn-outline red dropdown-toggle'))[0];

        $(clearButton).on("click", function(e) {
            console.log( "Clearing the calendar" );
            $(".hour-selected").removeClass("hour-selected")
        });

        // Hack to add an ID to schedule name and add the place holder
        let sched = $("input[value='Schedule Name']")
        $(sched).attr("ID",'schedule-name');  
        $(sched).attr("placeholder", "Schedule Name");
        $(sched).attr("value","");

    },

    userInfo: {},

    pullUserInfoToTheFrontEnd: function() {
        let email = getCookie( "userEmail" );
        console.log( "Email cookie is: ", email );
        $.ajax( {
            method: "GET",
            url: "/api/v1/useremail/" + email
        }).done( (resp) => {
            console.log( "ACCOUNT RESPONSE: ", resp );
            calendar.userInfo.userID      = resp[0].id;
            calendar.userInfo.userName    = resp[0].user_name;
            calendar.userInfo.coID        = resp[0].co_id,
            calendar.userInfo.companyName = resp[0].company_name;
            calendar.userInfo.email       = resp[0].email;
            calendar.userInfo.name        = resp[0].name;
            calendar.userInfo.phone       = resp[0].phone;
            calendar.userInfo.address     = resp[0].address;
            calendar.userInfo.city        = resp[0].city;
            calendar.userInfo.state       = resp[0].state;
            calendar.userInfo.zip         = resp[0].zip;
            calendar.userInfo.img         = resp[0].img;
            calendar.userInfo.type        = resp[0].type;
            calendar.userInfo.schedule_id = 0;
            calendar.userInfo.schedType   = resp[0].type === 'A' ? 'R' : 'A';
            console.log( calendar.userInfo );
        })
    },

    activateDateHeadings: function() {
        $("#datepicker").on( "change", function(e) {
            calendar.setDateHeadings( moment( e.currentTarget.value ) );
        })
    },

    setDateHeadings: function( dt ) {
        dt = moment( dt.format('YYYY-MM-DD'));
        let dow = dt.isoWeekday();
        dt.subtract( dow - 1, 'days' );
        console.log( "Start of week = ", dt.format('YYYY-MM-DD') );
        for ( let i = 1; i<8; i++ ) {
            let $dheader = $(".day-head[data-day-head='" + i + "'] span")[0];
            $dheader.innerHTML = dt.format( "M/D/YY" );
            $($dheader).attr("data-date", dt.format('YYYY-MM-DD'));
            dt.add( 1, 'days' );
        }
    },

    flipDayCellColor: function( target ) {
        var day = $(target).attr("data-day-head");
        $(".hour-tag[data-day='" + day + "']").each( function( i, cell ) {
            calendar.setHourCellColor( cell );
        })
    },

    flipHourRow: function (target) {
        $(target).siblings("td.hour-tag").each( function( i, cell ) { calendar.setHourCellColor( cell ) } )
    },

    flipAllHours: function () {
        $(".hour-tag").each( function( i, cell ) { calendar.setHourCellColor( cell ) } );
    },

    setHourCellColor: function ( target ) {
        if( target.dataset.selected === "0" ) {
            $(target).addClass( "hour-selected" );;
            target.dataset.selected = "1";
        } else {
            $(target).removeClass( "hour-selected" );
            target.dataset.selected = "0";
        }
    },

    getSelectedHours: function() {
        let hours = { 
            "schedule": {
                "schedule_nm": $("#schedule-name").val(),
                "co_id": calendar.userInfo.coID,
                "user_id": calendar.userInfo.userID,
                "type": calendar.userInfo.schedType,
                "schedule_id": calendar.userInfo.schedule_id

            },
            hours: []
        };
        $(".hour-selected").each( function( i, cell ) {
            console.log( i, cell );
            let newTime = {};
            newTime.date = $(".day[data-name='day-" + cell.dataset.day + "'").attr('data-date')
            newTime.hour = cell.dataset.hour.split(":")[0];
            hours.hours.push( newTime );
        });

        console.log( JSON.stringify( hours, null, 2 ) );

        return hours;
    },

    resetAllhours: function() {
        $(".hour-tag").each( function( i, cell ) {
            $(cell)[0].dataset.selected = "0";
            $(cell).removeClass("hour-selected");
        })
    },

    datePickerInit: function () {
        $("#datepicker").datepicker();
        $("#format").on("change", function () {
            $("#datepicker").datepicker("option", "dateFormat", $(this).val());
        });

        $("#datepicker").on("change", function(e) {
            console.log( "Date: ", e );
            console.log( $(e).attr("timestamp") );
        });

        $( "#datepicker" ).datepicker( "option", "changeMonth", true );
    },

    findCellbyDateTime: function ( pDate, pTime ) {
        let hptr = $(".day[data-date='" + pDate + "']").attr("data-name");        // Grab the 'dat-#' value from the header with the corresponding date
        let dayIndex = hptr.split( "-" )[1];                                      // Strip the 'day-' part off so you are left with the numeric value 

        // select the cell with the corresponding hour and dayIndex 
        let cellPtr = $(".hour-tag[data-day='" + dayIndex + "'][data-hour='" + pTime + ":00']");   

        // Returns a jQuery result set, so you can wrap it like this: $(findCellbyDateTime( '2017-03-27', '1' )).css("background-color","green")
        return cellPtr;
    }
} 

const logControl = {

    logout: function() {
        $.ajax( {
            method: "POST",
            url: "/logout"
        }).done( function() {
            console.log( "Logged out." );
        })
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(()=> {
    calendar.init();
})

