package com.gameserver.state;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;

public class MenuState extends State {
    
    public MenuState() {
        super("menu");
    }

    @Override
    public GameResponse handleAction(GameContext context, GameAction action) {
        switch (action.getActionType()) {
            case "SELECT_GAME_MODE":
                String gameMode = action.getGameMode();
                
                if (gameMode == null || gameMode.trim().isEmpty()) {
                    return GameResponse.builder()
                            .gameState("menu")
                            .message("Oyun modu seçilmedi")
                            .build();
                }
                
                context.setGameMode(gameMode.trim());
                
                // Rastgele soruları seç
                context.selectRandomQuestions(gameMode.trim());
                
                // Seçilen moda göre ilgili state'e geç
                switch (gameMode.trim()) {
                    case "PHISHING_ONLY":
                        context.transitionTo(context.getStates().get("phishing"));
                        context.setCurrentQuestionIndex(0);
                        
                        // İlk phishing sorusunu getir
                        GameAction getQuestionAction = new GameAction();
                        getQuestionAction.setActionType("GET_CURRENT_QUESTION");
                        return context.getCurrentStateObj().handleAction(context, getQuestionAction);
                                
                    case "PASSWORD_ONLY":
                        context.transitionTo(context.getStates().get("password"));
                        context.setCurrentPasswordQuestionIndex(0);
                        
                        // İlk soruyu getir
                        GameAction getPasswordQuestionAction = new GameAction();
                        getPasswordQuestionAction.setActionType("GET_CURRENT_QUESTION");
                        return context.getCurrentStateObj().handleAction(context, getPasswordQuestionAction);
                                
                    case "MIXED":
                        // Karışık mod: önce phishing, sonra password
                        context.transitionTo(context.getStates().get("phishing"));
                        context.setCurrentQuestionIndex(0);
                        
                        // İlk phishing sorusunu getir (ilk 5 soru)
                        GameAction getPhishingQuestionAction = new GameAction();
                        getPhishingQuestionAction.setActionType("GET_CURRENT_QUESTION");
                        GameResponse response = context.getCurrentStateObj().handleAction(context, getPhishingQuestionAction);
                        return GameResponse.builder()
                                .gameState("phishing")
                                .gameMode("MIXED")
                                .message("Karışık mod başladı! Önce 5 phishing sorusu, sonra 5 şifre güvenliği sorusu. İlk soruya hazır mısınız?")
                                .userName(response.getUserName())
                                .currentQuestionIndex(response.getCurrentQuestionIndex())
                                .totalQuestions(response.getTotalQuestions())
                                .currentQuestion(response.getCurrentQuestion())
                                .progress(response.getProgress())
                                .score(response.getScore())
                                .build();
                                
                    default:
                        return GameResponse.builder()
                                .gameState("menu")
                                .message("Geçersiz oyun modu")
                                .build();
                }
                
            default:
                return GameResponse.builder()
                        .gameState("menu")
                        .message("Geçersiz aksiyon")
                        .build();
        }
    }
}

