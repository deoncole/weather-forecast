var searchBtnEl = $("#searchBtn");
// global variable to hold the city name
var cityName = "";

// create a empty array to be used for local storage
var cityStorage = [];

// function to capitalize the first letter of a string to be use when grabbing a inputted city
function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// function to get the current day's forecast
var getcurrentDayForecast = function(cityForecast){
    //display the forecast to the user
    $("#chosen-city").text(cityForecast.city.name + " " + moment.unix(cityForecast.list[0].dt).format("M-DD-YYYY"));

    var weatherIcon = cityForecast.list[0].weather[0].icon;
    console.log(weatherIcon);
    var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    console.log(iconUrl);
    $("#weather-icon").attr("src", iconUrl);


};

var displayForecast = function(cityForecast){

}

var getForecast = function (city){
    // variable to hold the api for the request
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&cnt=6&units=imperial&appid=006aa30064ca02ee02bd1cc6373cf4f3";

    // fetch request to the api
    fetch(apiURL).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data);
                getcurrentDayForecast(data);
                // displayForecast(data);
            })
        } else {
            // alert the user to enter a vaild city name
            alert("Please enter a vaild city name.")
        }
    })
    // incase of netowrk error alert the user
    .catch(function(error){
        alert("Unable to connect to weather app.");
    });
};

searchBtnEl.click(function(){
    // variable to hold the name of the inputted city
    cityName = $("#cityTextArea").val()
    // format the city to be capitalizec
    cityName = capitalizeFirstLetter(cityName);
   
    // conditional to check if the input box is empty or not
    if (cityName === ""){
        alert("You must enter a city to see a forecast!");
        
    } else{
        // set the main title to the name of the inputted city
        // $("#chosen-city").text(cityName);

        // create a button of the inputted city and append it to the list element
        $(".city-list").append('<button type="button" class="city-btn bg-info list-group-item list-group-item-action mt-2">' + cityName + '</button>');
        //call the function to fetch the API
        getForecast(cityName)
    }
});

