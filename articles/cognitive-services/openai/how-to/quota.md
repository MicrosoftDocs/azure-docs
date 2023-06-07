---
title: Manage Azure OpenAI Service quota
titleSuffix: Azure Cognitive Services
description: Learn how to use Azure OpenAI to control your deployments rate limits.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 06/08/2023
ms.author: mbullwin
---

# Manage Azure OpenAI Service quota

Quota gives you the ability to actively manage how capacity is divided across resources at the subscription level. Instead of being tied to the default limits you can adjust and set your own custom allocations across your model deployments. This article will walk you through the process of managing your Azure OpenAI quota.

## Assign quota

When you initially create a model deployment, you have the option of assigning a set amount of Tokens Per Minute (TPM) to that deployment. TPM can be modified in increments of 1,000, and increasing TPM will also result in an increase in Requests Per Minute (RPM). The amount of increase in RPM is dependent on the corresponding model type for your deployment.

To create a new deployment from within the Azure AI Studio under **Management** select **Deployments** > **Create new deployment**.

The option to set the TPM will appear under the **Advanced options** drop-down:

:::image type="content" source="../media/quota/deployment.png" alt-text="Screenshot of the deployment UI of Azure OpenAI Studio" lightbox="../media/quota/deployment.png":::

Post deployment you can adjust your TPM allocation by selecting **Edit deployment** under **Management** > **Deployments** in Azure AI Studio. You can also modify this selection within the new quota management experience under **Management** > **Quotas**.

## Model specific settings

Different model deployments, also called model classes have unique max TPM values that you're now able to control. **This represents the maximum amount of TPM that can be allocated to that type of model deployment in a given region.** While each model type represents its own unique model class, the max TPM value is currently only different for certain model classes:

- GPT-4
- GPT-4-32K
- GPT-35-Turbo
- Text-Davinci-003

All other model classes have a common max TPM value.

> [!IMPORTANT]
> Quotas and limits are subject to change, for the most up-date-information consult our [quotas and limits article](../quotas-limits.md).

## View quota

For an all up view of your quota allocations across deployments in a given region, select **Management** > **Quota** in Azure OpenAI Studio:

:::image type="content" source="../media/quota/quota.png" alt-text="Screenshot of the quota UI of Azure OpenAI Studio" lightbox="../media/quota/quota.png":::

- **Quota Name**: What model classes have a deployment in the currently selected region. If a deployment doesn't exist in a region for a particular model class, it will not appear in this dashboard until a model is deployed.
- **Deployment**: Model deployments divided by model class.
- **Usage/Limit**: Current TPM usage / max TPM per model class.
- **Current usage**: Percent of TPM allocated per model class.

## Migrating existing deployments

As part of the transition to the new quota system and TPM based capacity allocation, all existing Azure OpenAI model deployments will be automatically migrated to using quota. In cases where the existing TPM/RPM allocation exceeds the default values due to previous custom increase requests, equivalent max amounts of TPM/RPM capacity will be allocated.

## How throttling works

Quota provides the ability to manage **Tokens Per Minute (TPM)** which in turn corresponds to a certain amount of **Requests Per Minute (RPM)**. For completion and chat completion calls, TPM is calculated not by the sum of input and response tokens, but instead is based on the value set for the max_tokens parameter in each completion call. This is important to understand, in that a particularly high max_tokens setting could unexpectedly lead to throttling even in cases where technically that number of tokens was not generated due completion responses below the max_tokens parameter setting.

For standard deployments you should self-limit your traffic to remain below your max TPM and RPM values.The underlying rate limit algorithms are designed to assume a fairly even distribution of traffic. While the rate limits are set per minute, throttling evaluation occurs at a variable, but more frequent interval. Sudden spikes in requests that if sustained for 60 seconds would breach your rate limit can trigger preemptive 429 throttling errors prior to your RPM threshold being exhausted.  

The alternative to **Standard** quota is **Provisioned Throughput**. This new pricing model, announced at Build 2023, allows you to reserve model processing capacity on a monthly or yearly commitment tier. This is valuable to those who require guaranteed support for production workload growth, consistent throughput and latency, or benefit from predictable budgeting throughout the year. **Provisioned Throughput is a limited-access capability available to select customers today.**  Your Azure sales team can provide details on this offering and its suitability to your scenario.

### General best practices to mitigate rate-limit throttling

To minimize issues related to throttling, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.
- Create another Azure OpenAI service resource in the same or different regions.

## Next steps

- To review quota defaults for Azure OpenAI, consult to the [quotas & limits article](../quotas-limits.md)
