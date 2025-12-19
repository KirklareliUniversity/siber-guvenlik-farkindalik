package com.gameserver.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class JsonStorageService {
    
    private static final String DATA_DIR = "data";
    private static final String USERS_FILE = DATA_DIR + "/users.json";
    private static final String GAME_RESULTS_FILE = DATA_DIR + "/game-results.json";
    
    private final ObjectMapper objectMapper;
    
    public JsonStorageService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        ensureDataDirectoryExists();
    }
    
    private void ensureDataDirectoryExists() {
        try {
            Path dataPath = Paths.get(DATA_DIR);
            if (!Files.exists(dataPath)) {
                Files.createDirectories(dataPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Veri dizini oluşturulamadı: " + DATA_DIR, e);
        }
    }
    
    public <T> List<T> loadFromJson(String filePath, Class<T> clazz) {
        File file = new File(filePath);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        
        try {
            CollectionType listType = objectMapper.getTypeFactory()
                    .constructCollectionType(List.class, clazz);
            return objectMapper.readValue(file, listType);
        } catch (IOException e) {
            throw new RuntimeException("JSON dosyası okunamadı: " + filePath, e);
        }
    }
    
    public <T> void saveToJson(String filePath, List<T> data) {
        try {
            File file = new File(filePath);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, data);
        } catch (IOException e) {
            throw new RuntimeException("JSON dosyasına yazılamadı: " + filePath, e);
        }
    }
    
    public List<Map<String, Object>> loadUsers() {
        File file = new File(USERS_FILE);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(file, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, 
                    objectMapper.getTypeFactory().constructMapType(Map.class, String.class, Object.class)));
        } catch (IOException e) {
            throw new RuntimeException("JSON dosyası okunamadı: " + USERS_FILE, e);
        }
    }
    
    public void saveUsers(List<Map<String, Object>> users) {
        saveToJson(USERS_FILE, users);
    }
    
    public List<Map<String, Object>> loadGameResults() {
        File file = new File(GAME_RESULTS_FILE);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(file, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, 
                    objectMapper.getTypeFactory().constructMapType(Map.class, String.class, Object.class)));
        } catch (IOException e) {
            throw new RuntimeException("JSON dosyası okunamadı: " + GAME_RESULTS_FILE, e);
        }
    }
    
    public void saveGameResults(List<Map<String, Object>> gameResults) {
        saveToJson(GAME_RESULTS_FILE, gameResults);
    }
}

