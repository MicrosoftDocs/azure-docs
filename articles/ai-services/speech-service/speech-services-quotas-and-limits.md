---
title: Speech service quotas and limits
titleSuffix: Azure AI services
description: Quick reference, detailed description, and best practices on the quotas and limits for the Speech service in Azure AI services.
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 02/17/2023
ms.author: alexeyo
---

# Speech service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for the Speech service in Azure AI services. The information applies to all [pricing tiers](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) of the service. It also contains some best practices to avoid request throttling.

For the free (F0) pricing tier, see also the monthly allowances at the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Quotas and limits reference

The following sections provide you with a quick guide to the quotas and limits that apply to the Speech service.

For information about adjustable quotas for Standard (S0) Speech resources, see [additional explanations](#detailed-description-quota-adjustment-and-best-practices), [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling), and [adjustment instructions](#speech-to-text-increase-real-time-speech-to-text-concurrent-request-limit). The quotas and limits for Free (F0) Speech resources aren't adjustable. 

> [!IMPORTANT]
> If you switch a Speech resource from Free (F0) to Standard (S0) pricing tier, the change of the corresponding quotas may take up to several hours.

### Speech to text quotas and limits per resource

This section describes speech to text quotas and limits per Speech resource. Unless otherwise specified, the limits aren't adjustable.

#### Real-time speech to text and speech translation

You can use real-time speech to text with the [Speech SDK](speech-sdk.md) or the [Speech to text REST API for short audio](rest-speech-to-text-short.md).

> [!IMPORTANT]
> These limits apply to concurrent real-time speech to text requests and speech translation requests combined. For example, if you have 60 concurrent speech to text requests and 40 concurrent speech translation requests, you'll reach the limit of 100 concurrent requests.

| Quota | Free (F0) | Standard (S0) |
|--|--|--|
| Concurrent request limit - base model endpoint | 1 <br/><br/>This limit isn't adjustable. | 100 (default value)<br/><br/>The rate is adjustable for Standard (S0) resources. See [additional explanations](#detailed-description-quota-adjustment-and-best-practices), [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling), and [adjustment instructions](#speech-to-text-increase-real-time-speech-to-text-concurrent-request-limit). |
| Concurrent request limit - custom endpoint | 1 <br/><br/>This limit isn't adjustable. | 100 (default value)<br/><br/>The rate is adjustable for Standard (S0) resources. See [additional explanations](#detailed-description-quota-adjustment-and-best-practices), [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling), and [adjustment instructions](#speech-to-text-increase-real-time-speech-to-text-concurrent-request-limit). |
| Max audio length for [real-time diarization](./get-started-stt-diarization.md). | N/A | 240 minutes per file  |

#### Batch transcription

| Quota | Free (F0) | Standard (S0) |
|--|--|--|
| [Speech to text REST API](rest-speech-to-text.md) limit | Not available for F0 | 300 requests per minute |
| Max audio input file size | N/A | 1 GB |
| Max number of blobs per container | N/A | 10000 |
| Max number of files per transcription request (when you're using multiple content URLs as input). | N/A | 1000  |
| Max audio length for transcriptions with diarization enabled. | N/A | 240 minutes per file  |

#### Model customization

The limits in this table apply per Speech resource when you create a Custom Speech model. 

| Quota | Free (F0) | Standard (S0) |
|--|--|--|
| REST API limit | 300 requests per minute | 300 requests per minute |
| Max number of speech datasets | 2 | 500 |
| Max acoustic dataset file size for data import | 2 GB | 2 GB |
| Max language dataset file size for data import | 200 MB | 1.5 GB |
| Max pronunciation dataset file size for data import | 1 KB | 1 MB |
| Max text size when you're using the `text` parameter in the [Models_Create](https://westcentralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create/) API request | 200 KB | 500 KB |

### Text to speech quotas and limits per resource

This section describes text to speech quotas and limits per Speech resource. 

#### Real-time text to speech

You can use real-time text to speech with the [Speech SDK](speech-sdk.md) or the [Text to speech REST API](rest-text-to-speech.md). Unless otherwise specified, the limits aren't adjustable.

| Quota | Free (F0) | Standard (S0) |
|--|--|--|
| Maximum number of transactions per time period for prebuilt neural voices and custom neural voices. | 20 transactions per 60 seconds<br/><br/>This limit isn't adjustable. | 200 transactions per second (TPS) (default value)<br/><br/>The rate is adjustable up to 1000 TPS for Standard (S0) resources. See [additional explanations](#detailed-description-quota-adjustment-and-best-practices), [best practices](#general-best-practices-to-mitigate-throttling-during-autoscaling), and [adjustment instructions](#text-to-speech-increase-concurrent-request-limit). |
| Max audio length produced per request | 10 min | 10 min |
| Max total number of distinct `<voice>` and `<audio>` tags in SSML | 50 | 50 |
| Max SSML message size per turn for websocket | 64 KB | 64 KB |

#### Batch synthesis

These limits aren't adjustable. For more information on batch synthesis latency, refer to [the batch synthesis latency and best practices](batch-synthesis.md#batch-synthesis-latency-and-best-practices).

| Quota | Free (F0) | Standard (S0) |
|--|--|--|
|REST API limit | Not available for F0 | 50 requests per 5 seconds |
| Max JSON payload size to create a synthesis job  | N/A | 500 kilobytes |
| Concurrent active synthesis jobs | N/A | 200 |
| Max number of text inputs per synthesis job | N/A | 1000 |
|Max time to live for a synthesis job since it being in the final state  | N/A | Up to 31 days (specified using properties) |

#### Custom neural voice - professional

The limits in this table apply per Speech resource when you create a professional custom neural voice model.

| Quota | Free (F0)| Standard (S0) |
|--|--|--|
| Max number of transactions per second (TPS) | Not available for F0 | 200 transactions per second (TPS) (default value) |
| Max number of datasets | N/A | 500 |
| Max number of simultaneous dataset uploads | N/A | 5 |
| Max data file size for data import per dataset | N/A | 2 GB |
| Upload of long audios or audios without script | N/A | Yes |
| Max number of simultaneous model trainings | N/A | 4 |
| Max number of custom endpoints | N/A | 50 |

#### Custom neural voice - personal voice

The limits in this table apply per Speech resource when you create a personal voice.

| Quota | Free (F0)| Standard (S0) |
|--|--|--|
| REST API limit (not including speech synthesis) | Not available for F0 | 50 requests per 10 seconds |
| Max number of transactions per second (TPS) for speech synthesis|Not available for F0  |200 transactions per second (TPS) (default value)  |

#### Real-time text to speech avatar

| Quota | Free (F0)| Standard (S0) |
|--|--|--|
| New connections per minute | Not available for F0 | 2 new connections per minute |

#### Audio Content Creation tool

| Quota | Free (F0)| Standard (S0) |
|--|--|--|
| File size (plain text in SSML)<sup>1</sup>  | 3,000 characters per file | 20,000 characters per file |
| File size (lexicon file)<sup>2</sup> | 30KB per file | 100KB per file|
| Billable characters in SSML| 15,000 characters per file | 100,000 characters per file |
| Export to audio library | 1 concurrent task | N/A |

<sup>1</sup> The limit only applies to plain text in SSML and doesn't include tags.

<sup>2</sup> The characters of lexicon file aren't charged. Only the lexicon elements in SSML are counted as billable characters. Refer to [billable characters](text-to-speech.md#billable-characters) to learn more.

### Speaker recognition quotas and limits per resource

Speaker recognition is limited to 20 transactions per second (TPS).

## Detailed description, quota adjustment, and best practices

Some of the Speech service quotas are adjustable. This section provides additional explanations, best practices, and adjustment instructions. 

The following quotas are adjustable for Standard (S0) resources. The Free (F0) request limits aren't adjustable.

- Speech to text [concurrent request limit](#real-time-speech-to-text-and-speech-translation) for base model endpoint and custom endpoint
- Text to speech [maximum number of transactions per time period](#text-to-speech-quotas-and-limits-per-resource) for prebuilt neural voices and custom neural voices
- Speech translation [concurrent request limit](#real-time-speech-to-text-and-speech-translation)

Before requesting a quota increase (where applicable), ensure that it's necessary. Speech service uses autoscaling technologies to bring the required computational resources in on-demand mode. At the same time, Speech service tries to keep your costs low by not maintaining an excessive amount of hardware capacity.

Let's look at an example. Suppose that your application receives response code 429, which indicates that there are too many requests. Your application receives this response even though your workload is within the limits defined by the [Quotas and limits reference](#quotas-and-limits-reference). The most likely explanation is that Speech service is scaling up to your demand and didn't reach the required scale yet. Therefore the service doesn't immediately have enough resources to serve the request. In most cases, this throttled state is transient.

### General best practices to mitigate throttling during autoscaling

To minimize issues related to throttling, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually. For example, let's say your application is using text to speech, and your current workload is 5 TPS. The next second, you increase the load to 20 TPS (that is, four times more). Speech service immediately starts scaling up to fulfill the new load, but is unable to scale as needed within one second. Some of the requests will get response code 429 (too many requests).
- Test different load increase patterns. For more information, see the [workload pattern example](#example-of-a-workload-pattern-best-practice).
- Create additional Speech service resources in *different* regions, and distribute the workload among them. (Creating multiple Speech service resources in the same region will not affect the performance, because all resources will be served by the same backend cluster).

The next sections describe specific cases of adjusting quotas.

### Speech to text: increase real-time speech to text concurrent request limit

By default, the number of concurrent real-time speech to text and speech translation [requests combined](#real-time-speech-to-text-and-speech-translation) is limited to 100 per resource in the base model, and 100 per custom endpoint in the custom model. For the standard pricing tier, you can increase this amount. Before submitting the request, ensure that you're familiar with the material discussed earlier in this article, such as the best practices to mitigate throttling.

>[!NOTE]
> Concurrent request limits for base and custom models need to be adjusted separately. You can have a Speech service resource that's associated with many custom endpoints hosting many custom model deployments. As needed, the limit adjustments per custom endpoint must be requested separately. 

Increasing the limit of concurrent requests doesn't directly affect your costs. The Speech service uses a payment model that requires that you pay only for what you use. The limit defines how high the service can scale before it starts throttle your requests.

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
1. In **Summary**, describe what you want (for example, "Increase speech to text concurrency request limit").
1. In **Problem type**, select **Quota or Subscription issues**.
1. In **Problem subtype**, select either:
   - **Quota or concurrent requests increase** for an increase request.
   - **Quota or usage validation** to check the existing limit.
1. Select **Next: Solutions**. Proceed further with the request creation.
1. On the **Details** tab, in the **Description** field, enter the following:
   - A note that the request is about the speech to text quota.
   - Choose either the base or custom model.
   - The Azure resource information you [collected previously](#have-the-required-information-ready).
   - Any other required information.
1. On the **Review + create** tab, select **Create**.
1. Note the support request number in Azure portal notifications. You'll be contacted shortly about your request.

### Example of a workload pattern best practice

Here's a general example of a good approach to take. It's meant only as a template that you can adjust as necessary for your own use.

Suppose that a Speech service resource has the concurrent request limit set to 300. Start the workload from 20 concurrent connections, and increase the load by 20 concurrent connections every 90-120 seconds. Control the service responses, and implement the logic that falls back (reduces the load) if you get too many requests (response code 429). Then, retry the load increase in one minute, and if it still doesn't work, try again in two minutes. Use a pattern of 1-2-4-4 minutes for the intervals.

Generally, it's a very good idea to test the workload and the workload patterns before going to production.

### Text to speech: increase concurrent request limit

For the standard pricing tier, you can increase this amount. Before submitting the request, ensure that you're familiar with the material discussed earlier in this article, such as the best practices to mitigate throttling.

Increasing the limit of concurrent requests doesn't directly affect your costs. Speech service uses a payment model that requires that you pay only for what you use. The limit defines how high the service can scale before it starts throttle your requests.

You aren't able to see the existing value of the concurrent request limit parameter in the Azure portal, the command-line tools, or API requests. To verify the existing value, create an Azure support request.

>[!NOTE]
>[Speech containers](speech-container-howto.md) don't require increases of the concurrent request limit, because containers are constrained only by the CPUs of the hardware they are hosted on.
 
#### Prepare the required information

To create an increase request, you need to provide your information. 

- For the prebuilt voice:
  - Speech resource ID
  - Region
- For the custom voice:
  - Deployment region
  - Custom endpoint ID

How to get information for the prebuilt voice:

1. Go to the [Azure portal](https://portal.azure.com/).
1. Select the Speech service resource for which you would like to increase the concurrency request limit.
1. From the **Resource Management** group, select **Properties**.
1. Copy and save the values of the following fields:
   - **Resource ID**
   - **Location** (your endpoint region)

How to get information for the custom voice:

1. Go to the [Speech Studio](https://aka.ms/speechstudio/customvoice) portal.
1. Sign in if necessary, and go to **Custom voice**.
1. Select your project, and go to **Deploy model**.
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
1. In **Summary**, describe what you want (for example, "Increase text to speech concurrency request limit").
1. In **Problem type**, select **Quota or Subscription issues**.
1. In **Problem subtype**, select either:
   - **Quota or concurrent requests increase** for an increase request.
   - **Quota or usage validation** to check the existing limit.
1. On the **Recommended solution** tab, select **Next**. 
1. On the **Additional details** tab, fill in all the required items. And in the **Details** field, enter the following:
   - A note that the request is about the text to speech quota.
   - Choose either the prebuilt voice or custom voice.
   - The Azure resource information you [collected previously](#prepare-the-required-information).
   - Any other required information.
1. On the **Review + create** tab, select **Create**.
1. Note the support request number in Azure portal notifications. You'll be contacted shortly about your request.
