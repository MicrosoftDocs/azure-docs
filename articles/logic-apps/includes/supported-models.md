---
ms.service: azure-logic-apps
ms.author: estfan
author: ecfan
ms.date: 02/18/2026
ms.topic: include
---

<a name="supported-models"></a>

## Supported Azure OpenAI Service models for agentic workflows

The following list specifies the AI models that you can use with agentic workflows:

### [Consumption (preview)](#tab/consumption)

Your agent loop automatically uses one of the following Azure OpenAI Service models:

- gpt-4o-mini
- gpt-5o-mini

> [!IMPORTANT]
>
> The AI model that your agent loop uses can originate from any region, so data residency for a specific region isn't guaranteed for data that the model handles.

### [Standard](#tab/standard)

Your agent loop can use one of the following models:

- gpt-5
- gpt-4.1
- gpt-4.1-mini
- gpt-4.1-nano
- gpt-4o
- gpt-4o-mini
- gpt-4
- gpt-35-turbo
