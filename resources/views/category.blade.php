@extends('layouts.legenda')
@section('title', $kmesage)
@section('content')
@foreach(array_chunk($marker->all(), 3) as $row)
<div class="row center-block">
@foreach($row as $item)
    @if($item->description != NULL)
<div class="col-xs-8 col-md-4"> <a class="ajax cboxElement" href="markers/{{$item->id}}">{{$item->title}}</a><br></div>
    @elseif($item->latitude != NULL)
    <div class="col-xs-8 col-md-4"> <a class="go-point" href="{{$item->latitude}},{{$item->longitude}},{{$item->title}}">{{$item->title}}</a><br></div>
    @else
    <div class="col-xs-8 col-md-4"> <p>{{$item->title}}</p><br></div>
    @endif
    @endforeach
</div>
@endforeach
@endsection
