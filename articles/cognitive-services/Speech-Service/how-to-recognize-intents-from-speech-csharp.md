---
title: Tutorial: Recognize intents from speech by using the Speech SDK for C#
titleSuffix: "Microsoft Cognitive Services"
description: |
  Tutorial explains how to recognize intents from speech from a file or a microphone by using the Speech SDK for C#.
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.technology: Speech
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: wolfma
---

# Tutorial: Recognize intents from speech using the Speech SDK for C#

[!INCLUDE [Article selector](../../../includes/cognitive-services-speech-service-how-to-recognize-intents-from-speech-selector.md)]

The Cognitive Services [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) integrates with the [Language Understanding service (LUIS)](https://www.luis.ai/home) to provide **intent recognition.** An intent is something the user wants to do: book a flight, check the weather, or make a call. The user can use whatever terms feel natural. Using machine learning, LUIS maps user requests to the intents you have defined in your application.

> [!NOTE]
> A LUIS application defines the intents you want to recognize. It's separate from the C# application that uses the Speech service.

LUIS provides two keys: 

In this tutorial, you use the Speech SDK to develop a C# console application that derives intents from user utterances, including these tasks.

> [!div class="checklist"]
> * CReate a Visual Studio project with the Speech SDK NuGet package
> * Create a speech factory using a LUIS endpoint key
> * Get an intent recognizer from the speech factory
> * Get the model for your LUIS app and add the intents you need
> * Connect event handlers to the recognizer
> * Begin single-shot or continuous recognition

## Prerequisites

Get the following before you begin this tutorial.

* A LUIS account. You can get one for free through the [LUIS Portal](https://www.luis.ai/home). There is a free pricing tier suitable for working through this tutorial.
* A LUIS application. If you are just trying things out, follow the [LUIS prebuilt Home Automation](https://docs.microsoft.com/azure/cognitive-services/luis/luis-get-started-create-app) quickstart to create one using an existing model.
* A free [Speech service subscription]](get-started.md).
* Visual Studio 2017 (any edition).

## Create Visual Studio project with Speech SDK

<!-- make this an include? it's shared with the quickstart -->

1. Start Visual Studio 2017.
 
1. Make sure the **.NET desktop environment** workload is available. Choose **Tools** \> **Get Tools and Features** from the Visual Studio menu bar to open the Visual Studio installer. If this workload is already enabled, close the dialog. 

    Otherwise, mark the checkbox next to **.NET desktop development,** then click the **Modify** button at the lower right corner of the dialog. Installation of the new feature will take a moment.

    ![Enable .NET desktop development](media/sdk/vs-enable-net-desktop-workload.png)

1. Create a new Visual C# Console App. In the **New Project** dialog box, from the left pane, expand **Installed** \> **Visual C#** \> **Windows Desktop** and then choose **Console App (.NET Framework)**. For the project name, enter *helloworld*.

    ![Create Visual C# Console App (.NET Framework)](media/sdk/qs-csharp-dotnet-windows-01-new-console-app.png "Create Visual C# Console App (.NET Framework)")

1. Install and reference the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget). In the Solution Explorer, right-click the solution and select **Manage NuGet Packages for Solution**.

    ![Right-click Manage NuGet Packages for Solution](media/sdk/qs-csharp-dotnet-windows-02-manage-nuget-packages.png "Manage NuGet Packages for Solution")

1. In the upper-right corner, in the **Package Source** field, select **Nuget.org**. Search for the `Microsoft.CognitiveServices.Speech` package and install it into the **helloworld** project.

    ![Install Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/qs-csharp-dotnet-windows-03-nuget-install-0.5.0.png "Install Nuget package")

1. Accept the displayed license to begin installation of the NuGet package.

    ![Accept the license](media/sdk/qs-csharp-dotnet-windows-04-nuget-license.png "Accept the license")

    After the package is installed, a confirmation appears in the Package Manager console.

1. Create a platform configuration matching your PC architecture via the Configuration Manager. Select **Build** > **Configuration Manager**.

    ![Launch the configuration manager](media/sdk/qs-csharp-dotnet-windows-05-cfg-manager-click.png "Launch the configuration manager")

1. In the **Configuration Manager** dialog box, add a new platform. From the **Active solution platform** drop-down list, select **New**.

    ![Add a new platform under the configuration manager window](media/sdk/qs-csharp-dotnet-windows-06-cfg-manager-new.png "Add a new platform under the configuration manager window")

1. If you are running 64-bit Windows, create a new platform configuration named `x64`. If you are running 32-bit Windows, create a new platform configuration named `x86`.

    ![On 64-bit Windows, add a new platform named "x64"](media/sdk/qs-csharp-dotnet-windows-07-cfg-manager-add-x64.png "Add x64 platform")


## Create the application

1. Create a speech factory with a LUIS subscription key and [region](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition) as parameters. The LUIS subscription key is called **endpoint key** in the service documentation. You can't use the LUIS authoring key. (See the note later in this section.)

1. Get an intent recognizer from the speech factory. A recognizer can use your device's default microphone, an audio stream, or audio from a file.

1. Get the language understanding model that's based on your **AppId**. Add the intents you require. 

1. Tie up the events for asynchronous operation, if desired. The recognizer then calls your event handlers when it has interim and final results (includes intents). If you don't tie up the events, your application receives only a final transcription result.

1. Start intent recognition. For single-shot recognition, such as command or query recognition, use the `RecognizeAsync()` method. This method returns the first recognized utterance. For long-running recognition, use the `StartContinuousRecognitionAsync()` method. Tie up the events for asynchronous recognition results.

See the following code snippets for intent recognition scenarios that use the Speech SDK. Replace the values in the sample with your own LUIS subscription key (endpoint key), the [region of your subscription](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition), and the **AppId** of your intent model.

> [!NOTE]
> In contrast to other services supported by the Speech SDK, intent recognition requires a specific subscription key (LUIS endpoint key). For information about the intent recognition technology, see the [LUIS website](https://www.luis.ai). For information on how to acquire the **endpoint key**, see [Create a LUIS endpoint key](https://docs.microsoft.com/azure/cognitive-services/LUIS/luis-how-to-azure-subscription#create-luis-endpoint-key).



## Top-level declarations

For all code in the following sections, these top-level declarations should be in place:

[!code-csharp[Top-level declarations](~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/intent_recognition_samples.cs#toplevel)]

## Intent recognition from a microphone

The following code shows how to recognize intent from microphone input in the default language (en-US).

[!code-csharp[Intent recognition by using a microphone](~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/intent_recognition_samples.cs#intentRecognitionWithMicrophone)]

## Intent recognition for a specified language

The following code shows how to recognize intent from microphone input in a specified language. In this example, the language is German (de-de).

[!code-csharp[Intent recognition by using a microphone in a specified language](~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/intent_recognition_samples.cs#intentRecognitionWithLanguage)]

## Intent recognition from a file with events

The following code shows how to recognize intent in the default language (en-US) in a continuous way. The code allows access to additional information like intermediate results. Input is taken from an audio file. The supported format is single-channel (mono) WAV/PCM with a sampling rate of 16 kHz.

[!INCLUDE [Sample audio](../../../includes/cognitive-services-speech-service-sample-audio.md)]

[!code-csharp[Intent recognition by using events from a file](~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/intent_recognition_samples.cs#intentContinuousRecognitionWithFile)]

[!INCLUDE [Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for the code from this article in the samples/csharp/sharedcontent/console folder.

## Next steps

- [How to recognize speech](how-to-recognize-speech-csharp.md)
- [How to translate speech](how-to-translate-speech-csharp.md)
