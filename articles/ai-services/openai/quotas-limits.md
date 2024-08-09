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
ms.date: 08/08/2024
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
| Default Whisper quota limits | 3 requests per minute |
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
| Max files per Assistant/thread | 10,000 when using the API or AI Studio. 20 when using Azure OpenAI Studio.|
| Max file size for Assistants & fine-tuning | 512 MB |
| Assistants token limit | 2,000,000 token limit |
| GPT-4o max images per request (# of images in the messages array/conversation history) | 10 |
| GPT-4 `vision-preview` & GPT-4 `turbo-2024-04-09` default max tokens | 16 <br><br> Increase the `max_tokens` parameter value to avoid truncated responses. GPT-4o max tokens defaults to 4096. |
| Max number of custom headers in API requests<sup>1</sup> | 10 |

<sup>1</sup> Our current APIs allow up to 10 custom headers, which are passed through the pipeline, and returned. We have noticed some customers now exceed this header count resulting in HTTP 431 errors. There is no solution for this error, other than to reduce header volume.  **In future API versions we will no longer pass through custom headers**. We recommend customers not depend on custom headers in future system architectures.


## Regional quota limits

[!INCLUDE [Quota](./includes/model-matrix/quota.md)]

[!INCLUDE [Quota](./includes/global-batch-limits.md)]

## gpt-4o rate limits

`gpt-4o` and `gpt-4o-mini` have rate limit tiers with higher limits for certain customer types.

### gpt-4o global standard

| Model|Tier| Quota Limit in tokens per minute (TPM) | Requests per minute |
|---|---|:---:|:---:|
|`gpt-4o`|Enterprise agreement | 30 M | 180 K |
|`gpt-4o-mini` | Enterprise agreement | 50 M | 300 K |
|`gpt-4o` |Default | 450 K | 2.7 K |
|`gpt-4o-mini` | Default | 2 M | 12 K  |

M = million | K = thousand

### gpt-4o standard

| Model|Tier| Quota Limit in tokens per minute (TPM) | Requests per minute |
|---|---|:---:|:---:|
|`gpt-4o`|Enterprise agreement | 1 M | 6 K |
|`gpt-4o-mini` | Enterprise agreement | 2 M | 12 K |
|`gpt-4o`|Default | 150 K | 900 |
|`gpt-4o-mini` | Default | 450 K | 2.7 K |

M = million | K = thousand

#### Usage tiers

Global Standard deployments use Azure's global infrastructure, dynamically routing customer traffic to the data center with best availability for the customer’s inference requests. This enables more consistent latency for customers with low to medium levels of traffic. Customers with high sustained levels of usage might see more variability in response latency.

The Usage Limit determines the level of usage above which customers might see larger variability in response latency. A customer’s usage is defined per model and is the total tokens consumed across all deployments in all subscriptions in all regions for a given tenant.

> [!NOTE]
> Usage tiers only apply to standard and global standard deployment types. Usage tiers do not apply to global batch deployments.

#### GPT-4o global standard & standard

|Model| Usage Tiers per month |
|----|----|
|`gpt-4o` | 8 Billion tokens |
|`gpt-4o-mini` | 45 Billion tokens |

#### GPT-4 standard

|Model| Usage Tiers per month|
|---|---|
| `gpt-4` + `gpt-4-32k`  (all versions) | 4 Billion |


## Other offer types

If your Azure subscription is linked to certain [offer types](https://azure.microsoft.com/support/legal/offer-details/) your max quota values are lower than the values indicated in the above tables.


|Tier| Quota Limit in tokens per minute (TPM) |
|---|:---|
|Azure for Students, Free Trials | 1 K (all models)|
| MSDN subscriptions | GPT 3.5 Turbo Series: 30 K <br> GPT-4 series: 8 K   |
| Monthly credit card based subscriptions <sup>1</sup> | GPT 3.5 Turbo Series: 30 K <br> GPT-4 series: 8 K  |

<sup>1</sup> This currently applies to [offer type 0003P](https://azure.microsoft.com/support/legal/offer-details/)

In the Azure portal you can view what offer type is associated with your subscription by navigating to your subscription and checking the subscriptions overview pane. Offer type corresponds to the plan field in the subscription overview.

### General best practices to remain within rate limits

To minimize issues related to rate limits, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.
- Increase the quota assigned to your deployment. Move quota from another deployment, if necessary.

### How to request increases to the default quotas and limits

Quota increase requests can be submitted from the [Quotas](./how-to/quota.md) page of Azure OpenAI Studio. Note that due to overwhelming demand, quota increase requests are being accepted and will be filled in the order they are received. Priority will be given to customers who generate traffic that consumes the existing quota allocation, and your request might be denied if this condition isn't met.

For other rate limits, [submit a service request](../cognitive-services-support-options.md?context=/azure/ai-services/openai/context/context).

## Next steps

Explore how to [manage quota](./how-to/quota.md) for your Azure OpenAI deployments.
Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
