<?php

use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- HALAMAN PELANGGAN ---
// Menampilkan Daftar Menu Alinea
Route::get('/', [MenuController::class, 'index'])->name('menu.index');


// --- HALAMAN ADMIN (PROTECTED) ---
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard: List Manajemen Menu
    Route::get('/dashboard', [MenuController::class, 'adminIndex'])->name('dashboard');
    
    // Fitur Toggle Sold Out / Available
    Route::patch('/products/{product}/toggle', [MenuController::class, 'toggleAvailability'])->name('products.toggle');

    // Profile Management (Bawaan Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['auth', 'verified'])->group(function () {
    // ... route yang lain ...
    
    // Route buat simpan menu baru
    Route::post('/products', [MenuController::class, 'store'])->name('products.store');

    Route::middleware(['auth', 'verified'])->group(function () {
    // ... route yang sudah ada ...
    Route::get('/qr-generator', [MenuController::class, 'qrGenerator'])->name('qr.index');
});
});
});

require __DIR__.'/auth.php';