package com.inventorypro.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller for the home page and application information
 * 
 * @author crycuros
 */
@Controller
public class HomeController {
    
    @Value("${app.developer}")
    private String developer;
    
    @Value("${app.version}")
    private String version;
    
    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("developer", developer);
        model.addAttribute("version", version);
        return "about";
    }
    
    @GetMapping("/credits")
    public String credits() {
        return "credits";
    }
}
