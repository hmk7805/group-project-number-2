
console.log( "Calendar loaded..." );

$("table").on("click", function(e) {
    console.log( e.target )
    setHourCellColor( e.target );
})

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