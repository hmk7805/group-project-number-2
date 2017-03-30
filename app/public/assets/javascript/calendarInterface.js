'use strict';

const populateSchedule = function(schedule){
    const url = `/api/v1/schedule/${schedule.id}`;
    $.ajax({
        method: "GET",
        url: url,
        dataType: 'json'
    }).done((data) => {
        console.log(data);
        $('#btnGroupVerticalDrop1').text(schedule.schedule_nm);
        console.log(`Setting current user schedule id to: ${schedule.id}`);
        calendar.userInfo.schedule_id = schedule.id;
        calendar.userInfo.schedule_nm = schedule.schedule_nm;
    });
}

$(() => {
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
                    let newSchedule = $('<li>').text(`Schedule: ${schedule.schedule_nm} || Schedule ID: ${schedule.id}`);
                    newSchedule.attr('id', `scheduleid-${schedule.id}`);
                    newSchedule.on('click', () => {
                        populateSchedule(schedule);
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

        
        if($('#schedule-name').val().trim() !== ''){
            calendar.userInfo.schedule_id = 0;
            calendar.userInfo.schedule_nm = $('#schedule-name').val().trim();
        }
        let currentHours = calendar.getSelectedHours();
        console.log(currentHours);

        $.ajax({
            method: 'POST',
            url: '/api/v1/addsched',
            data: currentHours,
            dataType: 'json'
        }).done((response) => {
            console.log(response);
            calendar.userInfo.schedule_id = response.dtls[0].schedule_id;
        });

        // rowArray.forEach(row => {
        //     if(row.nodeName === "TR"){
        //         const tdArray = [].slice.call(row.childNodes);
        //         console.log(tdArray);
        //         for(let i = 3; i < tdArray.length; i++){
        //             if(tdArray[i].nodeName === 'TD'){//add checks for if the user marked it available
        //                 //need to post with the following:
        //                 //user.id , day of the week it's associated with in date format
        //                 //the specific hour, the schedule id
        //                 console.log(tdArray[i]);
        //             }
        //         }

        //     }
        // })
    });




});