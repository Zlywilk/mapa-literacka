<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class markers extends Model
{
    protected $table = "markers";
     protected $dateFormat = 'U';
      protected $fillable=[
    'title',
    'user_id',
    'addres',
    'description',
    'type',
        'file',
    'latitude',
    'longitude',
    'repair',
'allow'
];
}
