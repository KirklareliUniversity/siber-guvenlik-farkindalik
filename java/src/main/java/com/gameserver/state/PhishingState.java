package com.gameserver.state;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;
import com.gameserver.model.Question;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PhishingState extends State {
    
    public PhishingState() {
        super("phishing");
    }

    @Override
    public GameResponse handleAction(GameContext context, GameAction action) {
        String gameMode = context.getGameMode();
        List<Question> questions = getQuestionsForMode(context, gameMode);
        
        switch (action.getActionType()) {
            case "SUBMIT_ANSWER":
                Question currentQuestion = questions.get(context.getCurrentQuestionIndex());
                
                // Trim ve normalize et
                String userAnswer = action.getAnswer() != null ? action.getAnswer().trim() : "";
                String correctAnswer = currentQuestion.getCorrectAnswer() != null ? currentQuestion.getCorrectAnswer().trim() : "";
                boolean isCorrect = correctAnswer.equals(userAnswer);
                
                if (isCorrect) {
                    context.setScore(context.getScore() + 1);
                }
                
                context.getAnswers().add(action.getAnswer());
                // Otomatik ilerlemeyi kaldır: sadece geri bildirim döndür, index artırma
                Map<String, Object> submitProgress = new HashMap<>();
                submitProgress.put("current", context.getCurrentQuestionIndex());
                submitProgress.put("total", questions.size());

                return GameResponse.builder()
                        .gameState("phishing")
                        .gameMode(gameMode)
                        .message(isCorrect ? "Doğru cevap!" : "Yanlış cevap!")
                        .userName(context.getUserName())
                        .score(context.getScore())
                        .currentQuestionIndex(context.getCurrentQuestionIndex())
                        .totalQuestions(questions.size())
                        .progress(submitProgress)
                        .isCorrect(isCorrect)
                        .explanation(currentQuestion.getExplanation())
                        .build();
                
            case "GET_CURRENT_QUESTION":
                Question question = questions.get(context.getCurrentQuestionIndex());
                
                Map<String, Object> progress = new HashMap<>();
                progress.put("current", context.getCurrentQuestionIndex());
                progress.put("total", questions.size());
                
                return GameResponse.builder()
                        .gameState("phishing")
                        .gameMode(gameMode)
                        .currentQuestion(question)
                        .currentQuestionIndex(context.getCurrentQuestionIndex())
                        .totalQuestions(questions.size())
                        .score(context.getScore())
                        .userName(context.getUserName())
                        .progress(progress)
                        .build();
                        
            case "NEXT_QUESTION":
                if (context.getCurrentQuestionIndex() < questions.size() - 1) {
                    context.setCurrentQuestionIndex(context.getCurrentQuestionIndex() + 1);
                    Question nextQuestion = questions.get(context.getCurrentQuestionIndex());
                    
                    Map<String, Object> nextProgress = new HashMap<>();
                    nextProgress.put("current", context.getCurrentQuestionIndex());
                    nextProgress.put("total", questions.size());
                    
                    return GameResponse.builder()
                            .gameState("phishing")
                            .gameMode(gameMode)
                            .currentQuestion(nextQuestion)
                            .currentQuestionIndex(context.getCurrentQuestionIndex())
                            .totalQuestions(questions.size())
                            .score(context.getScore())
                            .userName(context.getUserName())
                            .progress(nextProgress)
                            .build();
                } else {
                    // Tüm phishing soruları bitti
                    // GameMode'a göre sonraki state'i belirle
                    if ("MIXED".equals(gameMode)) {
                        // Karışık mod: password state'e geç
                        context.transitionTo(context.getStates().get("password"));
                        context.setCurrentPasswordQuestionIndex(0);
                        
                        // İlk şifre sorusunu getir
                        GameAction getPasswordQuestionAction = new GameAction();
                        getPasswordQuestionAction.setActionType("GET_CURRENT_QUESTION");
                        return context.getCurrentStateObj().handleAction(context, getPasswordQuestionAction);
                    } else {
                        // PHISHING_ONLY mod: direkt results state'e geç
                        context.transitionTo(context.getStates().get("results"));
                        
                        // Results state'inde GET_RESULTS aksiyonunu çağır
                        GameAction resultsAction = new GameAction();
                        resultsAction.setActionType("GET_RESULTS");
                        return context.getCurrentStateObj().handleAction(context, resultsAction);
                    }
                }
                        
            default:
                return GameResponse.builder()
                        .gameState("phishing")
                        .gameMode(gameMode)
                        .message("Geçersiz aksiyon")
                        .build();
        }
    }
    
    private List<Question> getQuestionsForMode(GameContext context, String gameMode) {
        // Rastgele seçilmiş soruları kullan
        List<Question> selectedQuestions = context.getSelectedPhishingQuestions();
        if (selectedQuestions != null && !selectedQuestions.isEmpty()) {
            return selectedQuestions;
        }
        
        // Fallback: eğer seçilmiş sorular yoksa, eski mantığı kullan
        List<Question> allQuestions = context.getQuestions();
        if ("MIXED".equals(gameMode)) {
            return allQuestions.subList(0, Math.min(5, allQuestions.size()));
        } else {
            return allQuestions.subList(0, Math.min(10, allQuestions.size()));
        }
    }
}
