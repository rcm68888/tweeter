/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const createTweetElement = function(tweet) {
  let tweetArticle = $('<article>');
  let tweetHeader = $('<header>').addClass('make-flex');
  let tweetFooter = $('<footer>');
  tweetHeader.append($('<img>').attr("src", tweet.user.avatars));
  tweetHeader.append($('<span>').text(tweet.user.name));
  tweetHeader.append($('<span>').addClass('hover-class').text(tweet.user.handle));
  tweetArticle.append($(tweetHeader));
  tweetArticle.append($('<p>').addClass('stay-inside-text').text(tweet.content.text));
  tweetFooter.append($('<span>').addClass('time')
  .append($('<span>').text(`${timeSinceTweeted(new Date(tweet.created_at))}`)));
  if (tweet.user.name === 'Descartes') {
    tweetFooter.append($('<span>')).text(`370 years ago`);
  } else if (tweet.user.name === 'Newton') {
    tweetFooter.append($('<span>')).text(`293 years ago`);
  } 
  tweetFooter.append($('<span>').addClass('icons')
  .append($('<i>').addClass('fa fa-flag'))
  .append($('<i>').addClass('fa fa-retweet'))
  .append($('<i>').addClass('fa fa-heart')));
  tweetArticle.append($(tweetFooter));
  // above I am appending the header, body and footer to tweetArticle and returning it below
  return tweetArticle;
};

// calculating time since tweets were created when the tweet button is pressed
const timeSinceTweeted = function(time) {
  var date = new Date(time),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
};

// shows tweets on app page
const renderTweets = function(tweet) {
  const tweetsContainer = $('.all-tweets');
  tweetsContainer.empty();
  tweet.forEach((tweet) => {
    tweetsContainer.prepend(createTweetElement(tweet));
  });
};
// gets the tweets from the /tweets to pass them to render
const loadTweets = function() {
  $.ajax({
    url: '/tweets',
    method: 'GET',
    success: function(tweetyTweets) {
      renderTweets(tweetyTweets);
    }
  });
};

// Toggle the compose tweet textarea on and off
const toggleComposeTweet = function() {
  $(".compose").click( (event) => {
    event.stopPropagation();
    $(".new-tweet").toggle(100, () => {
      $("#new-tweet-textarea").focus();
    });
  });
};

$(document).ready(() => {
  $('#new-tweet-textarea').val('');
  $('.form-class').submit((event) => {
    event.preventDefault();
    $(".new-tweet .display-error").css("visibility", "hidden");
    let text = $('#new-tweet-textarea').val();
    const tweetLength = text.length;
    // performing validation for input
    if (!text) {
      //$(".new-tweet .display-error").html("No tweet content!");
      //$(".new-tweet .display-error").css("visibility", "visible").addClass("danger-colour");
      //return; // block form submission when no content
    }
    if (tweetLength > 140) {
      //$(".new-tweet .display-error").html("Tweet over the character limit!");
      //$(".new-tweet .display-error").css("visibility", "visible").addClass("danger-colour");
      //return; // block form submission when content over limit
    }

    $.ajax({
      url: '/tweets/',
      method: 'POST',
      data: $('#new-tweet-textarea').serialize()
    })
    .then((res) => {
      loadTweets();
    });
    
    $('#new-tweet-textarea').val('');
  });
  toggleComposeTweet();
  loadTweets();
});