package dev.webglowup.backend.controller;

import dev.webglowup.backend.dto.LeadResponse;
import dev.webglowup.backend.dto.PostDetailResponse;
import dev.webglowup.backend.dto.PostRequest;
import dev.webglowup.backend.model.Post;
import dev.webglowup.backend.repository.LeadRepository;
import dev.webglowup.backend.repository.PostRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final LeadRepository leadRepository;
    private final PostRepository postRepository;

    public AdminController(LeadRepository leadRepository, PostRepository postRepository) {
        this.leadRepository = leadRepository;
        this.postRepository = postRepository;
    }

    @GetMapping("/leads")
    public List<LeadResponse> listLeads() {
        return leadRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(LeadResponse::from)
                .toList();
    }

    @GetMapping("/posts")
    public List<PostDetailResponse> listAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostDetailResponse::from)
                .toList();
    }

    @PostMapping("/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public PostDetailResponse createPost(@Valid @RequestBody PostRequest request) {
        if (postRepository.existsBySlug(request.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пост с таким slug уже существует");
        }
        Post post = new Post();
        applyRequest(post, request);
        return PostDetailResponse.from(postRepository.save(post));
    }

    @PutMapping("/posts/{id}")
    public PostDetailResponse updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пост не найден"));
        applyRequest(post, request);
        return PostDetailResponse.from(postRepository.save(post));
    }

    @DeleteMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Пост не найден");
        }
        postRepository.deleteById(id);
    }

    private void applyRequest(Post post, PostRequest request) {
        post.setSlug(request.slug());
        post.setTitle(request.title());
        post.setExcerpt(request.excerpt());
        post.setContent(request.content());
        post.setCoverImageUrl(request.coverImageUrl());
        post.setPublished(request.published());
    }
}
