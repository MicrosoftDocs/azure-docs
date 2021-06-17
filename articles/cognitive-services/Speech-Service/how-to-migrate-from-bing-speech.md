---
title: Migrate from Bing Speech to Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to migrate from an existing Bing Speech subscription to the Speech service from Azure Cognitive Services.
services: cognitive-services
author: wsturman
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/03/2020
ms.author: nitinme

# Customer intent: As a developer currently using the deprecated Bing Speech, I want to learn the differences between Bing Speech and the Speech service, so that I can migrate my application to the Speech service.
---

# Migrate from Bing Speech to the Speech service

Use this article to migrate your applications from the Bing Speech API to the Speech service.

This article outlines the differences between the Bing Speech APIs and the Speech service, and suggests strategies for migrating your applications. Your Bing Speech API subscription key won't work with the Speech service; you'll need a new Speech service subscription.

A single Speech service subscription key grants access to the following features. Each is metered separately, so you're charged only for the features you use.

* [Speech-to-text](speech-to-text.md)
* [Custom speech-to-text](./custom-speech-overview.md)
* [Text-to-speech](text-to-speech.md)
* [Custom text-to-speech voices](./how-to-custom-voice-create-voice.md)
* [Speech translation](speech-translation.md) (does not include [Text translation](../translator/translator-info-overview.md))

The [Speech SDK](speech-sdk.md) is a functional replacement for the Bing Speech client libraries, but uses a different API.

## Comparison of features

The Speech service is largely similar to Bing Speech, with the following differences.

| Feature | Bing Speech | Speech service | Details |
|--|--|--|--|
| C# SDK | :heavy_check_mark: | :heavy_check_mark: | Speech service supports Windows 10, Universal Windows Platform (UWP), and .NET Standard 2.0. |
| C++ SDK | :heavy_minus_sign: | :heavy_check_mark: | Speech service supports Windows and Linux. |
| Java SDK | :heavy_check_mark: | :heavy_check_mark: | Speech service supports Android and Speech Devices. |
| Continuous speech recognition | 10 minutes | Unlimited | The Speech SDK supports unlimited continuous recognition, and automatically reconnects upon timeout or disconnect. |
| Partial or interim results | :heavy_check_mark: | :heavy_check_mark: | Supported with the Speech SDK. |
| Custom speech models | :heavy_check_mark: | :heavy_check_mark: | Bing Speech requires a separate Custom Speech subscription. |
| Custom voice fonts | :heavy_check_mark: | :heavy_check_mark: | Bing Speech requires a separate Custom Voice subscription. |
| 24-kHz voices | :heavy_minus_sign: | :heavy_check_mark: |
| Speech intent recognition | Requires separate LUIS API call | Integrated (with SDK) | You can use a LUIS key with the Speech service. |
| Simple intent recognition | :heavy_minus_sign: | :heavy_check_mark: |
| Batch transcription of long audio files | :heavy_minus_sign: | :heavy_check_mark: |
| Recognition mode | Manual via endpoint URI | Automatic | Recognition mode is not available in the Speech service. |
| Endpoint locality | Global | Regional | Regional endpoints improve latency. |
| REST APIs | :heavy_check_mark: | :heavy_check_mark: | The Speech service REST APIs are compatible with Bing Speech (different endpoint). REST APIs support text-to-speech and limited speech-to-text functionality. |
| WebSockets protocols | :heavy_check_mark: | :heavy_minus_sign: | The Speech SDK abstracts web socket connections for functionality that requires a constant connection to the service, so there is no longer support to subscribe to them manually. |
| Service-to-service API calls | :heavy_check_mark: | :heavy_minus_sign: | Provided in Bing Speech via the C# Service Library. |
| Open-source SDK | :heavy_check_mark: | :heavy_minus_sign: |

The Speech service uses a time-based pricing model (rather than a transaction-based model). See [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for details.

## Migration strategies

If you or your organization have applications in development or production that use a Bing Speech API, you should update them to use the Speech service as soon as possible. See the [Speech service documentation](index.yml) for available SDKs, code samples, and tutorials.

The Speech service [REST APIs](./overview.md#reference-docs) are compatible with the Bing Speech APIs. If you're currently using the Bing Speech REST APIs, you need only change the REST endpoint, and switch to a Speech service subscription key.

If you're using a Bing Speech client library for a specific programming language, migrating to the [Speech SDK](speech-sdk.md) requires changes to your application, because the API is different. The Speech SDK can make your code simpler, while also giving you access to new features. The Speech SDK is available in a wide variety of programming languages. APIs on all platforms are similar, easing multi-platform development.

The Speech service doesn't offer a global endpoint. Determine if your application functions efficiently when it uses a single regional endpoint for all of its traffic. If not, use geolocation to determine the most efficient endpoint. You need a separate Speech service subscription in each region you use.

To get started with the Speech SDK:

1. Download the [Speech SDK](speech-sdk.md).
1. Work through the Speech service [quickstart guides](./get-started-speech-to-text.md?pivots=programming-language-csharp&tabs=dotnet) and [tutorials](how-to-recognize-intents-from-speech-csharp.md). Also look at the [code samples](./speech-sdk.md#sample-source-code) to get experience with the new APIs.
1. Update your application to use the Speech service.

## Support

Bing Speech customers should contact customer support by opening a [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). You can also contact us if your support need requires a [technical support plan](https://azure.microsoft.com/support/plans/).

For Speech service, SDK, and API support, visit the Speech service [support page](../cognitive-services-support-options.md?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext%253fcontext%253d%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext).

## Next steps

* [Try out Speech service for free](overview.md#try-the-speech-service-for-free)
* [Get started with speech-to-text](get-started-speech-to-text.md)
* [Get started with text-to-speech](get-started-text-to-speech.md)

## See also

* [Speech service release notes](releasenotes.md)
* [What is the Speech service](overview.md)
* [Speech service and Speech SDK documentation](speech-sdk.md#get-the-speech-sdk)