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
                    var gif = result.data[i].images.fixed_width_still.url;
                    var rating = result.data[i].rating.toUpperCase();
                    var imageRating = $("<span>");
                    imageRating.text("Rating: " + rating);
                    var newImage = $("<img>");
                    newImage.addClass("m-1 gifImage");
                    newImage.attr({"value": i, "src": gif, "status": "static"});
                    var newDiv = $("<div>");
                    newDiv.addClass("col-3 text-center")
                    newDiv.append(newImage);
                    newDiv.append("<br>");
                    newDiv.append(imageRating);
                    $("#gifs").append(newDiv);
                }
                that.clickImage();
            })
        })
    },
    clickImage(){
        $(".gifImage").on("click", function(){
            if($(this).attr("status") === "static"){
                this.src = this.src.replace("200w_s", "200w");
                $(this).attr("status", "gif");
            }
            else{
                this.src = this.src.replace("200w", "200w_s");
                $(this).attr("status", "static");
            }
        })
    },
    collectInput(){
        var that = this;
        $("#submit").on("click", function(){
            var input = $("#search").val();
            $("#search").val("");
            var newButton = $("<button>");
            newButton.addClass("btn btn-outline-info m-1");
            newButton.text(input);
            $("#buttons").append(newButton);
            that.clickButton();
        });
    }
}

$(document).ready(function(){
    gifTastic.createButtons();
    gifTastic.clickButton();
    gifTastic.collectInput();
})