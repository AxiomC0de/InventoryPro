package com.inventorypro.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.inventorypro.model.InventoryTransaction;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByProductId(Long productId);
    
    List<InventoryTransaction> findByTransactionDateBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT t FROM InventoryTransaction t ORDER BY t.transactionDate DESC")
    List<InventoryTransaction> findRecentTransactions();
    
    @Query(value = "SELECT DATE_FORMAT(transaction_date, '%Y-%m') as month, " +
           "SUM(CASE WHEN transaction_type = 'SALE' THEN quantity * -1 ELSE 0 END) as units_sold " +
           "FROM inventory_transactions " +
           "WHERE transaction_type = 'SALE' " +
           "GROUP BY DATE_FORMAT(transaction_date, '%Y-%m') " +
           "ORDER BY month", nativeQuery = true)
    List<Object[]> getMonthlySalesData();
}
