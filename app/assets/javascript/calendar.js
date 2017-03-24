
console.log( "Calendar loaded..." );

$("table").on("click", function(e) {

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
    $(".hour-selected").each( function( i, cell ) {
        console.log( i, cell );
    })
}

function resetAllhours() {
    $(".hour-tag").each( function( i, cell ) {
        $(cell)[0].dataset.selected = "0";
        $(cell).removeClass("hour-selected");
    })
}