var topics = ["BigBang", "Super Junior", "Girl's Generation", "TVXQ", "BTS", "MAMAMOO", "EXO", "BAP", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)", "MBLAQ", "BlockB", "Epik High"];
var numberDisplayed = 10;
var firstClick = true; 
var lastClicked;

var gifTastic = {
    createButtons(){
        // Generates button for each index of the topics array
        for(var i = 0; i < topics.length; i++){
            var newButton = $("<button>");
            newButton.addClass("btn btn-outline-info m-1 gifButtons");
            newButton.text(topics[i]);
            $("#buttons").append(newButton);
        }
    },
    generateGifs(buttonName){
        var that = this;
        // Generates appropriate URL for AJAX 
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + buttonName + "+KPOP&api_key=10dpuSkxshqdLim7xp7FyDbgQPlJC3Vc&limit=" + numberDisplayed;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(result){
            // Empties the gifs div before generating new gifs
            $("#gifs").empty();
            // Generates a gif for all data returned from API
            for(var i = 0; i < result.data.length; i++){
                var gif = result.data[i].images.fixed_height_still.url;
                var downloadLink = result.data[i].images.original.url;
                // Generates a rating for each gif
                var rating = result.data[i].rating.toUpperCase();
                var imageRating = $("<span>").text("Rating: " + rating);
                // Generates a download button for each gif
                var download = $("<button>");
                download.addClass("downloadButton");
                download.attr("href", downloadLink);
                download.html("<i class='fas fa-download'></i>");
                // Generates each gif
                var newImage = $("<img>");
                newImage.addClass("m-1 gifImage");
                newImage.attr({"value": i, "src": gif, "status": "static"});
                // Generates a new div for each gif
                var newDiv = $("<div>");
                newDiv.addClass("col text-center m-2")
                // Append everything to the new div 
                newDiv.append(newImage, "<br>", download, "<span>&nbsp</span>", imageRating);
                // Display new div in gifs div
                $("#gifs").append(newDiv);
            }
            // Once the gifs are generated, then user can click or download image
            that.clickImage();
            that.downloadImage();
        })
    },
    clickButton(){
        var that = this;
        // Generates appropriate gifs according to button clicked
        $(".gifButtons").on("click", function(){
            // Default number of gifs displayed is 10
            numberDisplayed = 10;
            // On the first click of the page, the add more gifs button is generated
            if(firstClick){
                var moreButton = $("<button>");
                moreButton.addClass("btn btn-outline-info addMoreGifs");
                moreButton.text("Add 10 more GIFs");
                $(".input-group").after(moreButton);
                firstClick = false; 
            }
            // Stores the text of the clicked button 
            lastClicked = $(this).text();
            // Runs the generategifs method using the text of button clicked
            that.generateGifs(lastClicked);   
        })
        
    },
    clickImage(){
        // Changes between static image and gif on click
        $(".gifImage").on("click", function(){
            if($(this).attr("status") === "static"){
                // Replacing the part in the src that determines if image is static or gif
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
        // collects user's input once submit button was clicked
        $("#submit").on("click", function(){
            var input = $("#search").val();
            $("#search").val("");
            // pushes input into the topics array
            topics.push(input);
            // empties buttons div so buttons aren't repeated
            $("#buttons").empty();
            // Creates the buttons again, this time including user's input
            that.createButtons();
            // Runs the clickbutton method again, so new user button can be clicked
            that.clickButton();
        });
    },
    addMoreGifs(){
        var that = this; 
        $(".container").on("click", ".addMoreGifs", function(){
            // Once addmoregifs button is clicked, increase number of displayed gifs 
            numberDisplayed += 10;
            // Run generategifs method again using the new number of displayed
            that.generateGifs(lastClicked);
        })
    },
    downloadImage(){
        // One click download of gif using download.js plugin 
        // Would have liked to use the download attribute in HTML5, but does not work with cross-origin files
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