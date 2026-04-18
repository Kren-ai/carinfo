<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     * Supports optional filters via query parameters:
     *   ?product_name=Honda
     *   ?product_type=SUV
     *   ?product_parent_id=5
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('product_name')) {
            $query->where('product_name', 'like', '%' . $request->product_name . '%');
        }

        if ($request->filled('product_type')) {
            $query->where('product_type', $request->product_type);
        }

        if ($request->has('product_parent_id')) {
            $query->where('product_parent_id', $request->product_parent_id);
        }

        return response()->json($query->get(), 200);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_name'      => 'required|string|max:255',
            'product_type'      => 'required|string|max:255',
            'product_parent_id' => 'nullable|integer|exists:products,product_id',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        return response()->json($product, 200);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        $validated = $request->validate([
            'product_name'      => 'sometimes|string|max:255',
            'product_type'      => 'sometimes|string|max:255',
            'product_parent_id' => 'nullable|integer|exists:products,product_id',
        ]);

        $product->update($validated);

        return response()->json($product, 200);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.'], 200);
    }
}
