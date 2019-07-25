---
title: 'Quickstart: Recognize speech, C# (.NET Core) - Speech Services'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in C# under .NET Core on Windows or macOS by using the Speech SDK
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: wolfma
---

# Quickstart: Recognize speech with the Speech SDK for .NET Core

Quickstarts are also available for [text-to-speech](quickstart-text-to-speech-dotnetcore.md) and [speech-translation](quickstart-translate-speech-dotnetcore-windows.md).

If desired, choose a different programming language and/or environment:<br/>
[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a C# console application for .NET Core on Windows or macOS by using the Cognitive Services [Speech SDK](speech-sdk.md). You transcribe speech to text in real time from your PC's microphone. The application is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017 (any edition).

> [!NOTE]
> .NET Core is an open-source, cross-platform .NET platform that implements the [.NET Standard](https://docs.microsoft.com/dotnet/standard/net-standard) specification.

You need a Speech Services subscription key to complete this Quickstart. You can get one for free. See [Try the Speech Services for free](get-started.md) for details.

## Prerequisites

This quickstart requires:

* [.NET Core SDK](https://dotnet.microsoft.com/download)
* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/)
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).

## Create a Visual Studio project

[!INCLUDE [](../../../includes/cognitive-services-speech-service-quickstart-dotnetcore-create-proj.md)]

## Add sample code

1. Open `Program.cs`, and replace all the code in it with the following.

    [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-dotnetcore/helloworld/Program.cs#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Also replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

1. Build the application. From the menu bar, choose **Build** > **Build Solution**. The code should compile without errors.

    ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-csharp-dotnetcore-windows-05-build.png "Successful build")

1. Start the application. From the menu bar, choose **Debug** > **Start Debugging**, or press **F5**.

    ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-csharp-dotnetcore-windows-06-start-debugging.png "Start the app into debugging")

1. A console window appears, prompting you to say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech Services and transcribed to text, which appears in the same window.

    ![Screenshot of console output after successful recognition](media/sdk/qs-csharp-dotnetcore-windows-07-console-output.png "Console output after successful recognition")

## Next steps

Additional samples, such as how to read speech from an audio file, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
