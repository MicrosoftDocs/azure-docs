---
title: Migrate from the Translator Speech API to the Speech Service
titleSuffix: Azure Cognitive Services
description: Use this topic to migrate your applications from the Translator Speech API to the Speech Service.
services: cognitive-services
author: aahill
manager: cgronlun
ms.service: cognitive-services
ms.component: Speech
ms.topic: article
ms.date: 10/01/2018
ms.author: aahi
---

# Migrate from the Translator Speech API to the Speech Service

Use this article to migrate your applications from the Microsoft Translator Speech API to the [Speech Service](index.yml). This guide outlines the differences between the Translator Speech API and Speech Service, and suggests strategies for migrating your applications.

> [!NOTE]
> Your Translator Speech API subscription key won't be accepted by the Speech Service. You will need to start a new Speech Service subscription.

## Comparison of features

| Feature                                           | Translator Speech API                                  | Speech Service | Details                                                                                                                                                                                                                                                                            |
|---------------------------------------------------|-----------------------------------------------------------------|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Translation to text                               | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Translation to speech                             | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Global endpoint                                   | :heavy_check_mark:                                              | :heavy_minus_sign:                 | The Speech Service does not currently offer a global endpoint. A global endpoint can automatically direct traffic to the nearest regional endpoint, decreasing latency in your application.                                                    |
| Regional endpoints                                | :heavy_minus_sign:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Connection time limit                             | 90 Minutes                                               | Unlimited with the SDK. 10 Minutes with a websocket connection                                                                                                                                                                                                                                                                                   |
| Auth key in header                                | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Multiple languages translated in a single request | :heavy_minus_sign:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| SDKs available                                    | :heavy_minus_sign:                                              | :heavy_check_mark:                 | See the [Speech Service documentation](index.yml) for available SDKs.                                                                                                                                                    |
| Websocket Connections                             | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Languages API                                     | :heavy_check_mark:                                              | :heavy_minus_sign:                 | The Speech Service supports the same range of languages described in the [Translator API languages reference](../translator-speech/languages-reference.md) article. |
| Profanity Filter and Marker                       | :heavy_minus_sign:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| .WAV/PCM as input                                 | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Other file types as input                         | :heavy_minus_sign:                                              | :heavy_minus_sign:                 |                                                                                                                                                                                                                                                                                    |
| Partial Results                                   | :heavy_check_mark:                                              | :heavy_check_mark:                 |                                                                                                                                                                                                                                                                                    |
| Timing Info                                       | :heavy_check_mark:                                              | :heavy_minus_sign:                 |                                                                                                                                                                 |
| Correlation ID                                    | :heavy_check_mark:                                              | :heavy_minus_sign:                 |                                                                                                                                                                                                                                                                                    |
| Custom Speech Models                              | :heavy_minus_sign:                                              | :heavy_check_mark:                 | The Speech Service offers custom speech models that enable you to customize speech recognition to your organization’s unique vocabulary.                                                                                                                                           |
| Custom Translation Models                         | :heavy_minus_sign:                                              | :heavy_check_mark:                 | Subscribing to the Microsoft Text Translation API enables you to use [Custom Translator](https://www.microsoft.com/translator/business/customization/) (currently in preview) to use your own data for more accurate translations.                                                 |

## Migration strategies

If you or your organization have applications in development or production that use the Translator Speech API, you should update them to use the Speech Service. See the [Speech Service](index.yml) documentation for available SDKs, code samples, and tutorials. Below are some things to consider when migrating:

* The Speech Service does not currently offer a global endpoint. You will need to determine if your application will function efficiently using a single regional endpoint for all of it's traffic. If it won't, you will need to use geolocation to determine the most efficient endpoint.

* If your application uses long-lived connections and can't use the available SDKs, you can use a websocket connection and manage the 10-minute timeout limit by reconnecting at the appropriate times.

* If your application uses the Translator Text API and Translator Speech API to enable custom translation models, you will be able to add ‘Category’ IDs directly using the Speech Service.

* The Speech Service can complete translations into multiple languages in a single request, unlike the Translator Speech API.

## Next steps

* [try out Speech Service for free](get-started.md)
* [Quickstart: Recognize speech in a UWP app using the Speech SDK](quickstart-csharp-uwp.md)

## See also

* [What is the Speech service](overview.md)
* [Speech Service and SDK documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-devices-sdk-qsg)
