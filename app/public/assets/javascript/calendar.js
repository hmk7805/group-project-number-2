
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
    },

    userInfo: {},

    pullUserInfoToTheFrontEnd: function() {
        let email = getCookie( "userEmail" );
        console.log( "Email cookie is: ", email );
        $.ajax( {
            method: "GET",
            url: "/api/v1/useremail/" + email
        }).done( (resp) => {
            console.log( resp );
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
                "name": "MySchedule",
                "co_id": 1,
                "user_id": 1
            },
            hours: []
        };
        $(".hour-selected").each( function( i, cell ) {
            console.log( i, cell );
            let newTime = {};
            newTime.type = 'R';  // Should be "R" or "A"
            newTime.day = cell.dataset.day;
            newTime.hour = cell.dataset.hour.split(":")[0];
            hours.hours.push( newTime );
        });

        console.log( JSON.stringify( hours, null, 2 ) );
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