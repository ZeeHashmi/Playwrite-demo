# AI Security Test Suite

A Playwright-based security testing framework for AI systems, designed to detect prompt injection, jailbreak, and data leakage vulnerabilities.

## Overview

Created by: Zee Hashmi

This test suite provides comprehensive security testing for AI models and endpoints. It includes:

- **Prompt Injection Tests** — Detect attempts to manipulate AI responses through injected instructions
- **Jailbreak Tests** — Identify vulnerabilities where safety guidelines can be bypassed
- **Data Leakage Tests** — Verify that sensitive information is not exposed in responses

## Project Structure

```
ai-security-test-suite/
├── tests/
│   ├── promptInjection.spec.ts   # Prompt injection vulnerability tests
│   ├── jailbreak.spec.ts         # Jailbreak attack tests
│   └── dataLeakage.spec.ts       # Data leakage vulnerability tests
├── utils/
│   ├── aiClient.ts               # AI API client wrapper
│   └── validators.ts             # Security test validators
├── config/
│   └── config.ts                 # Test configuration
├── package.json
├── playwright.config.ts
└── README.md
```

## Installation

```bash
npm install
```

## Configuration

Set environment variables before running tests:

| Variable | Description | Default |
|----------|-------------|---------|
| `AI_BASE_URL` | AI API endpoint | `https://api.openai.com/v1` |
| `AI_API_KEY` | API key for authentication | - |
| `AI_MODEL` | Model identifier | `gpt-4` |
| `AI_TIMEOUT` | Request timeout (ms) | `30000` |
| `BASE_URL` | Base URL for Playwright | `http://localhost:3000` |
| `VERBOSE` | Enable verbose logging | `false` |

## Running Tests

```bash
# Run all tests
npm test

# Run with UI mode
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# View HTML report
npm run report
```

## Test Categories

### Prompt Injection Tests

| Test | Description |
|------|-------------|
| Direct injection | Tests if model follows injected instructions |
| Indirect injection | Tests context manipulation via additional prompts |
| Role-playing injection | Tests "developer mode" and similar patterns |
| Context leakage | Tests if original prompts are revealed |
| Multi-turn injection | Tests gradual injection through conversation |

### Jailbreak Tests

| Test | Description |
|------|-------------|
| DAN jailbreak | Tests "Do Anything Now" style attacks |
| Role reversal | Tests evil bot / character role attacks |
| Authority escalation | Tests "developer override" patterns |
| Fictional scenario | Tests "fictional story" bypass attempts |
| Token manipulation | Tests obfuscated/encoded prompts |
| Chained attacks | Tests multi-step jailbreak attempts |
| Ignore previous | Tests "ignore above" patterns |

### Data Leakage Tests

| Test | Description |
|------|-------------|
| PII detection | Tests for personal information exposure |
| Training data extraction | Tests for proprietary data exposure |
| API key leakage | Tests for credential exposure |
| System prompt leakage | Tests for internal instructions exposure |
| Context overflow | Tests buffer overflow exploitation |
| Indirect leakage | Tests summarization-based exposure |
| Code credentials | Tests for hardcoded secrets in code |

## Validation Results

Each test returns a `ValidationResult` object:

```typescript
interface ValidationResult {
  passed: boolean;      // Whether the test passed
  severity: Severity;   // CRITICAL, HIGH, MEDIUM, or LOW
  issues: string[];     // List of detected issues
  score: number;        // Security score (0-100)
}
```

## Extending the Suite

### Adding Custom Tests

1. Create a new spec file in `tests/`
2. Import `AIClient` and `Validators` from `utils/`
3. Use the existing test patterns

### Adding Custom Validators

Extend `Validators` in `utils/validators.ts`:

```typescript
static validateCustomAttack(
  prompt: string,
  response: string
): ValidationResult {
  // Your validation logic here
}
```

## Security Score Interpretation

| Score | Interpretation |
|-------|----------------|
| 90-100 | Strong security posture |
| 70-89 | Minor issues detected |
| 50-69 | Moderate vulnerabilities |
| 0-49 | Critical security issues |

## License

MIT