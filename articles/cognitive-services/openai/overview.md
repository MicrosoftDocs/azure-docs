---
title: What is Azure OpenAI?
titleSuffix: Azure Cognitive Services
description: Apply advanced language models to variety of use cases with the Azure OpenAI service 
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: overview
ms.date: 5/24/2021
ms.custom: 
keywords:  
---

# What is Azure OpenAI?

The Azure OpenAI service provides REST API access to OpenAI's powerful language models including the GPT-3, Codex and Embeddings model series. These models can be easily adapted to your specific task including but not limited to content generation, summarization, semantic search, and natural language to code translation. Users can access the service through REST APIs, Python SDK, or our web-based interface in the Azure OpenAI Studio.

### Features overview

| Feature | Azure OpenAI |
| ---     |  --- |
| Models available | GPT-3 base series <br> Codex Series <br> Embeddings Series <br> Learn more in our [Engines](./concepts/engines.md) page.|
| Fine-tuning | Ada, <br>Babbage, <br> Curie,<br>Code-cushman-001 <br> Davinci<br> |
| Billing Model| Coming Soon |
| Virtual network support | Yes | 
| Managed Identity| Yes, via Azure Active Directory | 
| UI experience | **Azure Portal** for account & resource management, <br> **Azure OpenAI Service Studio** for model exploration and fine tuning |
| Regional availability | South Central US, <br> West Europe |
| Content filtering | Prompts and completions are evaluated against our content policy with automated systems. High severity content will be blocked. |

## Responsible AI

At Microsoft, we're committed to the advancement of AI driven by principles that put people first. Generative models such as the ones available in the Azure OpenAI service have significant potential benefits, but without careful design and thoughtful mitigations, such models have the potential to generate incorrect or even harmful content. Microsoft has made significant investments to help guard against abuse and unintended harm, which includes requiring applicants to show well-defined use cases, incorporating Microsoft’s [principles for responsible AI use](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1:primaryr6), building content filters to support customers, and providing responsible AI implementation guidance to onboarded customers.

## How do I get access to Azure OpenAI?

How do I get access to Azure OpenAI Service?

Access is currently limited as we navigate high demand, upcoming product improvements, and [Microsoft’s commitment to responsible AI](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1:primaryr6). For now, we're working with customers with an existing partnership with Microsoft, lower risk use cases, and those committed to incorporating mitigations. In addition to applying for initial access, all solutions using the Azure OpenAI service are required to go through a use case review before they can be released for production use.

More specific information is included in the application form. We appreciate your patience as we work to responsibly enable broader access to the Azure OpenAI service.

Apply here for initial access or for a production review:

[Apply now](https://aka.ms/oaiapply)

All solutions using the Azure OpenAI service are also required to go through a use case review before they can be released for production use, and are evaluated on a case-by-case basis. In general, the more sensitive the scenario the more important risk mitigation measures will be for approval.

## Terms of Use

The use  of Azure OpenAI service is governed by the terms of service that were agreed to upon onboarding. You may only use this service for the use case provided. You must complete an additional review before using the Azure OpenAI service in a "live" or production scenario, within your company, or with your customers (as compared to use solely for internal evaluation).

## Next steps

Learn more about the [underlying engines/models that power Azure OpenAI](./concepts/engines.md).