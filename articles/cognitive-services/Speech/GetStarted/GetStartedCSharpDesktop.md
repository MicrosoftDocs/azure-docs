---
title: Get Started with Microsoft Speech Recognition API using C# Desktop Library | Microsoft Docs
description: Develop basic Windows applications that use the Microsoft speech recognition API to convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/27/2017
ms.author: zhouwang
---
# Getting started with Microsoft speech recognition in C&#35; for .NET on Windows

This page shows how to develop a basic Windows application that uses Microsoft speech recognition API to convert spoken audio to text. Using the client library allows for real-time streaming, which means that when your client application sends audio to the service, it simultaneously and asynchronously receives partial recognition results back.

The C# desktop library can be used by developers who want to use Microsoft Speech Service from apps running on any device. To use the library, you need to install [NuGet package Microsoft.ProjectOxford.SpeechRecognition-x86](https://www.nuget.org/packages/Microsoft.ProjectOxford.SpeechRecognition-x86/) for 32-bit platform and [NuGet package Microsoft.ProjectOxford.SpeechRecognition-x64](https://www.nuget.org/packages/Microsoft.ProjectOxford.SpeechRecognition-x64/) for 64-bit platform. For client library API reference, see [Microsoft Speech C# Desktop Library](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-Windows/master/docs/SpeechSDK/index.html).

The following sections describe how to install, build, and run the C# sample application using C# desktop library.

## Prerequisites

### Platform requirements

The following sample has been developed for Windows 8+ and .NET Framework 4.5+ using [Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs).

### Get the sample application

You may clone the sample from the [Speech C# Desktop Library Sample](https://github.com/microsoft/cognitive-speech-stt-windows) repository.

### Subscribe to speech recognition API and get a free trial subscription key

Microsoft Speech API is part of Microsoft Cognitive Services on Azure(previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services Subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, click Get API Key to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you may use either key.

> [!IMPORTANT]
> **Get a subscription key**
>
> You must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/) before using speech client libraries.
>
> **Use your subscription key**
>
>  With the provided C# desktop sample application, you need to paste your subscription key into the text box when running the sample. See more information below: [Run the sample application](#step-3-run-the-sample-application).

## Step 1: Install the sample application

1. Start Microsoft Visual Studio 2015 and click `File`, select `Open`, then `Project/Solution`.
2. Browse to the folder where you saved the downloaded speech recognition API files. Click on `Speech`, then `Windows`, and then the `Sample-WPF` folder.
3. Double-click to open the Visual Studio 2015 Solution (.sln) file named `SpeechToText-WPF-Samples.sln`. This opens the solution in Visual Studio.

## Step 2: Build the sample application

1. If you want to use *Recognition with intent*, you first need to sign up to the [Language Understanding Intelligent Service (LUIS)](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/), and then use the endpoint URL of your LUIS app to set the value of key `LuisEndpointUrl` in `app.config` file in the `samples/SpeechRecognitionServiceExample` folder. For more information on the endpoint URL of LUIS app, see [Publish LUIS App](../../luis/luis-get-started-create-app.md#publish-your-app).

> [!TIP]
> You must replace the character `&` in the LUIS endpoint URL with `&amp;` to ensure that the URL is correctly interpreted by the XML parser.

2. Press Ctrl+Shift+B, or click `Build` on the ribbon menu, then select `Build Solution`.

## Step 3: Run the sample application

1. After the build is complete, press F5 or click `Start` on the ribbon menu to run the sample.
2. Locate the `Project Oxford Speech to Text` window with the **text edit box** reading **"Paste your subscription key here to start"**. Paste your subscription key into the text box as shown in below screenshot. You may choose to persist your subscription key on your PC or laptop by clicking the `Save Key` button. When you want to delete the subscription key from the system, click `Delete Key` to remove it from your PC or laptop.

  ![speech recognition paste in key](../Images/SpeechRecog_paste_key.PNG)

3. Under `Speech Recognition Source` choose one of the six speech sources, which fall into two main input categories.

  * Using your computer's microphone, or an attached microphone, to capture speech.
  * Playing an audio file.

Each category has three recognition modes.

 * **ShortPhrase Mode**: an utterance up to 15 seconds long. As data is sent to the server, the client receives multiple partial results and one final result with multiple N-best choices.
 * **LongDictation Mode**: an utterance up to 2 minutes long. As data is sent to the server, the client receives multiple partial results and multiple final results, based on where the server indicates sentence pauses.
 * **Intent Detection**: the server returns additional structured information about the speech input. To use Intent, you need to first train a model using [LUIS](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/).

There are sample audio files to be used with this sample application. You find the files in the repository you downloaded with this sample under `samples/SpeechRecognitionServiceExample` folder. These sample audio files run automatically if no other files are chosen when selecting the `Use wav file for Shortphrase mode` or `Use wav file for Longdictation mode` as your speech input. Currently only wav audio format is supported.

![Speech to Text Interface](../Images/HelloJones.PNG)

## Samples explained

### Recognition events

* **Partial Results Events:** this event gets called every time when the Speech Service predicts what you might be saying - even before you finish speaking (if you are using `MicrophoneRecognitionClient`) or have finished sending data (if you are using `DataRecognitionClient`).

* **Error Events:** called when the service detects an Error.

* **Intent Events:** called on "WithIntent" clients (only in ShortPhrase mode) after the final recognition result has been parsed into a structured JSON intent.

* **Result Events:**
  * In `ShortPhrase` mode, this event is called and returns n-best results after you finish speaking.
  * In `LongDictation` mode, the event handler is called multiple times, based on where the service identifies sentence pauses.
  * **For each of the n-best choices**, a confidence value and a few different forms of the recognized text are returned. For more information, see the [output format](../Concepts.md#output-format) page.

Event handlers are already pointed out in the code in form of code comments.

## Related topics

* [Microsoft Speech Desktop Library Reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-Windows/master/docs/SpeechSDK/index.html)
* [Get started with Microsoft speech recognition API in Java on Android](GetStartedJavaAndroid.md)
* [Get started with Microsoft speech recognition API in Objective C on iOS](Get-Started-ObjectiveC-iOS.md)
* [Get started with Microsoft speech recognition API in JavaScript](GetStartedJSWebsockets.md)
* [Get started with Microsoft speech recognition API via REST](GetStartedREST.md)
