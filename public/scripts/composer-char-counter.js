const updateCounter = (counterPassed) => {
  $( 'span.counter ').text(140 - counterPassed);
}

$(document).ready(function() {
  let charCounter = $(this).val().length;
  $( '.new-tweet textarea' ).on('input', function() {
    charCounter = $(this).val().length;
    updateCounter(charCounter);
    if (charCounter > 140) {
      $( ' span.counter ').addClass(' over-limit ');
    } else {
      $(' span.counter ').removeClass(' over-limit ');
    }
  });
});