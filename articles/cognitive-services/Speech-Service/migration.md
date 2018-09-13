---
title: How to migrate from Bing Speech to the Speech Service
titleSuffix: "Microsoft Cognitive Services"
description: Learn the differences between Bing Speech and the Speech Service from a developer standpoint and migrate your application to use the Speech Service.
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 09/12/2018
ms.author: nitinme

# Customer intent: As a developer currently using the deprecated Bing Speech, I want to learn the differences between Bing Speech and the Speech Service so that I can migrate my application to the Speech Service.
---

# How to migrate from Bing Speech to the Speech Service

The Speech service unites the Azure speech features previously available via the [Bing Speech API](https://docs.microsoft.com/azure/cognitive-services/speech/home), [Translator Speech](https://docs.microsoft.com/azure/cognitive-services/translator-speech/), [Custom Speech](https://docs.microsoft.com/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-home), and [Custom Voice](http://customvoice.ai/) services. Now, one subscription provides access to all of these capabilities.

Bing Speech and its corresponding client libraries and APIs, including the REST APIs, have been deprecated. Future investment in Azure speech functionality will focus on the Speech Service. 

We recommend Bing Speech customers switch to the Speech Service and SDK as soon as possible to benefit from quality improvements and new features, as well as ongoing support and development.

## Differences for developers

From a developer standpoint, the main differences between Bing Speech and the Speech Service are as follows.

* The Speech Service usess a time-based (rather than transaction-based) pricing model. Please see Speech Service Pricing for details.

* The Speech Service is available in multiple regions to suit the needs of customers worldwide.  You will need an Azure subscription key for each region used by your application. 

    For development purposes, you may use the service for free for a limited time, or in limited volume. See [Try the Speech service for free](get-started.md).

* A single Speech Service subscription key grants access to the following features. Each is metered separately, so you are charged only for the amount of service actually used.

    * Speech-to-text
    * Custom speech-to-text 
    * Text-to-speech
    * Custom text-to-speech voices
    * Speech translation

    A Language Understanding Service (LUIS) endpoint key also grants access to all the Speech services.

> [!NOTE]
> Text-to-text translation is not part of the Speech Service and requires its own subscription.

* The Speech Service supports 24-KHz voices for text-to-speech, improving audio quality. At this writing, there are two such voices (US English only): Jessa24kRUS and Guy24kRUS.

* The Speech Service REST APIs are compatible with those of Bing Speech. If you are currently using the Bing Speech REST APIs, you need only change the REST endpoint and obtain a Speech Service subscription key.

* The Speech Service WebSockets protocol is also compatible with that of Bing Speech. We recommend that new development target the Speech Service SDK, rather than using WebSockets. However, as with the REST APIs, existing code that uses Bing Speech via WebSockets requires only a change in endpoint and an updated key.

* The Speech Service provides SDKs for C#, C++, Java, JavaScript, and Swift. The APIs of these SDKs are different from those of the Bing Speech client libraries. 

## Speech SDK

If you are using a Bing Speech client API, migrating to the Speech Service will require changes to your application. In many cases, migrating to a Speech Services SDK can make your code simpler, as well as providing access to new features now and in the future, making it a good investment of your time.

To get started with the new Speech SDK:

1. Download the Speech SDK.
1. Work through the Speech Service quickstart guides, tutorials, and look at the code samples to get comfortable with the new APIs.
1. Update your application to use the new Speech service and APIs.

## Support

For Bing Speech, please contact customer support by opening a support ticket. You could also contact us if your support need requires a Technical Support Plan.

For the new unified Speech services and APIs support, please visit our support page. 
