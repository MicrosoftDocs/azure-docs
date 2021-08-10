---
title: How to backup and recover speech customization resources
titleSuffix: Azure Cognitive Services
description: Learn how to prepare for service outages with Custom Speech and Custom Voice. 
services: cognitive-services
author: masakiitagaki
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/28/2021
ms.author: mitagaki
---

# Backup and recover speech customization resources

The Speech service is [available in various regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions)). Since service subscription keys are tied to a single region, when customers acquire a key, they select a specific region, in which their data, model and deployments reside.

In case customers create their own data assets, such as customized speech models and custom voice fonts, the datasets are also **available only within the service-deployed region**. Such assets are:

**Custom Speech**
-   Training audio/text data
-   Test audio/text data
-   Customized speech models
-   Log data

**Custom Voice**
-   Training audio/text data
-   Test audio/text data
-   Custom voice fonts

## Business Continuity and Disaster Recovery (BCDR) Best Practices

While some customers use our default endpoints to transcribe audio or standard voices for speech synthesis, other customers create assets for customization.

As these assets are backed up regularly and automatically by the repositories themselves, **no data loss will occur** if a region becomes unavailable. However, if a region is non-operational, customers must take steps to ensure service continuity.

### How to monitor service availability

For customers that use our default endpoints, we advise to configure their clients to monitor for errors, and if they persist, be prepared to re-direct to another region of your choice where you have a service subscription.

Please follow these instructions.

1.  Use [our documentation](/azure/cognitive-services/speech-service/rest-speech-to-text) to get the list of regionally available endpoints.
2.  Select a primary and one or more secondary/backup regions from the list.
3.  From Azure portal, create Speech Service resources for each region selected
    -  If you have set a specific quota, you may also consider setting the same quota in the backup regions. See details in [Speech service Quotas and Limits](/azure/cognitive-services/speech-service/speech-services-quotas-and-limits).

4.  Note that each region has its own STS token service. For the primary region and any backup regions your client configuration file needs to know the:
    -  Regional Speech service endpoints
    -  [Regional subscription key and the region code](/azure/cognitive-services/speech-service/rest-speech-to-text)

5.  Configure your code so that you monitor for connectivity errors (typically connection timeouts and service unavailability errors). Here is a sample code (C\#) that you may leverage to achieve that: [Git Hub: Adding Sample for showing a possible candidate for switching    regions](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/fa6428a0837779cbeae172688e0286625e340942/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#L965).

    1.  Given that networks yield transient errors, for single connectivity issue occurrences, the suggestion is to retry.
    2.  For persistence redirect traffic to the new STS token service and Speech service endpoint. (For Text-to-Speech, reference sample code: [Git Hub: TTS public voice switching region](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_samples.cs#L880).)

The recovery from regional failures for this usage type can be instantaneous and at a very low cost. All that is required is the development of this functionality on the client side. The data loss that will incur assuming no back
up of the audio stream will be minimal.

### Custom endpoint recovery

For customers with data assets, models or deployments in one region will not have their data visible or accessible in any other region.

Customers are encouraged to create Speech Service resources in one main and a secondary region following the same steps as the customers using default endpoints.

#### Custom Speech

Custom Speech Service does not support automatic failover. For those customers we propose the following additional steps to replicate custom models in all prepared regions.

1.  Create your custom model in one main region (Primary).
2.  Run the [Model Copy API](https://eastus2.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) to replicate the custom model to all prepared regions (Secondary).
3.  Go to Speech Studio to load the copied model and create a new endpoint in the secondary region. See how to deploy a new model in [Train and deploy a Custom Speech model](/azure/cognitive-services/speech-service/how-to-custom-speech-train-model).
    -  If you have set a specific quota, you may also consider setting the same quota in the backup regions. See details in [Speech service Quotas and Limits](/azure/cognitive-services/speech-service/speech-services-quotas-and-limits).
4.  Configure your client to fail over on persistent errors as with the default endpoints usage.

Again, in the client code customers are advised to monitor against availability of their deployed models (primary region) and redirect their audio traffic to the secondary region should the primary fail. This approach would guarantee failover in real time, assuming that the customer has taken the time to complete the previous 4 steps.

##### Offline failover

For customers that do not require real time failover they can decide to import their data, create and deploy their models in the secondary region at a later point in time with the understanding that these tasks will take time to
complete.

##### Failover Tests

This section provides general guidance about timing. The times were recorded to estimate offline failover using a [representative test data set](https://github.com/microsoft/Cognitive-Custom-Speech-Service).

-   Data upload to new region: **15mins**
-   Acoustic/language model creation: **6 hours (depending on the data volume)**
-   Model evaluation: **30 mins**
-   Endpoint deployment: **10 mins**
-   Model copy API call: **10 mins**
-   Client code reconfiguration and deployment: **Depending on the client system**

It is nonetheless advisable to create keys for a primary and secondary region for production models with real time requirements.

#### Custom Voice

Custom Voice does not support automatic failover. Handle real-time synthesis failures with these two options.

**Option 1: Fail over to public voice in the same region.**

When custom voice real-time synthesis fails, fail over to a public voice (client sample code: [GitHub: custom voice failover to public voice](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_samples.cs#L899)).

Check the [public voices available](/azure/cognitive-services/speech-service/language-support#neural-voices). You can also change the sample code above if you would like to fail over to a different voice or in a different region.

**Option 2: Fail over to custom voice on another region.**

1.  Create and deploy your custom voice in one main region (primary).
2.  Copy your custom voice model to another region (the secondary region) in [Speech Studio](https://speech.microsoft.com).
3.  Go to Speech Studio and switch to the Speech resource in the secondary region. Load the copied model and create a new endpoint.
    -   Voice model deployment usually finishes **in 3 minutes**.
    -   Note: additional endpoint is subjective to additional charges. [Check the pricing for model hosting here](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

4.  Configure your client to fail over to the secondary region. Follow a sample code: [Git Hub: custom voice failover to secondary region](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_synthesis_samples.cs#L920).
