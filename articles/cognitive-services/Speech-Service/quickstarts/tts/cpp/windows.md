---
title: 'Quickstart: Synthesize speech, C++ (Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: Learn how to synthesize speech in C++ on Windows Desktop by using the Speech SDK
services: cognitive-services
author: yinhew
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/24/2019
ms.author: yinhew
---

# Quickstart: Synthesize speech in C++ on Windows by using the Speech SDK

Quickstarts are also available for [speech recognition](quickstart-cpp-windows.md) and [speech translation](quickstart-translate-speech-cpp-windows.md).

In this article, you create a C++ console application for Windows. You use the Cognitive Services [Speech SDK](speech-sdk.md) to synthesize speech from text in real time and play the speech on your PC's speaker. The application is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2019 (any edition).

For a complete list of languages/voices available for speech synthesis, see [language support](language-support.md#text-to-speech).

## Prerequisites

You need a Speech Services subscription key to complete this Quickstart. You can get one for free. See [Try the Speech Services for free](get-started.md) for details.

## Create a Visual Studio project

[!INCLUDE [Quickstart C++ project](../../../includes/cognitive-services-speech-service-quickstart-cpp-create-proj.md)]

## Add sample code

1. Open the source file **helloworld.cpp**.

1. Replace all the code with the following snippet:

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/text-to-speech/cpp-windows/helloworld/helloworld.cpp#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Type an English phrase or sentence. The application transmits your text to the Speech Services, which sends synthesized speech to the application to play on your speaker.

   ![Console output after successful speech synthesis](media/sdk/qs-tts-cpp-windows-console-output.png)

## Next steps

Additional samples, such as how to save speech to an audio file, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C++ samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Create a Custom Voice](how-to-custom-voice-create-voice.md)
- [Record custom voice samples](record-custom-voice-samples.md)
