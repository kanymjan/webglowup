package dev.webglowup.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record PostRequest(
        @NotBlank(message = "Укажите slug") String slug,
        @NotBlank(message = "Укажите заголовок") String title,
        String excerpt,
        @NotBlank(message = "Укажите содержимое поста") String content,
        String coverImageUrl,
        boolean published
) {
}
