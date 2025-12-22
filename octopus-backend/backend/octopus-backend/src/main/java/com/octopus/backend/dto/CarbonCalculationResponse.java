package com.octopus.backend.dto;

import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonProperty;

public record CarbonCalculationResponse(
    @JsonProperty("activity") String activity,
    @JsonProperty("count") Long count,
    @JsonProperty("carbon") CarbonMetrics carbon,
    @JsonProperty("equivalents") PhysicalEquivalents equivalents,
    @JsonProperty("timestamp") Instant timestamp,
    @JsonProperty("calculationModel") String calculationModel,
    @JsonProperty("note") String note,
    @JsonProperty("processingTimeMs") Long processingTimeMs,
    @JsonProperty("traceId") String traceId
) {
    public CarbonCalculationResponse(
        String activity, Long count, CarbonMetrics carbon,
        PhysicalEquivalents equivalents, Instant timestamp,
        String calculationModel, String note
    ) {
        this(activity, count, carbon, equivalents, timestamp,
             calculationModel, note, null, null);
    }

    public record CarbonMetrics(
        @JsonProperty("grams") Double grams,
        @JsonProperty("kilograms") Double kilograms
    ) {}

    public record PhysicalEquivalents(
        @JsonProperty("carMiles") Double carMiles,
        @JsonProperty("treeDays") Double treeDays
    ) {}
}
