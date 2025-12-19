package com.gameserver.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @JsonProperty("id")
    private int id;
    
    @JsonProperty("email")
    private Email email;
    
    @JsonProperty("question")
    private String question;
    
    @JsonProperty("options")
    private List<String> options;
    
    @JsonProperty("correctAnswer")
    private String correctAnswer;
    
    @JsonProperty("explanation")
    private String explanation;
}
