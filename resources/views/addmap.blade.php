
@extends('layouts.master')  
@section('js')
 <script src="{{ elixir('js/all.js') }}" async defer></script>
@endsection
      @section('content') 
      @if(Auth::check())
<div class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title"> czy aby napewno wiesz co czynisz ?</h4>
      </div>
      <div class="modal-body">
        <p>Człowieku czy aby naprwno chcesz usunąć ten marker?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">nie jednak anuluje</button>
        <button type="button" class="btn btn-primary" id="destroy">tak jestem dorosły wiem co robie</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
    <div id="toggle" class="glyphicon glyphicon-menu-hamburger"></div>
    <div id="sidebar-wrapper" class="toggled hide">

        

        <input class="form-control" id="city" type="text" placeholder="wpisz nazwe miasta">
    
    <button class="btn btn-sm btn-default city">Idź do UL.</button>
          <div class="globalmesage alert" role="alert"></div>
        @permission('editall')
    {{-- */$role=2;/* --}}
        @else
       {{-- */$role=0;/* --}} 
@endpermission
        <input class="form-control" id="userid" value="{{ Auth::user()->id }}" type="hidden" > 
        <input class="form-control" id="roleid" value="{{$role}}" type="hidden" > 
    <form  action="markers" method="post" id="uplo" enctype="multipart/form-data">

        <div id="0" class="panelholding addnewmarker">
        <div class="panel panel-default">
  <div class="panel-heading">marker<span class="pull-right cancel clickable"><i class="fa fa-times"></i></span></div>
  <div class="panel-body">
          
            <div class="form-group">
                <div class="error0 alert alert-danger" role="alert" ></div>
                <input class="form-control title required deltable" name="title"   type="text" placeholder="wpisz tytuł" required>
                                           
                
                <input class="form-control addres deltable" name="addres"   type="hidden">

                <textarea  class="form-control opis deltable" name="opis"  placeholder="wpisz opis"></textarea>
                <select name="type" class="form-control type deltable required" required>
                  <option value="" disabled selected>wybiesz kategorie</option>
                    @foreach($kategorie as $item)
      <option value="{{$item->id}}">{{$item->opis}}</option>
    @endforeach
                </select>
               <input type="file" name="image" class="deltable">
                    <input class="form-control latitude deltable" name="latitude"   type="hidden" >
                                    <input class="form-control longitude deltable" name="longitude"  type="hidden" >

 <div class="checkbox"> 
     <label>
      <input name="repair" class="repair form-checkbox"  type="checkbox" value="0"> archwalne
    </label>
       
  </div>
    </div>
                    <div class="panel-footer text-center">
                 <div class="btn-group" data-toggle="buttons">
                     <button type="submit" class="btn btn-sm btn-default clickable send" >wyślij</button>
                     <button type="button" class="btn btn-sm btn-default clickable cancel" >anuluj</button>
                </div>
            </div>
  
               
     
       
                        
            </div>
</div>
            </div>
             <div class="row text-center all">
               <div class="btn-group " data-toggle="buttons">
                   <button type="submit"  class="btn btn-sm btn-default clickable sendall" >wyślij wszystkie</button>
                   <button type="button"  class="btn btn-sm btn-default clickable cancelall" >anuluj wszytkie</button>
                </div>
            </div>
</form>
        @endif
           
      </div>

    <div id="map" ></div>
<a id="legend" class='ajax' href="{{url('/legend')}}" ><button  class="btn btn-default" title="legenda i opcje">legenda i opcje</button></a>
@endsection
