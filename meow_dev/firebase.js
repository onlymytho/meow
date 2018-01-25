// Initialize Firebase
// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyDOp6tQe-xP3-yr4qrUI3zLIN5aS4HsA7A",
  authDomain: "meow-8b4d0.firebaseapp.com",
  projectId: "meow-8b4d0",
  databaseURL: "https://meow-8b4d0.firebaseio.com/",
  storageBucket: "gs://meow-8b4d0.appspot.com/",
  messagingSenderId: "1024050973443"
};
firebase.initializeApp(config);

// Get a reference to the database service


function CurrentDate() {
    var d = new Date(Date.now()),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('');
}

meow_today_count_ref = firebase.database().ref('meow-today/' + CurrentDate() + '/count')


function meow_counter() {
    meow_today_count_ref.transaction(function(count){
        if (count === null) {
            // the counter doesn't exist yet, start at one
            return 1;
        } else if (typeof count === 'number') {
            // increment - the normal case
            return count + 1;
        } else {
            // we can't increment non-numeric counts
            console.log('The counter has a non-numeric count: ' + count)
            // letting the callback return undefined cancels the transaction
        }
    });
    display_meow_count()
}
function display_meow_count() {
    meow_today_count_ref.on('value', function(data) {
        document.getElementById('meow_count').innerText = data._e.T
    });
}

function initializeData(){
    display_meow_count()
}


initializeData()
