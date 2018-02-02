
// getJSON
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

// numberWithCommas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



var search_result = []
var called_count = 0
var after_temp = ''



// instagram
function call_instagram(count=9, after=after_temp) {
    getJSON('https://v7i1eyrpj1.execute-api.ap-southeast-1.amazonaws.com/prod/meow-api-prod?count='+count+'&after='+after, instagram_callback)
}
var instagram_callback = function(err, instagram_data) {
    if (err != null) {
        console.log('Something went wrong: ' + err);
    }
    else {
        // console.log(instagram_data)
        after_temp = instagram_data.after
        for (i=0; i<instagram_data.data.length; i++) {

            // create image elements
            var image_div = document.createElement( 'div' );
            image_div.className = 'image'

            var img = document.createElement( 'img' );
            image_div.appendChild( img );
            img.className = 'imgs'
            img.src = instagram_data.data[i].image_url
            img.id = search_result.length

            var label_div = document.createElement( 'div' );
            image_div.appendChild( label_div );
            label_div.className = 'label_div'
            label_div.id = 'label_div' + search_result.length
            var profile_img_div = document.createElement( 'div' );
            profile_img_div.id = 'profile_img_div' + search_result.length
            var profile_img = document.createElement( 'img' );
            profile_img.id = 'profile_img' + search_result.length
            var alias_a = document.createElement ('a' );
            var alias = document.createElement( 'p' );
            alias.id = 'alias' + search_result.length
            label_div.appendChild(profile_img_div);
            profile_img_div.appendChild(profile_img);
            label_div.appendChild(alias_a);
            alias_a.appendChild(alias);
            alias_a.href = 'https://www.instagram.com/' + instagram_data.data[i].username
            alias_a.target = '_blank'
            profile_img_div.className = 'profile_img_div'
            profile_img.className = 'profile_img'
            alias.className = 'alias'
            profile_img.src = instagram_data.data[i].profile_url
            alias.innerText = instagram_data.data[i].username


            document.getElementsByClassName('images')[0].appendChild(image_div);
            image_div.classList.add('visible')


            // Put image items into search_result
            search_result.push(instagram_data.data[i].image_url)

            // add actions
            img.addEventListener('click', viewer.show_viewer, false);
            img.addEventListener('mouseover', toggle_label, false)
            img.addEventListener('mouseout', toggle_label, false)
            label_div.addEventListener('mouseover', toggle_label, false)
            label_div.addEventListener('mouseout', toggle_label, false)
        }
    }
}


// giphy
// var offset = Math.floor(Math.random() * 500)
// var giphy_search = ['cat']
//
//
// function call_giphy() {
//     getJSON('https://api.giphy.com/v1/gifs/search?q='+giphy_search[0]+'&api_key=dc6zaTOxFJmzC&limit=9&offset='+offset, giphy_callback);
//     called_count = called_count + 1
// }
//
// var giphy_callback = function(err, giphy_data) {
//   if (err != null) {
//     console.log('Something went wrong: ' + err);
//   }
//   else {
//      for (i=0; i<giphy_data.data.length; i++) {
//          var image_div = document.createElement( 'div' );
//          image_div.className = 'image'
//          var img = document.createElement( 'img' );
//          image_div.appendChild( img );
//          img.className = 'imgs'
//          img.id = search_result.length
//          img.src = giphy_data.data[i].images.downsized_large.url
//          img.addEventListener('click', show_viewer, false);
//          search_result.push(giphy_data.data[i].images.original.url)
//
//          document.getElementsByClassName('images')[0].appendChild(image_div);
//      }
//  offset = offset + 9
//   }
// };


// image label
function toggle_label(e) {
    if (['image', 'imgs', 'label_div', 'label_div on', 'alias', 'profile_img'].indexOf(e.target.className) !== -1) {
        if (e.type == 'mouseover') {
            document.getElementById('label_div'+e.target.id.slice(-1)).classList.add('on')
        } else if (e.type == 'mouseout') {
            document.getElementById('label_div'+e.target.id.slice(-1)).classList.remove('on')
        }
    }
}


// viewer
function Viewer() {
    var current_viewer_image = 0;
}
Viewer.prototype = {
    show_viewer: function(e) {
        document.getElementById('viewer').classList.add('on');
        document.getElementById('viewer_image').src = search_result[e.target.id]
        current_viewer_image = e.target.id
        ready_to_call_check()
    },
    close_viewer: function() {
        document.getElementById('viewer').classList.remove('on');
    },
    next_image: function() {
        var next_image = search_result[parseInt(current_viewer_image)+1]
        if ( !!next_image ) {
            document.getElementById('viewer_image').src = next_image
            current_viewer_image = parseInt(current_viewer_image) + 1
            ready_to_call_check()
        } else {
            call_images()
            document.getElementById('viewer_image').src = next_image
            current_viewer_image = parseInt(current_viewer_image) + 1
            ready_to_call_check()
        }
    },
    prev_image: function() {
        var prev_image = search_result[parseInt(current_viewer_image)-1]
        if ( !!prev_image ) {
            document.getElementById('viewer_image').src = prev_image
            current_viewer_image = parseInt(current_viewer_image) - 1
        }
    },
}
var viewer = new Viewer();

function ready_to_call_check() {
    if (9 * called_count - current_viewer_image  <  3) {
        call_images(9)
    }
}

function call_images(call_count) {
    // call_giphy()
    call_instagram(count=call_count)
}


function get_username() {
    if ( localStorage.getItem("username") ) {
        document.getElementById('input_username').value = localStorage.getItem("username");
    }
}
function set_username() {
    var input_username = document.getElementById('input_username').value
    localStorage.setItem("username", input_username);
}

function adjust_input_width() {
    input = document.getElementById('input_username')
    // if (input.value){
    //     input.style.width = ((input.value.length + 2) * 24) + 'px'
    // } else {'400px'}
}
function get_currenttime() {
    var objToday = new Date(),
    	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    	dayOfWeek = weekday[objToday.getDay()],
    	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
    	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate(),
    	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
    	curMonth = months[objToday.getMonth()],
    	curYear = objToday.getFullYear(),
    	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
    	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
    	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
    	curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
    var time = curHour + ":" + curMinute + curMeridiem
    var date = dayOfWeek + ", " + curMonth + " " + dayOfMonth + ", " + curYear;


    document.getElementById('time').innerText = time;
    document.getElementById('date').innerText = date;
}
function open_survey(type) {
    if (type=='upload') {
        document.getElementById('survey_upload').classList.toggle('on')
        document.querySelector('#upload li').classList.toggle('on')
    } else if (type=='feedback') {
        document.getElementById('survey_feedback').classList.toggle('on')
        document.querySelector('#feedback li').classList.toggle('on')
    }
}
function meow_button_tweak() {
    meow_button_count += 1
    if ([3,7,12,19,27,32,41,57,71,83,97,117,131,177,201].indexOf(meow_button_count) !== -1) {
        meow_aud = new Audio('https://www.google.com/logos/fnbx/animal_sounds/cat.mp3')
        meow_aud.volume = 0.1;
        meow_aud.play()
    }
}
function display_initiation() {
    // WARNING:: In case you want to delete email in localStorage
    // localStorage.removeItem('email')

    if (!localStorage.email) {
        document.getElementById('initiation').style.display = 'block'
    } else {
        console.log('Registered: '+localStorage.email)
    }
}
function user_register(boolean) {
    let email = document.getElementById('register_email')
    let password = document.getElementById('register_pw')
    let confirm_password = document.getElementById('register_pw_confirmation')

    if (boolean == false) {
        // Reset(disable) customvalidity messeges.
        email.setCustomValidity("")
        password.setCustomValidity("")
        confirm_password.setCustomValidity("")
    } else if (boolean == true){
        console.log('start to register')
        // validate register form
        if (!email.value  ||  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) == false ) {
            // Uninputed email or invalid
            email.setCustomValidity("Please enter an valid email address")
        } else if (!password.value  ||  /^[a-zA-Z0-9]{6,16}$/.test(password.value) == false) {
            // Uninputed password or invalid password. Password should mix characters and number. And it should be 6~16 chars.
            password.setCustomValidity("Please enter an password between 6 ~ 16 characters")
        } else if (!confirm_password.value  ||  password.value != confirm_password.value) {
            // Uninputed password confirmation or password and confirmation don't match.
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            // Reset(disable) customvalidity messeges.
            email.setCustomValidity("")
            password.setCustomValidity("")
            confirm_password.setCustomValidity("")

            // At first, try to sign in
            firebase.auth().signInWithEmailAndPassword(email.value, password.value)
                .then(function() {
                    // Email login is succeeded
                    localStorage.setItem("email", email.value); // Just to convince storing email on cache
                    window.location.reload()
                })
                .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/user-not-found') {

                        // if there's no user in db, create user account to firebase
                        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                            .then(
                                function() {
                                    // store email into localStorage when creation is succeeded
                                    localStorage.setItem("email", email.value);
                                    window.location.reload()
                                }
                            )
                            .catch(function(error) {
                                // Handle Errors here.
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                if (errorCode === 'auth/operation-not-allowed') {
                                    console.log('Operation is not allowed. Ask to administrator.')
                            }
                        });
                    } else if (errorCode === 'auth/wrong-password') {
                        // Registered email, but wrong password
                        alert('Already registered email. Please enter the correct password.')
                    }
                })
        }
    }
}
function addEventListener() {
    document.getElementById('input_username').addEventListener("input", function() {
        set_username();
        adjust_input_width()
    }, false);
    // referenced https://stackoverflow.com/a/29152483 to add stopImmediatePropagation()
    document.getElementById('upload').addEventListener("click", function(event) { event.stopImmediatePropagation(); open_survey('upload'); }, false);
    document.getElementById('feedback').addEventListener("click", function(event) { event.stopImmediatePropagation(); open_survey('feedback'); }, false);
    document.getElementById('start_form').addEventListener("submit", function(e) { e.preventDefault(); }, false);
    document.getElementById('start_button').addEventListener('click', function() {user_register(true); }, false);
    document.getElementById('register_email').addEventListener('input', function() {user_register(false); }, false);
    document.getElementById('register_pw').addEventListener('input', function() {user_register(false); }, false);
    document.getElementById('register_pw_confirmation').addEventListener('input', function() {user_register(false); }, false);
    document.getElementById('more_meows').addEventListener("click", function(event) { event.stopImmediatePropagation(); call_images(9); }, false);
    document.getElementById('meow_button').addEventListener("click", function(event) { event.stopImmediatePropagation(); meow_counter(); meow_button_tweak();}, false);
    document.getElementById('bg_layer').addEventListener("click", function(event) { event.stopImmediatePropagation(); viewer.close_viewer(); }, false);
    document.getElementById('prev_button').addEventListener("click", function(event) { event.stopImmediatePropagation(); viewer.prev_image(); }, false);
    document.getElementById('next_button').addEventListener("click", function(event) { event.stopImmediatePropagation(); viewer.next_image(); }, false);
    document.getElementById('meow_paw_main').addEventListener("click", function(event) { event.stopImmediatePropagation(); console.log('paw');
    document.getElementsByClassName('credit')[0].classList.toggle('on') }, false);
}



//  MAIN
meow_button_count = 0
display_initiation()
call_images(6)
get_username()
adjust_input_width()
get_currenttime()
setInterval(get_currenttime, 1000);
addEventListener()
