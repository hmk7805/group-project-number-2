
console.log( "Calendar loaded..." );

$("table").on("click", "*", function(e) {

    if ( $(e.target).hasClass( "top-left" ) ) {
        flipAllHours()
    } 

    if ( $(e.target).hasClass( "hour" ) ) {
        flipHourRow(e.target);
    }
 
    if ( $(e.target).hasClass( "day-head" ) ) {
        flipDayCellColor( e.target );
    }
    
    if ( $( e.target ).hasClass("hour-tag") ) {
        setHourCellColor( e.target );
    }

})

function flipDayCellColor( target ) {
    console.log( target );
    var day = $(target).attr("data-day-head");
    $(".hour-tag[data-day='" + day + "']").each( function( i, cell ) {
        setHourCellColor( cell );
    })
}

function flipHourRow(target) {
    $(target).siblings("td.hour-tag").each( function( i, cell ) { setHourCellColor( cell ) } )
}

function flipAllHours() {
    $(".hour-tag").each( function( i, cell ) { setHourCellColor( cell ) } );
}

function setHourCellColor( target ) {
    if( target.dataset.selected === "0" ) {
        $(target).addClass( "hour-selected" );;
        target.dataset.selected = "1";
    } else {
        $(target).removeClass( "hour-selected" );
        target.dataset.selected = "0";
    }
}

function getSelectedHours() {
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
}

function resetAllhours() {
    $(".hour-tag").each( function( i, cell ) {
        $(cell)[0].dataset.selected = "0";
        $(cell).removeClass("hour-selected");
    })
}

$(function () {
    $("#datepicker").datepicker();
    $("#format").on("change", function () {
        $("#datepicker").datepicker("option", "dateFormat", $(this).val());
    });
});

$("#datepicker").on("change", function(e) {
    console.log( "Date: ", e );
    console.log( $(e).attr("timestamp") );
})