var searchBtnEl = $("#searchBtn");
// global variable to hold the city name
var cityName = "";

// create a empty array to be used for local storage
var cityStorage = [];

// boolean to check if the city has been chosen or not
var selectedCity = false;

// if there is content in local storage create the buttons to see the saved cities
$(document).ready(function(){
    // check if the local storage is null or not when loading the page
    if(localStorage.getItem("cityList") != null){

        // get items from local storage and set them to the array
        var savedCities = localStorage.getItem("cityList");
        cityStorage = JSON.parse(savedCities);
    
        // loop through the stored array and create the buttons for the cities
        for(var i =0; i<cityStorage.length; i++){
            $(".city-list").append('<button type="button" class="city-btn bg-info list-group-item list-group-item-action mt-2">' + cityStorage[i] + '</button>');
        }
    } else {
        return;
    }

});

// function to handle the click event on the city's that are saved
$(".city-list").click(function(event){
    // get the text of the selected button
    var chosenCity = event.target.textContent;
    // call the function to show the forecast of the selected city
    getForecast(chosenCity, true);
});

// function to capitalize the first letter of a string to be use when grabbing a inputted city
function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// function to check if a 5 day forecast is already displaying. If so empty the div and call the function to display the new forecast
var cityForecastCheck = function(forecast){
    if ($(".card-holder").children().length > 0){
        $(".card-holder").empty();
        getFutureForecast(forecast);
    } else {
        getFutureForecast(forecast);
    }

}

// function to check if local storage is empty or not
var checkLocalStorage = function(cityName){
    if (localStorage.getItem("cityList")===null){
        cityStorage.push(cityName)
        localStorage.setItem("cityList", JSON.stringify(cityStorage));
    } else if (localStorage.getItem("cityList") != null){
        var cityList = localStorage.getItem("cityList");
        cityStorage = JSON.parse(cityList);
        cityStorage.push(cityName);
        localStorage.setItem("cityList", JSON.stringify(cityStorage));
    }
};

// function to get the 5 day forecast
var getFutureForecast = function(upcomingWeather){

    // loop through the passed array parameter and create elements for the card to display the 5 day forecast
    for (var i = 0; i<upcomingWeather.length; i++){

        // create divs to hold the elements
        var cardEl = document.createElement("div");
        var cardContentEl = document.createElement("div");
        var imageContentEl = document.createElement("div");
        var weatherContentEl = document.createElement("div");
        var tempEl = document.createElement("div");
        var sunriseEl = document.createElement("div");
        var sunsetEl = document.createElement("div");
        // set the class name and attributes for the card
        cardEl.className="card";
        cardEl.setAttribute('style', 'width: 10rem; background-color:#798699;');
        imageContentEl.setAttribute('style', "margin:0 auto;");
        cardContentEl.className="card-body";
    
        // set the innerHTML for the card with the 5 day forecast info from the array
        cardContentEl.innerHTML = '<h5 class=card-title card-date>' + moment.unix(upcomingWeather[i].dt).format("M/DD/YY") + '</h5>'
        imageContentEl.innerHTML = '<img src=http://openweathermap.org/img/wn/' + upcomingWeather[i].weather[0].icon + '@2x.png alt=weather icon</img>';
        weatherContentEl.innerHTML = '<p class=card-text>'+upcomingWeather[i].weather[0].description+'</p>';
        tempEl.innerHTML = '<p class=card-text>Temp: '+Math.round(upcomingWeather[i].temp.day)+'</p>';
        sunriseEl.innerHTML = '<p class=card-text>Wind Speed: '+upcomingWeather[i].speed+'mph</p>';
        sunsetEl.innerHTML = '<p class=card-text>Humidity: '+upcomingWeather[i].humidity+' %</p>';
    
        // append all of the elements
        cardEl.append(cardContentEl);
        cardEl.append(imageContentEl);
        cardEl.append(weatherContentEl);
        cardEl.append(tempEl);
        cardEl.append(sunriseEl);
        cardEl.append(sunsetEl);
        
        // append the card to the main element
        $(".card-holder").append(cardEl);
    }

};

// function to get the current day's forecast
var getCurrentDayForecast = function(cityForecast){
    //display the city and date to the user
    $("#chosen-city").text(cityForecast.city.name + " - " + moment.unix(cityForecast.list[0].dt).format("ddd, M/DD/YY"));

    // create a variable to hold the id of the icon the current day's weather and set it to a url and to the image element
    var weatherIcon = cityForecast.list[0].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    $("#weather-icon").attr("src", iconUrl);

    //set the decsription, temperature, sunrise and sunset of the current day's weather
    $("#city-desc").text(cityForecast.list[0].weather[0].description);
    $("#city-temp").text("Temp: " + Math.round(cityForecast.list[0].temp.day) + " degrees");
    $("#city-sunrise").text("Wind Speed: " + cityForecast.list[0].speed + " mph");
    $("#city-sunset").text("Humidity: " + cityForecast.list[0].humidity + " %");

};

//  function to display the 5 day forecast from the API data 
var displayForecast = function(cityForecast){
    // set an array to hold the upcoming 5 day forecast
    var upcomingWeather = [];

    // loop through the data and push into the array
    for(var i=0; i<cityForecast.list.length; i++){
        upcomingWeather.push(cityForecast.list[i]);
    }
    // remove the current day forecast from the array
    upcomingWeather.splice(0, 1);
    // call the function to check if a 5 day forecast is currently displayed
    cityForecastCheck(upcomingWeather);
}

// function to get the fetch the data from the weather api
var getForecast = function (city, selectedCity){
    // variable to hold the api for the request
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&cnt=6&units=imperial&appid=006aa30064ca02ee02bd1cc6373cf4f3";

    // fetch request to the api
    fetch(apiURL).then(function(response){
        if(response.ok){
            response.json().then(function(data){

                if (selectedCity){
                    //call the function to check local storage
                    // checkLocalStorage(cityName)
                
                    // call the function to display the current day forecast
                    getCurrentDayForecast(data);
                    // call the function to display the five day forecast
                    displayForecast(data);

                    selectedCity = false;
                } else {

                    // create a button of the inputted city and append it to the list element
                    $(".city-list").append('<button type="button" class="city-btn bg-info list-group-item list-group-item-action mt-2">' + cityName + '</button>');
    
                    //call the function to check local storage
                    checkLocalStorage(cityName)
                    
                    // call the function to display the current day forecast
                    getCurrentDayForecast(data);
                    // call the function to display the five day forecast
                    displayForecast(data);
                }
            })
        } else {
            // alert the user to enter a vaild city name
            alert("Please enter a vaild city name.")
            return;
        }
    })
    // incase of netowrk error alert the user
    .catch(function(error){
        alert("Unable to connect to weather app.");
    });
};

// click function when the search button is clicked
searchBtnEl.click(function(){
    // variable to hold the name of the inputted city
    cityName = $("#cityTextArea").val()
    // format the city to be capitalizec
    cityName = capitalizeFirstLetter(cityName);
   
    // conditional to check if the input box is empty or not
    if (cityName === ""){
        alert("You must enter a city to see a forecast!");
        return;
    } else{
        
        //call the function to fetch the API
        getForecast(cityName, false);

        // set the main title to the name of the inputted city
        $("#cityTextArea").val("");
    }
});