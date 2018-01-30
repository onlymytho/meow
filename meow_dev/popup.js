
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
            var profile_img = document.createElement( 'img' );
            var alias_a = document.createElement ('a' );
            var alias = document.createElement( 'p' );
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
            img.addEventListener('click', show_viewer, false);
            image_div.addEventListener('mouseover', toggle_label, false)
            image_div.addEventListener('mouseout', toggle_label, false)
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
    if (['label_div', 'alias', 'profile_img'].indexOf(e.target.className) === -1 ){
        if (e.type == 'mouseover') {
            document.getElementById('label_div'+e.target.id).classList.add('on')
        } else if (e.type == 'mouseout') {
            document.getElementById('label_div'+e.target.id).classList.remove('on')
        }
    }
    // image_div를 hover하거나 클릭했을 떄 해당 이미지에 대한 id가 얻어지도록 하는 구조로 바꾸면 모든 게 아름답게 해결됨.
}


// viewer
var current_viewer_image = 0;

function ready_to_call_check() {
    if (9 * called_count - current_viewer_image  <  3) {
        call_images(9)
    }
}
function show_viewer(e) {
    document.getElementById('viewer').classList.add('on');
    document.getElementById('viewer_image').src = search_result[e.target.id]
    current_viewer_image = e.target.id
    ready_to_call_check()
};
function close_viewer() {
    document.getElementById('viewer').classList.remove('on');
}
function next_image() {
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
}
function prev_image() {
    var prev_image = search_result[parseInt(current_viewer_image)-1]
    if ( !!prev_image ) {
        document.getElementById('viewer_image').src = prev_image
        current_viewer_image = parseInt(current_viewer_image) - 1
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



//  MAIN
call_images(6)
get_username()
adjust_input_width()
get_currenttime()
setInterval(get_currenttime, 1000);
document.getElementById('input_username').addEventListener("input", function() {
    set_username();
    adjust_input_width()
}, false);
document.getElementById('upload').addEventListener("click", function() { open_survey('upload'); }, false);
document.getElementById('feedback').addEventListener("click", function() { open_survey('feedback'); }, false);
document.getElementById('more_meows').addEventListener("click", function() { call_images(9); }, false);
document.getElementById('more_meows').addEventListener("click", function() { call_images(9); }, false);
document.getElementById('meow_button').addEventListener("click", function() { meow_counter(); }, false);
document.getElementById('bg_layer').addEventListener("click", function() { close_viewer(); }, false);
document.getElementById('prev_button').addEventListener("click", function() { prev_image(); }, false);
document.getElementById('next_button').addEventListener("click", function() { next_image(); }, false);
document.getElementById('meow_paw_main').addEventListener("click", function() { console.log('paw'); document.getElementsByClassName('credit')[0].classList.toggle('on') }, false);
