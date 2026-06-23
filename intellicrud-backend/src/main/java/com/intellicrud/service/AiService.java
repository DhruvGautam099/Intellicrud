package com.intellicrud.service;

import com.intellicrud.model.Book;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generates an insight on why a user should read a specific book.
     * Constructs a prompt combining the book's title, author, and description.
     */
    public String generateBookSummary(Book book) {
        if (apiKey == null || apiKey.contains("YOUR_GEMINI_API_KEY_HERE")) {
            return "AI feature disabled: Missing API Key. To enable, add your Gemini API key to application.properties.";
        }

        // Construct the prompt carefully to guide the AI to act as a reading assistant
        String promptText = String.format(
            "Act as an expert virtual reading assistant. I am considering reading the book '%s' by %s. " +
            "The book is about: %s. " +
            "Please provide a concise, engaging 3-4 sentence explanation of why I should read this book, " +
            "highlighting its main themes and appeal.",
            book.getTitle(), book.getAuthor(), book.getDescription()
        );

        return callGeminiApi(promptText);
    }

    /**
     * Generates book recommendations based on user genre/theme inputs.
     */
    public String generateRecommendations() {
        if (apiKey == null || apiKey.contains("YOUR_GEMINI_API_KEY_HERE")) {
             return "AI feature disabled: Missing API Key. To enable, add your Gemini API key to application.properties.";
        }

        String promptText = "Act as an expert virtual reading assistant. Recommend 3 highly acclaimed books " +
                            "across different genres. For each book, provide the title, author, and a 1-sentence " +
                            "pitch on why it is a must-read. Format as a clean list.";

        return callGeminiApi(promptText);
    }

    /**
     * Helper method to call the Gemini API.
     * Maps the simple prompt string to the required JSON structure for Gemini.
     */
    private String callGeminiApi(String promptText) {
        try {
            String url = apiUrl + "?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Constructing the JSON payload structure required by Gemini API v1beta
            // { "contents": [{ "parts": [{ "text": "promptText" }] }] }
            Map<String, Object> part = new HashMap<>();
            part.put("text", promptText);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            // Extract the generated text from the response structure
            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                    if (!parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
            return "Unable to generate a response from the AI at this time.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with AI Service: " + e.getMessage();
        }
    }
}
