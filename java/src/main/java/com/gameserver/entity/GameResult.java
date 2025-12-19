package com.gameserver.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameResult {
    private Long id;
    private User user;
    private String gameMode;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer percentage;
    private String grade;
    private LocalDateTime playedAt;
}

