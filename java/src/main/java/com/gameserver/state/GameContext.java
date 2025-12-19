package com.gameserver.state;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;
import com.gameserver.model.Question;
import com.gameserver.model.PasswordQuestion;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GameContext {
    private Map<String, State> states;
    private State currentState;
    private String gameState;
    private List<Question> questions;
    private List<PasswordQuestion> passwordQuestions;
    private List<Question> selectedPhishingQuestions; // Seçilen phishing soruları
    private List<PasswordQuestion> selectedPasswordQuestions; // Seçilen şifre güvenliği soruları
    private String userName;
    private int score;
    private List<String> answers;
    private int currentQuestionIndex;
    private int currentPasswordQuestionIndex;
    private Map<String, Object> passwordAnalysis;
    private String gameMode; // "PHISHING_ONLY", "PASSWORD_ONLY", "MIXED"
    
    public GameContext() {
        this.states = new HashMap<>();
        this.states.put("welcome", new WelcomeState());
        this.states.put("menu", new MenuState());
        this.states.put("phishing", new PhishingState());
        this.states.put("password", new PasswordState());
        this.states.put("results", new ResultsState());
        
        this.currentState = this.states.get("welcome");
        this.gameState = "welcome";
        
        loadQuestions();
        loadPasswordQuestions();
        reset();
    }
    
    private void loadQuestions() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ClassPathResource resource = new ClassPathResource("questions.json");
            this.questions = mapper.readValue(resource.getInputStream(), new TypeReference<List<Question>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Questions dosyası yüklenemedi", e);
        }
    }
    
    private void loadPasswordQuestions() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ClassPathResource resource = new ClassPathResource("password-questions.json");
            this.passwordQuestions = mapper.readValue(resource.getInputStream(), new TypeReference<List<PasswordQuestion>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Password questions dosyası yüklenemedi", e);
        }
    }
    
    public void reset() {
        this.userName = "";
        this.score = 0;
        this.answers = new ArrayList<>();
        this.currentQuestionIndex = 0;
        this.currentPasswordQuestionIndex = 0;
        this.passwordAnalysis = null;
        this.gameMode = null;
        this.selectedPhishingQuestions = null;
        this.selectedPasswordQuestions = null;
    }
    
    /**
     * Oyun moduna göre rastgele sorular seçer
     * PHISHING_ONLY: 10 phishing sorusu
     * PASSWORD_ONLY: 10 şifre güvenliği sorusu
     * MIXED: 5 phishing + 5 şifre güvenliği sorusu
     */
    public void selectRandomQuestions(String gameMode) {
        if (gameMode == null) {
            return;
        }
        
        // Tüm soruların bir kopyasını oluştur ve karıştır
        List<Question> shuffledPhishing = new ArrayList<>(this.questions);
        Collections.shuffle(shuffledPhishing);
        
        List<PasswordQuestion> shuffledPassword = new ArrayList<>(this.passwordQuestions);
        Collections.shuffle(shuffledPassword);
        
        switch (gameMode) {
            case "PHISHING_ONLY":
                // 10 phishing sorusu seç
                this.selectedPhishingQuestions = cloneWithShuffledOptions(
                        shuffledPhishing.subList(0, Math.min(10, shuffledPhishing.size())));
                this.selectedPasswordQuestions = new ArrayList<>();
                break;
                
            case "PASSWORD_ONLY":
                // 10 şifre güvenliği sorusu seç
                this.selectedPhishingQuestions = new ArrayList<>();
                this.selectedPasswordQuestions = cloneWithShuffledPasswordOptions(
                        shuffledPassword.subList(0, Math.min(10, shuffledPassword.size())));
                break;
                
            case "MIXED":
                // 5 phishing + 5 şifre güvenliği sorusu seç
                this.selectedPhishingQuestions = cloneWithShuffledOptions(
                        shuffledPhishing.subList(0, Math.min(5, shuffledPhishing.size())));
                this.selectedPasswordQuestions = cloneWithShuffledPasswordOptions(
                        shuffledPassword.subList(0, Math.min(5, shuffledPassword.size())));
                break;
        }
    }
    
    public State getState(String stateName) {
        return this.states.get(stateName);
    }
    
    public void transitionTo(State newState) {
        if (this.currentState != null) {
            this.currentState.exit(this);
        }
        
        this.currentState = newState;
        this.gameState = newState.getName();
        
        if (this.currentState != null) {
            this.currentState.enter(this);
        }
    }
    
    public GameResponse handleAction(GameAction action) {
        return this.currentState.handleAction(this, action);
    }
    
    public String getCurrentState() {
        return this.gameState;
    }
    
    // Getters and Setters
    public Map<String, State> getStates() {
        return states;
    }
    
    public State getCurrentStateObj() {
        return currentState;
    }
    
    public String getGameState() {
        return gameState;
    }
    
    public List<Question> getQuestions() {
        return questions;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public int getScore() {
        return score;
    }
    
    public void setScore(int score) {
        this.score = score;
    }
    
    public List<String> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }
    
    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }
    
    public void setCurrentQuestionIndex(int currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }
    
    public Map<String, Object> getPasswordAnalysis() {
        return passwordAnalysis;
    }
    
    public void setPasswordAnalysis(Map<String, Object> passwordAnalysis) {
        this.passwordAnalysis = passwordAnalysis;
    }
    
    public String getGameMode() {
        return gameMode;
    }
    
    public void setGameMode(String gameMode) {
        this.gameMode = gameMode;
    }
    
    public List<PasswordQuestion> getPasswordQuestions() {
        return passwordQuestions;
    }
    
    public int getCurrentPasswordQuestionIndex() {
        return currentPasswordQuestionIndex;
    }
    
    public void setCurrentPasswordQuestionIndex(int currentPasswordQuestionIndex) {
        this.currentPasswordQuestionIndex = currentPasswordQuestionIndex;
    }
    
    public List<Question> getSelectedPhishingQuestions() {
        return selectedPhishingQuestions;
    }
    
    public List<PasswordQuestion> getSelectedPasswordQuestions() {
        return selectedPasswordQuestions;
    }

    private List<Question> cloneWithShuffledOptions(List<Question> source) {
        List<Question> cloned = new ArrayList<>();
        for (Question q : source) {
            List<String> optionsCopy = new ArrayList<>(q.getOptions());
            Collections.shuffle(optionsCopy);
            Question clone = new Question(
                    q.getId(),
                    q.getEmail(),
                    q.getQuestion(),
                    optionsCopy,
                    q.getCorrectAnswer(),
                    q.getExplanation()
            );
            cloned.add(clone);
        }
        return cloned;
    }

    private List<PasswordQuestion> cloneWithShuffledPasswordOptions(List<PasswordQuestion> source) {
        List<PasswordQuestion> cloned = new ArrayList<>();
        for (PasswordQuestion q : source) {
            List<String> optionsCopy = new ArrayList<>(q.getOptions());
            Collections.shuffle(optionsCopy);
            PasswordQuestion clone = new PasswordQuestion(
                    q.getId(),
                    q.getQuestion(),
                    optionsCopy,
                    q.getCorrectAnswer(),
                    q.getExplanation()
            );
            cloned.add(clone);
        }
        return cloned;
    }
}
