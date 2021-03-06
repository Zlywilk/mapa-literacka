var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */
require('laravel-elixir-imagemin');

elixir(function(mix) {
        mix.styles(['map.min.css','colorbox.css']);
        mix.scripts([
        'map.js','jquery.colorbox-min.js'
    ]).version(['css/all.css','js/all.js']);
 mix.imagemin();

});
