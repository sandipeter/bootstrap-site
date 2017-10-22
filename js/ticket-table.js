$(document).ready(function(){
    var RESTURL = "http://localhost:3000";
    var searchString = '';
    var sortKey = '';
    var sortDirection = '';
    var ticketListTable = $("#ticket-list");
    // lapozas globalis valtozoi
    var pageLimit = 3; // hany egyed jelenjen meg egy lapon
    var currentPage = 1; // jelenleg hol all a lapozo
    var maxPage = 0; // hany oldalt tudunk megjeleniteni
    var totalCount = 0; // osszes egyed szam amit a server tud szolgaltatni

    

    //jegywek táblájának generálása
    //tábla kitöltése javascript objektummal
    function fillTicketsTable(currentTickets) {
        var tbody = $("#ticket-list tbody");
        tbody.html('');

        $.each(currentTickets, function (index, ticket) {
            var row = $(".templates .ticket-row").clone();
            row.find("td").eq(0).html(ticket.id);
            row.find("td").eq(1).html(ticket.event);
            row.find("td").eq(2).html(ticket.time);
            row.find("td").eq(3).html(ticket.seller);
            row.find("td").eq(4).html(ticket.pcs);
            row.find("td").eq(5).html(ticket.link);
            tbody.append(row);
        });
    }






// Lista újratöltése ajax-val (meghívja a fillTicketTable-t is!)
function refreshTicketList() {

    var urlParams = [];
    var url = RESTURL + "/tickets";
    var reg = /\?.*event\=([0-9]*)/;
    var eventId = 1;


    // lapozo adatok kezelese
    urlParams.push('_limit=' + pageLimit);
    urlParams.push('_page=' + currentPage);
    // sima szoveges kereses lekezelese
    if (searchString.length>0) urlParams.push('q=' + searchString);

    //rendezés kezelése

    if (sortKey.length>0) 
    {
        urlParams.push('_sort=' + sortKey);
        urlParams.push('_order=' + sortDirection);
    }

    //az eventid hozzáadása
    //eventId = window.location.href.match(reg)[1];
    urlParams.push('eventId=' + sessionStorage.eventId);
    //ha van url parameter akkor összefűzzük az url változóba
    if (urlParams.length>=0) url = url + "?" + urlParams.join('&');

    $.getJSON(url).done(
        function(ticketList, textStatus, request){    // a request paraméter adja vissza a json adatot (hívás + választ)
            var oldMaxPage = maxPage;
            // valasz fejlecbol kiolvassuk az osszes lehetseges talalat szamat
            totalCount = request.getResponseHeader('X-Total-Count');
            maxPage = totalCount / pageLimit;
                // modulus (maradekos) osztas
                if (maxPage % 1 !== 0) {
                    maxPage = parseInt(maxPage) + 1;
                }
                if (oldMaxPage != maxPage) {
                    renderTicketTabletPaginator();
                }

            // lapozo ertekeinek frissitese
            refreshPaginate();
            // tablazat kirajzolasa az uj adatokkal
            fillTicketsTable(ticketList);
    });
}



function refreshPaginate(){
   var paginatorElem = $("#ticket-list-paginator");
   var firstElem = paginatorElem.find("ul > li:first-child");   //bal oldali nyíl
   var lastElem = paginatorElem.find("ul > li:last-child");   //JOBB oldali nyíl

   if(currentPage == 1)
   {
        firstElem.addClass('disabled');
        lastElem.removeClass('disabled');
        lastElem.prev().removeClass('disabled'); //előző lista-elem
   }
   else
   {
       firstElem.removeClass('disabled');
       firstElem.next().removeClass('disabled');
       lastElem.addClass('disabled');
   }
   paginatorElem.find('ul > li').eq(currentPage).addClass('active');
}





function renderTicketTabletPaginator(){
    var paginatorULElem = $('#ticket-list-paginator > ul');
    // mivel ujra generaljuk a lapozot, ezert elotte uritjuk
    paginatorULElem.html('');
    var html = [];
    // balra nyilacska html (nem valtoztatjuk)
    html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Previous" data-paginate-size="prev"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>');

    for (var i = 1; i <= maxPage; i++) {
        // a belso elemek toltese (szam elemek)
        html.push('<li class="page-item"><a class="page-link" href="#" data-paginate-size="' + i + '">' + i + '</a></li>');
    }

    // jobbra nyilacska html (nem valtoztatjuk)
    html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-paginate-size="next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>');

        // tomb osszefuzese ures szoveggel es utana az UL elem-be toltese
        paginatorULElem.html(html.join(''));
}







$(".tickets-search-row input").on("keyup", function(){
    searchString=$(this).val();
    refreshTicketList()
});

ticketListTable.find("thead th[data-key]").on("click",function(){ //attribútum szelektor

    var th= $(this);
    $.each(ticketListTable.find("thead th[data-key]"), function(index,elem){
        var currentTh = $(elem)
        if (th.data("key")!=currentTh.data("key"))
            currentTh.removeClass("desc").removeClass("asc");

    });

    sortKey = th.data("key");

    if(th.hasClass("asc")) 
    {
        sortDirection = 'desc';
        th.removeClass("asc").addClass("desc");
    }
    else 
    {
        sortDirection = 'asc';
        th.removeClass("desc").addClass("asc");
    }

    refreshTicketList();;
});
    // Innen indul az alkalamzás
    refreshTicketList();

    ticketListTable.on("ticketDataChanged", function(){
        refreshTicketList();
    })
});
window.currentEvent = null;

$("#newTicketForm").sendForm();
//jegylista frissítése
function refreshTicketList(){ //nem ugyanaz mint a fenti
    $("#newTicketModal").modal("hide");
    $("#ticket-list").trigger("ticketDataChanged")
}     


function openNewTicketModal(){
    $("#newTicketModal").modal("show")
}

function setEventDetails(event){
    $("#event").val(event.title);
    $("#time").val(event.time);
}


$.getJSON("http://localhost:3000/events").done(function(events){    //selecthez fv

    var select = $("#eventId")
                .on("change", function(ev){
                    var event = $(this)
                            .find("option:selected")
                            .data("event");
                    setEventDetails(event);
                 });
    //var eventId = window.location.href.match(/\?.*event\=([0-9]*)/)[1];

    $.each(events,function(index, event){
        var option = $("<option />");
        option.data("event",event);     //a data objktum beállítása - hozzákötjük a saját eseménysét
        option.val(event.id);
        option.text(event.title);
        if(event.id==sessionStorage.eventId){
            option.prop("selected",true);
            setEventDetails(event);
        }
        select.append(option);
    })
})

