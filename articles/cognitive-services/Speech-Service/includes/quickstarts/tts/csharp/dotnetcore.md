---
title: 'Quickstart: Synthesize speech, C# (.NET Core) - Speech service'
titleSuffix: Azure Cognitive Services
description: Learn how to synthesize speech in C# under .NET Core on Windows by using the Speech SDK
services: cognitive-services
author: yinhew
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/04/2020
ms.author: yinhew
---

> [!NOTE]
> .NET Core is an open-source, cross-platform .NET platform that implements the [.NET Standard](https://docs.microsoft.com/dotnet/standard/net-standard) specification.

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=dotnetcore&pivots=programming-language-csharp)

## Add sample code

1. Open `Program.cs`, and replace all the code in it with the following.

    [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp/dotnetcore/text-to-speech/helloworld/Program.cs#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Also replace the string `YourServiceRegion` with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

1. Build the application. From the menu bar, choose **Build** > **Build Solution**. The code should compile without errors.

    ![Screenshot of Visual Studio application, with Build Solution option highlighted](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-dotnetcore-windows-05-build.png "Successful build")

1. Start the application. From the menu bar, choose **Debug** > **Start Debugging**, or press **F5**.

    ![Screenshot of Visual Studio application, with Start Debugging option highlighted](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-dotnetcore-windows-06-start-debugging.png "Start the app into debugging")

1. A console window appears, prompting you to type some text. Type a few words or a sentence. The text that you typed is transmitted to the Speech service and synthesized to speech, which plays on your speaker.

    ![Screenshot of console output after successful synthesis](~/articles/cognitive-services/Speech-Service/media/sdk/qs-tts-csharp-dotnet-windows-console-output.png "Console output after successful synthesis")

## Next steps

[!INCLUDE [Speech synthesis basics](../../text-to-speech-next-steps.md)]

## See also

- [Create a Custom Voice](~/articles/cognitive-services/Speech-Service/how-to-custom-voice-create-voice.md)
- [Record custom voice samples](~/articles/cognitive-services/Speech-Service/record-custom-voice-samples.md)
