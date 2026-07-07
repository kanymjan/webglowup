package dev.webglowup.backend.controller;

import dev.webglowup.backend.dto.LeadRequest;
import dev.webglowup.backend.model.Lead;
import dev.webglowup.backend.notification.TelegramNotifier;
import dev.webglowup.backend.repository.LeadRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadRepository leadRepository;
    private final TelegramNotifier telegramNotifier;

    public LeadController(LeadRepository leadRepository, TelegramNotifier telegramNotifier) {
        this.leadRepository = leadRepository;
        this.telegramNotifier = telegramNotifier;
    }

    @PostMapping
    public ResponseEntity<Void> createLead(@Valid @RequestBody LeadRequest request) {
        Lead lead = new Lead();
        lead.setName(request.name());
        lead.setContact(request.contact());
        lead.setMessage(request.message());
        leadRepository.save(lead);
        telegramNotifier.notifyNewLead(lead);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
