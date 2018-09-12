---
title: Migrating to the Azure Cognitive Services Speech API
titleSuffix: Azure Cognitive Services
description: Use this topic to migrate your applications to the Azure Cognitive Services Speech API
services: cognitive-services
author: aahill
manager: cgronlun
ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 09/12/2018
ms.author: aahi
---

# Migrating to the Azure Cognitive Services Speech API

Starting in TBD, The Microsoft Translator Speech API will be replaced by the [Azure Cognitive Services Speech API](https://docs.microsoft.com/azure/cognitive-services/Speech-Service/). 
After the Speech API is released, you will have one year to migrate your applications to it. This guide will outline the differences between the Translator Speech API and the Unified Speech API and suggest strategies to convert to the new API. 
Note that Your Translator Speech API subscription key will not be accepted by the new Speech API. You will need a new subscription.


## Comparison of features

| Feature                                           | Cognitive Services Speech API                                   | Translator Speech API (deprecated) | Details                                                                                                                                                   |
|---------------------------------------------------|-----------------------------------------------------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| --                                                | --                                                              | --                          |                                                                                                                                                           |
| Translation to text                               | :heavy_check_mark:                                              | :heavy_check_mark:          |                                                                                                                                                           |
| Translation to speech                             | :heavy_check_mark:                                              | :heavy_check_mark:          |                                                                                                                                                           |
| Global endpoint                                   | :heavy_minus_sign:                                              | :heavy_check_mark:          | The Cognitive Services Speech API does not offer a global endpoint, which directs traffic to the nearest data center. |                                                                                                                                                        |
| Regional endpoints                                | :heavy_check_mark:                                              | :heavy_minus_sign:          |                                                                                                                                                           |
| Connection time limit                             | Unlimited with the SDK. 10 Minutes with a websocket connection* | 90 Minutes                  |                                                                                                                                                           |
| Auth key in header                                | :heavy_check_mark:                                              | :heavy_check_mark:          |                                                                                                                                                           |
| Multiple languages translated in a single request | :heavy_check_mark:                                              | :heavy_minus_sign:          |                                                                                                                                                           |
| SDKs available                                    | :heavy_check_mark:                                              | :heavy_minus_sign:          | See the [speech service documentation](https://docs.microsoft.com/azure/cognitive-services/Speech-Service/) for available SDKs.                           |
| Websocket Connection                              | :heavy_check_mark:                                              | :heavy_check_mark:          |                                                                                                                                                           |
| Languages API                                     | :heavy_minus_sign:                                              | :heavy_check_mark:          | A languages API is in development for The Cognitive Services Speech API, and will support the same languages as the Languages API for the Translator API. |
| Profanity Filter and Marker                       | :heavy_check_mark:                                              | :heavy_minus_sign:          |                                                                                                                                                           |
| .WAV/PCM as input                                 | :heavy_check_mark:                                              | :heavy_check_mark:          |                                                                                                                                                           |
| Other file types as input                         | :heavy_minus_sign:                                              | :heavy_minus_sign:          |                                                                                                                                                           |
| Partial Results                                   | :heavy_check_mark:                                              | :heavy_check_mark:          |                                                                                                                                                           |
| Timing Info                                       | :heavy_minus_sign:                                              | :heavy_check_mark:          | This feature is not currently available but will be added to the API in the future.                                                                       |
| Correlation ID                                    | :heavy_minus_sign:                                              | :heavy_check_mark:          |                                                                                                                                                           |
| Custom Speech Models | :heavy_check_mark: | :heavy_minus_sign: | The Cognitive Services Speech API offers custom speech models that enable you to customize speech recognition to your organization’s unique terminology. |
| Custom Translation Models | :heavy_check_mark: | :heavy_minus_sign: | offers a product called Custom Translator, it is currently in preview (Sept. 2018). Custom Translator requires a subscription to the Microsoft Text Translation API. Customers can create neural translation models using their own data to enable more accurate translations of content specific to a domain of knowledge.  |

## Migration strategies

If you or your organization have an application in development that uses the Translator API, you should update it to use the Azure Cognitive Services Speech API as soon as possible. 
See the [Speech API](https://docs.microsoft.com/azure/cognitive-services/Speech-Service/) documentation for available SDKs, code samples, and tutorials.

For applications in production, your organization will need to migrate it to the new Speech API. Things to consider when migrating:

* The new Speech API does not currently offer a global endpoint, but is in consideration for a future release. 
    You will need to determine if your application will function efficiently using a single regional endpoint for all traffic. If it won't, you will need to implement geo-location to determine the most efficient endpoint.

* If your application uses long-lived connections and can't use the available SDKs, you can use a websocket connection and manage the 10-minute timeout limit by reconnecting at the appropriate times.

* All Translator API subscriptions will expire one year after the public release of the Speech API.

* As a Language API is in development for the Cognitive Services Speech API, you should check the Cognitive Services [Speech API documentation](https://docs.microsoft.com/azure/cognitive-services/Speech-Service/) often to be updated on its release.

* Additional SDKs are under consideration for future release. If the SDK you want is not available, check the Cognitive Services Speech API documentation often for updates.  

* If your application uses the Translator Text API and Translator Speech API to enable custom translation models, you will be able to add ‘Category’ IDs directly using the Cognitive Services Speech API.

* The new Speech API enables multiple translations in a single request. If your applications translated into several languages, then you would have needed to make multiple requests. The new Speech API lets you translate into multiple languages in a single request.


