package com.octopus.backend.dto;

import java.time.Instant;

public record ServiceHealthResponse(
    HealthStatus status,
    Instant checkedAt,
    String service
) {}
