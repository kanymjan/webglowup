package dev.webglowup.backend.notification;

import dev.webglowup.backend.model.Lead;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * Sends a Telegram message for every new lead so the owner gets notified
 * instantly instead of having to check the admin panel. Silently does
 * nothing if bot credentials aren't configured (local dev without a bot).
 */
@Component
public class TelegramNotifier {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotifier.class);

    private final String botToken;
    private final String chatId;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public TelegramNotifier(
            @Value("${telegram.bot-token:}") String botToken,
            @Value("${telegram.chat-id:}") String chatId) {
        this.botToken = botToken;
        this.chatId = chatId;
    }

    public void notifyNewLead(Lead lead) {
        if (botToken.isBlank() || chatId.isBlank()) {
            log.debug("Telegram bot-token/chat-id not configured, skipping notification");
            return;
        }

        String message = lead.getMessage() == null || lead.getMessage().isBlank() ? "—" : lead.getMessage();
        String text = "🆕 Новая заявка с сайта\n\nИмя: %s\nКонтакт: %s\nСообщение: %s"
                .formatted(lead.getName(), lead.getContact(), message);

        try {
            String json = "{\"chat_id\":\"%s\",\"text\":\"%s\"}".formatted(escapeJson(chatId), escapeJson(text));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.telegram.org/bot" + botToken + "/sendMessage"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() != 200) {
                            log.warn("Telegram notification failed: {} {}", response.statusCode(), response.body());
                        }
                    })
                    .exceptionally(ex -> {
                        log.warn("Telegram notification error", ex);
                        return null;
                    });
        } catch (Exception e) {
            log.warn("Failed to build Telegram notification", e);
        }
    }

    private static String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "");
    }
}
