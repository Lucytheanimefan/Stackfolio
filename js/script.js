var opts = {
    lines: 13 // The number of lines to draw
        ,
    length: 28 // The length of each line
        ,
    width: 14 // The line thickness
        ,
    radius: 42 // The radius of the inner circle
        ,
    scale: .7 // Scales overall size of the spinner
        ,
    corners: 1 // Corner roundness (0..1)
        ,
    color: '#000' // #rgb or #rrggbb or array of colors
        ,
    opacity: 0.25 // Opacity of the lines
        ,
    rotate: 0 // The rotation offset
        ,
    direction: 1 // 1: clockwise, -1: counterclockwise
        ,
    speed: 1 // Rounds per second
        ,
    trail: 60 // Afterglow percentage
        ,
    fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        ,
    zIndex: 2e9 // The z-index (defaults to 2000000000)
        ,
    className: 'spinner' // The CSS class to assign to the spinner
        ,
    top: '50%' // Top position relative to parent
        ,
    left: '50%' // Left position relative to parent
        ,
    shadow: false // Whether to render a shadow
        ,
    hwaccel: false // Whether to use hardware acceleration
        //,
        //position: 'absolute' // Element positioning
}

var spinner;
var time;
/*-----------------------Home/default pages----------------------*/
//hide the go button
if (document.getElementById("btnSearch")) {
    document.getElementById('btnSearch').style.visibility = 'hidden';
}

//sound cloud init

SC.initialize({
    client_id: '6d1caa788d732e9fd98623a6305089a2',
    redirect_uri: 'http://people.duke.edu/~lz107/Stackfolio/callback.html'
});

// initiate auth popup
SC.connect().then(function() {
    return SC.get('/me');
}).then(function(me) {
    alert('Hello, ' + me.username);
});

function searchKeyPress(e) {
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13) {
        document.getElementById('btnSearch').click();
        return false;
    }
    return true;
}


function getSound() {
    if (document.getElementById("input").value) {
        var response;
        $('#main-page').empty();

        var input = document.getElementById("input").value;

        var realtarget = document.getElementById('dropDown');
        console.log("spinner!");

        spinner = new Spinner(opts).spin(realtarget);

        SC.get('/tracks', {
            q: input,
            license: 'cc-by-sa'
        }).then(function(tracks) {
            response = tracks;
            console.log(response);
            displayData(response, input, spinner);
            dropDownInteractivity()
        });
    }
}

function displayData(response, input, spinner) {
    var queueDiv = document.getElementById("queue");
    queueDiv.innerHTML = "Search results for: " + input;

    for (var i = 0; i < response.length; i++) {
        var obj = response[i];
        console.log(obj);
        var info = document.createElement("p");
        info.innerHTML = "";
        Object.keys(obj).forEach(function(key, index) {
            if (key=="user"){
                info.innerHTML = info.innerHTML + "<br>" + key.toProperCase() + ": " + "<a href ="+obj[key]['permalink_url']+">"+ obj[key]['username']+ "</a>";
            }
            else if (key=="Download_url"|| key == "artwork_url" || key =="attachments_uri" || key=="permalink_url" || key=="stream_url" || key=="uri"){
                info.innerHTML = info.innerHTML + "<br><a href = " + obj[key] + ">"+key.toProperCase() + "</a>";
            }
            else if (obj[key] != null && key!="User_favorite") {
                info.innerHTML = info.innerHTML + "<br>" + key.toProperCase() + ": " + obj[key];
            }
        });

        console.log("finished looping through object");

        var accordion = document.createElement("button");
        accordion.className = "accordion";

        console.log("title" + obj.title);
        accordion.innerHTML = "<b>" + obj.title + "</b> ";
        queueDiv.appendChild(accordion);

        var panelDiv = document.createElement("div");
        panelDiv.className = "panel";
        panelDiv.id = "panelDiv_" + i.toString()
        queueDiv.appendChild(panelDiv);

        panelDiv.appendChild(info);

        console.log("done looping");
    }
    spinner.stop();
}

function dropDownInteractivity() {

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};