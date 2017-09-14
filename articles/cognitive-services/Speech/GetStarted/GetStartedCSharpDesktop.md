---
title: Get started with Bing speech recognition in C# for .NET on Windows | Microsoft Docs
description: Develop basic Windows applications that use the Bing Speech API to convert spoken audio to text.
services: cognitive-services
author: priyaravi20
manager: yanbo

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 02/17/2017
ms.author: prrajan
---

# Get started with Bing speech recognition in C&#35; for .NET on Windows

Develop a basic Windows application that uses the Bing Speech API to convert spoken audio to text by sending audio to Microsoft's servers in the cloud. Using the client library allows for real-time streaming. Thus, at the same time your client application sends audio to the service, it simultaneously and asynchronously receives partial recognition results. This article describes how to use the client library, which currently supports speech in seven languages. The following example defaults to American English, "en-US". 

For the client library API reference, see the [Microsoft Bing Speech SDK](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-Windows/master/docs/SpeechSDK/index.html).

<a name="Prerequisites"></a>
## Prerequisites

### Platform requirements
The following example was developed for Windows 8+ and .NET Framework 4.5+ using [Microsoft Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs).

### Get the client library and the example
Download the Bing Speech API client library and the example through the [SDK](https://github.com/microsoft/cognitive-speech-stt-windows). Extract the downloaded zip file to a folder of your choice. Many users choose the Visual Studio 2015 folder.

### Subscribe to the Bing Speech API, and get a free-trial subscription key
Before you create the example, you must subscribe to the Bing Speech API, which is part of Microsoft Cognitive Services on Azure (previously Project Oxford). 

For subscription and key management details, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this tutorial.

<a name="Step1"></a>
## Step 1: Install the example application

1. Start Visual Studio 2015, and select **File** > **Open** > **Project/Solution**.

2. Browse to the folder where you saved the downloaded Bing Speech API files. Select **Speech** > **Windows**. Then select the **Sample-WPF** folder.

3. Double-click to open the Visual Studio 2015 Solution (.sln) file named **SpeechToText-WPF-Samples.sln**. The solution opens in Visual Studio.

<a name="Step2"></a>
## Step 2: Build the example application

1. Press Ctrl+Shift+B, or select **Build** on the ribbon menu. 

2. Select **Build Solution**.

<a name="Step3"></a>
## Step 3: Run the example application

1. After the build is finished, press **F5** or select **Start** on the ribbon menu to run the example.

2. In the **Project Oxford Speech To Text Sample** window, paste your subscription key in the text box shown in the following screenshot. To save your subscription key on your PC or laptop, select **Save Key**. To delete the subscription key from the system, select **Delete Key** to remove it from your PC or laptop.

    ![Subscription key text box](../Images/SpeechRecog_paste_key.PNG)

3. Under **Speech Recognition Source**, choose one of the six speech sources, which fall into two main input categories:

  a. Use your computer's microphone, or an attached microphone, to capture speech.

  b. Play an audio file.

  Each category has three recognition modes:

  a. **ShortPhrase mode**. An utterance up to 15 seconds long. As data is sent to the server, the client receives multiple partial results and one final multiple n-best choice result.

  b. **LongDictation mode**. An utterance up to two minutes long. As data is sent to the server, the client receives multiple partial results and multiple final results, based on where the server identifies sentence pauses.

  c. **Intent detection**. The server returns additional structured information about the speech input. To use intent, you need to first train a model. For more information, see [LUIS](https://www.luis.ai/).

Example audio files are available for use with this example application. The files are in the repository you downloaded with this example. Go to **SpeechRecognitionServiceExample** > **samples** > **Windows** > **SpeechToText**. If no other files are chosen, these example audio files run automatically when you select **Use wav file for Shortphrase mode** or **Use wav file for LongDictation mode**. Currently, only wav audio format is supported.

![Speech-to-text interface](../Images/HelloJones.PNG)

<a name="Review"></a>
## Review and learn

### Events
#### Partial results event
This event gets called every time the speech recognition service has an idea of what you might be saying. It's called even before you finish speaking (if you use the microphone client) or finish transferring data (if you use the data client).
#### Intent event
This event is called on WithIntent clients (only in ShortPhrase mode) after the final reco result is parsed into structured JSON intent.
#### Result event
This event is called when you finish speaking (in ShortPhrase mode). You're provided with n-best choices for the result. In LongDictation mode, the handler associated with this event is called multiple times, based on where the server identifies sentence pauses.

Event handlers are already pointed out in the code in the form of code comments.

 **Return format** |  Description |
 ------|------
 **LexicalForm** |  This form is optimal for use by applications that need raw, unprocessed speech-recognition results.
 **DisplayText**  |  The recognized phrase with inverse text normalization, capitalization, punctuation, and profanity masking applied. Profanity is masked with asterisks after the initial character, for example, "d***". This form is optimal for use by applications that display the speech recognition results to users.
**Inverse text normalization (ITN) has been applied**  |  For example, ITN converts the result text "go to fourth street" to "go to 4th St". This form is optimal for use by applications that display the speech recognition results to users.
**InverseTextNormalizationResult**  | ITN converts phrases like "one two three four" to a normalized form, such as "1234". For example, ITN converts the result text "go to fourth street" to "go to 4th St". This form is optimal for use by applications that interpret the speech recognition results as commands or perform queries based on the recognized text.
**MaskedInverseTextNormalizationResult**  |  The recognized phrase with ITN and profanity masking applied, but no capitalization or punctuation. Profanity is masked with asterisks after the initial character, for example, "d***". This form is optimal for use by applications that display the speech recognition results to users. ITN also is applied. For example, ITN converts the result text "go to fourth street" to "go to 4th St". This form is optimal for use by applications that use the unmasked ITN results but also need to display the command or query to users.

<a name="RelatedTopics"></a>
## Related topics
* [Get started with the Bing Speech API in Java on Android](GetStartedJavaAndroid.md)
* [Get started with Bing speech recognition in Objective-C on iOS](Get-Started-ObjectiveC-iOS.md)
* [Get started with the Bing Speech API in JavaScript](GetStartedJS.md)
* [Get started with the Bing Speech API in cURL](GetStarted-cURL.md)
