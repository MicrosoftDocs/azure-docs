how-to-monitor-LLM-safety-quality.md

# TEST

## Metric requirements: configuration
For generation safety and quality, the following data collection is required:

* **prompt (aka question) text** - the original prompt given by user
* **completion (aka answer) text** - the final completion from LLM API call that is returned to user
* **context text** - any context data that is sent to LLM API call together with original prompt (optional)
* **ground truth text** - the user-defined text as the source of truth (optional)