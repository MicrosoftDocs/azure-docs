---
title: 'Quickstart: Translate speech, C# (.NET Framework Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll create a .NET Framework application to capture user speech, translate it to another language, and output the text to the command line. This guide is designed for Windows users.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/28/2019
ms.author: erhopf
---

Quickstarts are also available for [speech recognition](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp) and [speech synthesis](~/articles/cognitive-services/Speech-Service/quickstarts/text-to-speech.md?pivots=programming-language-csharp).

In this quickstart, you'll create a .NET Framework application that captures user speech from your computer's microphone, translates the speech, and transcribes the translated text to the command line in real time. This application can run on 32-bit or 64-bit Windows, and it's built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2019.

For a complete list of languages available for speech translation, see [language support](~/articles/cognitive-services/Speech-Service/language-support.md).

## Prerequisites

Before you get started, make sure to:

1. [Create a Speech resource and get a subscription key]().
2. [Setup your development environment](~/articles/cognitive-services/Speech-Service/quickstarts/setup-platform.md). Use this quickstart to install and configure Visual Studio 2019.
3. [Create an empty sample project](~/articles/cognitive-services/Speech-Service/quickstarts/create-project.md)

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
