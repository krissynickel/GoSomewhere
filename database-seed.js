let flick = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json';

$(document).ready(function () {
  // Login credentials
  const credentials = {
    username: 'tas127',
    password: '730125659',
  };


  // Airlines
  const airlines = [
    // fill with airlines
  ];

  $.ajax('./airports.json', {
    type: 'GET',
    success: (response) => {
      let size = Object.keys(response).length;
      let keys = Object.keys(response);
      for(let i = 0; i < size; i ++) {
        let name = 'yes';
      }
    }
  })


  // Airports
  const airports = [
    // fill with airports
  ];

  const flights = [
    // fill with flights
  ];


  const instances = [
    // fill with instances
  ];

  const itineraries = [

  ];


  // Seats
  const seats = [
    // fill with seats
  ];


  // Tickets
  const tickets = [
    // fill with tickets
  ];


  // Planes
  const planes = [
    // fill with planes
  ];


  /**
   * Just a simple mapping from pluralized resource names to singular
   *   resource names.
   */
  const singularize = {
    airlines: 'airline',
    airports: 'airport',
    flights: 'flight',
    instances: 'instance',
    itineraries: 'itinerary',
    seats: 'seat',
    tickets: 'ticket',
    planes: 'plane',
  };


  /**
   * Logs in to the flights-api server.
   * 
   * @param username  The username of your flights-api account
   * @param password  The password for your flights-api account
   * @return  Returns a promise object that resolves once you are logged in
   */
  function login(username, password) {
    return $.ajax({
      url: 'http://comp426.cs.unc.edu:3001/sessions',
      type: 'POST',
      data: {
        user: {
          username: username,
          password: password,
        },
      },
      xhrFields: { withCredentials: true },
    });
  }


  /**
   * Logs out of the flights-api server
   * 
   * @return  Returns a promise object that resolves once you are logged out
   */
  function logout() {
    return $.ajax({
      url: 'http://comp426.cs.unc.edu:3001/sessions',
      type: 'DELETE',
      xhrFields: { withCredentials: true },
    });
  }


  /**
   * Clears the data in your database
   * 
   * @return  Returns a promise object that resolves once your data is cleared
   */
  function clear() {
    return $.ajax({
      url: 'http://comp426.cs.unc.edu:3001/data',
      type: 'DELETE',
      xhrFields: { withCredentials: true },
    });
  }


  /**
   * Makes a series of ajax requests to seed the database with one type of resource
   * 
   * @param resourceName  The plural name of the resource as a string
   * @param dataArray     An array of data objects representing the fields to create
   * @return Returns a promise object that resolves once all requests have completed
   */
  function create(resourceName, dataArray) {
    let prom = $().promise(); // start with an empty promise
    dataArray.forEach(function (data) {
      let wrappedData = {};
      wrappedData[singularize[resourceName]] = data;
      prom = prom.then(function () {
        return $.ajax({
          url: 'http://comp426.cs.unc.edu:3001/' + resourceName,
          type: 'POST',
          data: wrappedData,
          xhrFields: { withCredentials: true },
        });
      });
    });
    return prom;
  }

  let isRunning = false;
  $('#start-button').click(function () {
    if (isRunning) {
      return;
    }
    isRunning = true;

    $('#message').html('<strong class="text-muted">Seeding database...</strong>');
    $().promise().then(function () {
      return create('airlines', airlines);
    }).then(function () {
      return create('airports', airports);
    }).then(function () {
      return create('flights', flights);
    }).then(function () {
      return create('instances', instances);
    }).then(function () {
      return create('itineraries', itineraries);
    }).then(function () {
      return create('seats', seats);
    }).then(function () {
      return create('tickets', tickets);
    }).then(function () {
      return create('planes', planes);
    }).then(function () {
      $('#message').html('<strong class="text-success">Finished!</strong>');
    }).fail(function () {
      $('#message').html('<strong class="text-danger">An error occurred.</strong>');
    }).always(function () {
      isRunning = false;
    });
  });
});