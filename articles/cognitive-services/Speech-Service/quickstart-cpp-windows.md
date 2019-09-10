---
title: 'Quickstart: Recognize speech, C++ (Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in C++ on Windows Desktop by using the Speech SDK
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/19/2019
ms.author: wolfma
---

# Quickstart: Recognize speech in C++ on Windows by using the Speech SDK

Quickstarts are also available for [speech synthesis](quickstart-text-to-speech-cpp-windows.md) and [speech translation](quickstart-translate-speech-cpp-windows.md).

If you want, choose a different programming language and environment:<br/>
[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a C++ console application for Windows. You use the Cognitive Services [Speech SDK](speech-sdk.md) to transcribe speech to text in real time from your PC's microphone. The application is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2019 (any edition).

## Prerequisites

You need a Speech Services subscription key to complete this Quickstart. You can get one for free. See [Try the Speech Services for free](get-started.md) for details.

## Create a Visual Studio project

[!INCLUDE [Quickstart C++ project](../../../includes/cognitive-services-speech-service-quickstart-cpp-create-proj.md)]

## Add sample code

1. Open the source file **helloworld.cpp**.

1. Replace all the code with the following snippet:

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp-windows/helloworld/helloworld.cpp#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Speak an English phrase or sentence. The application transmits your speech to the Speech Services, which transcribes to text and sends it back to the application for display.

   ![Console output after successful recognition](media/sdk/qs-cpp-windows-08-console-output-release.png)

## Next steps

Additional samples, such as how to read speech from an audio file, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C++ samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Train a model for Custom Speech](how-to-custom-speech-train-model.md)
