var RESTURL = "http://localhost:3000";

function startEventsPage(){
    $.getJSON(RESTURL + "/events").done(function (eventList) {
        showEventList(eventList);
    });
}
//események megjelenítése.
function showEventList(eventList) {
    var template = $(".templates a.card").clone();
    var parentElement = $(".events-card-deck");
    parentElement.html("");
    $.each(eventList, function (index, event) {
        var eventElement = template.clone();

        //eventElement.attr("href", "tickets.html?event=" + event.id);
        eventElement.find("h4").text(event.title);
        eventElement.data("event",event);   //az event elementhez hozzá lett adva a data attributum - esemény
        eventElement.find(".card-body p").eq(0).text(event.description);
        eventElement.find(".card-body .event-time small").text(event.time);
        eventElement.find("img").attr("src", event.image);

        eventElement.on("click", function(){        //sessionstorage-be menti eventId néven
            sessionStorage.eventId=$(this).data("event").id;    // a data-ból az event-id-jét olvassuk ki
        })
        parentElement.append(eventElement);
    });
}
function openNewEventModal() {
    $("#newEventModal").modal("show");         //előre megírt jquery plugin - modal
}

//file előnézet készítése
$("input#image").on("change", function() {
    var file = this.files[0];
    if (file.type.indexOf("image") < 0) return false;

   var reader = new FileReader();
   reader.addEventListener("load", function () {
    $(".preview-holder img")[0].src = reader.result;
  }, false);

  if (file) reader.readAsDataURL(file);

});


$(".preview-holder img").on("click", function(){
    var div = $(this).parent().clone();
    div.addClass("big-image").on("click", function(){
        div.removeClass("big-image");
    });
    $(document.body).append(div);
});

startEventsPage();