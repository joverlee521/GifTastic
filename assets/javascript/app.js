var topics = ["BigBang", "Super Junior", "Girl's Generation", "TVXQ", "BTS", "MAMAMOO", "EXO", "BAP", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)", "MBLAQ", "BlockB", "Epik High"];
var numberDisplayed = 10;
var firstClick = true; 
var lastClicked;
var player; 
var favorites = [];
var firstFavoriteClick = true; 

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
    // Uses GIPHY API to generate gifs 
    generateGifs(buttonName){
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
                // Generates favorite button
                var favorite = $("<button>");
                favorite.addClass("favoriteButton");
                favorite.attr("href", gif);
                favorite.html("<i class='fas fa-heart'></i>");
                if(favorites.indexOf(favorite.attr("href")) >= 0){
                    favorite.css({"color": "#F6E848", "pointer-events": "none"});
                }
                // Generates each gif
                var newImage = $("<img>");
                newImage.addClass("m-1 gifImage");
                newImage.attr({"src": gif, "status": "static"});
                // Generates a new div for each gif
                var newDiv = $("<div>");
                newDiv.addClass("col text-center m-2")
                // Append everything to the new div 
                newDiv.append(newImage, "<br>", favorite, "<span>&nbsp</span>", imageRating, "<span>&nbsp</span>", download);
                // Display new div in gifs div
                $("#gifs").append(newDiv);
            }
        })
    },
    clickButton(){
        var that = this;
        // Generates appropriate gifs according to button clicked
        $(document).on("click", ".gifButtons", function(){
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
            that.searchYouTube(lastClicked);
        })
        
    },
    clickImage(){
        // Changes between static image and gif on click
        $(document).on("click", ".gifImage", function(){
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
        $("#submit").on("click", function(event){
            event.preventDefault();
            var input = $("#search").val();
            $("#search").val("");
            // pushes input into the topics array
            topics.push(input);
            // empties buttons div so buttons aren't repeated
            $("#buttons").empty();
            // Creates the buttons again, this time including user's input
            that.createButtons();
        });
    },
    addMoreGifs(){
        var that = this; 
        $(document).on("click", ".addMoreGifs", function(){
            // Once addmoregifs button is clicked, increase number of displayed gifs 
            numberDisplayed += 10;
            // Run generategifs method again using the new number of displayed
            that.generateGifs(lastClicked);
        })
    },
    downloadImage(){
        // One click download of gif using download.js plugin 
        // Would have liked to use the download attribute in HTML5, but does not work with cross-origin files
        $(document).on("click", ".downloadButton", function(){
            download($(this).attr("href"));
        })
    },
    storeFavorites(){
        $(document).on("click", ".favoriteButton", function(){
            favorites.push($(this).attr("href"));
            localStorage.setItem("items", JSON.stringify(favorites));
            $(this).css({"color": "#F6E848", "pointer-events": "none"});
        })
    },
    displayFavorites(){
        if(localStorage.getItem("items")){
            favorites = JSON.parse(localStorage.getItem("items"));
        }
        else{
            favorites = [];
        }
        $(document).on("click", "#favorites", function(){
            $("#gifs").empty();
            $("#youtube-player").empty();
            if (favorites.length > 0){
                for(var i = 0; i < favorites.length; i ++){
                    // Generates each gif
                    var favoriteGif = $("<img>");
                    favoriteGif.addClass("m-2 gifImage");
                    favoriteGif.attr({"src": favorites[i], "status": "static"});
                    $("#gifs").append(favoriteGif);
                }
                if(firstFavoriteClick){
                var clear = $("<button>");
                clear.addClass("btn btn-outline-danger clearFavorites");
                clear.text("Clear Favorites");
                $("#gifs").after(clear);
                firstFavoriteClick = false; 
                }
            } 
            else {
                var message = $("<div class='col'>")
                message.html("<h2>You don't have any favorites yet!</h2>")
                $("#gifs").append(message);
            }
        })
    },
    clearFavorites(){
        $(document).on("click", ".clearFavorites", function(){
            $("#gifs").empty();
            localStorage.clear();
            favorites = [];
            $(this).remove();
            firstFavoriteClick = true; 
        })
    },
    // Uses YouTube DATA API to search for relevant YouTube Video
    searchYouTube(buttonName){
        var that = this;
        var newURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + buttonName + "+MV&type=video&videoEmbeddable=true&key=AIzaSyBUf7sZOA7CfTMYvlNTCUvn-U05WYjbh1Y";
        $.ajax({
            url: newURL,
            method: "GET"
        }).then(function(result){
            // Empties youtube player div to allow new video to be embedded
            $("#youtube-player").empty();
            if(result.items.length === 0){
                $("#youtube-player").append("<h2>No Video Available</h2>");
            }
            else{
                var vidId = result.items[0].id.videoId;
                $("#youtube-player").append("<div id='player'>");
                // Embeds video using videoID from search API
                that.onYouTubeIframeAPIReady(vidId);
            }
        })
    },
    // Using YouTube iFrame API to embed video into webpage
    onYouTubeIframeAPIReady(id) {
        var that = this;
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: id,
          events: {
            'onReady': that.onPlayerReady,
          }
        });
    },
    // Will play youtube video once the video is ready
    onPlayerReady(event) {
        event.target.playVideo();
    },
}

$(document).ready(function(){
    gifTastic.createButtons();
    gifTastic.clickButton();
    gifTastic.clickImage();
    gifTastic.collectInput();
    gifTastic.addMoreGifs();
    gifTastic.downloadImage();
    gifTastic.storeFavorites();
    gifTastic.displayFavorites();
    gifTastic.clearFavorites();
})