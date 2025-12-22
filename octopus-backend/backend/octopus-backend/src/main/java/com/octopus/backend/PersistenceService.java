package com.octopus.backend;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.*;

@Service
public class PersistenceService {
    private static final Logger log = LoggerFactory.getLogger(PersistenceService.class);
    private static final String DATA_FILE = "carbon-data.txt";

    public long loadMessageCount() {
        try {
            if (Files.exists(Paths.get(DATA_FILE))) {
                String content = Files.readString(Paths.get(DATA_FILE)).trim();
                long count = Long.parseLong(content);
                log.info("Loaded previous message count: {}", count);
                return count;
            }
        } catch (Exception e) {
            log.warn("Could not load previous data: {}", e.getMessage());
        }
        log.info("Starting with fresh message count");
        return 0;
    }

    public void saveMessageCount(long count) {
        try {
            Files.writeString(Paths.get(DATA_FILE), String.valueOf(count));
            log.debug("Saved message count: {}", count);
        } catch (Exception e) {
            log.error("Failed to save message count: {}", e.getMessage());
        }
    }
}
