---
title: Azure OpenAI Service quotas and limits
titleSuffix: Azure AI services
description: Quick reference, detailed description, and best practices on the quotas and limits for the OpenAI service in Azure AI services.
#services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-openai
ms.custom:
  - ignite-2023
  - references_regions
ms.topic: conceptual
ms.date: 05/19/2024
ms.author: mbullwin
---

# Azure OpenAI Service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for Azure OpenAI in Azure AI services.

## Quotas and limits reference

The following sections provide you with a quick guide to the default quotas and limits that apply to Azure OpenAI:

| Limit Name | Limit Value |
|--|--|
| OpenAI resources per region per Azure subscription | 30 |
| Default DALL-E 2 quota limits | 2 concurrent requests |
| Default DALL-E 3 quota limits| 2 capacity units (6 requests per minute)|
| Maximum prompt tokens per request | Varies per model. For more information, see [Azure OpenAI Service models](./concepts/models.md)|
| Max fine-tuned model deployments | 5 |
| Total number of training jobs per resource | 100 |
| Max simultaneous running training jobs per resource | 1 |
| Max training jobs queued | 20 |
| Max Files per resource (fine-tuning) | 50 |
| Total size of all files per resource (fine-tuning) | 1 GB |
| Max training job time (job will fail if exceeded) | 720 hours |
| Max training job size (tokens in training file) x (# of epochs) | 2 Billion |
| Max size of all files per upload (Azure OpenAI on your data) | 16 MB |
| Max number or inputs in array with `/embeddings` | 2048 |
| Max number of `/chat/completions` messages | 2048 |
| Max number of `/chat/completions` functions | 128 |
| Max number of `/chat completions` tools | 128 |
| Maximum number of Provisioned throughput units per deployment | 100,000 |
| Max files per Assistant/thread | 20 |
| Max file size for Assistants & fine-tuning | 512 MB |
| Assistants token limit | 2,000,000 token limit |

## Regional quota limits

[!INCLUDE [Quota](~/reusable-content/ce-skilling/azure/includes/ai-services/openai/includes/model-matrix/quota.md)]

## gpt-4o rate limits

`gpt-4o` introduces rate limit tiers with higher limits for certain customer types.

### gpt-4o global standard

> [!NOTE]
> The [global standard model deployment type](./how-to/deployment-types.md#deployment-types) is currently in public preview.

|Tier| Quota Limit in tokens per minute (TPM) | Requests per minute |
|---|:---:|:---:|
|Enterprise agreement | 10 M | 60 K |
|Default | 450 K | 2.7 K |

M = million | K = thousand

### gpt-4o standard

|Tier| Quota Limit in tokens per minute (TPM) | Requests per minute |
|---|:---:|:---:|
|Enterprise agreement | 1 M | 6 K |
|Default | 150 K | 900 |

M = million | K = thousand

#### Usage tiers

Global Standard deployments use Azure's global infrastructure, dynamically routing customer traffic to the data center with best availability for the customer’s inference requests. This enables more consistent latency for customers with low to medium levels of traffic. Customers with high sustained levels of usage may see more variability in response latency.

The Usage Limit determines the level of usage above which customers might see larger variability in response latency. A customer’s usage is defined per model and is the total tokens consumed across all deployments in all subscriptions in all regions for a given tenant.

#### GPT-4o global standard & standard

|Model| Usage Tiers per month |
|----|----|
|`GPT-4o` |1.5 Billion tokens |

### General best practices to remain within rate limits

To minimize issues related to rate limits, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.
- Increase the quota assigned to your deployment. Move quota from another deployment, if necessary.

### How to request increases to the default quotas and limits

Quota increase requests can be submitted from the [Quotas](./how-to/quota.md) page of Azure OpenAI Studio. Please note that due to overwhelming demand, quota increase requests are being accepted and will be filled in the order they are received. Priority will be given to customers who generate traffic that consumes the existing quota allocation, and your request may be denied if this condition isn't met.

For other rate limits, please [submit a service request](../cognitive-services-support-options.md?context=/azure/ai-services/openai/context/context).

## Next steps

Explore how to [manage quota](./how-to/quota.md) for your Azure OpenAI deployments.
Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
