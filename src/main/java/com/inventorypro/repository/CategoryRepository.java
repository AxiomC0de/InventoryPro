package com.inventorypro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.inventorypro.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
}
