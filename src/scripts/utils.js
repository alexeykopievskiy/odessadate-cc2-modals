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
})
