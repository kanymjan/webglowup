package dev.webglowup.backend.controller;

import dev.webglowup.backend.dto.PostDetailResponse;
import dev.webglowup.backend.dto.PostSummaryResponse;
import dev.webglowup.backend.model.Post;
import dev.webglowup.backend.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<PostSummaryResponse> listPublished() {
        return postRepository.findByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(PostSummaryResponse::from)
                .toList();
    }

    @GetMapping("/{slug}")
    public PostDetailResponse getBySlug(@PathVariable String slug) {
        Post post = postRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пост не найден"));
        return PostDetailResponse.from(post);
    }
}
