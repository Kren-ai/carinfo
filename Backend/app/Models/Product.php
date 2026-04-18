<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['product_name', 'product_type', 'product_parent_id'])]
class Product extends Model
{
    protected $primaryKey = 'product_id';

    /**
     * Get the parent product.
     */
    public function parent(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_parent_id', 'product_id');
    }

    /**
     * Get the child products.
     */
    public function children(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Product::class, 'product_parent_id', 'product_id');
    }
}
