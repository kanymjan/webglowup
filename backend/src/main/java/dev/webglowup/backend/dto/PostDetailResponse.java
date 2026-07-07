package dev.webglowup.backend.dto;

import dev.webglowup.backend.model.Post;

import java.time.Instant;

public record PostDetailResponse(
        Long id,
        String slug,
        String title,
        String excerpt,
        String content,
        String coverImageUrl,
        boolean published,
        Instant createdAt
) {
    public static PostDetailResponse from(Post post) {
        return new PostDetailResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getExcerpt(),
                post.getContent(),
                post.getCoverImageUrl(),
                post.isPublished(),
                post.getCreatedAt()
        );
    }
}
