@extends('layouts.legenda')
@section('title', 'Legenda')
@section('content')
<div class="container-fluid">
@foreach(array_chunk($Categories->all(), 3) as $row)
<div class="row center-block">
@foreach($row as $item)
<div class="col-xs-8 col-md-4">  <a class="ajax cboxElement" href="category/{{str_slug($item->description)}}/{{$item->id}}"> <img src="{{$item->gfx}}" alt="{{$item->description}}">{{$item->description}} </a><input type="checkbox" value="{{$item->id}}" checked></div>
    @endforeach
</div>
@endforeach
</div>
@endsection
