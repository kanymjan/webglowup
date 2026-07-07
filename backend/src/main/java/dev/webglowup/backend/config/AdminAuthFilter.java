package dev.webglowup.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Guards /api/admin/** with a single shared secret passed via the X-Admin-Key
 * header. Deliberately simple (no Spring Security) since there is only one
 * admin user for this MVP.
 */
@Component
public class AdminAuthFilter extends OncePerRequestFilter {

    @Value("${app.admin-key}")
    private String adminKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getRequestURI().startsWith("/api/admin") && !"OPTIONS".equalsIgnoreCase(request.getMethod())) {
            String providedKey = request.getHeader("X-Admin-Key");
            if (providedKey == null || !providedKey.equals(adminKey)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Unauthorized\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
