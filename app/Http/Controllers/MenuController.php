<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    /**
     * Tampilan untuk Pelanggan (Halaman Welcome)
     */
    public function index()
    {
        return Inertia::render('Welcome', [
            'categories' => Category::all(),
            // Kita ambil semua produk, tapi di React nanti kita filter logic displaynya
            'products' => Product::with('category')->where('is_available', true)->get(),
        ]);
    }

    /**
     * Tampilan untuk Admin (Halaman Dashboard)
     */
    public function adminIndex()
    {
        return Inertia::render('Dashboard', [
            // Admin bisa lihat semua menu, termasuk yang Sold Out
            'products' => Product::with('category')->orderBy('category_id')->get(),
            'categories' => Category::all(),
        ]);
    }

    /**
     * Fitur Toggle Sold Out / Available
     */
    public function toggleAvailability(Product $product)
    {
        $product->update([
            'is_available' => !$product->is_available
        ]);

        return back()->with('message', 'Status menu berhasil diupdate!');
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Validasi foto max 2MB
        ]);

        // Handle Upload Foto
        if ($request->hasFile('image')) {
            // Simpan di storage/app/public/products
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        Product::create($validated);

        return back()->with('message', 'Menu berhasil ditambahin, Lek!');
    }

    // Tambahin fungsi ini di dalam MenuController.php
    public function qrGenerator()
    {
        return Inertia::render('Admin/QRGenerator');
    }
}