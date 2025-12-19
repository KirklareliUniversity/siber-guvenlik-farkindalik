package com.gameserver.controller;

import com.gameserver.entity.User;
import com.gameserver.entity.GameResult;
import com.gameserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, Object> request) {
        try {
            String fullName = (String) request.get("fullName");
            String birthDate = (String) request.get("birthDate");
            String educationLevel = (String) request.get("educationLevel");
            String profession = (String) request.get("profession");
            Boolean hasCybersecurityTraining = Boolean.valueOf(request.get("hasCybersecurityTraining").toString());
            
            if (fullName == null || fullName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Ad soyad gerekli"));
            }
            
            User user = userService.createUser(fullName, birthDate, educationLevel, profession, hasCybersecurityTraining);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", user.getId());
            response.put("message", "Kullanıcı başarıyla kaydedildi");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Hata: " + e.getMessage()));
        }
    }
    
    @PostMapping("/save-result")
    public ResponseEntity<Map<String, Object>> saveGameResult(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String gameMode = (String) request.get("gameMode");
            Integer score = Integer.valueOf(request.get("score").toString());
            Integer totalQuestions = Integer.valueOf(request.get("totalQuestions").toString());
            Integer correctAnswers = Integer.valueOf(request.get("correctAnswers").toString());
            Integer percentage = Integer.valueOf(request.get("percentage").toString());
            String grade = (String) request.get("grade");
            
            GameResult result = userService.saveGameResult(userId, gameMode, score, totalQuestions, 
                                                          correctAnswers, percentage, grade);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("resultId", result.getId());
            response.put("message", "Oyun sonucu kaydedildi");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Hata: " + e.getMessage()));
        }
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<Map<String, Object>> getLeaderboard() {
        try {
            List<GameResult> results = userService.getLeaderboard();
            
            List<Map<String, Object>> leaderboard = results.stream()
                    .map(result -> {
                        Map<String, Object> entry = new HashMap<>();
                        entry.put("rank", 0); // Will be set below
                        entry.put("fullName", result.getUser().getFullName());
                        entry.put("score", result.getScore());
                        entry.put("percentage", result.getPercentage());
                        entry.put("grade", result.getGrade());
                        entry.put("gameMode", result.getGameMode());
                        entry.put("playedAt", result.getPlayedAt().toString());
                        entry.put("hasCybersecurityTraining", result.getUser().getHasCybersecurityTraining());
                        return entry;
                    })
                    .collect(Collectors.toList());
            
            // Set ranks
            for (int i = 0; i < leaderboard.size(); i++) {
                leaderboard.get(i).put("rank", i + 1);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("leaderboard", leaderboard);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Hata: " + e.getMessage()));
        }
    }
}

