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
    })

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
    registerButton.on('click', function() {
        register();
    });
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
        },
        error: (e) => {
            console.log(e);
        }
    });
}