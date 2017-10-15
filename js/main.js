
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
$("a.nav-link").click(function(ev){
    ev.preventDefault();
    startPageChange(this);
})

function startPageChange(elem){
var link = $(elem);
var prop = link.data("prop")    || "opacity";
var val = link.data("value")    || "0";
var speed = link.data("speed")    ||  1000;
var settings={}; 
settings[prop]=val;
$(document.body).animate(settings,speed,function(){
    document.location = link.attr("href");
})
}


$(".events-search-row input").on("keyup", function(ev) {
    $.each( $(".events-card-deck .card .card-title"), function(index, elem)   {
        elem = $(elem);
        var search = ev.target.value.toLowerCase();
        var content = elem.html().toLowerCase();
        if ( content.indexOf(search) == -1 ) {
          elem.parents(".card").hide();
        } else {
          elem.parents(".card").show();
        }
    });
});

//regiszter oldal
$(".cherry-custom-file").on("change",function(ev){
    $(this).find(".file-name").html(ev.target.value.split("\\").pop())
    ;})

//tickets oldal
$('[data-toggle="tooltip"]').tooltip();

//tickets oldal
var alertBox = $('.alert.alert-primary')
function showInvalidMessage(){
    alertBox
    .removeClass('alert-primary')
    .addClass('alert-danger')
    .find('.alert-message')
    .text('sikertelen')
};
//jegywek tömbje
var tickets=[
    {
        event: "Sziget Fesztivál",
        time: "2018-08-03 18:00:00",
        seller: "Kiss Márton",
        pcs: "5",
        link: 'licit/1'
    },
    {
        event: "Diótürő balett",
        time: "2018-08-03 18:00:00",
        seller: "Nagy Ádám",
        pcs: "8",
        link: 'licit/1'
    },
    {
        event: "Moma party",
        time: "2018-08-03 18:00:00",
        seller: "Brezewiczy krisztián",
        pcs: "6",
        link: 'licit/1'
    },
    {
        event: "Kék szakállú herceg vára",
        time: "2018-08-03 18:00:00",
        seller: "Zwack Magdolna",
        pcs: "15",
        link: 'licit/1'
    },
    {
        event: "Balett midnenkinek",
        time: "2018-08-03 18:00:00",
        seller: "Schwartz Aurél",
        pcs: "3",
        link: 'licit/1'
    },
    {
        event: "Macskák musical",
        time: "2018-08-03 18:00:00",
        seller: "Cserló József",
        pcs: "2",
        link: 'licit/1'
    },
];

//jegywek táblájának generálása
var ticketTable = $("table.table.table-striped").eq(0);

function fillTicketsTable(currentTickets){
    currentTickets=currentTickets || tickets
    var tbody = ticketTable.find("tbody");
    tbody.html("");
    $.each(currentTickets, function(index, ticket){
        var row = $(".templates .ticket-row").clone();
        row.find("td").eq(0).html(index + 1);
        row.find("td").eq(1).html(ticket.event);
        row.find("td").eq(2).html(ticket.time);
        row.find("td").eq(3).html(ticket.seller);
        row.find("td").eq(4).html(ticket.pcs);
        row.find("td").eq(5).html(ticket.link);
        tbody.append(row);
    })  
};
fillTicketsTable();

//jegyek táblázat szűrése
$(".tickets-search-row input").on("keyup", filterTickets)
function filterTickets(){
    //console.log( $(this).val() );
    var currentValue= $(this).val().toLowerCase();
    var filteredTickets = [];
    if(currentValue == "") filteredTickets = tickets;
    else filteredTickets = tickets.filter(function(item){
        var done = false;
        for(var k in item){
            if(item[k].toString().toLowerCase().indexOf(currentValue)>-1) done = true;        
        }
        return done;
    });

    fillTicketsTable(filteredTickets);
};

//jegyek táblázat rendezése
ticketTable.find("thead th[data-key]").on("click",orderTicketTable); //attribútum szelektor

function orderTicketTable(){
    var th= $(this);
    $.each(ticketTable.find("thead th[data-key]"), function(index,elem){
        var currentTh = $(elem)
        if (th.data("key")!=currentTh.data("key"))
            currentTh.removeClass("desc").removeClass("asc");

    });
    var key = th.data("key");
    var sortedTickets = tickets.map(function(item){        //ez klónozás
        return item;
    });

    if(th.hasClass("asc")) th.removeClass("asc").addClass("desc");
    else th.removeClass("desc").addClass("asc");

    sortedTickets.sort(function(a,b){
        if(th.hasClass("asc")) return a[key].toString().localeCompare(b[key].toString());
        else return b[key].toString().localeCompare(a[key].toString());
    });
    fillTicketsTable(sortedTickets);
};