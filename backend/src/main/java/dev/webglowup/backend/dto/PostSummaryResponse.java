package dev.webglowup.backend.dto;

import dev.webglowup.backend.model.Post;

import java.time.Instant;

public record PostSummaryResponse(
        Long id,
        String slug,
        String title,
        String excerpt,
        String coverImageUrl,
        Instant createdAt
) {
    public static PostSummaryResponse from(Post post) {
        return new PostSummaryResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getExcerpt(),
                post.getCoverImageUrl(),
                post.getCreatedAt()
        );
    }
}
