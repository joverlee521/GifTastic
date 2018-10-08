// Variable declarations
var topics = ["BigBang", "Super Junior", "Girl's Generation", "TVXQ", "MAMAMOO", "EXO", "BAP", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)", "MBLAQ", "BlockB", "Epik High"];
var numberDisplayed = 10;
var firstClick = true; 
var lastClicked;
var player; 
var favorites = [];
var firstFavoriteClick = true; 

var gifTastic = {
    createButtons(){
        // Dynamically creates a button for each index of the topics array
        for(var i = 0; i < topics.length; i++){
            var newButton = $("<button>");
            newButton.addClass("btn btn-outline-info m-1 gifButtons");
            newButton.text(topics[i]);
            $("#buttons").append(newButton);
        }
    },
    // Uses GIPHY API to generate gifs 
    generateGifs(buttonName){
        // Incorporates the button name and number of gifs to display in the URL for AJAX call
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + buttonName + "+KPOP&api_key=10dpuSkxshqdLim7xp7FyDbgQPlJC3Vc&limit=" + numberDisplayed;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(result){
            // Empties the gifs div before generating new gifs
            $("#gifs").empty();
            // Generates a gif for all data returned from API
            for(var i = 0; i < result.data.length; i++){
                // Grabs the gif url and download url
                var gif = result.data[i].images.fixed_height_still.url;
                var downloadLink = result.data[i].images.original.url;
                // Generates a rating for each gif
                var rating = result.data[i].rating.toUpperCase();
                var imageRating = $("<span>").text("Rating: " + rating);
                // Generates a download button for each gif
                var download = $("<button class='downloadButton'>");
                download.attr("data-link", downloadLink);
                download.html("<i class='fas fa-download'></i>");
                // Generates favorite button
                var favorite = $("<button class='favoriteButton'>");
                favorite.attr("data-link", gif);
                favorite.html("<i class='fas fa-heart'></i>");
                // Changes favorite button if corresponding gif has already been added to favorites
                if(favorites.indexOf(favorite.attr("data-link")) >= 0){
                    favorite.css({"color": "#F6E848", "pointer-events": "none"});
                }
                // Generates each gif
                var newImage = $("<img>");
                newImage.addClass("m-1 gifImage");
                newImage.attr({"src": gif, "status": "static"});
                // Generates a new div for each gif
                var newDiv = $("<div>");
                newDiv.addClass("col-12 col-sm text-center m-2")
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
            // Remove clearFavorites button
            $(".clearFavorites").remove();
            // Flag that allows clearFavorites button to be generated again
            firstFavoriteClick = true;
            // On the first click of the page, the add more gifs button is generated
            if(firstClick){
                var moreButton = $("<button>");
                moreButton.addClass("btn btn-outline-info addMoreGifs");
                moreButton.text("Add 10 more GIFs");
                $("form").after(moreButton);
                firstClick = false; 
            }
            // Stores the text of the clicked button 
            lastClicked = $(this).text();
            // Runs the generategifs and searchYouTube method using the text of button clicked
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
            // stores user's input
            var input = $("#search").val();
            // Does not allow empty inputs
            if(input === ""){
                $("#search").popover({
                    content: "Please enter something into the search bar",
                    placement: "top"
                })
                $("#search").popover("show");
                setTimeout(function(){$("#search").popover("dispose")}, 1500);
                return;
            }
            // Does not allow double entries
            else if(topics.indexOf(input) >= 0){
                $("#search").popover({
                    content: "This was already searched!",
                    placement: "top"
                })
                $("#search").popover("show");
                setTimeout(function(){$("#search").popover("dispose")}, 1500);
                return;
            }
            else{
                // empties search bar once input is entered
                $("#search").val("");
                topics.push(input);
                $("#buttons").empty();
                // Creates the buttons again, this time including user's input
                that.createButtons();
            }
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
            download($(this).attr("data-link"));
        })
    },
    storeFavorites(){
        $(document).on("click", ".favoriteButton", function(){
            // Stores favorite gifs in favorite array and localstorage
            favorites.push($(this).attr("data-link"));
            localStorage.setItem("gifs", JSON.stringify(favorites));
            // Changes and disables clicked favoriteButton
            $(this).css({"color": "#F6E848", "pointer-events": "none"});
        })
    },
    displayFavorites(){
        // ensures favorites reflects what is stored in localstorage
        if(localStorage.getItem("gifs")){
            favorites = JSON.parse(localStorage.getItem("gifs"));
        }
        else{
            favorites = [];
        }
        $(document).on("click", "#favorites", function(){
        
            // Empty containers so favorites can be displayed
            $("#gifs").empty();
            $("#sortable").empty();
            $("#youtube-player").empty();
            $("#youtube-player").removeClass("video-container");
            $(".addMoreGifs").remove();
            firstClick = true; 
            // Display favorites if user has favorited gifs
            if (favorites.length > 0){
                // Displays FYI message
                var fyi = $("<div class='col'>");
                fyi.html("<h4>FYI: You can sort your favorite GIFs by dragging them around!</h4>");
                $("#gifs").append(fyi);
                for(var i = 0; i < favorites.length; i ++){
                    // Generates each favorite gif
                    var favoriteGif = $("<img>");
                    favoriteGif.addClass("m-2 gifImage");
                    favoriteGif.attr({"src": favorites[i], "status": "static"});
                    $("#sortable").append(favoriteGif);
                }
                // Ensures clear button is not created multiple tiems
                if(firstFavoriteClick){
                var clear = $("<button>");
                clear.addClass("btn btn-outline-danger mb-2 clearFavorites");
                clear.text("Clear Favorites");
                $("#gifs").after(clear);
                firstFavoriteClick = false; 
                }
            } 
            // Display empty message if no favorites yet
            else {
                var message = $("<div class='col'>")
                message.html("<h2>You don't have any favorites yet!</h2>")
                $("#gifs").append(message);
            }
        })
    },
    clearFavorites(){
        // clears favorites and localstorage
        $(document).on("click", ".clearFavorites", function(){
            $("#gifs").empty();
            $("#sortable").empty();
            localStorage.removeItem("gifs");
            favorites = [];
            $(this).remove();
            firstFavoriteClick = true; 
        })
    },
    // enabled sorting of favorite GIFs using jQuery UI
    sortFavorites(){
        $("#sortable").sortable({
            helper: "clone",
            opacity: 0.7   
        });
        // Updates localstorage and favorites array once sort has been updated
        $( "#sortable" ).on("sortupdate",function( event, ui ) {
            // sorts ids of gifs into a string
            var sorted = $( this ).sortable( "serialize", {attribute: "src"});
            // reconstitute the url 
            var newSorted = sorted.replace(/\[]=/g, "_");
            // change string into an array
            var sortedArray = newSorted.split("&");
            // store sortedArray into localStorage
            localStorage.setItem("gifs", JSON.stringify(sortedArray)) ;
            favorites = JSON.parse(localStorage.getItem("gifs"));   
      });
    },
    // Uses YouTube DATA API to search for relevant YouTube Videos
    searchYouTube(buttonName){
        var that = this;
        var newURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + buttonName + "+MV&type=video&videoEmbeddable=true&videoLicense=youtube&videoSyndicated=true&key=AIzaSyBUf7sZOA7CfTMYvlNTCUvn-U05WYjbh1Y";
        $.ajax({
            url: newURL,
            method: "GET"
        }).then(function(result){
            // Empties youtube player div to allow new video to be embedded
            $("#youtube-player").empty();
            $("#youtube-player").addClass("video-container");
            if(result.items.length === 0){
                // Displays when no videos are returned
                $("#youtube-player").append("<h2>No Video Available</h2>");
            }
            else{
                // Embeds video using videoID from search API
                var vidId = result.items[0].id.videoId;
                $("#youtube-player").append("<div id='player'>");
                that.onYouTubeIframeAPIReady(vidId);
            }
        })
    },
    // Using YouTube iFrame API to embed video into webpage
    // Copy & pasted from YouTube API documentation
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
    gifTastic.sortFavorites();
})