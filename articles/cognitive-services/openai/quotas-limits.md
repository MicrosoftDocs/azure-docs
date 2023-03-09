---
title: Azure OpenAI Service quotas and limits
titleSuffix: Azure Cognitive Services
description: Quick reference, detailed description, and best practices on the quotas and limits for the OpenAI service in Azure Cognitive Services.
services: cognitive-services
author: ChrisHMSFT
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: conceptual
ms.date: 03/01/2023
ms.author: chrhoder
---

# Azure OpenAI Service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for Azure OpenAI in Azure Cognitive Services.

## Quotas and limits reference

The following sections provide you with a quick guide to the quotas and limits that apply to the Azure OpenAI:

| Limit Name | Limit Value |
|--|--|
| OpenAI resources per region | 2 | 
| Requests per minute per model* | ChatGPT & Davinci-models (002 and later): 120  <br> All other models: 300 |
| Tokens per minute per model* | ChatGPT & Davinci-models (002 and later): 40,000  <br> All other models: 120,000 |
| Max fine-tuned model deployments* | 2 |
| Ability to deploy same model to multiple deployments | Not allowed |
| Total number of training jobs per resource | 100 |
| Max simultaneous running training jobs per resource | 1 |
| Max training jobs queued | 20 | 
| Max Files per resource | 50 |
| Total size of all files per resource | 1 GB | 
| Max training job time (job will fail if exceeded) | 120 hours |
| Max training job size (tokens in training file) x (# of epochs) | **Ada**: 40-M tokens <br> **Babbage**: 40-M tokens <br> **Curie**: 40-M tokens <br> **Cushman**: 40-M tokens <br> **Davinci**: 10-M |

*The limits are subject to change. We anticipate that you will need higher limits as you move toward production and your solution scales. When you know your solution requirements, please reach out to us by applying for a quota increase here: <https://aka.ms/oai/quotaincrease>

### General best practices to mitigate throttling during autoscaling

To minimize issues related to throttling, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.
- Create another OpenAI service resource in the same or different regions, and distribute the workload among them.

The next sections describe specific cases of adjusting quotas.

### How to request an increase to the transactions-per-minute,  number of fine-tuned models deployed or token per minute quotas.

If you need to increase the limit, you can apply for a quota increase here: <https://aka.ms/oai/quotaincrease>

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
