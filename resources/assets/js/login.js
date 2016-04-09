
$('#login').on('submit', function(event ) {
  event.preventDefault();
var data = $(this).serialize();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
});
    $.ajax({
      type: 'POST',
      url: '/login',
      data: data,
      success: function(response ) {
        alert(response);
      }
    });
});
