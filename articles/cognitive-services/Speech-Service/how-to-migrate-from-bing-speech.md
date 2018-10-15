---
title: Migrate from Bing Speech to the Speech Service
titleSuffix: Azure Cognitive Services
description: Learn the differences between Bing Speech and the Speech Service from a developer standpoint and migrate your application to use the Speech Service.
services: cognitive-services
author: wsturman

ms.service: cognitive-services
ms.component: Speech
ms.topic: article
ms.date: 10/01/2018
ms.author: gracez

# Customer intent: As a developer currently using the deprecated Bing Speech, I want to learn the differences between Bing Speech and the Speech Service so that I can migrate my application to the Speech Service.
---

# Migrate from Bing Speech to the Speech Service

Use this article to migrate your applications from the Bing Speech API to the Speech Service.

This article outlines the differences between the Bing Speech APIs and the Speech Service, and suggests strategies for migrating your applications. Your Bing Speech API subscription key won't be accepted by the Speech Service; you'll need a new Speech Service subscription.

A single Speech Service subscription key grants access to the following features. Each is metered separately, so you're charged only for the features you use.

* [Speech-to-text](speech-to-text.md)
* [Custom speech-to-text](https://cris.ai)
* [Text-to-speech](text-to-speech.md)
* [Custom text-to-speech voices](how-to-customize-voice-font.md)
* [Speech translation](speech-translation.md) (does not include [Text translation](../translator/translator-info-overview.md))

The [Speech SDK](speech-sdk.md) is a functional replacement for the Bing Speech client libraries, but uses a different API.

## Comparison of features

The Speech Service is largely at feature, platform, and programming language parity with Bing Speech with the following differences.

Feature | Bing Speech | Speech Service | Details
-|-|-|-
C++ SDK | :heavy_minus_sign: | :heavy_check_mark: | Speech Service supports Windows and Linux
Java SDK | :heavy_check_mark: | :heavy_check_mark: | Speech Service supports Android and Speech Devices
C# SDK | :heavy_check_mark: | :heavy_check_mark: | Speech Service supports Windows 10, UWP, and .NET Standard 2.0
Continuous speech recognition | 10 minutes | Unlimited (with SDK) | Both Bing Speech and Speech Service WebSockets protocols support up to 10 minutes per call. However, the Speech SDK automatically reconnects on timeout or disconnect.
Partial or interim results | :heavy_check_mark: | :heavy_check_mark: | With WebSockets protocol or SDK
Custom speech models | :heavy_check_mark: | :heavy_check_mark: | Bing Speech requires a separate Custom Speech subscription
Custom voice fonts | :heavy_check_mark: | :heavy_check_mark: | Bing Speech requires a separate Custom Voice subscription
24-KHz voices | :heavy_minus_sign: | :heavy_check_mark: 
Speech intent recognition | Requires separate LUIS API call | Integrated (with SDK) |  A LUIS key may be used with the Speech Service.
Simple intent recognition | :heavy_minus_sign: | :heavy_check_mark: 
Batch transcription of long audio files | :heavy_minus_sign: | :heavy_check_mark:
Recognition mode | Manual via endpoint URI | Automatic | Recognition mode is not available in Speech Service
Endpoint locality | Global | Regional | Regional endpoints improve latency. A global endpoint is under consideration for the Speech Service.
REST APIs | :heavy_check_mark: | :heavy_check_mark: | Speech Service REST API is compatible with Bing Speech (different endpoint). REST APIs support text-to-speech and limited speech-to-text functionality.
WebSockets protocols | :heavy_check_mark: | :heavy_check_mark: | Speech Service WebSockets API is compatible with Bing Speech (different endpoint). Migrate to the Speech SDK if possible to simplify your code.
Service-to-service API calls | :heavy_check_mark: | :heavy_minus_sign: | Provided in Bing Speech via the C# Service Library. 
Open source SDK | :heavy_check_mark: | :heavy_minus_sign: |

The Speech Service uses a time-based pricing model (rather than a transaction-based model). See [Speech Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for details.

## Migration strategies

If you or your organization have applications in development or production that use a Bing Speech API, you should update them to use the Speech Service as soon as possible. See the [Speech Service documentation](index.yml) for available SDKs, code samples, and tutorials.

The Speech Service [REST APIs](rest-apis.md) are compatible with the Bing Speech APIs. If you're currently using the Bing Speech REST APIs, you need only change the REST endpoint and switch to a Speech Service subscription key.

The Speech Service WebSockets protocols are also compatible with those used by Bing Speech. We recommend that new development target the Speech Service SDK, rather than using WebSockets, and we encourage you to migrate existing code to the SDK as well. However, as with the REST APIs, existing code that uses Bing Speech via WebSockets requires only a change in endpoint and an updated key.

If you're using a Bing Speech client library for a specific programming language, migrating to the [Speech SDK](speech-sdk.md) will require changes to your application because the API is different. The Speech SDK can make your code simpler while also giving you access to new features.

Currently, the Speech SDK supports C# (Windows 10, UWP, .NET Standard), Java (Android and custom devices), Objective C (iOS), C++ (Windows and Linux), and JavaScript. APIs on all platforms are similar, easing multi-platform development.

The Speech Service doesn't currently offer a global endpoint. You will need to determine if your application will function efficiently using a single regional endpoint for all of its traffic. If not, use geolocation to determine the most efficient endpoint. You will need a separate Speech Service subscription in each region you use.

If your application uses long-lived connections and can't use an available SDK, you can use a WebsSockets connection and manage the 10-minute timeout limit by reconnecting at the appropriate times.

To get started with the Speech SDK:

1. Download the [Speech SDK](speech-sdk.md).
1. Work through the Speech Service [quickstart guides](quickstart-csharp-dotnet-windows.md), [tutorials](how-to-recognize-intents-from-speech-csharp.md), and look at the [code samples](samples.md) to get experience with the new APIs.
1. Update your application to use the Speech service and APIs.

## Support

Bing Speech customers should contact customer support by opening a [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). You can also contact us if your support need requires a [Technical Support Plan](https://azure.microsoft.com/support/plans/).

For Speech Service, SDK, and API support, visit the Speech Service [support page](support.md).

## Next steps

* [Try out Speech Service for free](get-started.md)
* [Quickstart: Recognize speech in a UWP app using the Speech SDK](quickstart-csharp-uwp.md)

## See also
* [Speech Service release notes](releasenotes.md)
* [What is the Speech service](overview.md)
* [Speech Service and SDK documentation](speech-sdk.md#get-the-sdk)
