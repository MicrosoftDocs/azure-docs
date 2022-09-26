---
title: "Quickstart: Recognize speech from a microphone, C# (UWP) - Speech service"
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/02/2020
ms.author: eur
ms.custom: devx-track-csharp
---

## Prerequisites

Before you get started:

> [!div class="checklist"]
> * [Create a Speech resource](~/articles/cognitive-services/cognitive-services-apis-create-account.md#get-the-keys-for-your-resource)
> * [Setup your development environment and create an empty project](../../../../quickstarts/setup-platform.md?tabs=uwp&pivots=programming-language-csharp)
> * Make sure that you have access to a microphone for audio capture

If you've already done this, great. Let's keep going.

## Open your project in Visual Studio

The first step is to make sure that you have your project open in Visual Studio.

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

1. In **Solution Explorer**, open `MainPage.xaml`.

2. In the designer's XAML view, insert the following XAML snippet into the **Grid** tag (between `<Grid>` and `</Grid>`):

   [!code-xml[UI elements](~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml#StackPanel)]

3. In **Solution Explorer**, open the code-behind source file `MainPage.xaml.cs`. (It's grouped under `MainPage.xaml`.)

4. Replace the code with the following base code:

    :::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="skeleton_1":::
    :::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="skeleton_2":::
    :::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="skeleton_3":::

## Create a Speech configuration

Before you can initialize a `SpeechRecognizer` object, you need to create a configuration that uses your subscription key and subscription region. Insert this code in the `SpeechRecognitionFromMicrophone_ButtonClicked()` method.

> [!NOTE]
> This sample uses the `FromSubscription()` method to build the `SpeechConfig`. For a full list of available methods, see [SpeechConfig Class](/dotnet/api/)

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="create_speech_configuration":::

## Initialize a SpeechRecognizer

Now, let's create a `SpeechRecognizer`. This object is created inside of a using statement to ensure the proper release of unmanaged resources. Insert this code in the `SpeechRecognitionFromMicrophone_ButtonClicked()` method, right below your Speech configuration.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="create_speech_recognizer_1":::
:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="create_speech_recognizer_2":::

## Recognize a phrase

From the `SpeechRecognizer` object, you call the `RecognizeOnceAsync()` method. This method lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified, to stop recognizing speech.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="recognize_phrase":::

## Display the recognition results (or errors)

When the recognition result is returned by the Speech service, you'll want to do something with it. We're going to keep it simple and print the result to the status panel.

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/quickstart/csharp/uwp/from-microphone/helloworld/MainPage.xaml.cs" id="print_results":::

## Build and run the application

Now you are ready to build and test your application.

1. From the menu bar, choose **Build** > **Build Solution** to build the application. The code should compile without errors now.

1. Choose **Debug** > **Start Debugging** (or press **F5**) to start the application. The **helloworld** window appears.

   ![Sample UWP speech recognition application in C# - quickstart](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-uwp-helloworld-window.png)

1. Select **Enable Microphone**, and when the access permission request pops up, select **Yes**.

   ![Microphone access permission request](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-uwp-10-access-prompt.png)

1. Select **Speech recognition with microphone input**, and speak an English phrase or sentence into your device's microphone. Your speech is transmitted to the Speech service and transcribed to text, which appears in the window.

   ![Speech recognition user interface](~/articles/cognitive-services/Speech-Service/media/sdk/qs-csharp-uwp-11-ui-result.png)

## Next steps

[!INCLUDE [Speech recognition basics](../../speech-to-text-next-steps.md)]
