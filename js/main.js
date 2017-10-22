
"use strict";
//callback fv az esemény után
//function fadeDown(){console.log(this);};
//eseménykezelő beállítása
//$("p").click(function(){
//$(this).slideDown(3500).slideUp(2000);
//$(this).slideDown(3500).css("color","blue");
//$(this).fadeTo(5000,1,fadeDown)
//});
//esemény kiváltása
//$("p").click();



//kattintás megelőzése
$("a.nav-link").click(function (ev) {
    ev.preventDefault();
    startPageChange(this);
})

function startPageChange(elem) {
    var link = $(elem);
    var prop = link.data("prop") || "opacity";
    var val = link.data("value") || "0";
    var speed = link.data("speed") || 1000;
    var settings = {};
    settings[prop] = val;
    $(document.body).animate(settings, speed, function () {
        document.location = link.attr("href");
    })
}


$(".events-search-row input").on("keyup", function (ev) {
    $.each($(".events-card-deck .card .card-title"), function (index, elem) {
        elem = $(elem);
        var search = ev.target.value.toLowerCase();
        var content = elem.html().toLowerCase();
        if (content.indexOf(search) == -1) {
            elem.parents(".card").hide();
        } else {
            elem.parents(".card").show();
        }
    });
});

//regiszter oldal
$(".cherry-custom-file").on("change", function (ev) {
    $(this).find(".file-name").html(ev.target.value.split("\\").pop())
        ;
})


//tickets oldal
var alertBox = $('.alert.alert-primary')
function showInvalidMessage() {
    alertBox
        .removeClass('alert-primary')
        .addClass('alert-danger')
        .find('.alert-message')
        .text('sikertelen')
};

$('[data-toggle="tooltip"]').tooltip();

//jquery plugin for send form data
$.fn.sendForm = function () {         //fn-hez kell adni = function

    var form = $(this);         //űrlap amiről meghívtuk
    var action = form.attr("action");   //getter  - kiveszi az action attribútumot  - ez az url!!
    var method = form.attr("method") || "post";  // ha nem volt megadva a htmlben a method
    var callBack = form.attr("callBack");

    function checkFormItem(input){
        input = $(input);
        if (input.attr("required") && input.val()==""){
            input.parents(".form-group").addClass("invalid");
            return false;
        }else{
            input.parents(".form-group").removeClass("invalid");
        }
        return true;
    };

    form.on("submit", function (ev) {      //submit eseményt figyeli
        ev.preventDefault();                //megállítja az eseményt
        var formData = {};                    // változó
        var formIsValid = [];
        $(this).find("input, select, textarea").each( function(index, input) {
            formData[input.name] = input.value;
            formIsValid.push(checkFormItem(input));
            
        });                  //összeszedi az űrlap adatokat az objektumba

        if(formIsValid.indexOf(false)>-1){
            return;
        }
        $.ajax({
            type: method.toUpperCase(),
            url: action,
            "data": formData,
            dataType: 'json'
        }).done(function (resp) {
            console.log(resp);
            if (window[callBack]) {
                window[callBack](); //a window névtérben jön létre a fv -> ezért elérhető 
            }
        });
    });
    return this;        //chaining miatt kell!!
};

$("#newEventForm").sendForm();