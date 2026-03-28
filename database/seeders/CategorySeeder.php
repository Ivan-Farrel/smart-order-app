<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Black/White Coffee',
            'Filter Coffee',
            'Ceremonial Matcha',
            'Alinea To Go',
            'Coffee Base',
            'Tea Base',
            'Refreshing',
            'Signature Coffee',
            'Milk Base',
            'Starters & Lite Bites',
            'Main Course',
            'Pastries & Desserts'
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
                'slug' => Str::slug($category),
            ]);
        }
    }
}