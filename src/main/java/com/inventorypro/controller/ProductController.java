package com.inventorypro.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.inventorypro.model.Product;
import com.inventorypro.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/sku/{sku}")
    public ResponseEntity<Product> getProductBySku(@PathVariable String sku) {
        Optional<Product> product = productService.getProductBySku(sku);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchProductsByName(name);
    }
    
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }
    
    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return productService.getLowStockProducts();
    }
    
    @GetMapping("/out-of-stock")
    public List<Product> getOutOfStockProducts() {
        return productService.getOutOfStockProducts();
    }
    
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isPresent()) {
            product.setId(id);
            return ResponseEntity.ok(productService.saveProduct(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isPresent()) {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/stock")
    public ResponseEntity<String> updateStock(@PathVariable Long id, @RequestParam int quantity) {
        boolean updated = productService.updateStock(id, quantity);
        if (updated) {
            return ResponseEntity.ok("Stock updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
