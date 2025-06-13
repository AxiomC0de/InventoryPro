package com.inventorypro.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventorypro.model.Product;
import com.inventorypro.repository.InventoryTransactionRepository;
import com.inventorypro.service.ProductService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ProductService productService;
    
    @Autowired
    private InventoryTransactionRepository transactionRepository;
    
    @GetMapping("/inventory-summary")
    public Map<String, Object> getInventorySummary() {
        List<Product> products = productService.getAllProducts();
        
        int totalProducts = products.size();
        int lowStockProducts = productService.getLowStockProducts().size();
        int outOfStockProducts = productService.getOutOfStockProducts().size();
        
        double totalInventoryValue = products.stream()
                .mapToDouble(p -> p.getPrice().doubleValue() * p.getStock())
                .sum();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProducts", totalProducts);
        summary.put("lowStockProducts", lowStockProducts);
        summary.put("outOfStockProducts", outOfStockProducts);
        summary.put("totalInventoryValue", totalInventoryValue);
        
        return summary;
    }
    
    @GetMapping("/monthly-sales")
    public List<Object[]> getMonthlySalesData() {
        return transactionRepository.getMonthlySalesData();
    }
    
    @GetMapping("/low-stock")
    public List<Product> getLowStockReport() {
        return productService.getLowStockProducts();
    }
    
    @GetMapping("/out-of-stock")
    public List<Product> getOutOfStockReport() {
        return productService.getOutOfStockProducts();
    }
    
    @GetMapping("/inventory-value")
    public List<Product> getInventoryValueReport() {
        return productService.getAllProducts();
    }
}
