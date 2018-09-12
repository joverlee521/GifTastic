var topics = ["Big Bang", "Super Junior", "Girl's Generation", "TVXQ", "BTS", "MAMAMOO", "EXO", "BAP", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)", "MBLAQ", "BlockB", "Epik High"];

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
        var that = this;
        $(".btn").on("click", function(){
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + $(this).text() + "+kpop&api_key=10dpuSkxshqdLim7xp7FyDbgQPlJC3Vc&limit=10";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(result){
                $("#gifs").empty();
                for(var i = 0; i < result.data.length; i++){
                    var gif = result.data[i].images.fixed_height_still.url;
                    var rating = result.data[i].rating.toUpperCase();
                    var imageRating = $("<span>");
                    imageRating.text("Rating: " + rating);
                    var newImage = $("<img>");
                    newImage.addClass("m-1 gifImage");
                    newImage.attr({"value": i, "src": gif, "status": "static"});
                    var newDiv = $("<div>");
                    newDiv.addClass("col text-center")
                    newDiv.append(newImage, "<br>", imageRating);
                    $("#gifs").append(newDiv);
                }
                that.clickImage();
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
    },
    collectInput(){
        var that = this;
        $("#submit").on("click", function(){
            var input = $("#search").val();
            $("#search").val("");
            topics.push(input);
            $("#buttons").empty();
            that.createButtons();
            that.clickButton();
        });
    }
}

$(document).ready(function(){
    gifTastic.createButtons();
    gifTastic.clickButton();
    gifTastic.collectInput();
})