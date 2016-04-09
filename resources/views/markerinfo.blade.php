
<div class="container-fluid">
        <h4 style="margin:0px">{{$marker->title}}</h4>
  @if ($marker->opis !== '')
        <p style="margin:0px">{{$marker->opis}}</p>
     @endif
          @if ($marker->image !== NULL)
    <img src="{{$marker->image}}" alt="{{$marker->title}}"><br>
@endif
                 <a class="myLink" href="{{$marker->latitude}},{{$marker->longitude}}">pokaż punkt na mapie</a>
</div>
</div>