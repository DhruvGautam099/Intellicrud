package com.intellicrud.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Document(collection = "books")
public class Book {

    @Id
    private String id;
    
    private String title;
    private String author;
    private String genre;
    private String description;
    
    // Flexible, schema-less attribute map for dynamic tags like "Awards", "Series", etc.
    private Map<String, Object> dynamicAttributes = new HashMap<>();

    public Book() {}

    public Book(String title, String author, String genre, String description) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Map<String, Object> getDynamicAttributes() { return dynamicAttributes; }
    public void setDynamicAttributes(Map<String, Object> dynamicAttributes) { 
        this.dynamicAttributes = dynamicAttributes; 
    }
}
