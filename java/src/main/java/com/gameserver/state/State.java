package com.gameserver.state;

import com.gameserver.model.GameAction;
import com.gameserver.model.GameResponse;

public abstract class State {
    protected String name;

    public State(String name) {
        this.name = name;
    }

    public abstract GameResponse handleAction(GameContext context, GameAction action);

    public void enter(GameContext context) {
        // Optional: Called when entering this state
    }

    public void exit(GameContext context) {
        // Optional: Called when exiting this state
    }

    public String getName() {
        return name;
    }
}
