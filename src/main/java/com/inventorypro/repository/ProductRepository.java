package com.inventorypro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.inventorypro.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.stock < p.lowStockThreshold AND p.stock > 0")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.stock <= 0")
    List<Product> findOutOfStockProducts();
    
    @Query("SELECT p FROM Product p ORDER BY p.stock DESC")
    List<Product> findAllOrderByStockDesc();
}
