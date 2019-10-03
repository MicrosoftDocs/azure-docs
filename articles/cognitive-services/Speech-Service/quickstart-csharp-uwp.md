---
title: 'Quickstart: Recognize speech, C# (UWP) - Speech Service'
titleSuffix: Azure Cognitive Services
description: In this article, you create a C# Universal Windows Platform (UWP) application by using the Cognitive Services Speech SDK. You transcribe speech to text in real time from your device's microphone. The application is built with the Speech SDK NuGet Package and Microsoft Visual Studio 2019.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 08/19/2019
ms.author: erhopf
ms.custom: seodec18
---

# Quickstart: Recognize speech in a UWP app by using the Speech SDK

Quickstarts are also available for [speech synthesis](quickstart-text-to-speech-csharp-uwp.md), [speech translation](quickstart-translate-speech-uwp.md), and [voice-first virtual assistant](quickstart-virtual-assistant-csharp-uwp.md).

If you want, choose a different programming language and/or environment:<br/>
[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you develop a C# Universal Windows Platform (UWP) application by using the Cognitive Services [Speech SDK](speech-sdk.md). The program transcribes speech to text in real time from your device's microphone. The application is built with the [Speech SDK NuGet Package](https://aka.ms/csspeech/nuget) and Microsoft Visual Studio 2019 (any edition).

> [!NOTE]
> The Universal Windows Platform lets you develop apps that run on any device that supports Windows 10, including PCs, Xbox, Surface Hub, and other devices.

## Prerequisites

This quickstart requires:

* [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/).
* An Azure subscription key for the Speech Service. [Get one for free](get-started.md).

## Create a Visual Studio project

[!INCLUDE [](../../../includes/cognitive-services-speech-service-quickstart-uwp-create-proj.md)]

## Add sample code

Now add the XAML code that defines the user interface of the application, and add the C# code-behind implementation.

1. In **Solution Explorer**, open `MainPage.xaml`.

1. In the designer's XAML view, insert the following XAML snippet into the **Grid** tag (between `<Grid>` and `</Grid>`):

   [!code-xml[UI elements](~/samples-cognitive-services-speech-sdk/quickstart/csharp-uwp/helloworld/MainPage.xaml#StackPanel)]

1. In **Solution Explorer**, open the code-behind source file `MainPage.xaml.cs`. (It's grouped under `MainPage.xaml`.)

1. Replace all the code in it with the following snippet:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp-uwp/helloworld/MainPage.xaml.cs#code)]

1. In the source file's `SpeechRecognitionFromMicrophone_ButtonClicked` handler, find the string `YourSubscriptionKey`, and replace it with your subscription key.

1. In the `SpeechRecognitionFromMicrophone_ButtonClicked` handler, find the string `YourServiceRegion`, and replace it with the [region](regions.md) associated with your subscription. (For example, use `westus` for the free trial subscription.)

1. From the menu bar, choose **File** > **Save All** to save your changes.

## Build and run the application

Now you are ready to build and test your application.

1. From the menu bar, choose **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the application. The **helloworld** window appears.

   ![Sample UWP speech recognition application in C# - quickstart](media/sdk/qs-csharp-uwp-helloworld-window.png)

1. Select **Enable Microphone**, and when the access permission request pops up, select **Yes**.

   ![Microphone access permission request](media/sdk/qs-csharp-uwp-10-access-prompt.png)

1. Select **Speech recognition with microphone input**, and speak an English phrase or sentence into your device's microphone. Your speech is transmitted to the Speech Services and transcribed to text, which appears in the window.

   ![Speech recognition user interface](media/sdk/qs-csharp-uwp-11-ui-result.png)

## Next steps

> [!div class="nextstepaction"]
> [Explore C# samples on GitHub](https://aka.ms/csspeech/samples)

## See also

- [Quickstart: Translate speech with the Speech SDK for C# (UWP)](quickstart-translate-speech-uwp.md)
- [Train a model for Custom Speech](how-to-custom-speech-train-model.md)
