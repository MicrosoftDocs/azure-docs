---
title: Migrate from the Translator Speech API to the Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to migrate your applications from the Translator Speech API to the Speech service.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/21/2020
ms.author: aahi
---

# Migrate from the Translator Speech API to the Speech service

Use this article to migrate your applications from the Microsoft Translator Speech API to the [Speech service](index.yml). This guide outlines the differences between the Translator Speech API and Speech service, and suggests strategies for migrating your applications.

> [!NOTE]
> Your Translator Speech API subscription key won't be accepted by the Speech service. You'll need to create a new Speech service subscription.

## Comparison of features

| Feature                                           | Translator Speech API                                  | Speech service | Details                                                                                                                                                                                                                                                                            |
|---------------------------------------------------|-----------------------------------------------------------------|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Translation to text                               | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Translation to speech                             | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Global endpoint                                   | :heavy_check_mark:                                              | :heavy_minus_sign:                 | The Speech service doesn't offer a global endpoint. A global endpoint can automatically direct traffic to the nearest regional endpoint, decreasing latency in your application.                                                    |
| Regional endpoints                                | :heavy_minus_sign:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Connection time limit                             | 90 minutes                                               | Unlimited with the SDK. 10 minutes with a WebSockets connection.                                                                                                                                                                                                                                                                                   |
| Auth key in header                                | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Multiple languages translated in a single request | :heavy_minus_sign:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| SDKs available                                    | :heavy_minus_sign:                                              | :heavy_check_mark:                 | See the [Speech service documentation](index.yml) for available SDKs.                                                                                                                                                    |
| WebSockets connections                            | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Languages API                                     | :heavy_check_mark:                                              | :heavy_minus_sign:                 | The Speech service supports the same range of languages described in the [Translator languages reference](../translator-speech/languages-reference.md) article. |
| Profanity Filter and Marker                       | :heavy_minus_sign:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| .WAV/PCM as input                                 | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Other file types as input                         | :heavy_minus_sign:                                              | :heavy_minus_sign:                 |                                                                                                                                                                                                                                                                                    |
| Partial results                                   | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Timing info                                       | :heavy_check_mark:                                              | :heavy_minus_sign:                 |                                                                                                                                                                 |
| Correlation ID                                    | :heavy_check_mark:                                              | :heavy_minus_sign:                 |                                                                                                                                                                                                                                                                                    |
| Custom speech models                              | :heavy_minus_sign:                                              | :heavy_check_mark:                 | The Speech service offers custom speech models that enable you to customize speech recognition to your organization’s unique vocabulary.                                                                                                                                           |
| Custom translation models                         | :heavy_minus_sign:                                              | :heavy_check_mark:                 | Subscribing to the Microsoft Text Translation API enables you to use [Custom Translator](https://www.microsoft.com/translator/business/customization/) to use your own data for more accurate translations.                                                 |

## Migration strategies

If you or your organization have applications in development or production that use the Translator Speech API, you should update them to use the Speech service. See the [Speech service](index.yml) documentation for available SDKs, code samples, and tutorials. Consider the following when you are migrating:

* The Speech service doesn't offer a global endpoint. Determine if your application functions efficiently when it uses a single regional endpoint for all of its traffic. If not, use geolocation to determine the most efficient endpoint.

* If your application uses long-lived connections and can't use the available SDKs, you can use a WebSockets connection. Manage the 10-minute timeout limit by reconnecting at the appropriate times.

* If your application uses the Translator service and Translator Speech API to enable custom translation models, you can add Category IDs directly by using the Speech service.

* Unlike the Translator Speech API, the Speech service can complete translations into multiple languages in a single request.

## Next steps

* [Try out Speech service for free](get-started.md)
* [Quickstart: Recognize speech in a UWP app using the Speech SDK](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=uwp)

## See also

* [What is the Speech service](overview.md)
* [Speech service and Speech SDK documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-devices-sdk-qsg)
