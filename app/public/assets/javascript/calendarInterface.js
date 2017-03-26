'use strict';

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
                
            })
        })
    })
//end of the triple ajax call for user data and populating the schedules

    $('#submit-schedule').on('click', (e) => {
        e.preventDefault();
        const selectedHours = $('#selected-hours');
        const rowArray = [].slice.call(selectedHours[0].childNodes);
        console.log(rowArray);
        let userSelection = {
            "rows": [
                
            ]
        };
        rowArray.forEach(row => {
            if(row.nodeName === "TR"){
                const tdArray = [].slice.call(row.childNodes);
                console.log(tdArray);
                for(let i = 3; i < tdArray.length; i++){
                    if(tdArray[i].nodeName === 'TD'){

                    }
                }

            }
        })
    });




});