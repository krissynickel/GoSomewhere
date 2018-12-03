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
            console.log(e);
        }
    });

    $('#userdropdown').hide();
    $('#reserveButton').hide();

    $('#login').on('click', function() {
        setUpLogin();
    });
    $('#register').on('click', function() {
        setUpRegister();
    });

    setUpHome();

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

let setUpLogin = function() {
    $('body').children().not('.navbar').remove();
    window.clearInterval(carouselTime);

    let loginDiv = $('<div class="container"></div>');
    $('body').append(loginDiv);

    loginDiv.append('<label for="username" class="sr-only">Username</label>');
    loginDiv.append('<input type="text" id="username" class="form-control" placeholder="Username" required autofocus />');
    loginDiv.append('<label for="password" class="sr-only">Password</label>');
    loginDiv.append('<input type="password" id="password" class="form-control" placeholder="Password" required>');
    
    let loginButton = $('<button class="btn btn-lg btn-primary btn-block" type="button">Sign In</button>');
    loginDiv.append(loginButton);
}

let setUpRegister = function() {
    $('body').children().not('.navbar').remove();
    window.clearInterval(carouselTime);

    let registerDiv = $('<div class="container"></div>');
    $('body').append(registerDiv);

    registerDiv.append('<label for="usernameRegister" class="sr-only">Username</label>');
    registerDiv.append('<input type="text" id="usernameRegister" class="form-control" placeholder="Username" required autofocus />');
    registerDiv.append('<label for="passwordRegister" class="sr-only">Password</label>');
    registerDiv.append('<input type="password" id="passwordRegister" class="form-control" placeholder="Password" required>');

    let registerButton = $('<button class="btn btn-lg btn-primary btn-block" type="button">Register</button>');
    registerDiv.append(registerButton);
    registerDiv.append('<div id="registerMistake"></div>');
    registerButton.on('click', function() {
        register();
    });
}

let setUpHome = function() {
    $('body').children().not('.navbar').remove();
    let body = $('body');

    let carouselDiv = $('<div id="carouselAirport" class="carousel slide" data-interval="3000" data-ride="carousel"></div>');
    let carouselInner = $('<div class="carousel-inner"></div>');
    carouselDiv.append(carouselInner);
    carouselInner.append('<div class="item active"><img id="carousel1" src="./plane.jpg" alt="Plane"><div class="carousel-caption"><h3 id="carousel1header">Plane</h3></div></div>');
    carouselInner.append('<div class="item"><img id="carousel2" src="./electricplanep.jpg" alt="Electric Plane"><div class="carousel-caption"><h3 id="carousel2header">Plane 2</h3></div></div>');
    body.append(carouselDiv);

    body.append('<h1 class="text-center display-1">426 Final Project</h1>');
    body.append('<blockquote class="blockquote"></blockquote>');
    $('blockquote').append('<p class="mb-0">I\'m in love with cities I\'ve never been to and people I\'ve never met.</p><footer class="blockquote-footer">John Green</footer>');
}

let register = function() {
    let username = $('#usernameRegister').val();
    let password = $('#passwordRegister').val();

    $.ajax(root + 'users', {
        type: 'POST',
        data: {
            'user': {
                'username': username,
                'password' : password,
            }
        },
        xhrFields: {withCredentials: true},
        success: (response) => {
            console.log(response);
            if(response.hasOwnProperty('username')) {
                setUpHome();
                $('#username').text(response.username);
                $('#username').show();
                $('#reserveButton').show();
            }
            
        },
        error: (response) => {
            console.log(response.responseJSON.status);
            if(response.responseJSON.status == 409) {
                $('#registerMistake').empty();
                $('#registerMistake').append('<ul><li>A user already exists with that username.</li><ul>');
            }
        }
    });
}