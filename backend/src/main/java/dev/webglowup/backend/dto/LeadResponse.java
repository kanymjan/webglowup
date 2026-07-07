package dev.webglowup.backend.dto;

import dev.webglowup.backend.model.Lead;

import java.time.Instant;

public record LeadResponse(
        Long id,
        String name,
        String contact,
        String message,
        Instant createdAt
) {
    public static LeadResponse from(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                lead.getName(),
                lead.getContact(),
                lead.getMessage(),
                lead.getCreatedAt()
        );
    }
}
