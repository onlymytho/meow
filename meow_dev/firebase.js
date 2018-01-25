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
meow_today_user_hash_ref = firebase.database().ref('meow-today/' + CurrentDate() + '/user_hash/')

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
    var hash = fingerprinting()
    meow_today_user_hash_ref.update({ [hash]: 1 });

}

function display_meow_count() {
    // ref: https://firebase.google.com/docs/database/web/retrieve-data


    meow_today_count_ref.on('value', function(data) {
        var d = data._e.T
        if (d) {
            document.getElementById('meow_count').innerText = d
        } else {
            document.getElementById('meow_count').innerText = 0
        }
        localStorage.setItem("meow_count", meow_count);
    });
    meow_today_user_hash_ref.on('value', function(data) {
        document.getElementById('butlers_count').innerText = data.numChildren()
        localStorage.setItem("butlers_count", butlers_count);
    });
}

function fingerprinting() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var txt = "BrowserLeaks,com <canvas> 1.0";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    var strng=canvas.toDataURL();

    var hash=0;
    if (strng.length==0) return 'nothing!';
    for (i = 0; i < strng.length; i++) {
		char = strng.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash;
	}
	return hash;
}

function initializeData(){
    display_meow_count()
    fingerprinting()
}


initializeData()
