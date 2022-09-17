---
title: Speech service quotas and limits
titleSuffix: Azure Cognitive Services
description: Quick reference, detailed description, and best practices on the quotas and limits for the Speech service in Azure Cognitive Services.
services: cognitive-services
author: alexeyo26
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/22/2022
ms.author: alexeyo
---

# Speech service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for the Speech service in Azure Cognitive Services. The information applies to all [pricing tiers](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) of the service. It also contains some best practices to avoid request throttling.

## Quotas and limits reference

The following sections provide you with a quick guide to the quotas and limits that apply to Speech service.

### Speech-to-text quotas and limits per resource

In the following tables, the parameters without the **Adjustable** row aren't adjustable for all price tiers.

#### Online transcription

You can use online transcription with the [Speech SDK](speech-sdk.md) or the [speech-to-text REST API for short audio](rest-speech-to-text-short.md).

| Quota | Free (F0)<sup>1</sup> | Standard (S0) |
|--|--|--|
| Concurrent request limit - base model endpoint | 1 | 100 (default value) |
| Adjustable | No<sup>2</sup> | Yes<sup>2</sup> |
| Concurrent request limit - custom endpoint | 1 | 100 (default value) |
| Adjustable | No<sup>2</sup> | Yes<sup>2</sup> |

#### Batch transcription

| Quota | Free (F0)<sup>1</sup> | Standard (S0) |
|--|--|--|
| [Speech-to-text REST API](rest-speech-to-text.md) limit | Not available for F0 | 300 requests per minute |
| Max audio input file size | N/A | 1 GB |
| Max input blob size (for example, can contain more than one file in a zip archive). Note the file size limit from the preceding row. | N/A | 2.5 GB |
| Max blob container size | N/A | 5 GB |
| Max number of blobs per container | N/A | 10000 |
| Max number of files per transcription request (when you're using multiple content URLs as input). | N/A | 1000  |

#### Model customization

| Quota | Free (F0)<sup>1</sup> | Standard (S0) |
|--|--|--|
| REST API limit | 300 requests per minute | 300 requests per minute |
| Max number of speech datasets | 2 | 500 |
| Max acoustic dataset file size for data import | 2 GB | 2 GB |
| Max language dataset file size for data import | 200 MB | 1.5 GB |
| Max pronunciation dataset file size for data import | 1 KB | 1 MB |
| Max text size when you're using the `text` parameter in the [CreateModel](https://westcentralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateModel/) API request | 200 KB | 500 KB |

<sup>1</sup> For the free (F0) pricing tier, see also the monthly allowances at the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).<br/>
<sup>2</sup> See [additional explanations](#detailed-description-quota-adjustment-and-best-practices), [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling), and [adjustment instructions](#speech-to-text-increase-online-transcription-concurrent-request-limit).<br/>

### Text-to-speech quotas and limits per resource

In the following tables, the parameters without the **Adjustable** row aren't adjustable for all price tiers.

#### General

| Quota | Free (F0)<sup>3</sup> | Standard (S0) |
|--|--|--|
| **Max number of transactions per certain time period per Speech service resource** |  |  |
| Real-time API. Prebuilt neural voices and custom neural voices. | 20 transactions per 60 seconds | 200 transactions per second (TPS) (default value) |
| Adjustable | No<sup>4</sup> | Yes<sup>5</sup>, up to 1000 TPS |
| **HTTP-specific quotas** |  |  |
| Max audio length produced per request | 10 min | 10 min |
| Max total number of distinct `<voice>` and `<audio>` tags in SSML | 50 | 50 |
| **Websocket specific quotas** |  |  |
| Max audio length produced per turn | 10 min | 10 min |
| Max total number of distinct `<voice>` and `<audio>` tags in SSML | 50 | 50 |
| Max SSML message size per turn | 64 KB | 64 KB |

#### Long Audio API

| Quota | Free (F0)<sup>3</sup> | Standard (S0) |
|--|--|--|
| Min text length | N/A | 400 characters for plain text; 400 [billable characters](text-to-speech.md#pricing-note) for SSML |
| Max text length | N/A | 10000 paragraphs |
| Start time | N/A | 10 tasks or 10000 characters accumulated |

#### Custom Neural Voice

| Quota | Free (F0)<sup>3</sup> | Standard (S0) |
|--|--|--|
| Max number of transactions per second (TPS) per Speech service resource | Not available for F0 | See [General](#general) |
| Max number of datasets per Speech service resource | N/A | 500 |
| Max number of simultaneous dataset uploads per Speech service resource | N/A | 5 |
| Max data file size for data import per dataset | N/A | 2 GB |
| Upload of long audios or audios without script | N/A | Yes |
| Max number of simultaneous model trainings per Speech service resource | N/A | 3 |
| Max number of custom endpoints per Speech service resource | N/A | 50 |
| *Concurrent request limit for Custom Neural Voice* |  |  |
| Default value | N/A | 10 |
| Adjustable | N/A | Yes<sup>5</sup> |

#### Audio Content Creation tool

| Quota | Free (F0)| Standard (S0) |
|--|--|--|
| File size  | 3,000 characters per file | 20,000 characters per file |
| Export to audio library | 1 concurrent task | N/A |

<sup>3</sup> For the free (F0) pricing tier, see also the monthly allowances at the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).<br/>
<sup>4</sup> See [additional explanations](#detailed-description-quota-adjustment-and-best-practices) and [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling).<br/>
<sup>5</sup> See [additional explanations](#detailed-description-quota-adjustment-and-best-practices), [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling), and [adjustment instructions](#text-to-speech-increase-concurrent-request-limit).<br/>

## Detailed description, quota adjustment, and best practices

Before requesting a quota increase (where applicable), ensure that it's necessary. Speech service uses autoscaling technologies to bring the required computational resources in on-demand mode. At the same time, Speech service tries to keep your costs low by not maintaining an excessive amount of hardware capacity.

Let's look at an example. Suppose that your application receives response code 429, which indicates that there are too many requests. Your application receives this response even though your workload is within the limits defined by the [Quotas and limits reference](#quotas-and-limits-reference). The most likely explanation is that Speech service is scaling up to your demand and didn't reach the required scale yet. Therefore the service doesn't immediately have enough resources to serve the request. In most cases, this throttled state is transient.

### General best practices to mitigate throttling during autoscaling

To minimize issues related to throttling, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually. For example, let's say your application is using text-to-speech, and your current workload is 5 TPS. The next second, you increase the load to 20 TPS (that is, four times more). Speech service immediately starts scaling up to fulfill the new load, but is unable to scale as needed within one second. Some of the requests will get response code 429 (too many requests).
- Test different load increase patterns. For more information, see the [workload pattern example](#example-of-a-workload-pattern-best-practice).
- Create additional Speech service resources in *different* regions, and distribute the workload among them. (Creating multiple Speech service resources in the same region will not affect the performance, because all resources will be served by the same backend cluster).

The next sections describe specific cases of adjusting quotas.

### Speech-to-text: increase online transcription concurrent request limit

By default, the number of concurrent requests is limited to 100 per resource in the base model, and 100 per custom endpoint in the custom model. For the standard pricing tier, you can increase this amount. Before submitting the request, ensure that you're familiar with the material discussed earlier in this article, such as the best practices to mitigate throttling.

>[!NOTE]
> If you use custom models, be aware that one Speech service resource might be associated with many custom endpoints hosting many custom model deployments. Each custom endpoint has the default limit of concurrent requests (100) set by creation. If you need to adjust it, you need to make the adjustment of each custom endpoint *separately*. Note also that the value of the limit of concurrent requests for the base model of a resource has *no* effect to the custom endpoints associated with this resource.

Increasing the limit of concurrent requests doesn't directly affect your costs. Speech service uses a payment model that requires that you pay only for what you use. The limit defines how high the service can scale before it starts throttle your requests.

Concurrent request limits for base and custom models need to be adjusted separately.

You aren't able to see the existing value of the concurrent request limit parameter in the Azure portal, the command-line tools, or API requests. To verify the existing value, create an Azure support request.

>[!NOTE]
>[Speech containers](speech-container-howto.md) don't require increases of the concurrent request limit, because containers are constrained only by the CPUs of the hardware they are hosted on. Speech containers do, however, have their own capacity limitations that should be taken into account. For more information, see the [Speech containers FAQ](./speech-container-howto.md).

#### Have the required information ready

- For the base model:
  - Speech resource ID
  - Region
- For the custom model:
  - Region
  - Custom endpoint ID

How to get information for the base model:

1. Go to the [Azure portal](https://portal.azure.com/).
1. Select the Speech service resource for which you would like to increase the concurrency request limit.
1. From the **Resource Management** group, select **Properties**.
1. Copy and save the values of the following fields:
   - **Resource ID**
   - **Location** (your endpoint region)

How to get information for the custom model:

1. Go to the [Speech Studio](https://aka.ms/speechstudio/customspeech) portal.
1. Sign in if necessary, and go to **Custom Speech**.
1. Select your project, and go to **Deployment**.
1. Select the required endpoint.
1. Copy and save the values of the following fields:
   - **Service Region** (your endpoint region)
   - **Endpoint ID**

#### Create and submit a support request

Initiate the increase of the limit for concurrent requests for your resource, or if necessary check the current limit, by submitting a support request. Here's how:

1. Ensure you have the required information listed in the previous section.
1. Go to the [Azure portal](https://portal.azure.com/).
1. Select the Speech service resource for which you would like to increase (or to check) the concurrency request limit.
1. In the **Support + troubleshooting** group, select **New support request**. A new window will appear, with auto-populated information about your Azure subscription and Azure resource.
1. In **Summary**, describe what you want (for example, "Increase speech-to-text concurrency request limit").
1. In **Problem type**, select **Quota or Subscription issues**.
1. In **Problem subtype**, select either:
   - **Quota or concurrent requests increase** for an increase request.
   - **Quota or usage validation** to check the existing limit.
1. Select **Next: Solutions**. Proceed further with the request creation.
1. On the **Details** tab, in the **Description** field, enter the following:
   - A note that the request is about the speech-to-text quota.
   - Choose either the base or custom model.
   - The Azure resource information you [collected previously](#have-the-required-information-ready).
   - Any other required information.
1. On the **Review + create** tab, select **Create**.
1. Note the support request number in Azure portal notifications. You'll be contacted shortly about your request.

### Example of a workload pattern best practice

Here's a general example of a good approach to take. It's meant only as a template that you can adjust as necessary for your own use.

Suppose that a Speech service resource has the concurrent request limit set to 300. Start the workload from 20 concurrent connections, and increase the load by 20 concurrent connections every 90-120 seconds. Control the service responses, and implement the logic that falls back (reduces the load) if you get too many requests (response code 429). Then, retry the load increase in one minute, and if it still doesn't work, try again in two minutes. Use a pattern of 1-2-4-4 minutes for the intervals.

Generally, it's a very good idea to test the workload and the workload patterns before going to production.

### Text-to-speech: increase concurrent request limit

For the standard pricing tier, you can increase this amount. Before submitting the request, ensure that you're familiar with the material discussed earlier in this article, such as the best practices to mitigate throttling.

Increasing the limit of concurrent requests doesn't directly affect your costs. Speech service uses a payment model that requires that you pay only for what you use. The limit defines how high the service can scale before it starts throttle your requests.

You aren't able to see the existing value of the concurrent request limit parameter in the Azure portal, the command-line tools, or API requests. To verify the existing value, create an Azure support request.

>[!NOTE]
>[Speech containers](speech-container-howto.md) don't require increases of the concurrent request limit, because containers are constrained only by the CPUs of the hardware they are hosted on.

#### Prepare the required information

To create an increase request, you provide your deployment region and the custom endpoint ID. To get it, perform the following actions:

1. Go to the [Speech Studio](https://aka.ms/speechstudio/customvoice) portal.
1. Sign in if necessary, and go to **Custom Voice**.
1. Select your project, and go to **Deployment**.
1. Select the required endpoint.
1. Copy and save the values of the following fields:
   - **Service Region** (your endpoint region)
   - **Endpoint ID**

#### Create and submit a support request

Initiate the increase of the limit for concurrent requests for your resource, or if necessary check the current limit, by submitting a support request. Here's how:

1. Ensure you have the required information listed in the previous section.
1. Go to the [Azure portal](https://portal.azure.com/).
1. Select the Speech service resource for which you would like to increase (or to check) the concurrency request limit.
1. In the **Support + troubleshooting** group, select **New support request**. A new window will appear, with auto-populated information about your Azure subscription and Azure resource.
1. In **Summary**, describe what you want (for example, "Increase text-to-speech concurrency request limit").
1. In **Problem type**, select **Quota or Subscription issues**.
1. In **Problem subtype**, select either:
   - **Quota or concurrent requests increase** for an increase request.
   - **Quota or usage validation** to check the existing limit.
1. Select **Next: Solutions**. Proceed further with the request creation.
1. On the **Details** tab, in the **Description** field, enter the following:
   - A note that the request is about the text-to-speech quota.
   - Choose either the base or custom model.
   - The Azure resource information you [collected previously](#have-the-required-information-ready).
   - Any other required information.
1. On the **Review + create** tab, select **Create**.
1. Note the support request number in Azure portal notifications. You'll be contacted shortly about your request.
