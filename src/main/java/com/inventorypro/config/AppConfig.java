package com.inventorypro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Application configuration
 * 
 * @author crycuros
 */
@Configuration
public class AppConfig {

    /**
     * Adds a custom header to all responses with developer information
     */
    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> developerHeaderFilter() {
        FilterRegistrationBean<OncePerRequestFilter> registration = new FilterRegistrationBean<>();
        
        registration.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, 
                                           HttpServletResponse response, 
                                           FilterChain filterChain) 
                    throws ServletException, IOException {
                
                response.addHeader("X-Developed-By", "crycuros");
                filterChain.doFilter(request, response);
            }
        });
        
        return registration;
    }
}
