package com.gameserver.controller;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;
import com.gameserver.state.GameContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {
    
    private final Map<String, GameContext> sessions = new ConcurrentHashMap<>();
    
    @PostMapping("/start")
    public ResponseEntity<GameResponse> startGame(@RequestBody Map<String, String> request) {
        try {
            String userName = request.get("userName");
            String sessionId = request.get("sessionId");
            
            if (userName == null || userName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(GameResponse.builder()
                                .gameState("welcome")
                                .message("Kullanıcı adı gerekli")
                                .build());
            }
            
            if (sessionId == null || sessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(GameResponse.builder()
                                .gameState("welcome")
                                .message("Session ID gerekli")
                                .build());
            }
            
            GameContext gameContext = new GameContext();
            sessions.put(sessionId, gameContext);
            
            GameAction action = new GameAction();
            action.setActionType("START_GAME");
            action.setUserName(userName.trim());
            
            GameResponse result = gameContext.handleAction(action);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(GameResponse.builder()
                            .gameState("error")
                            .message("Sunucu hatası: " + e.getMessage())
                            .build());
        }
    }
    
    @PostMapping("/submit")
    @SuppressWarnings("unchecked")
    public ResponseEntity<GameResponse> submitAction(@RequestBody Map<String, Object> request) {
        try {
            String sessionId = (String) request.get("sessionId");
            String actionType = (String) request.get("actionType");
            Map<String, Object> payload = null;
            Object payloadObj = request.get("payload");
            if (payloadObj instanceof Map) {
                payload = (Map<String, Object>) payloadObj;
            }
            
            if (sessionId == null || sessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(GameResponse.builder()
                                .gameState("error")
                                .message("Session ID gerekli")
                                .build());
            }
            
            GameContext gameContext = sessions.get(sessionId);
            if (gameContext == null) {
                return ResponseEntity.badRequest()
                        .body(GameResponse.builder()
                                .gameState("error")
                                .message("Geçersiz session ID")
                                .build());
            }
            
            GameAction action = new GameAction();
            action.setActionType(actionType);
            action.setSessionId(sessionId);
            
            if (payload != null) {
                action.setAnswer((String) payload.get("answer"));
                action.setPassword((String) payload.get("password"));
                action.setGameMode((String) payload.get("gameMode"));
                action.setPayload(payload);
            }
            
            GameResponse result = gameContext.handleAction(action);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(GameResponse.builder()
                            .gameState("error")
                            .message("Sunucu hatası: " + e.getMessage())
                            .build());
        }
    }
    
    @GetMapping("/results/{sessionId}")
    public ResponseEntity<GameResponse> getResults(@PathVariable String sessionId) {
        try {
            if (sessionId == null || sessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(GameResponse.builder()
                                .gameState("error")
                                .message("Session ID gerekli")
                                .build());
            }
            
            GameContext gameContext = sessions.get(sessionId);
            if (gameContext == null) {
                return ResponseEntity.badRequest()
                        .body(GameResponse.builder()
                                .gameState("error")
                                .message("Geçersiz session ID")
                                .build());
            }
            
            GameAction action = new GameAction();
            action.setActionType("GET_RESULTS");
            
            GameResponse result = gameContext.handleAction(action);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(GameResponse.builder()
                            .gameState("error")
                            .message("Sunucu hatası: " + e.getMessage())
                            .build());
        }
    }
    
    @PostMapping("/restart")
    public ResponseEntity<GameResponse> restartGame(@RequestBody Map<String, String> request) {
        try {
            String sessionId = request.get("sessionId");
            
            if (sessionId == null || sessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(GameResponse.builder()
                                .gameState("error")
                                .message("Session ID gerekli")
                                .build());
            }
            
            sessions.remove(sessionId);
            
            return ResponseEntity.ok(GameResponse.builder()
                    .gameState("welcome")
                    .message("Oyun sıfırlandı")
                    .build());
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(GameResponse.builder()
                            .gameState("error")
                            .message("Sunucu hatası: " + e.getMessage())
                            .build());
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
