<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Markers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('markers', function (Blueprint $table) {
             $table->engine = "InnoDB";
       $table->increments('id');
          $table->string('title');
           $table->unsignedInteger('user_id')->nullable();
        $table->string('addres')->nullable();
            $table->text('opis')->nullable();
       $table->unsignedInteger('type');
       $table->string('image')->nullable();
        $table->float('latitude',10,6)->nullable();
        $table->float('longitude',10,6)->nullable();
        $table->boolean('repair')->default(0);
        $table->boolean('allow')->default(1);
            $table->timestamps();
        });
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
          Schema::table('markers', function($table) {
       $table->foreign('user_id')->references('id')->on('users');
        $table->foreign('type')->references('id')->on('kategorie')->onDelete('cascade');
   });
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('markers');
    }
}
