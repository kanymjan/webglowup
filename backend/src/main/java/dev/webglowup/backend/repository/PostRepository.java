package dev.webglowup.backend.repository;

import dev.webglowup.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByPublishedTrueOrderByCreatedAtDesc();

    List<Post> findAllByOrderByCreatedAtDesc();

    Optional<Post> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);
}
