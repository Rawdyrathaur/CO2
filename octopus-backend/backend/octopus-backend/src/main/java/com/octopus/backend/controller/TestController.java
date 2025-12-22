package com.octopus.backend.controller;

import com.octopus.backend.CarbonService;
import com.octopus.backend.dto.CarbonCalculationResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    private final CarbonService carbonService;
    
    public TestController(CarbonService carbonService) {
        this.carbonService = carbonService;
    }
    
    @GetMapping("/discord")
    public CarbonCalculationResponse testDiscord(@RequestParam(defaultValue = "1500") long messages) {
        return carbonService.calculateDiscordCarbon(messages);
    }
}
