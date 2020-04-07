$(document).ready(function(){
    $("#searchBtn").on("click", function(){
        event.preventDefault();
        var citySearch = $("#citySearch").val();
        $("#citySearch").val("");
        searchWeather(citySearch)
        // console.log(citySearch)
    })

function searchWeather(city){
    $.ajax({
        type:"GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=9e499300f484c7ee2fa88dd6b24dbc65&units=imperial",
        dataType: "json",

        success: function(data){
            if (history.indexOf(city)=== -1){
                history.push(city)
                window.localStorage.setItem("history", JSON.stringify(history))
                // going to need to call function that will create rows for btns
                if(history.indexOf(city)===-1){
                    history.push(city)
                    window.localStorage.setItem("history", JSON.stringify(history))
                    makeRow(city)
                }
            }
            $("#today").empty()

            console.log(data)
            var date = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString()+ ")")
            var card = $("<div>").addClass("card")
            var wind = $("<p>").addClass("card-text").text("windspeed: " + data.wind.speed + "mph")
            var humidity = $("<p>").addClass("card-text").text("humidity: " + data.main.humidity + "%") 
            var temp = $("<p>").addClass("card-text").text("temperature: " + data.main.temp )
            var cardBody = $("<div>").addClass("card-body")
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")

            date.append(img)
            cardBody.append(date, temp, humidity, wind)
            card.append(cardBody)
             $("#today").append(card)

            
             fiveDay(city)
             uvIndex(data.coord.lat, data.coord.lon)
        
        }


    })
}

    function fiveDay(city){
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=9e499300f484c7ee2fa88dd6b24dbc65&units=imperial", 
            dataType: "json",

          success:function (data){
              $("#forecast").html("<h4>Five Day Forecast</h4>").append("<div class=\'row\'>")
              console.log(data)
              for (var i = 0; i < data.list.length; i++){
                  if(data.list[i].dt_txt.indexOf("15:00:00")!==-1){
                      var col = $("<div>").addClass("col-md-2")
                      var card = $("<div>").addClass("card bg-primary text-white")
                      var body = $("<div>").addClass("card-body")
                      var title = $("<h1>").addClass("card-title").text(new Date (data.list[i].dt_txt).toLocaleDateString())
                      var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png")
                      var p1 = $("<p>").addClass("card-text").text("temp: " + data.list[i].main.temp_max)
                      var p2 = $("<p>").addClass("card-text").text("humidity: " + data.list[i].main.humidity)
                      col.append(card.append(body.append(title, img, p1, p2)))
                      $("#forecast .row").append(col)
                  }
              }
          }
        })  
    }
        function uvIndex(lat, lon){
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=9e499300f484c7ee2fa88dd6b24dbc65&lat="+lat+"&lon="+lon, 
                dataType: "json",

            success:function(data){
                console.log(data)
                var uv = $("<p>").text("uv index: " )
                var btn = $("<span>").addClass("btn btn-sm").text(data.value)
                if (data.value < 3){
                    btn.addClass("btn-success")
                } else if (data.value < 7) {
                 btn.addClass("btn-warning")
                } else {
                    btn.addClass("btn-danger")
                }
                $("#today .card-body").append(uv.append(btn))
            }
                    
                
        })

    }

    // function makeRow(text){
    //     var li = $("<li>").text(text)
    //     $(".history").append(li)    

    //     // attempt to create city name buttons 
    //     for (var i = 0; i < citySearch.length; i++){
    //      var button = $("<button>"); 
    //      button.text(citySearch[i])
    //      $(citySearch).append(button)
    //     }
    // }

    // makeRow()

//create a function for getting 5 day forecast 
//create a function to get uv index  -- take in 2 values: latitude & longitude
//create a function for creating a row for search and history
// create onclick for history buttons



var history = JSON.parse(window.localStorage.getItem("history"))||[]
});
