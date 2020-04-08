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
* [Custom speech-to-text](https://cris.ai)
* [Text-to-speech](text-to-speech.md)
* [Custom text-to-speech voices](how-to-customize-voice-font.md)
* [Speech translation](speech-translation.md) (does not include [Text translation](../translator/translator-info-overview.md))

The [Speech SDK](speech-sdk.md) is a functional replacement for the Bing Speech client libraries, but uses a different API.

## Comparison of features

The Speech service is largely similar to Bing Speech, with the following differences.

| Feature | Bing Speech | Speech service | Details |
|--|--|--|--|
| C# SDK | :heavy_check_mark: | :heavy_check_mark: | Speech service supports Windows 10, Universal Windows Platform (UWP), and .NET Standard 2.0. |
| C++ SDK | :heavy_minus_sign: | :heavy_check_mark: | Speech service supports Windows and Linux. |
| Java SDK | :heavy_check_mark: | :heavy_check_mark: | Speech service supports Android and Speech Devices. |
| Continuous speech recognition | 10 minutes | Unlimited (with SDK) | Both Bing Speech and Speech service WebSockets protocols support up to 10 minutes per call. However, the Speech SDK automatically reconnects on timeout or disconnect. |
| Partial or interim results | :heavy_check_mark: | :heavy_check_mark: | With WebSockets protocol or SDK. |
| Custom speech models | :heavy_check_mark: | :heavy_check_mark: | Bing Speech requires a separate Custom Speech subscription. |
| Custom voice fonts | :heavy_check_mark: | :heavy_check_mark: | Bing Speech requires a separate Custom Voice subscription. |
| 24-kHz voices | :heavy_minus_sign: | :heavy_check_mark: |
| Speech intent recognition | Requires separate LUIS API call | Integrated (with SDK) | You can use a LUIS key with the Speech service. |
| Simple intent recognition | :heavy_minus_sign: | :heavy_check_mark: |
| Batch transcription of long audio files | :heavy_minus_sign: | :heavy_check_mark: |
| Recognition mode | Manual via endpoint URI | Automatic | Recognition mode is not available in the Speech service. |
| Endpoint locality | Global | Regional | Regional endpoints improve latency. |
| REST APIs | :heavy_check_mark: | :heavy_check_mark: | The Speech service REST APIs are compatible with Bing Speech (different endpoint). REST APIs support text-to-speech and limited speech-to-text functionality. |
| WebSockets protocols | :heavy_check_mark: | :heavy_check_mark: | The Speech service WebSockets API is compatible with Bing Speech (different endpoint). Migrate to the Speech SDK if possible, to simplify your code. |
| Service-to-service API calls | :heavy_check_mark: | :heavy_minus_sign: | Provided in Bing Speech via the C# Service Library. |
| Open-source SDK | :heavy_check_mark: | :heavy_minus_sign: |

The Speech service uses a time-based pricing model (rather than a transaction-based model). See [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for details.

## Migration strategies

If you or your organization have applications in development or production that use a Bing Speech API, you should update them to use the Speech service as soon as possible. See the [Speech service documentation](index.yml) for available SDKs, code samples, and tutorials.

The Speech service [REST APIs](rest-apis.md) are compatible with the Bing Speech APIs. If you're currently using the Bing Speech REST APIs, you need only change the REST endpoint, and switch to a Speech service subscription key.

The Speech service WebSockets protocols are also compatible with those used by Bing Speech. We recommend that for new development, you use the Speech SDK rather than WebSockets. It's a good idea to migrate existing code to the SDK as well. However, as with the REST APIs, existing code that uses Bing Speech via WebSockets requires only a change in endpoint and an updated key.

If you're using a Bing Speech client library for a specific programming language, migrating to the [Speech SDK](speech-sdk.md) requires changes to your application, because the API is different. The Speech SDK can make your code simpler, while also giving you access to new features. The Speech SDK is available in a wide variety of programming languages. APIs on all platforms are similar, easing multi-platform development.

The Speech service doesn't offer a global endpoint. Determine if your application functions efficiently when it uses a single regional endpoint for all of its traffic. If not, use geolocation to determine the most efficient endpoint. You need a separate Speech service subscription in each region you use.

If your application uses long-lived connections and can't use an available SDK, you can use a WebSockets connection. Manage the 10-minute timeout limit by reconnecting at the appropriate times.

To get started with the Speech SDK:

1. Download the [Speech SDK](speech-sdk.md).
1. Work through the Speech service [quickstart guides](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnet) and [tutorials](how-to-recognize-intents-from-speech-csharp.md). Also look at the [code samples](samples.md) to get experience with the new APIs.
1. Update your application to use the Speech service.

## Support

Bing Speech customers should contact customer support by opening a [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). You can also contact us if your support need requires a [technical support plan](https://azure.microsoft.com/support/plans/).

For Speech service, SDK, and API support, visit the Speech service [support page](support.md).

## Next steps

* [Try out Speech service for free](get-started.md)
* [Quickstart: Recognize speech in a UWP app using the Speech SDK](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=uwp)

## See also
* [Speech service release notes](releasenotes.md)
* [What is the Speech service](overview.md)
* [Speech service and Speech SDK documentation](speech-sdk.md#get-the-speech-sdk)
