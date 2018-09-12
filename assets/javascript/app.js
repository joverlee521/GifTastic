var topics = ["Big Bang", "Super Junior", "Girl's Generation", "TVXQ", "BTS", "MAMAMOO", "EXO", "B.A.P.", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)", "MBLAQ", "Block B", "Epik High"];

var gifTastic = {
    createButtons(){
        for(var i = 0; i < topics.length; i++){
            var newButton = $("<button>");
            newButton.addClass("btn btn-outline-info m-1");
            newButton.text(topics[i]);
            $("#buttons").append(newButton);
        }
    },
    clickButton(){
        $(".btn").on("click", function(){
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).text() + "+kpop&api_key=10dpuSkxshqdLim7xp7FyDbgQPlJC3Vc&limit=10";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(result){
                $("#gifs").empty();
                for(var i = 0; i < result.data.length; i++){
                    var gif = result.data[i].images.fixed_height_still.url;
                    var newImage = $("<img>");
                    newImage.addClass("m-1 gifImage");
                    newImage.attr({"value": i, "src": gif, "status": "static"});
                    $("#gifs").append(newImage);
                }
                gifTastic.clickImage();
            })
        })
    },
    clickImage(){
        $(".gifImage").on("click", function(){
            if($(this).attr("status") === "static"){
                this.src = this.src.replace("200_s", "200");
                $(this).attr("status", "gif");
            }
            else{
                this.src = this.src.replace("200", "200_s");
                $(this).attr("status", "static");
            }
        })
    }
}

$(document).ready(function(){
    gifTastic.createButtons();
    gifTastic.clickButton();
})