$(document).ready(function() {
  $("#cc2-verify").on('click', function () {
    $(".cc2-modal__card").css('display', 'flex')
    $(".cc2-modal__upload, .cc2-modal__call").css('display', 'none')
  })
  $("#cc2-upload").on('click', function () {
    $(".cc2-modal__upload").css('display', 'flex')
    $(".cc2-modal__card, .cc2-modal__call").css('display', 'none')
  })
  $("#cc2-call").on('click', function () {
    $(".cc2-modal__call").css('display', 'flex')
    $(".cc2-modal__card, .cc2-modal__upload").css('display', 'none')
  })

  $("#phone").mask("9 (999) 999-99-99");

  $("#phone").on("blur", function() {
      var last = $(this).val().substr( $(this).val().indexOf("-") + 1 );

      if( last.length == 3 ) {
          var move = $(this).val().substr( $(this).val().indexOf("-") - 1, 1 );
          var lastfour = move + last;

          var first = $(this).val().substr( 0, 9 );

          $(this).val( first + '-' + lastfour );
      }
  });
})
