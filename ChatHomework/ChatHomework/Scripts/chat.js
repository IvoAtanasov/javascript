
/// <reference path="jquery-2.1.1.js" />
$(function () {
    var baseUrl = 'http://217.145.162.50/JSCourse/api/';
    var person = prompt("Please enter your name", "Anonymous");
    var currentRoom = -1;
    var getAllMessagesByRoom = function () {
        $.getJSON(baseUrl + "Messages?roomId=" + currentRoom, function (data) {
            var messages = "";
            var functionButtons = "";
            for (var i = 0; i < data.length; i++) {
                functionButtons = data[i].Author === person ? "<input type='image' src='Imiges/Edit.gif'id='" + data[i].Id + "'  width=18' height='18'  data-message='" + data[i].Message1 + "'> " + "<input type='image' src='Imiges/Delete.gif' id='" + data[i].Id + "'  width=18' height='18'>" : "";
                messages += data[i].Author + ":<b>" + data[i].Message1 + '</b>' + functionButtons + "</br>";
            }           
            $("#chatWindow").html(messages);
            $("input").on("click", function () {
                var src = $(this).attr("src");
                var messageID = $(this).attr("id");
                var newMessage = "";
                debugger
                if (src === "Imiges/Edit.gif") {
                    newMessage = prompt("Edit message", $(this).data("message").toString());
                    $.ajax({
                        url: baseUrl + "Messages/" + messageID,
                        dataType: "json",
                        type: "PUT",
                        data: {
                            Id: messageID,
                            RoomId: currentRoom,
                            Message1: newMessage,
                            Author: person,
                            Date: new Date().toJSON()
                        },
                        success: function () {
                            getAllMessagesByRoom();
                        }
                    })
                } else if (src === "Imiges/Delete.gif") {
                    $.ajax({
                        url: baseUrl + "Messages/" + messageID,
                        dataType: "json",
                        type: "Delete",
                        data: {
                            Id: messageID
                        },
                        success: function () {
                            getAllMessagesByRoom();
                        }
                    })
                }
            });

        });
    };
    (function GetRooms() {
        $.getJSON(baseUrl + "ChatRooms", function (data) {
            var i = 0, endloop = data.length;
            for ( i ; i < endloop; i++) {
                $("#chatRooms").append("<span class='btn' id='" + data[i].Id + "'>" + data[i].Name + "</span>");

            }
            $("span").on("click", function () {
                var roomID = $(this).attr("id");
                currentRoom = roomID;
                
                getAllMessagesByRoom();
            });
        });
    })();

    $("#btnPost").on("click", function () {
        var myMessage = {
            RoomId: currentRoom,
            Message1: $('#txtmessage').val(),
            Author: person,
            Date: new Date().toJSON()
        }

        $.post(baseUrl + 'Messages',
       myMessage,
       function () {
           getAllMessagesByRoom();
       });
    });



});