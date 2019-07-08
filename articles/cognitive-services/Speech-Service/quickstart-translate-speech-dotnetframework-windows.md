---
title: 'Quickstart: Translate speech, C# (.NET Framework Windows) - Speech Services'
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll create a simple .NET Framework application to capture user speech, translate it to another language, and output the text to the command line. This guide is designed for Windows users.
services: cognitive-services
author: wolfma61
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: erhopf
---

# Quickstart: Translate speech with the Speech SDK for .NET Framework

Quickstarts are also available for [speech-to-text](quickstart-csharp-dotnet-windows.md) and [text-to-speech](quickstart-text-to-speech-dotnet-windows.md).

In this quickstart, you'll create a simple .NET Framework application that captures user speech from your computer's microphone, translates the speech, and transcribes the translated text to the command line in real time. This application is designed to run on 64-bit Windows, and is built with the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2017.

For a complete list of languages available for speech translation, see [language support](language-support.md).

## Prerequisites

This quickstart requires:

* [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/)
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).

## Create a Visual Studio project

[!INCLUDE [Create project](../../../includes/cognitive-services-speech-service-create-speech-project-vs-csharp.md)]

## Add sample code

1. Open `Program.cs`, and replace all the code in it with the following.

    [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/speech-translation/csharp-dotnet-windows/helloworld/Program.cs#code)]

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Also replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

1. Build the application. From the menu bar, choose **Build** > **Build Solution**. The code should compile without errors.

    ![Screenshot of Visual Studio application, with Build Solution option highlighted](media/sdk/qs-csharp-dotnetcore-windows-05-build.png "Successful build")

1. Start the application. From the menu bar, choose **Debug** > **Start Debugging**, or press **F5**.

    ![Screenshot of Visual Studio application, with Start Debugging option highlighted](media/sdk/qs-csharp-dotnetcore-windows-06-start-debugging.png "Start the app into debugging")

1. A console window appears, prompting you to say something. Speak an English phrase or sentence. Your speech is transmitted to the Speech service, translated, and transcribed to text, which appears in the same window.

    ![Screenshot of console output after successful translation](media/sdk/qs-translate-csharp-dotnetcore-windows-output.png "Console output after successful translation")

## Next steps

Additional samples, such as how to read speech from an audio file, and output translated text as synthesized speech, are available on GitHub.

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
