
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
        console.log(instagram_data)
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
            document.getElementsByClassName('images')[0].appendChild(image_div);

            // Put image items into search_result
            search_result.push(instagram_data.data[i].image_url)

            // add actions
            img.addEventListener('click', show_viewer, false);
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
    console.log(input.value + '\t\t\t' + input.style.width)
    if (input.value){
        input.style.width = ((input.value.length + 2) * 36) + 'px'
    } else {'400px'}
}

//  MAIN
call_images(6)
get_username()
adjust_input_width()
document.getElementById('input_username').addEventListener("input", function() {
    set_username();
    adjust_input_width()
}, false);
document.getElementById('more_meows').addEventListener("click", function() { call_images(9); }, false);
document.getElementById('meow_button').addEventListener("click", function() { meow_counter(); }, false);
document.getElementById('bg_layer').addEventListener("click", function() { close_viewer(); }, false);
document.getElementById('prev_button').addEventListener("click", function() { prev_image(); }, false);
document.getElementById('next_button').addEventListener("click", function() { next_image(); }, false);
