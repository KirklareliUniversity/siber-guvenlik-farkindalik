package com.gameserver.state;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;
import com.gameserver.model.PasswordQuestion;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PasswordState extends State {
    
    public PasswordState() {
        super("password");
    }

    @Override
    public GameResponse handleAction(GameContext context, GameAction action) {
        String gameMode = context.getGameMode();
        List<PasswordQuestion> questions = getQuestionsForMode(context, gameMode);
        
        switch (action.getActionType()) {
            case "GET_CURRENT_QUESTION":
                if (context.getCurrentPasswordQuestionIndex() < questions.size()) {
                    PasswordQuestion question = questions.get(context.getCurrentPasswordQuestionIndex());
                    
                    Map<String, Object> progress = new HashMap<>();
                    progress.put("current", context.getCurrentPasswordQuestionIndex());
                    progress.put("total", questions.size() + 1); // +1 şifre girişi için
                    
                    return GameResponse.builder()
                            .gameState("password")
                            .gameMode(gameMode)
                            .currentPasswordQuestion(question)
                            .currentQuestionIndex(context.getCurrentPasswordQuestionIndex())
                            .totalQuestions(questions.size() + 1)
                            .score(context.getScore())
                            .userName(context.getUserName())
                            .progress(progress)
                            .build();
                } else if (context.getCurrentPasswordQuestionIndex() == questions.size()) {
                    // Şifre girişi ekranı
                    Map<String, Object> passwordInputProgress = new HashMap<>();
                    passwordInputProgress.put("current", questions.size());
                    passwordInputProgress.put("total", questions.size() + 1);
                    
                    return GameResponse.builder()
                            .gameState("password")
                            .gameMode(gameMode)
                            .message("Tüm sorular tamamlandı! Şimdi güçlü bir örnek şifre oluşturun.")
                            .userName(context.getUserName())
                            .score(context.getScore())
                            .currentQuestionIndex(questions.size())
                            .totalQuestions(questions.size() + 1)
                            .currentPasswordQuestion(null)
                            .progress(passwordInputProgress)
                            .build();
                }
                break;
                
            case "SUBMIT_ANSWER":
                if (context.getCurrentPasswordQuestionIndex() < questions.size()) {
                    PasswordQuestion currentQuestion = questions.get(context.getCurrentPasswordQuestionIndex());
                    
                    String userAnswer = action.getAnswer() != null ? action.getAnswer().trim() : "";
                    String correctAnswer = currentQuestion.getCorrectAnswer() != null ? currentQuestion.getCorrectAnswer().trim() : "";
                    boolean isCorrect = correctAnswer.equals(userAnswer);
                    
                    if (isCorrect) {
                        context.setScore(context.getScore() + 1);
                    }
                    
                    if (context.getAnswers() == null) {
                        context.setAnswers(new ArrayList<>());
                    }
                    context.getAnswers().add(action.getAnswer());
                    
                    Map<String, Object> submitProgress = new HashMap<>();
                    submitProgress.put("current", context.getCurrentPasswordQuestionIndex());
                    submitProgress.put("total", questions.size() + 1); // +1 şifre girişi için

                    return GameResponse.builder()
                            .gameState("password")
                            .gameMode(gameMode)
                            .message(isCorrect ? "Doğru cevap!" : "Yanlış cevap!")
                            .userName(context.getUserName())
                            .score(context.getScore())
                            .currentQuestionIndex(context.getCurrentPasswordQuestionIndex())
                            .totalQuestions(questions.size())
                            .progress(submitProgress)
                            .isCorrect(isCorrect)
                            .explanation(currentQuestion.getExplanation())
                            .build();
                }
                break;
                
            case "NEXT_QUESTION":
                if (context.getCurrentPasswordQuestionIndex() < questions.size() - 1) {
                    context.setCurrentPasswordQuestionIndex(context.getCurrentPasswordQuestionIndex() + 1);
                    PasswordQuestion nextQuestion = questions.get(context.getCurrentPasswordQuestionIndex());
                    
                    Map<String, Object> nextProgress = new HashMap<>();
                    nextProgress.put("current", context.getCurrentPasswordQuestionIndex());
                    nextProgress.put("total", questions.size() + 1); // +1 şifre girişi için
                    
                    return GameResponse.builder()
                            .gameState("password")
                            .gameMode(gameMode)
                            .currentPasswordQuestion(nextQuestion)
                            .currentQuestionIndex(context.getCurrentPasswordQuestionIndex())
                            .totalQuestions(questions.size())
                            .score(context.getScore())
                            .userName(context.getUserName())
                            .progress(nextProgress)
                            .build();
                } else {
                    // Tüm şifre soruları bitti, şimdi şifre girişi iste
                    // Index'i bir artır ki son soru tamamlanmış olsun
                    context.setCurrentPasswordQuestionIndex(context.getCurrentPasswordQuestionIndex() + 1);
                    
                    Map<String, Object> passwordInputProgress = new HashMap<>();
                    passwordInputProgress.put("current", questions.size());
                    passwordInputProgress.put("total", questions.size() + 1);
                    
                    return GameResponse.builder()
                            .gameState("password")
                            .gameMode(gameMode)
                            .message("Tüm sorular tamamlandı! Şimdi güçlü bir örnek şifre oluşturun.")
                            .userName(context.getUserName())
                            .score(context.getScore())
                            .currentQuestionIndex(questions.size())
                            .totalQuestions(questions.size() + 1)
                            .currentPasswordQuestion(null) // Şifre girişi ekranı için null
                            .progress(passwordInputProgress)
                            .build();
                }
                
            case "SUBMIT_PASSWORD":
                String submittedPassword = action.getPassword();
                Map<String, Object> passwordAnalysis = analyzePassword(submittedPassword);
                context.setPasswordAnalysis(passwordAnalysis);
                
                // Şifre analizi tamamlandı, results state'e geç
                context.transitionTo(context.getStates().get("results"));
                
                GameAction resultsAction = new GameAction();
                resultsAction.setActionType("GET_RESULTS");
                GameResponse response = context.getCurrentStateObj().handleAction(context, resultsAction);
                return GameResponse.builder()
                        .gameState(response.getGameState())
                        .message(response.getMessage())
                        .userName(response.getUserName())
                        .score(response.getScore())
                        .totalQuestions(response.getTotalQuestions())
                        .results(response.getResults())
                        .passwordAnalysis(response.getPasswordAnalysis())
                        .gameMode(gameMode)
                        .build();
                        
            default:
                return GameResponse.builder()
                        .gameState("password")
                        .gameMode(gameMode)
                        .message("Geçersiz aksiyon")
                        .build();
        }
        
        return GameResponse.builder()
                .gameState("password")
                .gameMode(gameMode)
                .message("Geçersiz aksiyon")
                .build();
    }
    
    private List<PasswordQuestion> getQuestionsForMode(GameContext context, String gameMode) {
        // Rastgele seçilmiş soruları kullan
        List<PasswordQuestion> selectedQuestions = context.getSelectedPasswordQuestions();
        if (selectedQuestions != null && !selectedQuestions.isEmpty()) {
            return selectedQuestions;
        }
        
        // Fallback: eğer seçilmiş sorular yoksa, eski mantığı kullan
        List<PasswordQuestion> allQuestions = context.getPasswordQuestions();
        if ("MIXED".equals(gameMode)) {
            return allQuestions.subList(0, Math.min(5, allQuestions.size()));
        } else {
            return allQuestions.subList(0, Math.min(10, allQuestions.size()));
        }
    }
    
    private Map<String, Object> analyzePassword(String password) {
        Map<String, Object> analysis = new HashMap<>();
        
        if (password == null || password.isEmpty()) {
            analysis.put("score", 0);
            analysis.put("feedback", "Şifre boş olamaz");
            analysis.put("strength", "Çok Zayıf");
            return analysis;
        }
        
        int score = 0;
        StringBuilder feedback = new StringBuilder();
        
        // Uzunluk kontrolü
        if (password.length() >= 8) {
            score += 2;
            feedback.append("✓ En az 8 karakter uzunluğunda\n");
        } else {
            feedback.append("✗ En az 8 karakter olmalı\n");
        }
        
        // Büyük harf kontrolü
        if (password.matches(".*[A-Z].*")) {
            score += 1;
            feedback.append("✓ Büyük harf içeriyor\n");
        } else {
            feedback.append("✗ Büyük harf ekleyin\n");
        }
        
        // Küçük harf kontrolü
        if (password.matches(".*[a-z].*")) {
            score += 1;
            feedback.append("✓ Küçük harf içeriyor\n");
        } else {
            feedback.append("✗ Küçük harf ekleyin\n");
        }
        
        // Rakam kontrolü
        if (password.matches(".*[0-9].*")) {
            score += 1;
            feedback.append("✓ Rakam içeriyor\n");
        } else {
            feedback.append("✗ Rakam ekleyin\n");
        }
        
        // Özel karakter kontrolü
        if (password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            score += 2;
            feedback.append("✓ Özel karakter içeriyor\n");
        } else {
            feedback.append("✗ Özel karakter ekleyin\n");
        }
        
        // Yaygın şifre kontrolü
        String[] commonPasswords = {"123456", "password", "123456789", "12345678", "12345", "1234567", "1234567890", "qwerty", "abc123", "password123"};
        boolean isCommon = false;
        for (String common : commonPasswords) {
            if (password.toLowerCase().contains(common.toLowerCase())) {
                isCommon = true;
                break;
            }
        }
        
        if (isCommon) {
            score -= 2;
            feedback.append("✗ Yaygın şifre kullanılmış\n");
        } else {
            feedback.append("✓ Yaygın şifre değil\n");
        }
        
        String strength;
        if (score >= 6) {
            strength = "Güçlü";
        } else if (score >= 4) {
            strength = "Orta";
        } else if (score >= 2) {
            strength = "Zayıf";
        } else {
            strength = "Çok Zayıf";
        }
        
        analysis.put("score", Math.max(0, score));
        analysis.put("feedback", feedback.toString());
        analysis.put("strength", strength);
        analysis.put("length", password.length());
        
        return analysis;
    }
}
