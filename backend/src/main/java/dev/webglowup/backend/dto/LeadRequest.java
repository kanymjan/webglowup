package dev.webglowup.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LeadRequest(
        @NotBlank(message = "Укажите имя") String name,
        @NotBlank(message = "Укажите контакт (телефон, telegram или email)") String contact,
        @Size(max = 2000, message = "Слишком длинное сообщение") String message
) {
}
