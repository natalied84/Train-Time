var config = {
    apiKey: "AIzaSyDUIxpt9VrNKmlHN9A9OriLKRmL8da-dds",
    authDomain: "homework-d3ffe.firebaseapp.com",
    databaseURL: "https://homework-d3ffe.firebaseio.com",
    projectId: "homework-d3ffe",
    storageBucket: "homework-d3ffe.appspot.com",
    messagingSenderId: "151021568470"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var name = $("#train-name").val().trim();
    var dest = $("#dest-input").val().trim();
    var firstTime = $("#first-time").val().trim();
    var trainFreq = $("#freq-input").val().trim();

    // Pushes to Firebase
    database.ref().push({
        tName: name,
        dest: dest,
        time: firstTime,    
        freq: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });

    alert("train successfully added");

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#dest-input").val("");
    $("#first-time").val("");
    $("#freq-input").val("");
});





database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot);

    // Store everything into a variable.
    var trainName = childSnapshot.val().tName;
    var destination = childSnapshot.val().dest;
    var frequency = childSnapshot.val().freq;
    var firstTime = childSnapshot.val().time;
    // var minutesAway = childSnapshot.val().minsAway;


    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "days");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequency   ;
    var tMinutesTillTrain = frequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");

    var clearBtn = $("<button>");
    clearBtn.addClass("clear-btn");
    clearBtn.attr("data-key", childSnapshot.ref.key)
    clearBtn.text("X");

    var newRow = $("<tr id='" + childSnapshot.ref.key + "'>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(tMinutesTillTrain),
        $("<td>").text(nextTrain),
        $("<td>").html(clearBtn),
    );

    // Append the new row to the table
    $("#train-table").append(newRow);
});


$("#train-table").on("click", ".clear-btn", function() {

    var lineClearID = $(this).attr("data-key");
    database.ref().child(lineClearID).remove();
    $("#" + lineClearID).remove();  
})