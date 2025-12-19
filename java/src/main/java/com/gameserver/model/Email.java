package com.gameserver.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Email {
    @JsonProperty("from")
    private String from;
    
    @JsonProperty("subject")
    private String subject;
    
    @JsonProperty("body")
    private String body;
    
    @JsonProperty("hasLink")
    private boolean hasLink;
    
    @JsonProperty("urgency")
    private String urgency; // "low", "medium", "high"
}
