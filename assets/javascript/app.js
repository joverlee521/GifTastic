var topics = ["Big Bang", "Super Junior", "Girl's Generation", "TVXQ", "BTS", "MAMAMOO", "EXO", "B.A.P.", "BLACKPINK", "SHINee", "EXID", "AOA", "f(x)"]

function createButtons(){
    for(var i = 0; i < topics.length; i++){
        var newButton = $("<button>");
        newButton.addClass("btn btn-outline-info m-1");
        newButton.text(topics[i]);
        $("#buttons").append(newButton);
    }
}

$(document).ready(function(){
    createButtons();
})