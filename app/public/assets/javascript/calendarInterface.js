'use strict';

const populateSchedule = function (schedule) {


    const url = `/api/v1/schedule/${schedule.id}`;
    $.ajax({
        method: "GET",
        url: url,
        dataType: 'json'
    }).done((data) => {
        console.log(data);
        $('#btnGroupVerticalDrop1').text(schedule.schedule_nm);
        console.log(schedule);
        console.log(`Setting current user schedule id to: ${schedule.id}`);
        calendar.userInfo.schedule_id = schedule.id;
        calendar.userInfo.schedule_nm = schedule.schedule_nm;
        calendar.userInfo.current_schedule_date = schedule.sched_date;
        calendar.setDateHeadings(moment(schedule.sched_date));
    });
}

const disableButtons = function() {
    const submitButton = (document.getElementsByClassName('btn btn-circle btn-outline green dropdown-toggle'))[0];
    const viewScheduleOverlay = (document.getElementsByClassName('btn btn-circle btn-outline blue dropdown-toggle'))[0];
    const clearButton = (document.getElementsByClassName('btn btn-circle btn-outline red dropdown-toggle'))[0];
    $(submitButton).addClass('hidden');
    $(viewScheduleOverlay).addClass('hidden');
    $(clearButton).addClass('hidden');

}

const enableButtons = function() {
    const submitButton = (document.getElementsByClassName('btn btn-circle btn-outline green dropdown-toggle'))[0];
    const viewScheduleOverlay = (document.getElementsByClassName('btn btn-circle btn-outline blue dropdown-toggle'))[0];
    const clearButton = (document.getElementsByClassName('btn btn-circle btn-outline red dropdown-toggle'))[0];
    $(submitButton).removeClass('hidden');
    $(viewScheduleOverlay).removeClass('hidden');
    $(clearButton).removeClass('hidden');

}


$(() => {
    disableButtons();
    let user = {};
    let company = {};
    //first ajax is to get the full user email address
    $.ajax({
        method: "GET",
        url: "/api/v1/getUserData",
        dataType: "json"
    }).done((data) => {
        console.log('first ajax complete');
        console.log(data);
        //gets us the full user info which links us to the company id
        $.ajax({
            method: "GET",
            url: `/api/v1/useremail/${data.email}`,
            dataType: "json"
        }).done((data) => {
            console.log('second ajax complete');
            console.log(data);
            user = data[0];
            if(user.type === 'E'){
                $('#schedule-name').addClass('hidden');
            } else {
                enableButtons();
            }
            $.ajax({
                method: "GET",
                url: `/api/v1/schedules/${data[0].co_id}`,
                dataType: "json"
            }).done((data) => {
                console.log('third ajax completed');
                console.log(data);
                // here we will perform our action with all of the schedules for a current company
                company = data;

                $('#schedule-dropdown').empty();
                data.forEach(schedule => {
                    let newSchedule = $('<li>').text(`Schedule: ${schedule.schedule_nm}`);
                    newSchedule.attr('id', `scheduleid-${schedule.id}`);
                    newSchedule.on('click', () => {
                        populateSchedule(schedule);
                        enableButtons();
                    });

                    $('#schedule-dropdown').prepend(newSchedule);

                });
            })
        })
    })
    //end of the triple ajax call for user data and populating the schedules
    const submitButton = (document.getElementsByClassName('btn btn-circle btn-outline green dropdown-toggle'))[0];
    console.log(submitButton);
    $(submitButton).on('click', (e) => {
        e.preventDefault();


        const firstDayOfWeek = ($('table thead tr'))[0].children[1].children[0].dataset.date;
        console.log(firstDayOfWeek);
        //const selectedHours = $('table tbody');
        //const rowArray = [].slice.call(selectedHours[0].childNodes);
        //console.log(rowArray);


        if ($('#schedule-name').val().trim() !== '') {
            calendar.userInfo.schedule_id = 0;
            calendar.userInfo.schedule_nm = $('#schedule-name').val().trim();
        }
        let currentHours = calendar.getSelectedHours();
        console.log(currentHours);

        if(currentHours.hours.length <= 0){
            console.log('no hours selected');
            return;
        }


        $.ajax({
            method: 'POST',
            url: '/api/v1/addsched',
            data: currentHours,
            dataType: 'json'
        }).done((response) => {
            console.log(response);
            calendar.userInfo.schedule_id = response.dtls[0].schedule_id;
            setTimeout(()=>{
                alert('Schedule successfully submitted!  Click the view to see current schedule Coverage/Availability/Requested Hours.');
                window.location.reload();
            }, 1000);
        });



    });
    const viewScheduleOverlay = (document.getElementsByClassName('btn btn-circle btn-outline blue dropdown-toggle'))[0];
    console.log(`Button to view things: ${viewScheduleOverlay}`);
    $(viewScheduleOverlay).on('click', (e) => {
        e.preventDefault();
        if(parseInt(calendar.userInfo.schedule_id) === 0 || !calendar.userInfo.schedule_nm){
            console.log('no data to enter');
            return;
        }

        $(".hour-selected").removeClass("hour-selected");
        $(".hour-tag").removeClass('covered');
        $(".hour-tag").removeClass('available');
        $(".hour-tag").removeClass('requested');

        let url = `/api/v1/schedule/${calendar.userInfo.schedule_id}`;
        $.ajax({
            method: 'GET',
            url: url,
            dataType: 'json'
        }).done((data) => {
            console.log(data);
            data.forEach(hour => {
                let timeBlock = calendar.findCellbyDateTime(hour.date, hour.hour);
                if(!timeBlock){
                    return;
                }
                if(hour.stat === 'C'){
                    //covered
                    timeBlock.addClass('covered');
                } else if (hour.stat === 'R'){
                    //needed but not covered
                    timeBlock.addClass('requested');
                } else {
                    //there is an employee available
                    timeBlock.addClass('available');
                }
            });
        });

        $('#logout-button').on('click', ()=>{
            console.log(`trying to logout`);
            logControl.logout();
        });

    });




});