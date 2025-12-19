package com.gameserver.state;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;

public class WelcomeState extends State {
    
    public WelcomeState() {
        super("welcome");
    }

    @Override
    public GameResponse handleAction(GameContext context, GameAction action) {
        switch (action.getActionType()) {
            case "START_GAME":
                if (action.getUserName() == null || action.getUserName().trim().isEmpty()) {
                    return GameResponse.builder()
                            .gameState("welcome")
                            .message("Kullanıcı adı gerekli")
                            .build();
                }
                
                context.setUserName(action.getUserName().trim());
                // Kullanıcı adı alındıktan sonra menu state'ine geç
                context.transitionTo(context.getStates().get("menu"));
                
                return GameResponse.builder()
                        .gameState("menu")
                        .message("Oyun modunu seçin")
                        .userName(context.getUserName())
                        .build();
                        
            default:
                return GameResponse.builder()
                        .gameState("welcome")
                        .message("Geçersiz aksiyon")
                        .build();
        }
    }
}
