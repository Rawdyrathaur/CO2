package com.octopus.backend.controller;

import com.octopus.backend.CarbonService;
import com.octopus.backend.PersistenceService;
import com.octopus.backend.dto.CarbonCalculationResponse;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/carbon")
@CrossOrigin(origins = "*")
public class CarbonController {

    private static final Logger log = LoggerFactory.getLogger(CarbonController.class);
    private final CarbonService carbonService;
    private final PersistenceService persistenceService;
    private final AtomicLong realBotMessages;     
    private final AtomicLong simulationMessages;   
    public CarbonController(CarbonService carbonService, PersistenceService persistenceService) {
        this.carbonService = carbonService;
        this.persistenceService = persistenceService;

      
        long savedCount = persistenceService.loadMessageCount();
        this.realBotMessages = new AtomicLong(savedCount);
        this.simulationMessages = new AtomicLong(0);

        log.info("CarbonController initialized with {} REAL bot messages from previous session", savedCount);
    }
    
    @PostMapping("/discord/batch")
    public Map<String, Object> recordDiscordBatch(@RequestBody Map<String, Object> request) {
        long messageCount = ((Number) request.get("count")).longValue();
        boolean isSimulation = request.containsKey("isSimulation")
            ? (Boolean) request.get("isSimulation")
            : false; 

        long newTotal;
        if (isSimulation) {
           
            newTotal = simulationMessages.addAndGet(messageCount);
            log.info("Simulation: added {} messages (simulation total: {})", messageCount, newTotal);
        } else {
           
            newTotal = realBotMessages.addAndGet(messageCount);
            persistenceService.saveMessageCount(newTotal);
            log.info("Real bot data: added {} messages (real total: {})", messageCount, newTotal);
        }

        CarbonCalculationResponse batchCalculation = carbonService.calculateDiscordCarbon(messageCount);

        long combinedTotal = realBotMessages.get() + simulationMessages.get();
        CarbonCalculationResponse totalCalculation = carbonService.calculateDiscordCarbon(combinedTotal);

        return Map.of(
            "batch", Map.of(
                "messages", messageCount,
                "carbon", batchCalculation.carbon(),
                "equivalents", batchCalculation.equivalents(),
                "isSimulation", isSimulation
            ),
            "hackathon", Map.of(
                "totalMessages", combinedTotal,
                "realBotMessages", realBotMessages.get(),
                "simulationMessages", simulationMessages.get(),
                "totalCarbon", totalCalculation.carbon(),
                "totalEquivalents", totalCalculation.equivalents(),
                "lastUpdated", Instant.now().toString()
            )
        );
    }
    
    
    @GetMapping("/hackathon/live")
    public Map<String, Object> getHackathonLiveData() {
        long realMessages = realBotMessages.get();
        long simMessages = simulationMessages.get();
        long combinedTotal = realMessages + simMessages;

        if (combinedTotal == 0) {
            return Map.of(
                "hackathon", "Octopus Hackathon",
                "totalMessages", 0,
                "realBotMessages", 0,
                "simulationMessages", 0,
                "carbonImpact", Map.of("kilograms", 0, "grams", 0),
                "equivalents", Map.of("carMiles", 0, "treeDays", 0),
                "lastUpdated", Instant.now().toString(),
                "message", "No data yet. Send your first batch!"
            );
        }

        CarbonCalculationResponse calculation = carbonService.calculateDiscordCarbon(combinedTotal);

        return Map.of(
            "hackathon", "Octopus Hackathon",
            "totalMessages", combinedTotal,
            "realBotMessages", realMessages,
            "simulationMessages", simMessages,
            "carbonImpact", calculation.carbon(),
            "equivalents", calculation.equivalents(),
            "lastUpdated", Instant.now().toString()
        );
    }
    
  
    @GetMapping("/hackathon/public")
    public Map<String, Object> getPublicHackathonData() {
        long currentTotal = realBotMessages.get() + simulationMessages.get();
        CarbonCalculationResponse calculation = carbonService.calculateDiscordCarbon(currentTotal);

        return Map.of(
            "event", "Octopus Hackathon",
            "description", "Live digital carbon footprint of our hackathon",
            "metrics", Map.of(
                "discordMessages", currentTotal,
                "carbonKg", calculation.carbon().kilograms(),
                "equivalentCarMiles", calculation.equivalents().carMiles()
            ),
            "impactStatement", formatImpactStatement(currentTotal, calculation),
            "viewLiveDashboard", "https://your-dashboard-url.here",
            "generatedAt", Instant.now().toString()
        );
    }

   
    @PostMapping("/simulation/reset")
    public Map<String, Object> resetSimulations() {
        long previousSimCount = simulationMessages.getAndSet(0);
        long realMessages = realBotMessages.get();

        log.info("Reset simulations: removed {} simulation messages, {} real messages remain",
                 previousSimCount, realMessages);

        CarbonCalculationResponse calculation = carbonService.calculateDiscordCarbon(realMessages);

        return Map.of(
            "success", true,
            "removedSimulations", previousSimCount,
            "remainingRealMessages", realMessages,
            "currentCarbon", calculation.carbon(),
            "message", "Simulation data reset successfully"
        );
    }
    
    
    @GetMapping("/calculate/single")
    public CarbonCalculationResponse calculateSingle(@RequestParam(defaultValue = "1500") long messages) {
        return carbonService.calculateDiscordCarbon(messages);
    }
 
    @GetMapping("/global-context")
    public Map<String, Object> getGlobalContext() {
        return Map.of(
            "articles", java.util.List.of(
                Map.of(
                    "id", "iea-datacenter-2024",
                    "title", "Data Centers to Use 8% of Global Electricity by 2030",
                    "description", "Latest IEA report shows AI and cloud computing driving unprecedented energy demand in data centers worldwide.",
                    "source", "International Energy Agency (IEA)",
                    "date", "2024-09",
                    "url", "https://www.iea.org/reports/electricity-2024",
                    "category", "energy",
                    "impact", "critical"
                ),
                Map.of(
                    "id", "nature-streaming-2024",
                    "title", "Streaming Video Emissions Lower Than Previously Thought",
                    "description", "New peer-reviewed research shows streaming's carbon footprint is 0.05-0.2kg CO₂/hour, emphasizing network efficiency improvements.",
                    "source", "Nature Climate Change",
                    "date", "2024-06",
                    "url", "https://www.nature.com/articles/s41558-024-01949-0",
                    "category", "research",
                    "impact", "moderate"
                ),
                Map.of(
                    "id", "w3c-sustainability-2024",
                    "title", "Web Sustainability Guidelines 1.0 Published",
                    "description", "W3C releases first official standard for sustainable web design and development practices.",
                    "source", "World Wide Web Consortium (W3C)",
                    "date", "2024-08",
                    "url", "https://www.w3.org/TR/wsg/",
                    "category", "standards",
                    "impact", "high"
                ),
                Map.of(
                    "id", "google-carbon-2024",
                    "title", "Google's AI Increases Data Center Emissions by 48%",
                    "description", "Google's 2024 environmental report reveals AI training and inference drove significant increases in carbon emissions.",
                    "source", "Google Environmental Report",
                    "date", "2024-07",
                    "url", "https://sustainability.google/reports/",
                    "category", "industry",
                    "impact", "critical"
                ),
                Map.of(
                    "id", "greenpeace-cloud-2024",
                    "title", "Major Cloud Providers Commit to 100% Renewable Energy",
                    "description", "AWS, Azure, and Google Cloud announce accelerated timelines for renewable energy adoption across global data centers.",
                    "source", "Greenpeace East Asia",
                    "date", "2024-10",
                    "url", "https://www.greenpeace.org/eastasia/publication/",
                    "category", "sustainability",
                    "impact", "high"
                )
            ),
            "lastUpdated", Instant.now().toString(),
            "totalArticles", 5
        );
    }

    private String formatImpactStatement(long messages, CarbonCalculationResponse calculation) {
        double kgCO2 = calculation.carbon().kilograms();
        double miles = calculation.equivalents().carMiles();

        return String.format(
            "Our %d Discord messages generated %.3f kg CO₂, equivalent to driving %.1f miles.",
            messages, kgCO2, miles
        );
    }
}
