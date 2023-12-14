---
title: Azure OpenAI Service provisioned throughput
description: Learn about provisioned throughput and Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 11/20/2023
ms.custom: 
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# What is provisioned throughput?

The provisioned throughput capability allows you to specify the amount of throughput you require for your application. The service then provisions the necessary compute and ensures it is ready for you. Throughput is defined in terms of provisioned throughput units (PTU) which is a normalized way of representing an amount of throughput for your deployment. Each model-versions pair requires different amounts of PTU to deploy and provide different amounts of throughput per PTU.

## What does the provisioned deployment type provide?

- **Predictable performance:** stable max latency and throughput for uniform workloads.
- **Reserved processing capacity:** A deployment configures the amount of throughput. Once deployed, the throughput is available whether used or not.
- **Cost savings:** High throughput workloads may provide cost savings vs token-based consumption.

An Azure OpenAI Deployment is a unit of management for a specific OpenAI Model. A deployment provides customer access to a model for inference and integrates additional features like Content Moderation ([See content moderation documentation](content-filter.md)).

> [!NOTE]
> Provisioned throughput units (PTU) are different from standard quota in Azure OpenAI and are not available by default. To learn more about this offering contact your Microsoft Account Team.

## What do you get?

|Topic | Provisioned|
|---|---|
| What is it? | Provides guaranteed throughput at smaller increments than the existing provisioned offer. Deployments will have a consistent max latency for a given model-version |
| Who is it for? | Customers who want guaranteed throughput with minimal latency variance. |
| Quota | Provisioned-managed throughput Units |
| Latency | Max latency constrained |
| Utilization | Provisioned-managed Utilization measure provided in Azure Monitor |
| Estimating size | Provided calculator in the studio & load test script |

## Key concepts

### Provisioned throughput units

Provisioned throughput Units (PTU) are units of model processing capacity that customers you can reserve and deploy for processing prompts and generating completions. The minimum PTU deployment, increments, and processing capacity associated with each unit varies by model type & version.

### Deployment types

We introduced a new deployment type called **ProvisionedManaged** which provides smaller increments of PTU per deployment. Both types have their own quota, and you will only see the options you have been enabled for.

### Quota

Provisioned throughput quota represents a specific amount of total throughput you can deploy. Quota in the Azure OpenAI Service is managed at the subscription level meaning that it can be consumed by different resources within that subscription.

Quota is specific to a (deployment type, mode, region) triplet and isn't interchangeable. Meaning you can't use quota for GPT-4 to deploy GPT-35-turbo. Customers can raise a support request to move the quota across deployment types, models, or regions but we can't guarantee that it will be possible.

While we make every attempt to ensure that quota is always deployable, quota does not represent a guarantee that the underlying capacity is available for the customer to use. The service assigns capacity to the customer at deployment time and if capacity is unavailable the deployment will fail with an out of capacity error.
