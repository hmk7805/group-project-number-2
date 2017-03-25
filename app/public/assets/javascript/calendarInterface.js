'use strict';

$(() => {
    //first ajax is to get the full user email address
    $.ajax({
        method: "GET",
        url: "/getUserInfo",
        dataType: "json"
    }).done((data) => {
        //gets us the full user info which links us to the company id
        $.ajax({
            method: "GET",
            url: `/api/v1/user/${data.email}`,
            dataType: "json"
        }).done((data) => {
            $.ajax({
                method: "GET",
                url: `/api/v1/schedules/${data.co_id}`,
                dataType: "json"
            }).done((data) => {
                // here we will perform our action with all of the schedules for a current company
                
            })
        })
    })




});