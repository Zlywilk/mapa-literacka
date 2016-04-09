@extends('layouts.legenda')
@section('title', $kmesage)
@section('content')
<script>$('.ajax').colorbox();</script>
@foreach(array_chunk($marker->all(), 3) as $row)
<div class="row center-block">
@foreach($row as $item)
    @if($item->opis == '')
    <div class="col-xs-8 col-md-4"> <p>{{$item->title}}</p></div>
    @else
<div class="col-xs-8 col-md-4"> <a class="ajax" href="/markers/{{$item->id}}">{{$item->title}}</a><br></div>
    @endif
    @endforeach
</div>
@endforeach
@endsection