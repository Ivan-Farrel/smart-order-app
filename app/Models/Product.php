<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage; // Tambahin ini

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 
        'name', 
        'description', 
        'price', 
        'image', // Path foto
        'is_available'
    ];

    // Tambahin Appends biar field 'image_url' otomatis ada
    protected $appends = ['image_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Accessor buat dapetin URL foto yang bener
    protected function getImageUrlAttribute()
    {
        if ($this->image && Storage::disk('public')->exists($this->image)) {
            return Storage::url($this->image);
        }
        // Foto default kalau produk gak punya foto
        return 'https://placehold.co/300x300/f4f4f5/a1a1aa?text=No+Image';
    }
}