---
title: 'Quickstart: Translate speech-to-speech, C# (.NET Framework Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/28/2019
ms.author: erhopf
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=dotnet)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=dotnet)

If you've already done this, great. Let's keep going.

## Add sample code

1. Open **Program.cs**, and replace all the code in it with the following.

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnet/translate-speech-to-text/helloworld/Program.cs#code)]

1. Find the string `YourSubscriptionKey`, and replace it with your subscription key.

1. Find the string `YourServiceRegion`, and replace it with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription. For example, if you're using the free trial subscription, the region is `westus`.

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application

1. From the menu bar, choose **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or select **F5**) to start the **helloworld** application.

1. Speak an English phrase or sentence into your device's microphone. The application transmits your speech to the Speech service, which translates the speech into text in another language (in this case, German). The Speech service sends the translated text back to the application, which displays the translation in the window.

   ![Speech translation user interface](~/articles/cognitive-services/Speech-Service/media/sdk/qs-translate-csharp-dotnetcore-windows-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file, and output translated text as synthesized speech, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Train a model for Custom Speech](~/articles/cognitive-services/Speech-Service/how-to-custom-speech-train-model.md)
