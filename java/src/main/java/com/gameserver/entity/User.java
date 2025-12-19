package com.gameserver.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String fullName;
    private String birthDate;
    private String educationLevel;
    private String profession;
    private Boolean hasCybersecurityTraining;
    private LocalDateTime createdAt;
}

