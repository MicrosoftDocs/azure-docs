---
title: 'Quickstart: Recognize speech, .NET Framework (Windows) - Speech Service'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a speech-to-text console application using the .NET framework for Windows and the Speech SDK. When finished, you can use your computer's microphone to transcribe speech to text in real time.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/28/2019
ms.author: wolfma
---

# Quickstart: Recognize speech with the Speech SDK for .NET Framework (Windows)

Quickstarts are also available for [speech synthesis](quickstart-text-to-speech-dotnet-windows.md) and [speech translation](quickstart-translate-speech-dotnetframework-windows.md).

If you want, choose a different programming language and/or environment:<br/>
[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

Use this guide to create a speech-to-text console application using the .NET framework for Windows and the Speech SDK. When finished, you can use your computer's microphone to transcribe speech to text in real time.

For a quick demonstration (without building the Visual Studio project yourself, as described in this article), get the latest [Cognitive Services Speech SDK Samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk) from GitHub.

## Prerequisites

To complete this project, you'll need:

* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/).
* A subscription key for the Speech Service. [Get one for free](get-started.md).
* Access to your computer's microphone.

## Create a Visual Studio project

[!INCLUDE [Create project](../../../includes/cognitive-services-speech-service-create-speech-project-vs-csharp.md)]

## Add sample code

1. Open `Program.cs` and replace the automatically generated code with this sample:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnet-windows/helloworld/Program.cs#code)]

1. Find the string `YourSubscriptionKey`, and replace it with your Speech Services subscription key.

1. Find the string `YourServiceRegion`, and replace it with the [region](regions.md) associated with your subscription. For example, if you're using the free trial subscription, the region is `westus`.

1. From the menu bar, choose **File** > **Save All**.

## Build and run the app

1. From the menu bar, choose **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the **helloworld** application.

1. Speak an English phrase or sentence into your device's microphone. Your speech is transmitted to the Speech Services and transcribed to text, which appears in the window.

   ![Speech recognition user interface](media/sdk/qs-csharp-dotnet-windows-10-console-output.png)

## Next steps

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Train a model for Custom Speech](how-to-custom-speech-train-model.md)
