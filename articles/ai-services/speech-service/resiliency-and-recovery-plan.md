---
title: How to back up and recover speech customer resources
titleSuffix: Azure AI services
description: Learn how to prepare for service outages with Custom Speech and Custom Voice.
services: cognitive-services
author: eric-urban
ms.author: eur
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 07/28/2021
ms.custom: ignite-fall-2021
---

# Back up and recover speech customer resources

The Speech service is [available in various regions](./regions.md). Speech resource keys are tied to a single region. When you acquire a key, you select a specific region, where your data, model and deployments reside.

Datasets for customer-created data assets, such as customized speech models, custom voice fonts and speaker recognition voice profiles, are also **available only within the service-deployed region**. Such assets are:

**Custom Speech**
-   Training audio/text data
-   Test audio/text data
-   Customized speech models
-   Log data

**Custom Voice**
-   Training audio/text data
-   Test audio/text data
-   Custom voice fonts

**Speaker Recognition**
- Speaker enrollment audio
- Speaker voice signature

While some customers use our default endpoints to transcribe audio or standard voices for speech synthesis, other customers create assets for customization.

These assets are backed up regularly and automatically by the repositories themselves, so **no data loss will occur** if a region becomes unavailable. However, you must take steps to ensure service continuity if there's a region outage.

## How to monitor service availability

If you use the default endpoints, you should configure your client code to monitor for errors. If errors persist, be prepared to redirect to another region where you have a Speech resource.

Follow these steps to configure your client to monitor for errors:

1.  Find the [list of regionally available endpoints in our documentation](./rest-speech-to-text.md).
2.  Select a primary and one or more secondary/backup regions from the list.
3. From Azure portal, create Speech service resources for each region.
    -  If you have set a specific quota, you may also consider setting the same quota in the backup regions. See details in [Speech service Quotas and Limits](./speech-services-quotas-and-limits.md).

4.  Each region has its own STS token service. For the primary region and any backup regions your client configuration file needs to know the:
    -  Regional Speech service endpoints
    -  [Regional key and the region code](./rest-speech-to-text.md)

5.  Configure your code to monitor for connectivity errors (typically connection timeouts and service unavailability errors). Here's sample code in C#: [GitHub: Adding Sample for showing a possible candidate for switching regions](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/fa6428a0837779cbeae172688e0286625e340942/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#L965).

    1.  Since networks experience transient errors, for single connectivity issue occurrences, the suggestion is to retry.
    2.  For persistence redirect traffic to the new STS token service and Speech service endpoint. (For Text to speech, reference sample code: [GitHub: TTS public voice switching region](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_samples.cs#L880).

The recovery from regional failures for this usage type can be instantaneous and at a low cost. All that is required is the development of this functionality on the client side. The data loss that will incur assuming no backup of the audio stream will be minimal.

## Custom endpoint recovery

Data assets, models or deployments in one region can't be made visible or accessible in any other region.

You should create Speech service resources in both a main and a secondary region by following the same steps as used for default endpoints.

### Custom Speech

Custom Speech service doesn't support automatic failover. We suggest the following steps to prepare for manual or automatic failover implemented in your client code. In these steps, you replicate custom models in a secondary region. With this preparation, your client code can switch to a secondary region when the primary region fails.

1.  Create your custom model in one main region (Primary).
2.  Run the [Models_CopyTo](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_CopyTo) operation to replicate the custom model to all prepared regions (Secondary).
3.  Go to Speech Studio to load the copied model and create a new endpoint in the secondary region. See how to deploy a new model in [Deploy a Custom Speech model](./how-to-custom-speech-deploy-model.md).
    -  If you have set a specific quota, also consider setting the same quota in the backup regions. See details in [Speech service Quotas and Limits](./speech-services-quotas-and-limits.md).
4.  Configure your client to fail over on persistent errors as with the default endpoints usage.

Your client code can monitor availability of your deployed models in your primary region, and redirect their audio traffic to the secondary region when the primary fails. If you don't require real-time failover, you can still follow these steps to prepare for a manual failover.

#### Offline failover

If you don't require real-time failover you can decide to import your data, create and deploy your models in the secondary region at a later time with the understanding that these tasks will take time to complete.

#### Failover time requirements

This section provides general guidance about timing. The times were recorded to estimate offline failover using a [representative test data set](https://github.com/microsoft/Cognitive-Custom-Speech-Service).

-   Data upload to new region: **15mins**
-   Acoustic/language model creation: **6 hours (depending on the data volume)**
-   Model evaluation: **30 mins**
-   Endpoint deployment: **10 mins**
-   Model copy API call: **10 mins**
-   Client code reconfiguration and deployment: **Depending on the client system**

It's nonetheless advisable to create keys for a primary and secondary region for production models with real-time requirements.

### Custom Voice

Custom Voice doesn't support automatic failover. Handle real-time synthesis failures with these two options.

**Option 1: Fail over to public voice in the same region.**

When custom voice real-time synthesis fails, fail over to a public voice (client sample code: [GitHub: custom voice failover to public voice](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_samples.cs#L899)).

Check the [public voices available](language-support.md?tabs=tts). You can also change the sample code above if you would like to fail over to a different voice or in a different region.

**Option 2: Fail over to custom voice on another region.**

1.  Create and deploy your custom voice in one main region (primary).
2.  Copy your custom voice model to another region (the secondary region) in [Speech Studio](https://aka.ms/speechstudio/).
3.  Go to Speech Studio and switch to the Speech resource in the secondary region. Load the copied model and create a new endpoint.
    -   Voice model deployment usually finishes **in 3 minutes**.
    -   Each endpoint is subject to extra charges. [Check the pricing for model hosting here](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

4.  Configure your client to fail over to the secondary region. See sample code in C#: [GitHub: custom voice failover to secondary region](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_samples.cs#L920).

### Speaker Recognition

Speaker Recognition uses [Azure paired regions](../../availability-zones/cross-region-replication-azure.md) to automatically fail over operations. Speaker enrollments and voice signatures are backed up regularly to prevent data loss and to be used if there's an outage.

During an outage, Speaker Recognition service will automatically fail over to a paired region and use the backed-up data to continue processing requests until the main region is back online.
