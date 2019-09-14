// TODO: remove window interval when load other pages

let root = 'http://comp426.cs.unc.edu:3001/';
let flickr = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=';
let weather = 'https://api.openweathermap.org/data/2.5/APPID=4eacef9202feba5a99e99baa737839aa&weather?q=';

let carouselTime;
let carouselBool;
let airlines = [];
let prices = [];

let user;

$(document).ready(function () {
    $.ajax(root + 'airlines', {
        async: false,
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: (response) => {
            for (let i = 0; i < response.length; i++) {
                airlines[response[i].id] = response[i];
                prices[response[i].id] = Math.floor(Math.random() * 100 + 50);
            }
        },
        error: (e) => {
            console.log(e);
        }
    });

    $.ajax(root + 'users', {
        xhrFields: { withCredentials: true },
        success: (response) => {
            $('#username').html(response.username + '<span class="caret"></span>');
            $('#userdropdown').show();
            $('#reserveButton').show();
            $('#register').remove();
            $('#login').remove();
            $('#rightNav').append('<li><a id="logout"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>');
            $('#logout').on('click', function () {
                logout();
            });
            $('#homeButton').hide();
            setUpBookingInfo();
        },
        error: (e) => {
            $('#userdropdown').hide();
            $('#reserveButton').hide();
            $('#randButton').hide();
            setUpHome();
        }
    });
//    setUpHome();

    $('#login').on('click', function () {
        setUpLogin();
    });
    $('#register').on('click', function () {
        setUpRegister();
    });
    $('#reserveButton').on('click', function () {
        $('#homeButton').show();
        $('#reserveButton').hide();
        console.log('click');
        setUpReserve();
    });
    $('#homeButton').on('click', function () {
        $('#homeButton').hide();
        $('#reserveButton').show();
        setUpHome();
    });
    $('#surpriseButton').on('click', function () {
        setUpRandom();
    });
    $('#bookingInfo').on('click', function () {
        setUpBookingInfo();
    });
});

let setUpLogin = function () {
    $('body').children().not('.navbar').remove();
    window.clearInterval(carouselTime);

    let loginDiv = $('<div class="container"></div>');
    $('body').append(loginDiv);

    loginDiv.append('<label for="usernameLogin" class="sr-only">Username</label>');
    loginDiv.append('<input type="text" id="usernameLogin" class="form-control" placeholder="Username" required autofocus />');
    loginDiv.append('<label for="passwordLogin" class="sr-only">Password</label>');
    loginDiv.append('<input type="password" id="passwordLogin" class="form-control" placeholder="Password" required>');

    let loginButton = $('<button class="btn btn-lg btn-primary btn-block" type="button">Sign In</button>');
    loginDiv.append(loginButton);
    loginDiv.append('<div id="loginMistake"></div>');
    loginButton.on('click', function () {
        login();
    });
}

let setUpRegister = function () {
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
    registerButton.on('click', function () {
        register();
    });
}

let setUpHome = function () {
    $('body').children().not('.navbar').remove();
    $('#reserveButton').html('Book a New Flight');
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

    carouselTime = window.setInterval(function () {
        console.log("Hey");
        let newAirport = airports[Math.floor(Math.random() * airports.length)];
        let newAirportCity = newAirport['city'];
        let query = encodeURI(newAirportCity + ' city');

        $.ajax(flickr + query, {
            dataType: 'jsonp',
            jsonpCallback: 'jsonFlickrFeed',
            success: (result) => {
                let rand = Math.floor(Math.random() * result.items.length);
                let src = result.items[rand].media.m;
                if (carouselBool) {
                    $('#carousel1').attr('src', src);
                    $('#carousel1header').text(newAirportCity);
                } else {
                    $('#carousel2').attr('src', src);
                    $('#carousel2header').text(newAirportCity);
                }

                carouselBool = !carouselBool;
            },
            error: (e) => {
                console.log(e);
            }
        });
    }, 3000);
}

let register = function () {
    let username = $('#usernameRegister').val();
    let password = $('#passwordRegister').val();

    $.ajax(root + 'users', {
        type: 'POST',
        data: {
            'user': {
                'username': username,
                'password': password,
            }
        },
        xhrFields: { withCredentials: true },
        success: (response) => {
            console.log(response);
            if (response.hasOwnProperty('username')) {
                setUpHome();
                $('#username').html('<p>' + response.username + '</p>' + '<span class="caret"></span>');
                $('#userdropdown').show();
                $('#reserveButton').show();
                $('#register').remove();
                $('#login').remove();
                $('#rightNav').append('<li><a id="logout"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>');
                $('#logout').on('click', function () {
                    $('#logout').on('click', function () {
                        logout();
                    });
                });
            }
        },
        error: (response) => {
            let responseCode = response.responseJSON.status;
            if (responseCode == 409) {
                $('#registerMistake').empty();
                $('#registerMistake').append('<ul><li>A user already exists with that username.</li><ul>');
            } else if (responseCode == 422) {
                $('#registerMistake').empty();
                $('#registerMistake').append('<ul><li>Your password must have at least 6 characters.</li></ul>');
            }
        }
    });
}

let login = function () {
    console.log("clicked");
    let username = $('#usernameLogin').val();
    let password = $('#passwordLogin').val();

    $.ajax(root + 'sessions', {
        type: 'POST',
        data: {
            'user': {
                'username': username,
                'password': password,
            }
        },
        xhrFields: { withCredentials: true },
        success: (response) => {
            console.log(response);
            setUpHome();
            $('#username').html('<p>' + response.username + '</p>' + '<span class="caret"></span>');
            $('#userdropdown').show();
            $('#reserveButton').show();
            $('#register').remove();
            $('#login').remove();
            $('#rightNav').append('<li><a id="logout"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>');
            $('#logout').on('click', function () {
                logout();
            });
        }, error: (response) => {
            if (response.status == 401) {
                $('#loginMistake').empty();
                $('#loginMistake').append('<ul><li>Either your username or password are incorrect</li></ul>');
            }
        }
    }); //end ajax  
}

let logout = function () {
    $.ajax(root + 'sessions', {
        type: 'DELETE',
        xhrFields: { withCredentials: true },
        success: () => {
            setUpHome();
            $('#logout').remove();
            $('#rightNav').append('<li><a id="register"><span class="glyphicon glyphicon-user"></span> Register</a></li>');
            $('#rightNav').append('<li><a id="login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>');
            $('#login').on('click', function () {
                setUpLogin();
            });
            $('#register').on('click', function () {
                setUpRegister();
            });
        },
        error: (err) => {
            console.log(err);
        }
    });
}


let setUpRandom = function () {
    $('body').children().not('.navbar').remove();
    window.clearInterval(carouselTime);

    let fromAirportRandom = $('<div class="form-group row" id="airports"> <div class="col-sm-6"><label class="sr-only" for="fromAirport">Depart From:</label><input id="fromAirportRandom" type="text" placeholder="Depart From" class="form-control col-sm"></div></div>');
    $('body').append(fromAirportRandom);
    let goButton = $('<button class="btn btn-lg btn-primary btn-block" type="button">Go!</button>');
    $('body').append(goButton);

    goButton.on('click', function () {
        console.log("yo fuck");
        let depart = $('#fromAirportRandom').val();
        console.log(depart);
        $.ajax(root + 'airports?filter[name_ilike]=' + encodeURI(depart), {
            type: 'GET',
            xhrFields: { withCredentials: true },
            async: false,
            success: (response) => {
                let flight;
                let id;
                let whichCity;
                let randomFArrival;
                let randomFDepart;
                $.ajax(root + 'flights?filter[departure_id]=' + response[0].id, {
                    type: 'GET',
                    xhrFields: { withCredentials: true },
                    success: (response) => {
                        console.log(response);
                        let flights = [];
                        for (let i = 0; i < response.length; i++) {
                            flights[i] = response[i];
                        }

                        //the random flight we chose
                        flight = flights[Math.floor(Math.random() * flights.length)];
                        randomFArrival = flight.arrival_id;
                        randomFDepart = flight.departure_id;


                        console.log(flight);
                        let airportWe;
                        $.ajax(root + 'airports', {
                            async: false,
                            type: 'GET',
                            xhrFields: { withCredentials: true },
                            success: (response) => {
                                //                                console.log("this is the response ");
                                for (let j = 0; j < response.length; j++) {
                                    if (response[j].id === flight.arrival_id) {
                                        airportWe = response[j];
                                    }
                                }
                                //                                console.log(airportWe);
                                whichCity = airportWe.city + " ";
                                let whichFlight = $("<div><p> You should go to " + whichCity + "! </p></div>");
                                $('body').append(whichFlight);


                            },
                            error: (e) => {
                                console.log(e);
                            }
                        });


                        //                        console.log(flight.id);
                        id = flight.id;
                        console.log("depart id " + randomFDepart);
                        console.log("arrive id " + randomFArrival);

                        //array of the flights we want the instances of
                        let ranFlight = [];
                        $.ajax(root + 'flights?filter[departure_id]=' + randomFDepart + '&filter[arrival_id]=' + randomFArrival, {
                            async: false,
                            type: 'GET',
                            xhrFields: { withCredentials: true },
                            success: (response) => {
                                console.log("flights depart arrive");
                                console.log(response);
                                for (let m = 0; m < response.length; m++) {
                                    ranFlight[m] = response[m];
                                }
                            },
                            error: (e) => {
                                console.log(e);
                            }
                        });
                        for (let n = 0; n < ranFlight.length; n++) {
                            $.ajax(root + 'instances?filter[flight_id]=' + ranFlight[n].id, {
                                async: false,
                                type: 'GET',
                                xhrFields: { withCredentials: true },
                                success: (response) => {
                                    //                                console.log("instances");
                                    //                                console.log(response);
                                    for (let k = 0; k < response.length; k++) {
                                        let instancesDiv = $('<div class="randomInstances" id="randomInstance' + k + 'flight' + n + '">Want to fly to ' + whichCity + ' on ' + response[k].date + ' at ' + ranFlight[n].departs_at + '? <button type="button" id="reserveInstance' + k + 'flight' + n + '" class="randomBook">Book it!</button></div>');
                                        $('body').append(instancesDiv);

                                        $('#reserveInstance' + k + 'flight' + n).on('click', function () {
                                            let flightData = new Object();
                                            flightData['prices'] = [];
                                            flightData['prices'] = 100;
                                            flightData['flights'] = [];
                                            flightData['flights'].push(response[k]);
                                            setUpBook(flightData, 1);
                                        });

                                    }

                                },
                                error: (e) => {
                                    console.log(e);
                                }
                            });
                        }


                    },
                    error: (e) => {
                        console.log(e);
                    }
                });
            }, error: (e) => {
                console.log(e);
                return;
            }
        });

    });

}

let setUpReserve = function () {
    // styling: little pop ups beside form if enter invalid value

    homeNow = false;
    console.log("made ot");
    $('body').children().not('.navbar').remove();

    let reserveDiv = $('<div class="container"></div>');
    $('body').append(reserveDiv);

    let fromAirport = $('<div class="form-group row" id="airports"> <div class="col-sm-6"><label class="sr-only" for="fromAirport">Depart From:</label><input id="fromAirport" type="text" placeholder="Depart From" class="form-control col-sm"></div></div>');
    reserveDiv.append(fromAirport);

    $('#airports').append('<div class="col-sm-6"><label class="sr-only" for="toAirport">Destination:</label><input id="toAirport" type="text" placeholder="Destination" class="form-control col-sm"></div>');

    let airportChoice = $('<div class="form-group row choices"></div>');
    reserveDiv.append(airportChoice);
    let fromChoice = $('<div class="col-sm-6" id="fromChoice"></div>');
    let destChoice = $('<div class="col-sm-6" id="destChoice"></div>');
    airportChoice.append(fromChoice);
    airportChoice.append(destChoice);

    let datePicker = $('<div class="form-group row" id="dates"></div>');
    reserveDiv.append(datePicker);

    let dateLeave = $('<div class="col-sm-3"><label class="middle" for="datepicker">Date of Flight:</label></div><div class="col-sm-9"><input type="date" id="datepicker" value="2018-12-03" class="form-control"></div>');
    datePicker.append(dateLeave);

    let timeRow = $('<div class="form-group row" id="times"></div>');
    reserveDiv.append(timeRow);

    let timeRange = $('<div class="col-sm-2">Departure Time:</div><div class="form-check col-sm-2"><label class="form-check-label"><input type="checkbox" id="time-range" class="form-check-input">Anytime</label></div>');
    timeRow.append(timeRange);

    let start = $('<div class="col-sm-1"><label for="time-start">Starting:</label></div><div class="col-sm-3"><input type="time" id="time-start" class="form-control" value="06:00"></div>');
    timeRow.append(start);

    let end = $('<div class="col-sm-1"><label for="time-end">Ending:</label></div><div class="col-sm-3"><input type="time" id="time-end" class="form-control" value="18:00"></div>');
    timeRow.append(end);

    let budgetRow = $('<div class="form-group row" id="budget"></div>');
    reserveDiv.append(budgetRow);

    let passengers = $('<div class="col-sm-4"><label for="passengers">Number of Passengers:</label></div><div class="col-sm-8"><input type="number" id="passengers" class="form-control" value="1" min="1"></div>');
    budgetRow.append(passengers);

    let buttons = $('<div class="form-group row" id="buttons"></div>');
    let roundtrip = $('<div class="col-sm-6"><button type="button" id="roundtrip" class="btn btn-light">Round Trip</button></div>');
    let oneway = $('<div class="col-sm-6"><button type="button" id="oneway" class="btn btn-light selected">One Way</button></div>');
    buttons.append(roundtrip);
    buttons.append(oneway);
    reserveDiv.append(buttons);

    let roundtripDiv = $('<div class="form-group row" id="roundtripDiv"></div>');
    reserveDiv.append(roundtripDiv);

    let rtDate = $('<div class="col-sm-3"><label class="middle" for="datereturn">Date of Return:</label></div><div class="col-sm-9"><input type="date" id="datereturn" value="2018-12-04" class="form-control"></div>');
    roundtripDiv.append(rtDate);

    $('#roundtripDiv').hide();

    let resultsDiv = $('<div class="container" id="results"></div>');
    $('body').append(resultsDiv);

    $('#time-range').prop('checked', true);
    $('#time-start').prop('disabled', true);
    $('#time-end').prop('disabled', true);
    let currDate = new Date();
    $('#datepicker').val(currDate.getFullYear() + '-' + (currDate.getMonth() + 1) + '-' + currDate.getDate());
    let newDate = incrementDate(currDate);
    $('#datereturn').val(newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate());

    $('#time-range').change(function () {
        if (this.checked) {
            $('#time-start').prop('disabled', true);
            $('#time-end').prop('disabled', true);
        } else {
            $('#time-start').prop('disabled', false);
            $('#time-end').prop('disabled', false);
        }
    });

    $('#day-range').change(function () {
        if (this.checked) {
            $('#datepicker2').prop('disabled', false);
        } else {
            $('#datepicker2').prop('disabled', true);
        }
    });

    $('#day-range-return').change(function () {
        if (this.checked) {
            $('#datepickerreturn2').prop('disabled', false);
        } else {
            $('#datepickerreturn2').prop('disabled', true);
        }
    });

    $('#roundtrip').on('click', function () {
        $(this).addClass('selected');
        $('#multicity').removeClass('selected');
        $('#oneway').removeClass('selected');
        $('#roundtripDiv').slideDown('slow');

        if (canGetResults()) {
            generateFlights();
        }
    });

    $('#oneway').on('click', function () {
        $(this).addClass('selected');
        $('#multicity').removeClass('selected');
        $('#roundtrip').removeClass('selected');
        $('#roundtripDiv').hide();

        if (canGetResults()) {
            generateFlights();
        }
    });

    $('#fromAirport').keyup(function (e) {
        let toSearch = $('#fromAirport').val();
        let toAdd = [];
        $('#fromChoice').empty();

        if (toSearch == '') {
            $('#fromChoice').append('<div class="row">No Results</div>');
            return;
        }
        $.ajax(root + 'airports?filter[name_ilike]=' + toSearch, {
            type: 'GET',
            xhrFields: { withCredentials: true },
            success: (response) => {
                for (let i = 0; i < response.length; i++) {
                    toAdd.push(response[i].name);
                }
            }, error: (e) => {
                console.log(e);
            }
        }).then(
            $.ajax(root + 'airports?filter[code_ilike]=' + toSearch, {
                type: 'GET',
                xhrFields: { withCredentials: true },
                success: (response) => {
                    for (let i = 0; i < response.length; i++) {
                        toAdd.push(response[i].name);
                    }
                }, error: (e) => {
                    console.log(e);
                }
            })).then(
                $.ajax(root + 'airports?filter[city]=' + toSearch, {
                    type: 'GET',
                    xhrFields: { withCredentials: true },
                    success: (response) => {
                        for (let i = 0; i < response.length; i++) {
                            toAdd.push(response[i].name);
                        }
                    }, error: (e) => {
                        console.log(e);
                    }
                })
            ).done(function () {
                let uniques = [];
                $.each(toAdd, function (i, el) {
                    if ($.inArray(el, uniques) === -1) uniques.push(el);
                });

                if (uniques.length == 0) {
                    $('#fromChoices').append('<div class="row">No Results</div>');
                }
                for (d = 0; d < uniques.length; d++) {
                    let choice = $('<div class="row choice">' + uniques[d] + '</div>');
                    choice.on('click', function () {
                        $('.fromchoice').removeClass('selectedChoice');
                        choice.addClass('selectedChoice');
                        if (canGetResults()) {
                            generateFlights();
                        }
                    });
                    $('#fromChoice').append(choice);
                }
            });
    });

    $('#toAirport').keyup(function (e) {
        let toSearch = $('#toAirport').val();
        let toAdd = [];
        $('#destChoice').empty();

        if (toSearch == '') {
            $('#destChoice').append('<div class="row">No Results</div>');
            return;
        }
        console.log(toSearch);
        $.ajax(root + 'airports?filter[name_ilike]=' + toSearch, {
            type: 'GET',
            xhrFields: { withCredentials: true },
            success: (response) => {
                for (let i = 0; i < response.length; i++) {
                    toAdd.push(response[i].name);
                }
            }, error: (e) => {
                console.log(e);
            }
        }).then(
            $.ajax(root + 'airports?filter[code_ilike]=' + toSearch, {
                type: 'GET',
                xhrFields: { withCredentials: true },
                success: (response) => {
                    for (let i = 0; i < response.length; i++) {
                        toAdd.push(response[i].name);
                    }
                }, error: (e) => {
                    console.log(e);
                }
            })).then(
                $.ajax(root + 'airports?filter[city]=' + toSearch, {
                    type: 'GET',
                    xhrFields: { withCredentials: true },
                    success: (response) => {
                        for (let i = 0; i < response.length; i++) {
                            toAdd.push(response[i].name);
                        }
                    }, error: (e) => {
                        console.log(e);
                    }
                })
            ).done(function () {
                let uniques = [];
                $.each(toAdd, function (i, el) {
                    if ($.inArray(el, uniques) === -1) uniques.push(el);
                });

                if (uniques.length == 0) {
                    $('#destChoice').append('<div class="row">No Results</div>');
                }
                for (d = 0; d < uniques.length; d++) {
                    let choice = $('<div class="row destchoice">' + uniques[d] + '</div>');
                    choice.on('click', function () {
                        $('.destchoice').removeClass('selectedDest');
                        choice.addClass('selectedDest');
                        if (canGetResults()) {
                            generateFlights();
                        }
                    });
                    $('#destChoice').append(choice);
                }
            });
    });

    $('#datepicker').change(function () {
        if (canGetResults()) {
            generateFlights();
        }
    });

    $('#datereturn').change(function () {
        if (canGetResults()) {
            generateFlights();
        }
    });

    $('#passengers').change(function() {
        if(canGetResults()) {
            generateFlights();
        }
    });

    let canGetResults = function () {
        console.log('called');
        if ($('#fromAirport').val() == '') {
            return false;
        }
        if ($('#toAirport').val() == '') {
            return false;
        }
        if ($('#fromAirport').val() == $('#toAirport').val()) {
            return false;
        }
        if ($('.selectedDest').length == 0) {
            return false;
        }
        if ($('.selectedChoice').length == 0) {
            return false;
        }

        if (!$('#time-range').is(':checked')) {
            let start = convertTime($('#time-start').val());
            let end = convertTime($('#time-end').val());
            if (end < start) {
                return false;
            }
        }
        if (parseInt($('#budgetInput').val()) < 1) {
            return false;
        }
        if (parseInt($('#passengers').val()) < 1) {
            return false;
        }

        return true;
    }

    let compareDates = function (before, after) {
        if (after.getFullYear() < before.getFullYear()) {
            return false;
        }
        if (after.getFullYear() > before.getFullYear()) {
            return true;
        }
        if (after.getMonth() == before.getMonth()) {
            if (after.getDate() < before.getDate()) {
                return false;
            }
        }
        if (after.getMonth() < before.getMonth()) {
            return false;
        }
        return true;
    }


    let convertTime = function (time) {
        let hour = time.substring(0, 2);
        if (hour.substring(0, 1) == '0') {
            hour = hour.substring(1, 2);
        }
        let minutes = time.substring(3, 5);
        if (minutes.substring(0, 1) == '0') {
            minutes = minutes.substring(1, 2);
        }
        return parseInt(hour) * 60 + parseInt(minutes);
    }

    let generateFlights = function () {
        let depart = $('.selectedChoice').text();

        let departID;
        $.ajax(root + 'airports?filter[name]=' + encodeURI(depart), {
            type: 'GET',
            xhrFields: { withCredentials: true },
            async: false,
            success: (response) => {
                console.log(response);
                departID = response[0].id;
            }, error: (e) => {
                console.log(e);
                return;
            }
        });

        let arrive = $('.selectedDest').text();
        let arriveID;
        $.ajax(root + 'airports?filter[name]=' + encodeURI(arrive), {
            type: 'GET',
            xhrFields: { withCredentials: true },
            async: false,
            success: (response) => {
                console.log(response);
                arriveID = response[0].id;
            }, error: (e) => {
                console.log(e);
                return;
            }
        });

        let startTime = '00:00';
        let endTime = '23:59';
        if (!$('#time-range').is(':checked')) {
            startTime = $('#time-start').val();
            endTime = $('#time-end').val();
        }

        let startDate = new Date($('#datepicker').val());
        startDate = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();

        // now is where we have to start splitting up by type
        if ($('#oneway').hasClass('selected')) {
            // easiest one
            // get flights that leave between the specified times
            let flights = [];
            let instances = [];
            $.ajax(root + 'flights?filter[departs_at_lt]=' + encodeURI(endTime) + '&filter[departs_at_gt]=' + encodeURI(startTime) + '&filter[departure_id]=' + departID + '&filter[arrival_id]=' + arriveID, {
                type: 'GET',
                async: false,
                xhrFields: { withCredentials: true },
                success: (response) => {
                    console.log(response);
                    flights = response;
                }, error: (e) => {
                    console.log(e);
                    return;
                }
            });

            for (let i = 0; i < flights.length; i++) {
                $.ajax(root + 'instances?filter[date]=' + startDate + '&filter[flight_id]=' + flights[i].id, {
                    type: 'GET',
                    async: false,
                    xhrFields: { withCredentials: true },
                    success: (response) => {
                        console.log(response);
                        for (let r = 0; r < response.length; r++) {
                            let info = [];
                            info[0] = flights[i];
                            info[1] = response[r];
                            instances.push(info);
                        }
                    }, error: (e) => {
                        console.log(e);
                        return;
                    }
                });
            }

            console.log(instances);
            buildInstances($('#results'), instances, 'oneway', $('#passengers').val());

        } else if ($('#roundtrip').hasClass('selected')) {
            let returnDate = new Date($('#datereturn').val());
            returnDate = returnDate.getFullYear() + '-' + (returnDate.getMonth() + 1) + '-' + returnDate.getDate();

            let flightsThere = [];
            $.ajax(root + 'flights?filter[departs_at_lt]=' + encodeURI(endTime) + '&filter[departs_at_gt]=' + encodeURI(startTime) + '&filter[departure_id]=' + departID + '&filter[arrival_id]=' + arriveID, {
                type: 'GET',
                async: 'false',
                xhrFields: { withCredentials: true },
                success: (response) => {
                    console.log(response);
                    flightsThere = response;
                }, error: (e) => {
                    console.log(e);
                    return;
                }
            });

            let instanceThere = [];
            for (let i = 0; i < flightsThere.length; i++) {
                $.ajax(root + 'instances?filter[date]=' + startDate + '&filter[flight_id]=' + flightsThere[i], {
                    type: 'GET',
                    async: 'false',
                    xhrFields: { withCredentials: true },
                    success: (response) => {
                        console.log(response);
                        for (let r = 0; r < response.length; r++) {
                            let info = [];
                            info[0] = flights[i];
                            info[1] = response[r];
                            instanceThere.push(info);
                        }
                    }, error: (e) => {
                        console.log(e);
                        return;
                    }
                });
            }

            let flightsBack = [];
            $.ajax(root + 'flights?filter[departure_id]=' + arriveID + '&filter[arrival_id]=' + departID, {
                type: 'GET',
                async: 'false',
                xhrFields: { withCredentials: true },
                success: (response) => {
                    console.log(response);
                    flightsBack = response;
                }, error: (e) => {
                    console.log(e);
                    return;
                }
            });

            let instanceBack = [];
            for (let i = 0; i < flightsBack.length; i++) {
                $.ajax(root + 'instances?filter[date]=' + returnDate + '&filter[flight_id]=' + flightsBack[i], {
                    type: 'GET',
                    async: 'false',
                    xhrFields: { withCredentials: true },
                    success: (response) => {
                        console.log(response);
                        for (let r = 0; r < response.length; r++) {
                            let info = [];
                            info[0] = flights[i];
                            info[1] = response[r];
                            instanceBack.push(info);
                        }
                    }, error: (e) => {
                        console.log(e);
                        return;
                    }
                });
            }

            // create paired instances
            let instances = [];
            for (let i = 0; i < instanceThere.length; i++) {
                for (let k = 0; k < instanceBack.length; k++) {
                    let dateThere = new Date(instanceThere[i][1].date);
                    let dateBack = new Date(instanceBack[k].date);
                    if (compareDates(dateThere, dateBack)) {
                        let info = [];
                        info[0] = instanceThere[i][0];
                        info[1] = instanceThere[i][1];
                        info[2] = instanceBack[k][0];
                        info[3] = instanceBack[k][1];
                    }
                }
            }
            console.log('instances');
            console.log(instances);
            buildInstances($('#results'), instances, 'roundtrip');
        }
    }
}

let buildInstances = function (div, instances, flag, numPassengers) {
    div.empty();
    if(instances.length == 0) {
        div.append('<div class="inline">No results to show!</div>');
    }
    if (flag == 'oneway') {
        for (let i = 0; i < instances.length; i++) {
            let d = $('<div class="inline"></div>');
            let flight = instances[i][0];
            let instance = instances[i][1];
            let depart = flight.departs_at;
            let arrive = flight.arrives_at;

            let airline = airlines[flight.airline_id];
            d.append('<div>' + airline.name + '</div>');
            d.append('<div>' + convertTime(depart) + '</div>');
            d.append('<div><span class="glyphicon glyphicon-circle-arrow-right"></span></div>');
            d.append('<div>' + convertTime(arrive) + '</div>');
            d.append('<input type="hidden" value="' + flight.id + '" id="flight' + i + '">');
            d.append('<input type="hidden" value="' + instance.id + '" id="instance' + i + '">');
            d.append('<div>Price: $' + (numPassengers * prices[flight.airline_id]) + '</div>');

            let button = $('<button id="instance' + i + '" type="button" class="btn btn-light book">Book This</button>');
            d.append(button);

            let flightData = new Object();
            flightData['price'] = [];
            flightData['price'].push(prices[flight.airline_id]);
            flightData['flights'] = [];
            flightData['flights'].push(instances[i][1]);
            button.on('click', function () {
                setUpBook(flightData, numPassengers);
            });

            div.append(d);
        }
    } else if (flag == 'roundtrip') {
        for (let i = 0; i < instances.length; i++) {
            let outer = $('<div></div>');

            let d = $('<div class="inline"></div>');
            let flight = instances[i][0];
            let instance = instances[i][1];
            let depart = flight.departs_at;
            let arrive = flight.arrives_at;

            let airline = airlines[flight.airline_id];
            d.append('<div>' + airline.name + '</div>');
            d.append('<div>' + convertTime(depart) + '</div>');
            d.append('<div><span class="glyphicon glyphicon-circle-arrow-right"></span></div>');
            d.append('<div>' + convertTime(arrive) + '</div>');
            d.append('<input type="hidden" value="' + flight.id + '" id="flight' + i + '">');
            d.append('<input type="hidden" value="' + instance.id + '" id="instance' + i + '">');
            d.append('<div>Price: $' + (numPassengers * prices[flight.airline_id]) + '</div>');
            d.append('<button id="instance' + i + '" type="button" class="btn btn-light book">Book This</button>');

            outer.append(d);

            let d2 = $('<div class="inline"></div>');
            let flight2 = instances[i][2];
            let instance2 = instances[i][3];
            let depart2 = flight2.departs_at;
            let arrive2 = flight2.arrives_at;

            let airline2 = airlines[flight2.airline_id];
            d2.append('<div>' + airline2.name + '</div>');
            d2.append('<div>' + convertTime(depart2) + '</div>');
            d2.append('<div><span class="glyphicon glyphicon-circle-arrow-right"></span></div>');
            d2.append('<div>' + convertTime(arrive2) + '</div>');
            d2.append('<input type="hidden" value="' + flight2.id + '" id="flight' + i + '">');
            d2.append('<input type="hidden" value="' + instance2.id + '" id="instance' + i + '">');
            d2.append('<div>Price: $' + (numPassengers * prices[flight2.airline_id]) + '</div>');

            let button = $('<button id="instance' + i + '" type="button" class="btn btn-light book">Book This</button>');
            d2.append(button);

            let flightData = new Object();
            flightData['price'] = [];
            flightData['price'].push(prices[flight.airline_id]);
            flightData['price'].push(prices[flight2.airline_id]);
            flightData['flights'] = [];
            flightData['flights'].push(instance1);
            flightData['flights'].push(instance2);

            button.on('click', function () {
                setUpBook(flightData, numPassengers);
            });


            outer.append(d2);

            div.append(outer);
        }
    }
}

let setUpBook = function (flightData, numPassengers) {
    $('body').children().not('.navbar').remove();

    $('body').append('<input type="email" placeholder="Email" id="email" class="form-control">');
    for (let p = 0; p < numPassengers; p++) {
        let passInfo = $('<div class="form-group row passInfo"></div>');
        passInfo.append('<div class="col-sm-3"><input type="text" class="firstname form-control" placeholder="First Name"></div>');
        passInfo.append('<div class="col-sm-3"><input type="text" class="lastname form-control" placeholder="Last Name"></div>');
        passInfo.append('<div class="col-sm-3"><input type="number" class="age form-control" min="1" max="115" value="18"></div>');
        passInfo.append('<div class="col-sm-3"><select class="gender form-control"><option value="male">Male</option><option value="female">Female</option><option value="prefer not to say">Prefer Not to Say</option></select></div>');
        $('body').append(passInfo);
    }
    let butt = $('<button type="button" class="btn btn-light" id="book">Book</button>');
    $('body').append(butt);
    butt.on('click', function () {
        if ($('#email').val() == '') {
            return;
        }
        let pass = $('.passInfo');
        for (let p = 0; p < pass.length; p++) {
            let pa = pass.eq(p);
            let fname = pa.find('.firstname').val();
            let lname = pa.find('.lastname').val();
            let age = pa.find('.age').val();
            let gender = pa.find('option:selected').val();
            if (fname == '' || lname == '' || parseInt(age) < 1 || parseInt(age) > 115 || gender == '') {
                return;
            }
        }

        for (let f = 0; f < flightData['flights'].length; f++) {
            $.ajax(root + 'itineraries', {
                type: 'POST',
                xhrFields: { withCredentials: true },
                data: {
                    'itinerary': {
                        'confirmation_code': randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                        'email': $('#email').val()
                    }
                },
                success: (response) => {
                    let itinID = response.id;
                    for (let p = 0; p < pass.length; p++) {
                        $.ajax(root + 'tickets', {
                            type: 'POST',
                            xhrFields: { withCredentials: true },
                            data: {
                                'ticket': {
                                    'first_name': pass.eq(p).find('.firstname').val(),
                                    'last_name': pass.eq(p).find('.lastname').val(),
                                    'age': pass.eq(p).find('.age').val(),
                                    'gender': pass.eq(p).find('option:selected').val(),
                                    'is_purchased': true,
                                    'price_paid': flightData['price'][f],
                                    'instance_id': flightData['flights'][f].id,
                                    'itinerary_id': itinID
                                }
                            },
                            success: (response) => {
                                console.log(response);
                            },
                            error: (e) => {
                                console.log(e);
                            }
                        })
                    }
                },
                error: (e) => {
                    console.log(e);
                }
            });
        }
    });

}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

let convertTime = function (time) {
    let date = new Date(time);
    let hour = (date.getHours() + 1) % 12;
    let ampm = (date.getHours() < 12) ? 'AM' : 'PM';
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }

    return hour + ':' + minute + ' ' + ampm;
}

let incrementDate = function (date) {
    let month = [];
    month[0] = month[2] = month[4] = month[6] = month[7] = month[9] = month[11] = 31;
    month[1] = 28;
    month[3] = month[5] = month[8] = month[10] = 30;

    let day = date.getDate() + 1;
    let mon = date.getMonth();
    let year = date.getFullYear();
    if (day > month[mon]) {
        day = 1;
        mon++;
    }
    if (mon == 12) {
        mon = 1;
        year++;
    }
    return new Date(year, mon, day, 0, 0, 0, 0);
}

let setUpBookingInfo = function () {
    $('body').children().not('.navbar').remove();

    let itineraries = [];
    $.ajax(root + 'itineraries', {
        type: 'GET',
        async: false,
        xhrFields: { withCredentials: true },
        success: (response) => {
            console.log(response);
            itineraries = response;
        },
        error: (e) => {
            console.log(e);
        }
    });
    if (itineraries.length == 0) {
        $('body').append('<div class="row">No trips to show yet! Try booking a flight!</div>');
    }
    for (let i = 0; i < itineraries.length; i++) {
        let ticketNum;
        let div = $('<div class="container"></div>');
        let titleRow = $('<div class="row"></div>');
        titleRow.append('<div class="col-sm-6">Trip ' + (i + 1) + '</div>');
        titleRow.append('<div class="col-sm-6">Confirmation Code: ' + itineraries[i].confirmation_code + '</div>');
        div.append(titleRow);
        $('body').append(div);
        let tickets = [];
        $.ajax(root + 'tickets?filter[itinerary_id]=' + itineraries[i].id, {
            type: 'GET',
            async: false,
            xhrFields: { withCredentials: true },
            success: (response) => {
                console.log(response);
                tickets = response;
                ticketNum = tickets.length;
            }, error: (e) => {
                console.log(e);
            }
        });

        let flightData = new Object();
        if (tickets.length > 0) {
            flightData = getFlightInfoByInstanceID(tickets[0].instance_id);
        } else {
            continue;
        }

        console.log(JSON.stringify(flightData));

        let infoDiv = $('<div class="row"></div>');
        infoDiv.append('<div class="col-sm-2">' + flightData['date'] + '</div>');
        infoDiv.append('<div class="col-sm-2">' + flightData['fromCity'] + '</div>');
        infoDiv.append('<div class="col-sm-2">' + flightData['departTime'] + '</div>');
        infoDiv.append('<div class="col-sm-2"><span class="glyphicon glyphicon-circle-arrow-right"></span></div>');
        infoDiv.append('<div class="col-sm-2">' + flightData['arrivalTime'] + '</div>');
        infoDiv.append('<div class="col-sm-2">' + flightData['toCity'] + '</div>');
        let deleteItinButton = $('<div><button class="btn" type="button">Delete Itinerary</button></div>');
        infoDiv.append(deleteItinButton);
        div.append(infoDiv);
        console.log("hope " + itineraries[i].id);
        $(deleteItinButton).on('click', function () {
            $.ajax(root + 'itineraries/' + itineraries[i].id, {
                type: 'DELETE',
                async: false,
                xhrFields: { withCredentials: true },
                success: (response) =>  {
                     console.log("yeet itinerary deleted");
                    div.remove();
                }
            });
        });

        let passDiv = $('<div><p>Passengers</p></div>');
        for (let t = 0; t < tickets.length; t++) {
            let tickDiv = $('<div id="passt' + t + 'i' + i + '">' + tickets[t].first_name + ' ' + tickets[t].last_name + '</div>');
            passDiv.append(tickDiv);
            let deleteTixButton = $('<div><button class="btn" type="button">Delete Ticket</button></div>');
            console.log($('#passt' + t + 'i' + i));
            tickDiv.append(deleteTixButton);
            
            $(deleteTixButton).on('click', function () {
                $.ajax(root + 'tickets/' + tickets[t].id, {
                    type: 'DELETE',
                    async: false,
                    xhrFields: { withCredentials: true },
                    success: (response) =>  {
                        console.log("yeet tix deleted");
                        ticketNum = ticketNum - 1;
                        console.log(t + " t");
                        console.log(i + " i");
                        $('#passt' + t + 'i' + i).remove();
                        if (ticketNum === 0) {
                            $.ajax(root + 'itineraries/' + itineraries[i].id, {
                                type: 'DELETE',
                                async: false,
                                xhrFields: { withCredentials: true },
                                success: (response) =>  {
                                     console.log("yeet empty itin deleted"); 
                                    div.remove();
                                }
                            });
                        }
                    }
                });
                    
            });
        }
        div.append(passDiv);

        let weatherDiv = $('<div></div>');
        $.ajax(weather + flightData['toCity'], {
            type: 'GET',
            success: (response) => {
                console.log(response);
            }
        });
        div.append(weatherDiv);
    }
}

let getFlightInfoByInstanceID = function (id) {
    let fromID = 0;
    let toID = 0;

    let flightInfo = new Object();
    let flightid = 0;
    $.ajax(root + 'instances/' + id, {
        type: 'GET',
        async: false,
        xhrFields: { withCredentials: true },
        success: (response) => {
            flightInfo['date'] = response.date;
            flightid = response.flight_id
        }
    });

    console.log(flightid);
    $.ajax(root + 'flights/' + flightid, {
        type: 'GET',
        async: false,
        xhrFields: { withCredentials: true },
        success: (response) => {
            fromID = response.departure_id;
            toID = response.arrival_id;
            flightInfo['departTime'] = response.departs_at;
            flightInfo['arrivalTime'] = response.arrives_at;
        }
    });

    $.ajax(root + 'airports/' + fromID, {
        type: 'GET',
        async: false,
        xhrFields: { withCredentials: true },
        success: (response) => {
            flightInfo['fromCity'] = response.city;
        }
    });
    $.ajax(root + 'airports/' + toID, {
        type: 'GET',
        async: false,
        xhrFields: { withCredentials: true },
        success: (response) => {
            flightInfo['toCity'] = response.city;
        }
    });
    return flightInfo;
}