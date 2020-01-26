var firebaseConfig = {
  apiKey: 'AIzaSyD6EG4Tht56f2UHhcrI5wxZquYGpv2nWRE',
  authDomain: 'train-scheduler-41ff2.firebaseapp.com',
  databaseURL: 'https://train-scheduler-41ff2.firebaseio.com',
  projectId: 'train-scheduler-41ff2',
  storageBucket: 'train-scheduler-41ff2.appspot.com',
  messagingSenderId: '10972729827',
  appId: '1:10972729827:web:eef4daf8df80cdb113d0d6'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//variable to reference database
var database = firebase.database();

//initial values
var name = '';
var destination = '';
var firstTrain = '';
var frequency = '';

//click function to add train to table
$('#submit').on('click', function(event) {
  //prevent the page from refreshing
  event.preventDefault();

  //get inputs
  name = $('#trainName')
    .val()
    .trim();
  destination = $('#destination')
    .val()
    .trim();
  firstTrain = $('#firstTrain')
    .val()
    .trim();
  frequency = $('#frequency')
    .val()
    .trim();

  //code to push..henge what is saved in firebase
  database.ref().push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    datedAdded: firebase.database.ServerValue.TIMESTAMP
  });

  //clear form values once form is submitted
  $('#trainName').val('');
  $('#destination').val('');
  $('#firstTrain').val('');
  $('#frequency').val('');
});

//firebase is always watching for changes to the data..this will print the changes to the console and html
database.ref().on(
  'child_added',
  function(childSnapshot) {
    //variables to hold childSnapshot
    var tName = childSnapshot.val().name;
    var tDest = childSnapshot.val().destination;
    var fTrain = childSnapshot.val().firstTrain;
    var tFreq = childSnapshot.val().frequency;

    //first time (push back 1 year to make sure it come before current time)
    var firstTimeConvert = moment(fTrain, 'hh:mm A').subtract(1, 'years');

    //current time
    var currentTime = moment().format('hh:mm A');
    console.log('current time: ' + moment(currentTime));

    //difference between the time
    var diffTime = moment().diff(moment(firstTimeConvert), 'minutes');

    //time apart
    var tApart = diffTime % tFreq;

    //minute until next train arrive
    var tMinutes = tFreq - tApart;

    //next arriving train
    var nextTrain = moment()
      .add(tMinutes, 'minutes')
      .format('hh:mm A');

    //append data into html
    $('#trainInfo').append(
      '<tr><td>' +
        tName +
        '</td><td>' +
        tDest +
        '</td><td>' +
        tFreq +
        '</td><td>' +
        nextTrain +
        '</td><td>' +
        tMinutes +
        '</td></tr>'
    );
  },
  //if any errors are experienced, log them to console
  function(errorObject) {
    console.log('Errors handled: ' + errorObject.code);
  }
);
