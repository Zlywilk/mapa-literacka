<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Auth;


use App\Http\Requests\StoremarkersPostRequest;
use App\markers;
use App\Categories;
use Carbon\Carbon;


class MakerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($lastid=0)
    {
    
            
    $lastmarker=markers::all()->last()->id;
        if($lastid!=$lastmarker){
           $result = markers::join('Categories', 'Categories.id', '=', 'markers.type')
    ->select('markers.id' ,'markers.description','addres','title','latitude','longitude','gfx','type', 'repair','user_id')
                  ->where('markers.id', '>', $lastid)
    ->getQuery() // Optional: downgrade to non-eloquent builder so we don't build invalid User objects.
    ->get();
        return $result; 
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
   


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response StoremarkersPostRequest
     */
    public function store(StoremarkersPostRequest $request)
    {
        $input=Input::all();
        $userid=Auth::user()->id;
         if(!is_array($input ['title'])){
                  markers::create
       ([
               'title' => $input ['title'],
       'addres' =>$input ['addres'], 
       'description' =>$input['opis'],
       'type'=>$input ['type'], 
       'image'=>$input['image'],
       'latitude' =>$input ['latitude'], 
       'longitude' =>$input ['longitude'], 
       'allow' =>'1',
       'user_id' =>$userid,
           'created_at'    => Carbon::now(), // only if your table has this column
        'updated_at'    => Carbon::now(), ]);
        
    
 
    }else{
             $panelcount=count($input['title']);
             for($i=0; $i<$panelcount; $i++)
     {          markers::create
       ([
               'title' => $input ['title'][$i],
       'addres' =>$input ['addres'][$i], 
       'description' =>$input['opis'][$i],
       'type'=>$input ['type'][$i], 
       'image'=>$input['image'][$i],
       'latitude' =>$input ['latitude'][$i], 
       'longitude' =>$input ['longitude'][$i], 
       'allow' =>'1',
       'user_id' =>$userid,
           'created_at'    => Carbon::now(), // only if your table has this column
        'updated_at'    => Carbon::now(), ]);
        }
    
 
    }
               }
         

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
            {
        return view('markerinfo', ['marker' => markers::findOrFail($id)]);
    }
    
    }
       public function category($kmesage,$id)
    {
            {
        return view('category', ['marker' => markers::where('type', $id)->get()])->with('kmesage', $kmesage);
    }
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoremarkersPostRequest $request)
    {
        $input=Input::all();
         if(!is_array($input ['title'])){
            $editid=$input['editid'];
markers::where('id', $editid)->update(array(
    'title' => $input ['title'],
       'addres' =>$input ['addres'], 
       'description' =>$input ['opis'],
       'type'=>$input ['type'], 
       'image'=>$input ['image'],
       'latitude' =>$input ['latitude'], 
       'longitude' =>$input ['longitude'], 
       'repair' =>$input ['repair'],
	   'updated_at'    => Carbon::now(), ));
    }else{
             $panelcount=count($input['title']);
             for($i=0; $i<$panelcount; $i++)
			 {            $editid=$input['editid'][$i];
markers::where('id', $editid)->update(array(
    'title' => $input ['title'][$i],
       'addres' =>$input ['addres'][$i], 
       'description' =>$input ['opis'][$i],
       'type'=>$input ['type'][$i], 
       'image'=>$input ['image'][$i],
       'latitude' =>$input ['latitude'][$i], 
       'longitude' =>$input ['longitude'][$i], 
       'repair' =>$input ['repair'][$i],
	   'updated_at'    => Carbon::now(), ));}

        }
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $id=Input::all();
        markers::destroy($id);
    }
}
