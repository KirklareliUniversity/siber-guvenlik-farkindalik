package com.gameserver.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameResponse {
    private String gameState;
    private String message;
    private String userName;
    private int score;
    private int currentQuestionIndex;
    private int totalQuestions;
    private Question currentQuestion;
    private PasswordQuestion currentPasswordQuestion;
    private Map<String, Object> progress;
    private List<String> answers;
    private Map<String, Object> passwordAnalysis;
    private Map<String, Object> results;
    private boolean isCorrect;
    private String explanation;
    private String gameMode; // "PHISHING_ONLY", "PASSWORD_ONLY", "MIXED"
}
