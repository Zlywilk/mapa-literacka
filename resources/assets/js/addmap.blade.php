
@extends('layouts.master')  
@section('js')
 <script src="{{  URL::asset('js/all.js') }}"></script>
@endsection
      @section('content') 
    <div id="toggle" class="glyphicon glyphicon-menu-hamburger"></div>
    <div id="sidebar-wrapper" class="toggled hide">
        @if(Auth::guest())
        <p>widzę że jesteś człowiekiem ciekawym świata <br><a href="{{url('/login')}}"> zaloguj się  aby móc dodawać punkty </a> </p>
        
        @else
        
        <input class="form-control" id="city" type="text" placeholder="wpisz nazwe miasta">
    
    <button class="btn btn-sm btn-default city">Idź do UL.</button>
          <div class="globalmesage alert" role="alert"></div>
        <input class="form-control" id="userid" value="{{ Auth::user()->id }}" type="hidden" > 
        <input class="form-control" id="roleid" value="{{ Auth::user()->name }}" type="hidden" > 
    <form  action="#" method="post" id="uplo">
        <div id="0" class="panelholding">
        <div class="panel panel-default">
  <div class="panel-heading">marker<span class="pull-right clickable"><i class="fa fa-times"></i></span></div>
  <div class="panel-body">
        
          
            <div class="form-group">
                <div class="error0 alert alert-danger" role="alert" ></div>
                <input class="form-control title required" name="title"   type="text" placeholder="wpisz tytuł" required>
                                           
                
                <input class="form-control addres" name="addres"   type="hidden">

                <textarea  class="form-control opis" name="opis"  placeholder="wpisz opis"></textarea>
                <select name="type" class="form-control type required" required>
                  <option value="" disabled selected>wybiesz kategorie</option>
                    @foreach($kategorie as $item)
      <option value="{{$item->id}}">{{$item->opis}}</option>
    @endforeach
                </select>
                 <input type="file" name="image">
                    <input class="form-control" name="latitude"  type="hidden" >
                                    <input class="form-control" name="longitude"  type="hidden" >

 <div class="checkbox"> 
     <label>
      <input name="repair" class="repair"  type="checkbox" value="0"> archwalne
    </label>
       
  </div>
    </div>
                    <div class="panel-footer text-center">
                 <div class="btn-group" data-toggle="buttons">
                     <button type="submit" class="btn btn-sm btn-default send" >wyślij</button>
                     <button type="button" class="btn btn-sm btn-default cancel" >anuluj</button>
                </div>
            </div>
  
               
     
       
                        
            </div>
</div>
            </div>
             <div class="row text-center all">
               <div class="btn-group " data-toggle="buttons">
                   <button type="submit"  class="btn btn-sm btn-default sendall" >wyślij wszystkie</button>
                   <button type="button"  class="btn btn-sm btn-default cancelall" >anuluj wszytkie</button>
                </div>
            </div>
</form>
        @endif
           
      </div>

    <div id="map" ></div>
<a id="legend" class='ajax' href="{{url('/legend')}}" ><button  class="btn btn-default" title="legenda i opcje">legenda i opcje</button></a>
@endsection