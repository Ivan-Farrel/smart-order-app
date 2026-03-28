<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['category_id' => 1, 'name' => 'Coffee Latte', 'price' => 33000, 'description' => 'Hot: 1 Part Espresso & Steamed Milk | Cold: 2 Parts Ristretto & Cold Milk'],
            ['category_id' => 1, 'name' => 'Oats Latte', 'price' => 38000],
            ['category_id' => 3, 'name' => 'Usucha', 'price' => 40000, 'description' => 'Ceremonial Grade Matcha'],
            ['category_id' => 5, 'name' => 'Sea Salt Caramel Latte', 'price' => 29000],
            ['category_id' => 10, 'name' => 'Mendoan', 'price' => 23000],
            ['category_id' => 11, 'name' => 'Nasgor Kampong', 'price' => 39000],
            ['category_id' => 12, 'name' => 'Poured Tiramisu', 'price' => 40000],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}