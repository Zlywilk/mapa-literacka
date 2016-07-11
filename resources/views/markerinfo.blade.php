
<div class="container-fluid">
        <h4 style="margin:0px">{{$marker->title}}</h4>
  @if ($marker->opis !== '')
        <p style="margin:0px">{{$marker->description}}</p>
     @endif
          @if ($marker->image !== NULL)
    <img src="{{$marker->image}}" alt="{{$marker->title}}"><br>
@endif
     @if ($marker->longitude !== NULL)
                 <a class="go-point" href="{{$marker->latitude}},{{$marker->longitude}},{{$marker->title}}">pokaż punkt na mapie</a>
    @endif

</div>
