---
title: 'Quickstart: Synthesize speech, C# (UWP) - Speech service'
titleSuffix: Azure Cognitive Services
description: In this article, you create a C# Universal Windows Platform (UWP) application by using the Cognitive Services Speech SDK. You synthesize speech from text in real time to your device's speaker. The application is built with the Speech SDK NuGet Package and Microsoft Visual Studio 2019.
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
> The Universal Windows Platform lets you develop apps that run on any device that supports Windows 10, including PCs, Xbox, Surface Hub, and other devices.

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=uwp&pivots=programming-language-csharp)

## Add sample code

Now add the XAML code that defines the user interface of the application, and add the C# code-behind implementation.

1. In **Solution Explorer**, open `MainPage.xaml`.

1. In the designer's XAML view, insert the following XAML snippet into the **Grid** tag (between `<Grid>` and `</Grid>`):

   [!code-xml[UI elements](~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/text-to-speech/helloworld/MainPage.xaml#StackPanel)]

1. In **Solution Explorer**, open the code-behind source file `MainPage.xaml.cs`. (It's grouped under `MainPage.xaml`.)

1. Replace all the code in it with the following snippet:

   [!code-csharp[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/text-to-speech/helloworld/MainPage.xaml.cs#code)]

1. In the source file's `Speak_ButtonClicked` handler, find the string `YourSubscriptionKey`, and replace it with your subscription key.

1. In the `Speak_ButtonClicked` handler, find the string `YourServiceRegion`, and replace it with the [region](~/articles/cognitive-services/Speech-Service/regions.md) associated with your subscription. (For example, use `westus` for the free trial subscription.)

1. From the menu bar, choose **File** > **Save All** to save your changes.

## Build and run the application

Now you are ready to build and test your application.

1. From the menu bar, choose **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the application. The **helloworld** window appears.

   ![Sample UWP speech synthesis application in C# - quickstart](~/articles/cognitive-services/Speech-Service/media/sdk/qs-text-to-speech-uwp-helloworld-window.png)

1. Enter some text into the textbox, and click **Speak**. Your text is transmitted to the Speech service and synthesized to speech, which plays on your speaker.

    ![Speech synthesis user interface](~/articles/cognitive-services/Speech-Service/media/sdk/qs-tts-csharp-uwp-ui-result.png)

## Next steps

[!INCLUDE [Speech synthesis basics](../../text-to-speech-next-steps.md)]

## See also

- [Create a Custom Voice](~/articles/cognitive-services/Speech-Service/how-to-custom-voice-create-voice.md)
- [Record custom voice samples](~/articles/cognitive-services/Speech-Service/record-custom-voice-samples.md)
