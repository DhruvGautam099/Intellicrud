package com.intellicrud.controller;

import com.intellicrud.model.Book;
import com.intellicrud.repository.BookRepository;
import com.intellicrud.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/ask/{bookId}")
    public ResponseEntity<Map<String, String>> askAboutBook(@PathVariable String bookId) {
        return bookRepository.findById(bookId).map(book -> {
            String insight = aiService.generateBookSummary(book);
            Map<String, String> response = new HashMap<>();
            response.put("insight", insight);
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<Map<String, String>> getRecommendations() {
        String recommendations = aiService.generateRecommendations();
        Map<String, String> response = new HashMap<>();
        response.put("recommendations", recommendations);
        return ResponseEntity.ok(response);
    }
}
