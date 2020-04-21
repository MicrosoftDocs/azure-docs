---
title: 'Quickstart: Synthesize speech, C# (Windows) - Speech service'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a text-to-speech console application using the .NET framework for Windows and the Speech SDK. When finished, you can synthesize speech from text, and hear the speech on your speaker in real time.
services: cognitive-services
author: yinhew
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/04/2020
ms.author: yinhew
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=dotnet&pivots=programming-language-csharp)

## Add sample code

1. Open **Program.cs** and replace the automatically generated code with this sample:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/text-to-speech/helloworld/Program.cs#code)]

1. Find the string `YourSubscriptionKey`, and replace it with your Speech service subscription key.

1. Find the string `YourServiceRegion`, and replace it with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription. For example, if you're using the free trial subscription, the region is `westus`.

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application

1. From the menu bar, choose **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or select **F5**) to start the **helloworld** application.

1. Enter an English phrase or sentence. The application transmits your text to the Speech service, which sends synthesized speech to the application to play on your speaker.

   ![Speech synthesis user interface](~/articles/cognitive-services/Speech-Service/media/sdk/qs-tts-csharp-dotnet-windows-console-output.png)

## Next steps

[!INCLUDE [Speech synthesis basics](../../text-to-speech-next-steps.md)]

## See also

- [Create a Custom Voice](~/articles/cognitive-services/Speech-Service/how-to-custom-voice-create-voice.md)
- [Record custom voice samples](~/articles/cognitive-services/Speech-Service/record-custom-voice-samples.md)
