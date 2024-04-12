---
title: 'Spring Environment variables'
titleSuffix: Azure OpenAI Service
description: set up spring ai environment variables for your key and endpoint
services: cognitive-services
manager: nitinme
author: mrbullwinkle # external contributor: gm2552
ms.author: mbullwin
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/27/2023
---

### Environment variables

Create and assign persistent environment variables for your key and endpoint.

> [!NOTE]
> Spring AI defaults the model name to `gpt-35-turbo`. It's only necessary to provide the `SPRING_AI_AZURE_OPENAI_MODEL` value if you've deployed a model with a different name.

```bash
export SPRING_AI_AZURE_OPENAI_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE"
export SPRING_AI_AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE"
export SPRING_AI_AZURE_OPENAI_MODEL="REPLACE_WITH_YOUR_MODEL_NAME_HERE"
```
