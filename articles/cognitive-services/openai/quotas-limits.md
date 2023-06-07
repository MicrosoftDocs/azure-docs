---
title: Azure OpenAI Service quotas and limits
titleSuffix: Azure Cognitive Services
description: Quick reference, detailed description, and best practices on the quotas and limits for the OpenAI service in Azure Cognitive Services.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: conceptual
ms.date: 06/08/2023
ms.author: mbullwin
---

# Azure OpenAI Service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for Azure OpenAI in Azure Cognitive Services.

## Quotas and limits reference

The following sections provide you with a quick guide to the default quotas and limits that apply to the Azure OpenAI:

| Limit Name | Limit Value |
|--|--|
| OpenAI resources per region per Azure subscription | 30 |
| Tokens per minute (TPM) per model and region<sup>1</sup> | GPT-4: TODO:DHuntley <br> GPT-4-32K: TODO:DHuntley <br> GPT-35-Turbo: TODO:DHuntley <br> Text-Davinci-003: TODO:DHuntley <br> All Others: TODO:DHuntley |
| Requests Per Minute (RPM) per model and region<sup>1</sup>| GPT-4: TODO:DHuntley <br> GPT-4-32K: TODO:DHuntley <br> GPT-35-Turbo: TODO:DHuntley <br> Text-Davinci-003: TODO:DHuntley <br> All Others: TODO:DHuntley |
| Maximum prompt tokens per request | Varies per model. For more information, see [Azure OpenAI Service models](./concepts/models.md)|
| Max fine-tuned model deployments<sup>2</sup> | 2 |
| Ability to deploy same model to multiple deployments | Not allowed |
| Total number of training jobs per resource | 100 |
| Max simultaneous running training jobs per resource | 1 |
| Max training jobs queued | 20 | 
| Max Files per resource | 50 |
| Total size of all files per resource | 1 GB | 
| Max training job time (job will fail if exceeded) | 720 hours |
| Max training job size (tokens in training file) x (# of epochs) | 2 Billion |

<sup>1</sup> Default quota limits are subject to change.

### General best practices to mitigate rate-limit throttling

To minimize issues related to throttling, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.
- Create another Azure OpenAI resource in the same or different regions

### How to request increases to the default quotas and limits

At this time, due to overwhelming demand we cannot accept any new resource or quota increase requests.

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
