package com.octopus.backend;

import com.octopus.backend.dto.*;
import com.octopus.backend.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.cache.annotation.Cacheable;
import jakarta.annotation.PostConstruct;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@Service
public class CarbonService {
    
    private static final Logger log = LoggerFactory.getLogger(CarbonService.class);
    
    @Value("${co2.microservice.url:http://localhost:3002/api/v1}")
    private String co2ServiceUrl;
    
    @Value("${co2.microservice.timeout.seconds:5}")
    private int timeoutSeconds;
    
    private final RestTemplate restTemplate;
    private HttpHeaders standardHeaders;
    
    public CarbonService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    @PostConstruct
    public void init() {
        this.standardHeaders = createStandardHeaders();
        log.info("CarbonService initialized. Microservice URL: {}, Timeout: {}s", 
                 co2ServiceUrl, timeoutSeconds);
    }
    
    /**
     * Calculates carbon impact for Discord messages with retry logic and caching.
     * Demonstrates: Resilience, Caching, Validation, Clean Error Handling
     */
    @Cacheable(value = "carbonCalculations", key = "#messageCount", unless = "#result == null")
    @Retryable(
        retryFor = {ResourceAccessException.class, HttpClientErrorException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2.0)
    )
    public CarbonCalculationResponse calculateDiscordCarbon(long messageCount) {
        validateInput(messageCount);
        
        log.debug("Calculating carbon for {} Discord messages", messageCount);
        Instant startTime = Instant.now();
        
        try {
            DiscordCalculationRequest request = new DiscordCalculationRequest(messageCount);
            ResponseEntity<CarbonCalculationResponse> response = callMicroservice(
                "/calculate/discord", 
                request, 
                CarbonCalculationResponse.class
            );
            
            Duration duration = Duration.between(startTime, Instant.now());
            log.info("Carbon calculation completed in {}ms for {} messages", 
                     duration.toMillis(), messageCount);
            
            return enrichResponse(response.getBody(), duration);
            
        } catch (HttpClientErrorException e) {
            throw new ValidationException(
                String.format("Invalid request for %d messages: %s", messageCount, e.getMessage()), 
                e
            );
        } catch (ResourceAccessException e) {
            throw new ServiceUnavailableException(
                "CO2 microservice unavailable. Please try again later.", 
                e
            );
        } catch (RestClientException e) {
            log.error("Unexpected error calculating carbon", e);
            throw new ServiceException(
                "Failed to calculate carbon impact. Please contact support.", 
                e
            );
        }
    }
    
    /**
     * Health check with circuit breaker pattern (simplified).
     * Demonstrates: Graceful degradation, Monitoring
     */
    public ServiceHealthResponse checkHealth() {
        try {
            ResponseEntity<?> response = restTemplate.getForEntity(
                co2ServiceUrl + "/health", 
                Map.class
            );
            
            boolean isHealthy = response.getStatusCode().is2xxSuccessful() &&
                               "operational".equals(((Map<?, ?>)response.getBody()).get("status"));
            
            return new ServiceHealthResponse(
                isHealthy ? HealthStatus.OPERATIONAL : HealthStatus.DEGRADED,
                Instant.now(),
                "co2-microservice"
            );
            
        } catch (RestClientException e) {
            log.warn("Health check failed for CO2 microservice: {}", e.getMessage());
            return new ServiceHealthResponse(
                HealthStatus.DOWN,
                Instant.now(),
                "co2-microservice"
            );
        }
    }
    
    // ==================== PRIVATE HELPER METHODS ====================
    
    private HttpHeaders createStandardHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        headers.set("X-Request-Source", "octopus-hackathon-backend");
        headers.set("X-Request-ID", java.util.UUID.randomUUID().toString());
        return HttpHeaders.readOnlyHttpHeaders(headers);
    }
    
    private <T, R> ResponseEntity<R> callMicroservice(String endpoint, T request, Class<R> responseType) {
        String url = co2ServiceUrl + endpoint;
        HttpEntity<T> entity = new HttpEntity<>(request, standardHeaders);
        
        log.debug("Calling CO2 microservice: {}", url);
        return restTemplate.exchange(url, HttpMethod.POST, entity, responseType);
    }
    
    private void validateInput(long messageCount) {
        if (messageCount < 0) {
            throw new ValidationException("Message count cannot be negative: " + messageCount);
        }
        if (messageCount > 10_000_000L) { // Sanity check
            throw new ValidationException(
                String.format("Message count %d exceeds reasonable limit", messageCount)
            );
        }
    }
    
    private CarbonCalculationResponse enrichResponse(CarbonCalculationResponse response, Duration processingTime) {
        if (response == null) return null;
        
        // Add metadata for observability
        return new CarbonCalculationResponse(
            response.activity(),
            response.count(),
            response.carbon(),
            response.equivalents(),
            response.timestamp(),
            response.calculationModel(),
            response.note(),
            processingTime.toMillis(), // Additional metadata
            java.util.UUID.randomUUID().toString() // Trace ID
        );
    }
    
    // ==================== SUPPORTING CLASSES ====================
    
    public record DiscordCalculationRequest(Long count) {
        public DiscordCalculationRequest {
            if (count == null || count < 0) {
                throw new IllegalArgumentException("Count must be non-negative");
            }
        }
    }
}