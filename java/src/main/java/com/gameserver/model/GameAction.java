package com.gameserver.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameAction {
    private String actionType;
    private String userName;
    private String sessionId;
    private String answer;
    private String password;
    private String gameMode; // "PHISHING_ONLY", "PASSWORD_ONLY", "MIXED"
    private Object payload;
}
