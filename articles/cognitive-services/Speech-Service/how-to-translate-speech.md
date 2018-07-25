---
title: Translate speech using Speech services | Microsoft Docs
description: Learn how to use Speech Translation in the Speech service.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/16/2018
ms.author: v-jerkin
---
# Translate speech using Speech service

The [Speech SDK](speech-sdk.md) is the simplest way to use speech translation in your application. The SDK provides the full functionality of the service. The basic process for performing speech translation includes the following steps:

1. Create a speech factory and provide a Speech service subscription key and [region](regions.md) or an authorization token. You also configure the source and target translation languages at this point, as well as specifying whether you want text or speech output.

2. Get a recognizer from the factory. For translation, select a translation recognizer. (The other recognizers are for *Speech to Text*.) There are various flavors of translation recognizer based on the audio source you are using.

4. Tie up events for asynchronous operation, if desired. The recognizer calls your event handlers when it has interim and final results. Otherwise, your application receives a final translation result.

5. Start recognition and translation.

# SDK samples

For the latest set of samples, see the [Cognitive Services Speech SDK Sample GitHub repository](https://aka.ms/csspeech/samples).

# Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Recognize speech in C#](quickstart-csharp-dotnet-windows.md)
