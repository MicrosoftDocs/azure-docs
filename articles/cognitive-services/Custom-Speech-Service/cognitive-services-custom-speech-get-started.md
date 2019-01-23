---
title: Get started with the Custom Speech Service on Azure | Microsoft Docs
description: Subscribe to the Custom Speech service and link the service activities to an Azure subscription to train a model and do a deployment.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

# Get Started with Custom Speech Service

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-custom-speech-deprecation-note.md)]

Explore the main features of the Custom Speech Service and learn how to build, deploy and use acoustic and language models for your application needs. More extensive documentation and step-by-step instructions can be found after you sign up on the Custom Speech Services portal.

## Samples  
There is a nice sample that we provide to get you going which you can find [here](https://github.com/Microsoft/Cognitive-Custom-Speech-Service).

## Prerequisites  

### Subscribe to Custom Speech Service and get a subscription key
Before playing with the above the example, you must subscribe to Custom Speech Service and get a subscription key, see [Subscriptions](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/CustomSpeech) or follow the explanations [here](CustomSpeech-How-to-Topics/cognitive-services-custom-speech-subscribe.md). Both the primary and secondary key can be used in this tutorial. Make sure to follow best practices for keeping your API key secret and secure.

### Get the client library and example
You may download a client library and example via [SDK](https://www.microsoft.com/cognitive-services/en-us/SDK-Sample?api=bing%20speech&category=sdk). The downloaded zip file needs to be extracted to a folder of your choice, many users choose the Visual Studio 2015 folder.

## Creating a custom acoustic model
To customize the acoustic model to a particular domain, a collection of speech data is required. This collection consists of a set of audio files of speech data, and a text file of transcriptions of each audio file. The audio data should be representative of the scenario in which you would like to use the recognizer

For example:
If you would like to better recognize speech in a noisy factory environment, the audio files should consist of people speaking in a noisy factory.
If you are interested in optimizing performance for a single speaker, e.g. you would like to transcribe all of FDR’s Fireside Chats, then the audio files should consist of many examples of that speaker only.

You can find a detailed description on how to create a custom acoustic model [here](CustomSpeech-How-to-Topics/cognitive-services-custom-speech-create-acoustic-model.md).

## Creating a custom language model
The procedure for creating a custom language model is similar to creating an acoustic model except there is no audio data, only text. The text should consist of many examples of queries or utterances you expect users to say or have logged users saying (or typing) in your application.

You can find a detailed description on how to create a custom language model [here](CustomSpeech-How-to-Topics/cognitive-services-custom-speech-create-language-model.md).

## Creating a custom speech-to-text endpoint
When you have created custom acoustic models and/or language models, they can be deployed in a custom speech-to-text endpoint. To create a new custom endpoint, click “Deployments” from the “CRIS” menu on the top of the page. This takes you to a table called “Deployments” of current custom endpoints. If you have not yet created any endpoints, the table will be empty. The current locale is reflected in the table title. If you would like to create a deployment for a different language, click on “Change Locale”. Additional information on supported languages can be found in the section on Changing Locale.

You can find a detailed description on how to create a custom speech-text endpoint [here](CustomSpeech-How-to-Topics/cognitive-services-custom-speech-create-endpoint.md).

## Using a custom speech endpoint
Requests can be sent to a CRIS speech-to-text endpoint in a very similar manner as the default Microsoft Cognitive Services speech endpoint. Note that these endpoints are functionally identical to the default endpoints of the Speech API. Thus, the same functionality available via the client library or REST API for the Speech API is also the available for your custom endpoint.

You can find a detailed description on how to use a custom speech-to-text endpoint [here](CustomSpeech-How-to-Topics/cognitive-services-custom-speech-use-endpoint.md).


Please note that the endpoints created via CRIS can process different numbers of concurrent requests depending on the tier the subscription is associated to. If more recognitions than that are requested, they will return the error code 429 (Too many requests). For more information please visit the [pricing information](https://www.microsoft.com/cognitive-services/en-us/pricing). In addition, there is a monthly quota of requests for the free tier. In cases you access your endpoint in the free tier above your monthly quota the service returns the error code 403 Forbidden.

The service assumes audio is transmitted in real-time. If it is sent faster, the request will be considered running until its duration in real-time has passed.

* [Overview](cognitive-services-custom-speech-home.md)
* [FAQ](cognitive-services-custom-speech-faq.md)
* [Glossary](cognitive-services-custom-speech-glossary.md)
