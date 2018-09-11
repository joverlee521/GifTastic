var topics = ["Big Bang", "Super Junior", "Girl's Generation", "TVXQ", "BTS", "MAMAMOO", "EXO", "B.A.P.", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)", "MBLAQ", "Block B", "Epik High"]

function createButtons(){
    for(var i = 0; i < topics.length; i++){
        var newButton = $("<button>");
        newButton.addClass("btn btn-outline-info m-1");
        newButton.text(topics[i]);
        $("#buttons").append(newButton);
    }
}

function clickButton(){
    $(".btn").on("click", function(){
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).text() + "+kpop&api_key=10dpuSkxshqdLim7xp7FyDbgQPlJC3Vc&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(result){
            $("#gifs").empty();
            for(var i = 0; i < result.data.length; i++){
                var newImage = $("<img>");
                newImage.addClass("m-1 gifImage");
                newImage.attr("src", result.data[i].images.fixed_height_still.url);
                $("#gifs").append(newImage);
            }
        })
    })
}

$(document).ready(function(){
    createButtons();
    clickButton();
})