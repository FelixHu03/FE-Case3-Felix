<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class jurnal extends Model
{
    use HasFactory,HasApiTokens;

    protected $table = 'jurnals';

    protected $fillable = [
        'judul',
        'pembuat',
        'tema',
        'isi',
        'tanggalBuat',
    ];
}
