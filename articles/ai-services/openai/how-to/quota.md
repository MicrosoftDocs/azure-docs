---
title: Manage Azure OpenAI Service quota
titleSuffix: Azure AI services
description: Learn how to use Azure OpenAI to control your deployments rate limits.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 06/07/2023
ms.author: mbullwin
---

# Manage Azure OpenAI Service quota

Quota provides the flexibility to actively manage the allocation of rate limits across the deployments within your subscription. This article walks through the process of managing your Azure OpenAI quota.

## Introduction to quota

Azure OpenAI's quota feature enables assignment of rate limits to your deployments, up-to a global limit called your “quota.”  Quota is assigned to your subscription on a per-region, per-model basis in units of **Tokens-per-Minute (TPM)**. When you onboard a subscription to Azure OpenAI, you'll receive default quota for most available models. Then, you'll assign TPM to each deployment as it is created, and the available quota for that model will be reduced by that amount. You can continue to create deployments and assign them TPM until you reach your quota limit. Once that happens, you can only create new deployments of that model by reducing the TPM assigned to other deployments of the same model (thus freeing TPM for use), or by requesting and being approved for a model quota increase in the desired region.

> [!NOTE]
> With a quota of 240,000 TPM for GPT-35-Turbo in East US, a customer can create a single deployment of 240K TPM, 2 deployments of 120K TPM each, or any number of deployments in one or multiple Azure OpenAI resources as long as their TPM adds up to less than 240K total in that region.

When a deployment is created, the assigned TPM will directly map to the tokens-per-minute rate limit enforced on its inferencing requests. A **Requests-Per-Minute (RPM)** rate limit will also be enforced whose value is set proportionally to the TPM assignment using the following ratio:

6 RPM per 1000 TPM.

The flexibility to distribute TPM globally within a subscription and region has allowed Azure OpenAI Service to loosen other restrictions:

- The maximum resources per region are increased to 30.
- The limit on creating no more than one deployment of the same model in a resource has been removed.

## Assign quota

When you create a model deployment, you have the option to assign Tokens-Per-Minute (TPM) to that deployment. TPM can be modified in increments of 1,000, and will map to the TPM and RPM rate limits enforced on your deployment, as discussed above.

To create a new deployment from within the Azure AI Studio under **Management** select **Deployments** > **Create new deployment**.

The option to set the TPM is under the **Advanced options** drop-down:

:::image type="content" source="../media/quota/deployment.png" alt-text="Screenshot of the deployment UI of Azure AI Studio" lightbox="../media/quota/deployment.png":::

Post deployment you can adjust your TPM allocation by selecting **Edit deployment** under **Management** > **Deployments** in Azure AI Studio. You can also modify this selection within the new quota management experience under **Management** > **Quotas**.

> [!IMPORTANT]
> Quotas and limits are subject to change, for the most up-date-information consult our [quotas and limits article](../quotas-limits.md).

## Model specific settings

Different model deployments, also called model classes have unique max TPM values that you're now able to control. **This represents the maximum amount of TPM that can be allocated to that type of model deployment in a given region.** While each model type represents its own unique model class, the max TPM value is currently only different for certain model classes:

- GPT-4
- GPT-4-32K
- Text-Davinci-003

All other model classes have a common max TPM value.

> [!NOTE]
> Quota Tokens-Per-Minute (TPM) allocation is not related to the max input token limit of a model. Model input token limits are defined in the [models table](../concepts/models.md) and are not impacted by changes made to TPM.  

## View and request quota

For an all up view of your quota allocations across deployments in a given region, select **Management** > **Quota** in Azure AI Studio:

:::image type="content" source="../media/quota/quota.png" alt-text="Screenshot of the quota UI of Azure AI Studio" lightbox="../media/quota/quota.png":::

- **Quota Name**: There's one quota value per region for each model type. The quota covers all versions of that model.  The quota name can be expanded in the UI to show the deployments that are using the quota.
- **Deployment**: Model deployments divided by model class.
- **Usage/Limit**: For the quota name, this shows how much quota is used by deployments and the total quota approved for this subscription and region. This amount of quota used is also represented in the bar graph.
- **Request Quota**: The icon in this field navigates to a form where requests to increase quota can be submitted.

## Migrating existing deployments

As part of the transition to the new quota system and TPM based allocation, all existing Azure OpenAI model deployments have been automatically migrated to use quota. In cases where the existing TPM/RPM allocation exceeds the default values due to previous custom rate-limit increases, equivalent TPM were assigned to the impacted deployments.

## Understanding rate limits

Assigning TPM to a deployment sets the Tokens-Per-Minute (TPM) and Requests-Per-Minute (RPM) rate limits for the deployment, as described above. TPM rate limits are based on the maximum number of tokens that are estimated to be processed by a request at the time the request is received. It isn't the same as the token count used for billing, which is computed after all processing is completed.  

As each request is received, Azure OpenAI computes an estimated max processed-token count that includes the following:

- Prompt text and count
- The max_tokens parameter setting
- The best_of parameter setting

As requests come into the deployment endpoint, the estimated max-processed-token count is added to a running token count of all requests that is reset each minute. If at any time during that minute, the TPM rate limit value is reached, then further requests will receive a 429 response code until the counter resets.

RPM rate limits are based on the number of requests received over time. The rate limit expects that requests be evenly distributed over a one-minute period. If this average flow isn't maintained, then requests may receive a 429 response even though the limit isn't met when measured over the course of a minute. To implement this behavior, Azure OpenAI Service evaluates the rate of incoming requests over a small period of time, typically 1 or 10 seconds. If the number of requests received during that time exceeds what would be expected at the set RPM limit, then new requests will receive a 429 response code until the next evaluation period. For example, if Azure OpenAI is monitoring request rate on 1-second intervals, then rate limiting will occur for a 600-RPM deployment if more than 10 requests are received during each 1-second period (600 requests per minute = 10 requests per second).

### Rate limit best practices

To minimize issues related to rate limits, it's a good idea to use the following techniques:

- Set max_tokens and best_of to the minimum values that serve the needs of your scenario. For example, don’t set a large max-tokens value if you expect your responses to be small.
- Use quota management to increase TPM on deployments with high traffic, and to reduce TPM on deployments with limited needs.
- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.

## Next steps

- To review quota defaults for Azure OpenAI, consult the [quotas & limits article](../quotas-limits.md)
