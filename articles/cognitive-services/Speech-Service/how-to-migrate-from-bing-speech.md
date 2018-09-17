---
title: How to migrate to the Speech Service
titleSuffix: "Microsoft Cognitive Services"
description: Learn the differences between Bing Speech and the Speech Service from a developer standpoint and migrate your application to use the Speech Service.
services: cognitive-services
author: wsturman

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 09/12/2018
ms.author: gracez

# Customer intent: As a developer currently using the deprecated Bing Speech, I want to learn the differences between Bing Speech and the Speech Service so that I can migrate my application to the Speech Service.
---

# How to migrate from Bing Speech to the Speech Service

The Speech service unites the Azure speech features previously available via the [Bing Speech](https://docs.microsoft.com/azure/cognitive-services/speech/home), [Translator Speech](https://docs.microsoft.com/azure/cognitive-services/translator-speech/), [Custom Speech](https://docs.microsoft.com/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-home), and [Custom Voice](http://customvoice.ai/) services. Now, one subscription provides access to all of these capabilities.

[Bing Speech](https://docs.microsoft.com/azure/cognitive-services/speech/home) and its corresponding [client libraries and APIs](https://docs.microsoft.com/azure/cognitive-services/speech/getstarted/getstartedclientlibraries), including the Bing Speech [REST APIs](https://docs.microsoft.com/azure/cognitive-services/speech/getstarted/getstartedrest), have been deprecated. Microsoft's ongoing investment in Azure speech functionality will focus on the Speech Service. 

We recommend customers switch to the Speech Service and SDK as soon as practical. You and your customers will benefit from quality improvements and new features and also from ongoing support and development.

## Differences for developers

From a developer standpoint, the main differences between Bing Speech and the Speech Service are as follows.

* The Speech Service uses a time-based pricing model (rather than a transaction-based model). See [Speech Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for details.

* The Speech Service is available in [multiple regions](regions.md) to suit the needs of customers worldwide. You need an [Azure subscription](https://docs.microsoft.com/azure/cognitive-services/welcome) for each region used by your application.

    For development purposes, you may use the service for free for a limited time, or in limited volume. See [Try the Speech service for free](get-started.md).

* A single Speech Service subscription key grants access to the following features. Each is metered separately, so you're charged only for the features you use.

    * [Speech-to-text](speech-to-text.md)
    * [Custom speech-to-text](https://cris.ai/CustomSpeech)
    * [Text-to-speech](text-to-speech.md)
    * [Custom text-to-speech voices](https://cris.ai/CustomVoice)
    * [Speech translation](speech-translation.md) (does not include [Text translation](https://docs.microsoft.com/azure/cognitive-services/translator/translator-info-overview))

* A [Language Understanding Service](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS) endpoint key can also be used with the Speech Service. See the [intent recognition tutorial](how-to-recognize-intents-from-speech-csharp.md) for details.

* The Speech Service supports 24-KHz voices for text-to-speech, improving audio quality. At this writing, there are two such voices (US English only): `Jessa24kRUS` and `Guy24kRUS`.

* The Speech Service REST APIs are compatible with those of Bing Speech. If you're currently using the Bing Speech REST APIs, you need only change the REST endpoint and switch to a Speech Service subscription key.

* The Speech Service WebSockets protocols are also compatible with those used by Bing Speech. We recommend that new development target the Speech Service SDK, rather than using WebSockets, and we encourage you to migrate existing code to the SDK as well. However, as with the REST APIs, existing code that uses Bing Speech via WebSockets requires only a change in endpoint and an updated key.

* The Speech Service provides SDKs for several popular programming languages. The APIs of these SDKs are different from those of the Bing Speech client libraries. See the following section.

## Speech SDK

If you're using a Bing Speech client library for a specific programming language, migrating to the Speech SDK will require changes to your application because the API is different. Migrating to the Speech SDK can make your code simpler, as well as giving you access to new features now and in the future, making it a good investment of your time.

To get started with the new Speech SDK:

1. Download the [Speech SDK](speech-sdk.md).
1. Work through the Speech Service [quickstart guides](quickstart-csharp-dotnet-windows.md), [tutorials](how-to-recognize-intents-from-speech-csharp.md), and look at the [code samples](samples.md) to get experience with the new APIs.
1. Update your application to use the new Speech service and APIs.

## Support

For Bing Speech, please contact customer support by opening a [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). You can also contact us if your support need requires a [Technical Support Plan](https://azure.microsoft.com/support/plans/).

For Speech Service, SDK, and API support, visit the Speech Service [support page](support.md).
