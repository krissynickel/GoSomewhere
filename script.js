let root = 'http://comp426.cs.unc.edu:3001/'
let flickr = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=';

let carouselTime;
let carouselBool;
let airports = [];

$(document).ready(function() {
    $.ajax(root + 'airports', {
        async: false,
        type: 'GET',
        xhrFields: {withCredentials: true},
        success: (response) => {
            for(let i = 0; i < response.length; i ++) {
                airports[i] = response[i];
            }
            airports = response;
        },
        error: (e) => {
            alert(e);
        }
    });

    $('#userdropdown').hide();
    $('#reserveButton').hide();

    carouselTime = window.setInterval(function() {
        let newAirport = airports[Math.floor(Math.random() * airports.length)];
        let newAirportCity = newAirport['city'];
        let query = encodeURI(newAirportCity + ' city');

        $.ajax(flickr + query, {
            dataType: 'jsonp',
            jsonpCallback: 'jsonFlickrFeed',
            success: (result) => {
                let rand = Math.floor(Math.random() * result.items.length);
                let src = result.items[rand].media.m;
                if(carouselBool) {
                    $('#carousel1').attr('src', src);
                    $('#carousel1header').text(newAirportCity);
                } else {
                    $('#carousel2').attr('src', src);
                    $('#carousel2header').text(newAirportCity);
                }
        
                carouselBool = !carouselBool;
            },
            error: (e) => {
                alert(e);
            }
        });        
    }, 3000);
});