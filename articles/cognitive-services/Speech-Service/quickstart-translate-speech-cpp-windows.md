---
title: 'Quickstart: Translate speech, C++ (Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll create a C++ application to capture user speech, translate it to another language, and output the text to the command line. This guide is designed for Windows users.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/24/2019
ms.author: erhopf
---

# Quickstart: Translate speech in C++ on Windows by using the Speech SDK

Quickstarts are also available for [speech recognition](quickstart-cpp-windows.md) and [speech synthesis](quickstart-text-to-speech-cpp-windows.md).

In this quickstart, you'll create a C++ application that captures user speech from your computer's microphone, translates the speech, and transcribes the translated text to the command line in real time. This application is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2019 (any edition).

For a complete list of languages available for speech translation, see [language support](language-support.md).

## Prerequisites

You need a Speech Services subscription key to complete this Quickstart. You can get one for free. See [Try the Speech Services for free](get-started.md) for details.

## Create a Visual Studio project

[!INCLUDE [Quickstart C++ project](../../../includes/cognitive-services-speech-service-quickstart-cpp-create-proj.md)]

## Add sample code

1. Open the source file **helloworld.cpp**.

1. Replace all the code with the following snippet:

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/speech-translation/cpp-windows/helloworld/helloworld.cpp?range=2-#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Speak an English phrase or sentence. The application transmits your speech to the Speech Services, which translates and transcribes to text (in this case, to French and German). The Speech Services then sends the text back to the application for display.

   ![Console output after successful speech translation](media/sdk/qs-translate-cpp-windows-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file or turn translated text into synthesized speech, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C++ samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Train a model for Custom Speech](how-to-custom-speech-train-model.md)
