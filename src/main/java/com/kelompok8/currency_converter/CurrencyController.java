package com.kelompok8.currency_converter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "*")
public class CurrencyController {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public CurrencyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    @GetMapping("/convert")
    public ResponseEntity<?> convertCurrency(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam double amount
    ) {
        String url = "https://open.er-api.com/v6/latest/" + from;

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            if (!"success".equals(root.path("result").asText())) {
                return ResponseEntity.internalServerError().body(Map.of("error", "API call failed"));
            }

            JsonNode rates = root.path("rates");
            if (!rates.has(to)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid currency code: " + to));
            }

            double rate = rates.get(to).asDouble();
            double converted = rate * amount;

            Map<String, Object> result = new HashMap<>();
            result.put("from", from);
            result.put("to", to);
            result.put("rate", rate);
            result.put("amount", amount);
            result.put("converted", converted);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}