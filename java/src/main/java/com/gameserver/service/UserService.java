package com.gameserver.service;

import com.gameserver.entity.User;
import com.gameserver.entity.GameResult;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private JsonStorageService jsonStorageService;
    
    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final List<GameResult> gameResults = new ArrayList<>();
    private final AtomicLong userIdCounter = new AtomicLong(1);
    private final AtomicLong resultIdCounter = new AtomicLong(1);
    
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    
    @PostConstruct
    public void init() {
        loadUsersFromJson();
        loadGameResultsFromJson();
    }
    
    private void loadUsersFromJson() {
        try {
            List<Map<String, Object>> usersData = jsonStorageService.loadUsers();
            for (Map<String, Object> userData : usersData) {
                User user = mapToUser(userData);
                users.put(user.getId(), user);
                if (user.getId() >= userIdCounter.get()) {
                    userIdCounter.set(user.getId() + 1);
                }
            }
        } catch (Exception e) {
            System.err.println("Kullanıcılar yüklenirken hata oluştu: " + e.getMessage());
        }
    }
    
    private void loadGameResultsFromJson() {
        try {
            List<Map<String, Object>> resultsData = jsonStorageService.loadGameResults();
            for (Map<String, Object> resultData : resultsData) {
                GameResult result = mapToGameResult(resultData);
                gameResults.add(result);
                if (result.getId() >= resultIdCounter.get()) {
                    resultIdCounter.set(result.getId() + 1);
                }
            }
        } catch (Exception e) {
            System.err.println("Oyun sonuçları yüklenirken hata oluştu: " + e.getMessage());
        }
    }
    
    private User mapToUser(Map<String, Object> userData) {
        User user = new User();
        user.setId(Long.valueOf(userData.get("id").toString()));
        user.setFullName((String) userData.get("fullName"));
        user.setBirthDate((String) userData.get("birthDate"));
        user.setEducationLevel((String) userData.get("educationLevel"));
        user.setProfession((String) userData.get("profession"));
        if (userData.get("hasCybersecurityTraining") != null) {
            user.setHasCybersecurityTraining(Boolean.valueOf(userData.get("hasCybersecurityTraining").toString()));
        }
        if (userData.get("createdAt") != null) {
            user.setCreatedAt(LocalDateTime.parse(userData.get("createdAt").toString(), DATE_TIME_FORMATTER));
        }
        return user;
    }
    
    private GameResult mapToGameResult(Map<String, Object> resultData) {
        GameResult result = new GameResult();
        result.setId(Long.valueOf(resultData.get("id").toString()));
        
        // userId'den User'ı bul
        Long userId = Long.valueOf(resultData.get("userId").toString());
        User user = users.get(userId);
        if (user == null) {
            throw new RuntimeException("Oyun sonucu için kullanıcı bulunamadı: " + userId);
        }
        result.setUser(user);
        
        result.setGameMode((String) resultData.get("gameMode"));
        result.setScore(Integer.valueOf(resultData.get("score").toString()));
        result.setTotalQuestions(Integer.valueOf(resultData.get("totalQuestions").toString()));
        result.setCorrectAnswers(Integer.valueOf(resultData.get("correctAnswers").toString()));
        result.setPercentage(Integer.valueOf(resultData.get("percentage").toString()));
        result.setGrade((String) resultData.get("grade"));
        if (resultData.get("playedAt") != null) {
            result.setPlayedAt(LocalDateTime.parse(resultData.get("playedAt").toString(), DATE_TIME_FORMATTER));
        }
        return result;
    }
    
    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("fullName", user.getFullName());
        map.put("birthDate", user.getBirthDate());
        map.put("educationLevel", user.getEducationLevel());
        map.put("profession", user.getProfession());
        map.put("hasCybersecurityTraining", user.getHasCybersecurityTraining());
        if (user.getCreatedAt() != null) {
            map.put("createdAt", user.getCreatedAt().format(DATE_TIME_FORMATTER));
        }
        return map;
    }
    
    private Map<String, Object> gameResultToMap(GameResult result) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", result.getId());
        map.put("userId", result.getUser().getId());
        map.put("gameMode", result.getGameMode());
        map.put("score", result.getScore());
        map.put("totalQuestions", result.getTotalQuestions());
        map.put("correctAnswers", result.getCorrectAnswers());
        map.put("percentage", result.getPercentage());
        map.put("grade", result.getGrade());
        if (result.getPlayedAt() != null) {
            map.put("playedAt", result.getPlayedAt().format(DATE_TIME_FORMATTER));
        }
        return map;
    }
    
    private void saveUsersToJson() {
        try {
            List<Map<String, Object>> usersData = users.values().stream()
                    .map(this::userToMap)
                    .collect(Collectors.toList());
            jsonStorageService.saveUsers(usersData);
        } catch (Exception e) {
            System.err.println("Kullanıcılar kaydedilirken hata oluştu: " + e.getMessage());
        }
    }
    
    private void saveGameResultsToJson() {
        try {
            List<Map<String, Object>> resultsData = gameResults.stream()
                    .map(this::gameResultToMap)
                    .collect(Collectors.toList());
            jsonStorageService.saveGameResults(resultsData);
        } catch (Exception e) {
            System.err.println("Oyun sonuçları kaydedilirken hata oluştu: " + e.getMessage());
        }
    }
    
    public User createUser(String fullName, String birthDate, String educationLevel, 
                          String profession, Boolean hasCybersecurityTraining) {
        // Son 1 dakika içinde aynı bilgilere sahip bir kullanıcı var mı kontrol et
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        for (User existingUser : users.values()) {
            if (existingUser.getFullName().equals(fullName) &&
                existingUser.getBirthDate().equals(birthDate) &&
                existingUser.getEducationLevel().equals(educationLevel) &&
                existingUser.getProfession().equals(profession) &&
                existingUser.getHasCybersecurityTraining().equals(hasCybersecurityTraining) &&
                existingUser.getCreatedAt() != null &&
                existingUser.getCreatedAt().isAfter(oneMinuteAgo)) {
                // Aynı kullanıcı son 1 dakika içinde kaydedilmiş, mevcut kullanıcıyı döndür
                return existingUser;
            }
        }
        
        // Yeni kullanıcı oluştur
        User user = new User();
        user.setId(userIdCounter.getAndIncrement());
        user.setFullName(fullName);
        user.setBirthDate(birthDate);
        user.setEducationLevel(educationLevel);
        user.setProfession(profession);
        user.setHasCybersecurityTraining(hasCybersecurityTraining);
        user.setCreatedAt(LocalDateTime.now());
        
        users.put(user.getId(), user);
        saveUsersToJson();
        return user;
    }
    
    public GameResult saveGameResult(Long userId, String gameMode, Integer score, 
                                     Integer totalQuestions, Integer correctAnswers, 
                                     Integer percentage, String grade) {
        User user = users.get(userId);
        if (user == null) {
            throw new RuntimeException("Kullanıcı bulunamadı: " + userId);
        }
        
        GameResult result = new GameResult();
        result.setId(resultIdCounter.getAndIncrement());
        result.setUser(user);
        result.setGameMode(gameMode);
        result.setScore(score);
        result.setTotalQuestions(totalQuestions);
        result.setCorrectAnswers(correctAnswers);
        result.setPercentage(percentage);
        result.setGrade(grade);
        result.setPlayedAt(LocalDateTime.now());
        
        gameResults.add(result);
        saveGameResultsToJson();
        return result;
    }
    
    public List<GameResult> getLeaderboard() {
        return gameResults.stream()
                .sorted(Comparator.comparing(GameResult::getScore).reversed()
                        .thenComparing(GameResult::getPercentage).reversed()
                        .thenComparing(GameResult::getPlayedAt).reversed())
                .limit(100) // Top 100
                .collect(Collectors.toList());
    }
    
    public User getUserById(Long userId) {
        return users.get(userId);
    }
}

