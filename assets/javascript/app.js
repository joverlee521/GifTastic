var topics = ["Big Bang", "Super Junior", "Girl's Generation", "TVXQ", "BTS", "MAMAMOO", "EXO", "BAP", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)", "MBLAQ", "BlockB", "Epik High"];
var numberDisplayed = 10;
var firstClick = true; 
var lastClicked;

var gifTastic = {
    createButtons(){
        for(var i = 0; i < topics.length; i++){
            var newButton = $("<button>");
            newButton.addClass("btn btn-outline-info m-1 gifButtons");
            newButton.text(topics[i]);
            $("#buttons").append(newButton);
        }
    },
    generateGifs(buttonName){
        var that = this;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + buttonName + "+KPOP&api_key=10dpuSkxshqdLim7xp7FyDbgQPlJC3Vc&limit=" + numberDisplayed;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(result){
                $("#gifs").empty();
                for(var i = 0; i < result.data.length; i++){
                    var gif = result.data[i].images.fixed_height_still.url;
                    var downloadLink = result.data[i].images.original.url;
                    var rating = result.data[i].rating.toUpperCase();
                    var imageRating = $("<span>").text("Rating: " + rating);
                    var download = $("<button>");
                    download.addClass("downloadButton");
                    download.attr("href", downloadLink);
                    download.html("<i class='fas fa-download'></i>");
                    var newImage = $("<img>");
                    newImage.addClass("m-1 gifImage");
                    newImage.attr({"value": i, "src": gif, "status": "static"});
                    var newDiv = $("<div>");
                    newDiv.addClass("col text-center m-2")
                    newDiv.append(newImage, "<br>", download, imageRating);
                    $("#gifs").append(newDiv);
                }
                that.clickImage();
                that.downloadImage();
            })
    },
    clickButton(){
        var that = this;
        $(".gifButtons").on("click", function(){
            numberDisplayed = 10;
            if(firstClick){
                var moreButton = $("<button>");
                moreButton.addClass("btn btn-outline-info addMoreGifs");
                moreButton.text("Add 10 more GIFs");
                $(".input-group").after(moreButton);
                firstClick = false; 
            }
            lastClicked = $(this).text();
            that.generateGifs(lastClicked);   
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
    },
    addMoreGifs(){
        var that = this; 
        $(".container").on("click", ".addMoreGifs", function(){
            numberDisplayed += 10;
            that.generateGifs(lastClicked);
        })
    },
    downloadImage(){
        $(".downloadButton").on("click", function(){
            download($(this).attr("href"));
        })
    }
}

$(document).ready(function(){
    gifTastic.createButtons();
    gifTastic.clickButton();
    gifTastic.collectInput();
    gifTastic.addMoreGifs();
})