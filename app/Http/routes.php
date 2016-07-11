<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

    

Route::get('/legend', 'categoryController@index');
Route::get('markers/{id}', 'MakerController@show');
Route::get('category/{kmesage}/{id}', 'MakerController@category');

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/


Route::group(['middleware' => ['web']], function () {
    Route::auth();
    Route::resource('markers', 'MakerController');
    Route::get('lastid/{lastid?}', 'MakerController@index');
     Route::delete('markers', 'MakerController@destroy');
     Route::patch('markers', 'MakerController@update');
    Route::get('/', function () {
$Categories=App\Categories::all();
    return view('addmap')->with('Categories',$Categories);
});
});
