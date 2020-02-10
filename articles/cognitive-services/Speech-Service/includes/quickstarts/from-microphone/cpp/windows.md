---
title: 'Quickstart: Recognize speech from a microphone, C++ (Windows) - Speech service'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in C++ on Windows Desktop by using the Speech SDK
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 12/17/2019
ms.author: wolfma
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=windows)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=windows)
> * Make sure that you have access to a microphone for audio capture

## Add sample code

1. Open the source file **helloworld.cpp**.

1. Replace all the code with the following snippet:

   [!code-cpp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/cpp/windows/from-microphone/helloworld/helloworld.cpp#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. From the menu bar, choose **File** > **Save All**.

> [!NOTE]
> The Speech SDK will default to recognizing using en-us for the language, see [Specify source language for speech to text](../../../../how-to-specify-source-language.md) for information on choosing the source language.

## Build and run the application

1. From the menu bar, select **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Speak an English phrase or sentence. The application transmits your speech to the Speech service, which transcribes to text and sends it back to the application for display.

   ![Console output after successful recognition](~/articles/cognitive-services/Speech-Service/media/sdk/qs-cpp-windows-08-console-output-release.png)

## Next steps

[!INCLUDE [footer](./footer.md)]