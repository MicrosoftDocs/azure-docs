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
ms.date: 06/30/2022
ms.author: chrhoder
---

# Azure OpenAI service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for the Azure OpenAI service in Azure Cognitive Services.

## Quotas and limits reference

The following sections provide you with a quick guide to the quotas and limits that apply to the Azure OpenAI service

| Limit Name | Limit Value |
|--|--|
| OpenAI resources per region | 2 | 
| Requests per second per deployment | 1 |
| Max fine-tuned model deployments | 2 |
| Ability to deploy same model to multiple deployments | Not allowed |
| Total number of training jobs per resource | 100 |
| Max simultaneous running training jobs per resource | 1 |
| Max training jobs queued | 20 | 
| Max Files per resource | 50 |
| Total size of all files per resource | 1 GB| 
| Max training job time (job will fail if exceeded) | 120 hours |
| Max training job size (tokens in training file * # of epochs) | **Ada**: 4-M tokens <br> **Babbage**: 4-M tokens <br> **Curie**: 4-M tokens <br> **Cushman**: 4-M tokens <br> **Davinci**: 500 K |


### General best practices to mitigate throttling during autoscaling

To minimize issues related to throttling, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.
- Create another OpenAI service resource in the same or different regions, and distribute the workload among them.

The next sections describe specific cases of adjusting quotas.

### Request an increase to a limit on transactions-per-second or number of fine-tuned models deployed

The limit of concurrent requests defines how high the service can scale before it starts to throttle your requests.

#### Have the required information ready

- OpenAI Resource ID
- Region
- Deployment Name 
  
How to get this information:

1. Go to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. Select the Azure OpenAI resource for which you would like to increase the request limit.
1. From the **Resource Management** group, select **Properties**.
1. Copy and save the values of the following fields:
   - **Resource ID**
   - **Location** (your endpoint region)
1. From the **Resource Management** group, select **Deployments**.
   - Copy and save the name of the Deployment you're requesting a limit increase

## Create and submit a support request

Initiate the increase of the limit for concurrent requests for your resource, or if necessary check the current limit, by submitting a support request. Here's how:

1. Ensure you have the required information listed in the previous section.
1. Go to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. Select the OpenAI service resource for which you would like to increase (or to check) the concurrency request limit.
1. In the **Support + troubleshooting** group, select **New support request**. A new window will appear, with auto-populated information about your Azure subscription and Azure resource.
1. In **Summary**, describe what you want (for example, "Increase OpenAI request limit").
1. In **Problem type**, select **Quota or Subscription issues**.
1. In **Problem subtype**, select **Increasing limits or access to specific functionality**
1. Select **Next: Solutions**. Proceed further with the request creation.
1. On the **Details** tab, in the **Description** field, enter the following:
   - Include details on which limit you're requesting an increase for.
   - The Azure resource information you [collected previously](#have-the-required-information-ready).
   - Any other required information.
1. On the **Review + create** tab, select **Create**. 
1. Note the support request number in Azure portal notifications. You'll be contacted shortly about your request.

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).
