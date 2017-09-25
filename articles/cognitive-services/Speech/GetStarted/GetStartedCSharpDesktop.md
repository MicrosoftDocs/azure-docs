---
title: Get started with Microsoft Speech Recognition in C# for .Net Windows | Microsoft Docs
description: Develop basic Windows applications that use the Microsoft Speech Recognition API to convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma61

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/27/2017
ms.author: zhouwang
---
# Getting Started with Microsoft Speech Recognition in C&#35; for .Net Windows

This page shows how to develop a basic Windows application that uses Microsoft Speech Recognition API to convert spoken audio to text. Using the Client Library allows for real-time streaming, which means that when your client application sends audio to the service, it simultaneously and asynchronously receives partial recognition results back. This page describes use of the C# Client Library. For client library API reference, see [Microsoft Speech C# Desktop Library](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-Windows/master/docs/SpeechSDK/index.html).

<a name="Prerequisites"></a>
## Prerequisites

### Platform Requirements

The following example has been developed for Windows 8+ and .NET Framework 4.5+ using [Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs).

### Get the Client Library and Example

You may clone the Speech Recognition API client library and example through [SDK](https://github.com/microsoft/cognitive-speech-stt-windows).

### Subscribe to Speech Recognition API and Get a Free Trial Subscription Key

Before creating the example, you must subscribe to Speech Recognition API, which is part of Microsoft Cognitive Services (previously Project Oxford). For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this tutorial.

If you want to use *Recognition with intent*, you also need to sign up [Language Understanding Intelligent Service (LUIS)](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/).

<a name="Step1"></a>
## Step 1: Install the Example Application

1. Start Microsoft Visual Studio 2015 and click `File`, select `Open`, then `Project/Solution`.
2. Browse to the folder where you saved the downloaded Speech Recognition API files. Click on `Speech`, then `Windows`, and then the `Sample-WPF` folder.
3. Double-click to open the Visual Studio 2015 Solution (.sln) file named `SpeechToText-WPF-Samples.sln`. This opens the solution in Visual Studio.

<a name="Step2"></a>
## Step 2: Build the Example Application

1. Press Ctrl+Shift+B, or click `Build` on the ribbon menu, then select `Build Solution`.

<a name="Step3"></a>
## Step 3: Run the Example Application

1. After the build is complete, press F5 or click `Start` on the ribbon menu to run the example.
2. Locate the `Project Oxford Speech to Text` window with the **text edit box** reading **"Paste your subscription key here to start"**. Paste your subscription key into the text box as shown in below screenshot. You may choose to persist your subscription key on your PC or laptop by clicking the `Save Key` button. When you want to delete the subscription key from the system, click `Delete Key` to remove it from your PC or laptop.

  ![Speech Recognition paste in key](../Images/SpeechRecog_paste_key.PNG)

3. Under `Speech Recognition Source` choose one of the six speech sources, which fall into two main input categories.

  * Using your computer's microphone, or an attached microphone, to capture speech.
  * Playing an audio file.

Each category has three recognition modes.

 * **ShortPhrase Mode**: An utterance up to 15 seconds long. As data is sent to the server, the client receives multiple partial results and one final result with multiple N-best choices.
 * **LongDictation Mode**: An utterance up to 2 minutes long. As data is sent to the server, the client receives multiple partial results and multiple final results, based on where the server indicates sentence pauses.
 * **Intent Detection**: The server returns additional structured information about the speech input. To use Intent, you need to first train a model using [LUIS](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/).

There are sample audio files to be used with this example application. You find the files in the repository you downloaded with this example under `samples/SpeechRecognitionServiceExample` folder. These example audio files run automatically if no other files are chosen when selecting the `Use wav file for Shortphrase mode` or `Use wav file for Longdictation mode` as your speech input. Currently only wav audio format is supported.

![Speech to Text Interface](../Images/HelloJones.PNG)

## Samples explained

### Recognition Events

* **Partial Results Events:** This event gets called every time when the Speech Service predicts what you might be saying - even before you finish speaking (if you are using `MicrophoneRecognitionClient`) or have finished sending data (if you are using `DataRecognitionClient`).

* **Error Events:** Called when the service detects an Error.

* **Intent Events:** Called on "WithIntent" clients (only in ShortPhrase mode) after the final recognition result has been parsed into a structured JSON intent.

* **Result Events:**
  * In `ShortPhrase` mode, this event is called and returns n-best results after you finish speaking.
  * In `LongDictation mode`, the event handler is called multiple times, based on where the service identifies sentence pauses.
  * **For each of the n-best choices**, a confidence value and a few different forms of the recognized text are returned. For more information, see the [output format](../Concepts.md#output-format) page.

Event handlers are already pointed out in the code in form of code comments.

<a name="RelatedTopics"></a>
## Related Topics

* [Microsoft Speech SDK Reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-Windows/master/docs/SpeechSDK/index.html)
* [Get started with Microsoft Speech Recognition API in Java on Android](GetStartedJavaAndroid.md)
* [Get started with Microsoft Speech Recognition API in Objective C on iOS](Get-Started-ObjectiveC-iOS.md)
* [Get started with Microsoft Speech Recognition API in JavaScript](GetStartedJSWebsockets.md)
* [Get started with Microsoft Speech Recognition API via REST](GetStartedREST.md)
