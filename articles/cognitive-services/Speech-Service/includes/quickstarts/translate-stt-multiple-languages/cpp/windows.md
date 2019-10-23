---
title: 'Quickstart: Translate speech to multiple languages, C++ (Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/24/2019
ms.author: erhopf
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=windows)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=windows)

## Add sample code

1. Open the source file **helloworld.cpp**.

1. Replace all the code with the following snippet:

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/translate-speech-to-text/helloworld/helloworld.cpp?range=2-#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

## Build and run the application

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Speak an English phrase or sentence. The application transmits your speech to the Speech Services, which translates and transcribes to text (in this case, to French and German). The Speech Services then sends the text back to the application for display.

   ![Console output after successful speech translation](~/articles/cognitive-services/Speech-Service/media/sdk/qs-translate-cpp-windows-output.png)

## Next steps

Additional samples, such as how to read speech from an audio file or turn translated text into synthesized speech, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C++ samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Train a model for Custom Speech](~/articles/cognitive-services/Speech-Service/how-to-custom-speech-train-model.md)
