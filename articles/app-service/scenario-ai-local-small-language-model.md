---
title: Use local small language models (SLMs) in Azure App Service
description: Deploy a web app with a local small language model (SLM) as a sidecar container to run AI models entirely within your App Service environment. No outbound calls or external AI service dependencies required.
author: cephalin
ms.author: cephalin
ms.service: azure-app-service
ms.topic: how-to
ms.date: 01/29/2026
ms.custom:
  - build-2025
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Use a local SLM (sidecar container)

Deploy a web app with a local small language model (SLM) as a sidecar container to run AI models entirely within your App Service environment. No outbound calls or external AI service dependencies required. This approach is ideal if you have strict data privacy or compliance requirements, as all AI processing and data remain local to your app. App Service offers high-performance, memory-optimized pricing tiers needed for running SLMs in sidecars.

## Overview

Small Language Models (SLMs) are compact AI models, such as Microsoft's Phi-3 and Phi-4 series, that can run efficiently with fewer computational resources compared to large language models. By deploying an SLM as a sidecar container alongside your web application in App Service, you can process AI requests entirely locally without making external API calls.

This architecture provides several advantages:

- **Complete data privacy**: All data and AI processing stays within your App Service environment
- **Zero external dependencies**: No reliance on external AI services or internet connectivity
- **Predictable latency**: Responses are consistently fast with no network overhead
- **Cost control**: Pay only for App Service compute resources, with no per-token charges
- **Regulatory compliance**: Meet strict data residency and privacy requirements

## When to use local SLMs

Local SLMs are ideal for scenarios where:

- **Data privacy is critical**: Healthcare, finance, legal, or government applications that cannot send data to external services
- **Offline capability is required**: Applications that must function without internet connectivity
- **Predictable costs are important**: Fixed infrastructure costs instead of variable per-request pricing
- **Low latency is essential**: Sub-100ms response times without network calls
- **Moderate AI capabilities suffice**: Tasks like classification, summarization, entity extraction, or simple Q&A that don't require the most powerful models

While SLMs may not match the capabilities of large models like GPT-4, they excel in focused, domain-specific tasks where smaller models can be fine-tuned for excellent performance with complete control over your data.

## Technical approach

App Service supports running SLMs through sidecar containers that deploy alongside your main application. The sidecar runs the model inference engine (such as ONNX Runtime or llama.cpp) and exposes a local endpoint your app can call. This keeps all processing in-process and maintains isolation while sharing the same compute resources.

## Get started with tutorials

## [.NET](#tab/dotnet)
- [Run a chatbot with a local SLM sidecar extension](tutorial-ai-slm-dotnet.md)

## [Java](#tab/java)
- [Run a chatbot with a local SLM (Spring Boot)](tutorial-ai-slm-spring-boot.md)

## [Node.js](#tab/nodejs)
- [Run a chatbot with a local SLM (Express.js)](tutorial-ai-slm-expressjs.md)

## [Python](#tab/python)
- [Run a chatbot with a local SLM (FastAPI)](tutorial-ai-slm-fastapi.md)
-----

## Related content

- [Integrate AI into your Azure App Service applications](overview-ai-integration.md)
