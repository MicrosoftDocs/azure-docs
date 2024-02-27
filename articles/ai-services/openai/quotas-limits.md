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
ms.date: 02/27/2024
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
| Max Files per resource (fine-tuning) | 30 |
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

The default quota for models varies by model and region. Default quota limits are subject to change.


| Region           | Text-Embedding-Ada-002   | text-embedding-3-small   | text-embedding-3-large   | GPT-35-Turbo   | GPT-35-Turbo-1106   | GPT-35-Turbo-16K   | GPT-35-Turbo-Instruct   | GPT-4   | GPT-4-32K   | GPT-4-Turbo   | GPT-4-Turbo-V   | Babbage-002   | Babbage-002 - finetune   | Davinci-002   | Davinci-002 - finetune   | GPT-35-Turbo - finetune   | GPT-35-Turbo-1106 - finetune   |
|:-----------------|:-------------------------|:-------------------------|:-------------------------|:---------------|:--------------------|:-------------------|:------------------------|:--------|:------------|:--------------|:----------------|:--------------|:-------------------------|:--------------|:-------------------------|:--------------------------|:-------------------------------|
| australiaeast    | 350 K                    | -                        | -                        | 300 K          | 120 K               | 300 K              | -                       | 40 K    | 80 K        | 80 K          | 30 K            | -             | -                        | -             | -                        | -                         | -                              |
| brazilsouth      | 350 K                    | -                        | -                        | -              | -                   | -                  | -                       | -       | -           | -             | -               | -             | -                        | -             | -                        | -                         | -                              |
| canadaeast       | 350 K                    | 350 K                    | 350 K                    | 300 K          | 120 K               | 300 K              | -                       | 40 K    | 80 K        | 80 K          | -               | -             | -                        | -             | -                        | -                         | -                              |
| eastus           | 240 K                    | 350 K                    | 350 K                    | 240 K          | -                   | 240 K              | 240 K                   | -       | -           | 80 K          | -               | -             | -                        | -             | -                        | -                         | -                              |
| eastus2          | 350 K                    | 350 K                    | 350 K                    | 300 K          | -                   | 300 K              | -                       | 40 K    | 80 K        | 80 K          | -               | -             | -                        | -             | -                        | -                         | -                              |
| francecentral    | 240 K                    | -                        | -                        | 240 K          | 120 K               | 240 K              | -                       | 20 K    | 60 K        | 80 K          | -               | -             | -                        | -             | -                        | -                         | -                              |
| japaneast        | 350 K                    | -                        | -                        | 300 K          | -                   | 300 K              | -                       | 40 K    | 80 K        | -             | 30 K            | -             | -                        | -             | -                        | -                         | -                              |
| northcentralus   | 350 K                    | -                        | -                        | 300 K          | -                   | 300 K              | -                       | -       | -           | 80 K          | -               | 240 K         | 250 K                    | 240 K         | 250 K                    | 250 K                     | 250 K                          |
| norwayeast       | 350 K                    | -                        | -                        | -              | -                   | -                  | -                       | -       | -           | 150 K         | -               | -             | -                        | -             | -                        | -                         | -                              |
| southafricanorth | 350 K                    | -                        | -                        | -              | -                   | -                  | -                       | -       | -           | -             | -               | -             | -                        | -             | -                        | -                         | -                              |
| southcentralus   | 240 K                    | -                        | -                        | 240 K          | -                   | -                  | -                       | -       | -           | 80 K          | -               | -             | -                        | -             | -                        | -                         | -                              |
| southindia       | 350 K                    | -                        | -                        | -              | 120 K               | -                  | -                       | -       | -           | 150 K         | -               | -             | -                        | -             | -                        | -                         | -                              |
| swedencentral    | 350 K                    | -                        | -                        | 300 K          | 120 K               | 300 K              | 240 K                   | 40 K    | 80 K        | 150 K         | 30 K            | 240 K         | 250 K                    | 240 K         | 250 K                    | 250 K                     | 250 K                          |
| switzerlandnorth | 350 K                    | -                        | -                        | 300 K          | -                   | 300 K              | -                       | 40 K    | 80 K        | -             | 30 K            | -             | -                        | -             | -                        | -                         | -                              |
| uksouth          | 350 K                    | -                        | -                        | 240 K          | 120 K               | 240 K              | -                       | 40 K    | 80 K        | 80 K          | -               | -             | -                        | -             | -                        | -                         | -                              |
| westeurope       | 240 K                    | -                        | -                        | 240 K          | -                   | -                  | -                       | -       | -           | -             | -               | -             | -                        | -             | -                        | -                         | -                              |
| westus           | 350 K                    | -                        | -                        | -              | 120 K               | -                  | -                       | -       | -           | 80 K          | 30 K            | -             | -                        | -             | -                        | -                         | -                              |

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
