---
title: Azure App Configuration support for AI Configuration
description: Introduction to AI Configuration support using App Configuration
author: MaryanneNjeri
ms.author: mgichohi
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 04/18/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
---

# AI configuration

AI application development often requires rapid iteration of prompts and frequent tuning of model parameters to meet evolving goals such as quality, responsiveness, customer satisfaction, and cost efficiency. AI configuration in Azure App Configuration helps streamline this process by decoupling model settings from application code, enabling faster, safer, and more flexible iteration. Here are some key benefits:

* **Rapid configuration iteration**  
    Externalize AI model settings, such as prompts, temperature, or model versions, into Azure App Configuration. Your applications can dynamically load updated configurations at runtime without requiring restarts, rebuilds, or redeployments.

* **Guided configuration authoring**  
    Use built-in configuration templates that conform to the specifications of models from various providers. The guided configuration authoring simplifies the adoption of new models, reduces configuration errors, and accelerates development by ensuring your settings are valid and aligned with model requirements.

* **Safe and controlled rollouts**  
    Use feature flags to gradually release new model settings or models to targeted user segments. Monitor rollout progress with telemetry and control rollbacks or roll-forwards with ease.

* **Data-driven experimentation**  
	Define custom metrics to evaluate the effectiveness of new AI configurations. Measure impact on performance, cost, or user satisfaction to make informed decisions about future iterations.

## Chat completion configuration

Chat completion is an AI capability that produces human-like dialogue responses while retaining memory of previous interactions to create coherent, contextual conversations. The following models are supported.

| **Provider**   | **Model**             |
|----------------|-----------------------|
| OpenAI         | GPT-3.5-Turbo         |
| OpenAI         | GPT-4                 |
| OpenAI         | GPT-4o                |
| OpenAI         | GPT-4.5 Preview       |
| OpenAI         | GPT-4.1               |
| OpenAI         | GPT-4.1-nano          |
| OpenAI         | GPT-4.1-mini          |
| OpenAI         | o1                    |
| OpenAI         | o1-mini               |
| OpenAI         | o1-preview            |
| OpenAI         | o3-mini               |
| Anthropic      | Claude 3.7 Sonnet     |
| Google         | Gemini 2.5 Pro        |
| DeepSeek       | DeepSeek-R1           |
| xAI            | Grok-3                |
| xAI            | Grok-3 Mini           |

Azure OpenAI Service supports a diverse set of models from OpenAI. For more information, see [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models). To learn more about models from Anthropic, refer to the [Claude models documentation](https://docs.anthropic.com/docs/about-claude/models/overview).  
For more details about models provided by Google, see the [Gemini models documentation](https://ai.google.dev/gemini-api/docs/models).

## Next steps

Continue to the following instructions to use AI configuration in your application:

> [!div class="nextstepaction"]
> [Chat completion configuration](./howto-chat-completion-config.md)