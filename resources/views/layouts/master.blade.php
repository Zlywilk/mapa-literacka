
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
      <meta name="csrf-token" content="{{ csrf_token() }}">
     <title>Grayscale - @yield('title')</title>
     <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
<link href="{{ elixir('css/all.css')}}" rel="stylesheet">
     <link href="https://fonts.googleapis.com/css?family=Open+Sans&subset=latin,latin-ext" rel="stylesheet" type="text/css">
       <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel='stylesheet' type='text/css'>
    </head>
    <body>
    @yield('content')
       <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCYqomDlEk2ZSZ0KeV8LwWdhHHzlJNGhOA"></script>
@yield('js')


     
    </body>
</html>
