@extends('layouts.legenda')
@section('title', 'Legenda')
@section('content')
<script>$('.ajax').colorbox();

</script> 
<div class="container-fluid">
@foreach(array_chunk($kategorie->all(), 3) as $row)
<div class="row center-block">
@foreach($row as $item)
<div class="col-xs-8 col-md-4">  <a class="ajax" href="category/{{str_slug($item->opis)}}/{{$item->id}}"> <img src="{{$item->gfx}}" alt="{{$item->opis}}">{{$item->opis}} </a><input type="checkbox" value="{{$item->id}}" checked></div>
    @endforeach
</div>
@endforeach
</div>
@endsection
