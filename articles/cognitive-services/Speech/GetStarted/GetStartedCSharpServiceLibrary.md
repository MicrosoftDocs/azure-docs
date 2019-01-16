---
title: Get started with the Microsoft Speech Recognition API by using the C# service library | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use the Bing Speech recognition service library to convert spoken language to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---
# Quickstart: Use the Bing Speech recognition service library in C&#35; for .NET Windows

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

The service library is for developers who have their own cloud service and want to call Speech Service from their service. If you want to call the speech recognition service from device-bound apps, do not use this SDK. (Use other client libraries or REST APIs for that.)

To use the C# service library, install the [NuGet package Microsoft.Bing.Speech](https://www.nuget.org/packages/Microsoft.Bing.Speech/). For the library API reference, see the [Microsoft Speech C# service library](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary/master/docs/index.html).

The following sections describe how to install, build, and run the C# sample application by using the C# service library.

## Prerequisites

### Platform requirements

The following example was developed for Windows 8+ and .NET 4.5+ Framework by using [Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs).

### Get the sample application

Clone the sample from the [Speech C# service library sample](https://github.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary) repository.

### Subscribe to the Speech Recognition API, and get a free trial subscription key

The Speech API is part of Cognitive Services (previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, select **Get API Key** to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you can use either key.

> [!IMPORTANT]
> * Get a subscription key. Before you can use the Speech client libraries, you must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/).
>
> * Use your subscription key. With the provided C# service library sample application, you need to provide your subscription key as one of the command-line parameters. For more information, see [Run the sample application](#step-3-run-the-sample-application).

## Step 1: Install the sample application

1. Start Visual Studio 2015, and select **File** > **Open** > **Project/Solution**.

2. Double-click to open the Visual Studio 2015 Solution (.sln) file named SpeechClient.sln. The solution opens in Visual Studio.

## Step 2: Build the sample application

Press Ctrl+Shift+B, or select **Build** on the ribbon menu. Then select **Build Solution**.

## Step 3: Run the sample application

1. After the build is finished, press F5 or select **Start** on the ribbon menu to run the example.

2. Open the output directory for the sample, for example, SpeechClientSample\bin\Debug. Press Shift+Right-click, and select **Open command window here**.

3. Run `SpeechClientSample.exe` with the following arguments:

   * Arg[0]: Specify an input audio WAV file.
   * Arg[1]: Specify the audio locale.
   * Arg[2]: Specify the recognition modes: *Short* for the `ShortPhrase` mode and *Long* for the `LongDictation` mode.
   * Arg[3]: Specify the subscription key to access the speech recognition service.

## Samples explained

### Recognition modes

* `ShortPhrase` mode: An utterance up to 15 seconds long. As data is sent to the server, the client receives multiple partial results and one final best result.
* `LongDictation` mode: An utterance up to 10 minutes long. As data is sent to the server, the client receives multiple partial results and multiple final results, based on where the server indicates sentence pauses.

### Supported audio formats

The Speech API supports audio/WAV by using the following codecs:

* PCM single channel
* Siren
* SirenSR

### Preferences

To create a SpeechClient, you need to first create a Preferences object. The Preferences object is a set of parameters that configures the behavior of the speech service. It consists of the following fields:

* `SpeechLanguage`: The locale of the audio sent to the speech service.
* `ServiceUri`: The endpoint used to call the speech service.
* `AuthorizationProvider`: An IAuthorizationProvider implementation used to fetch tokens in order to access the speech service. Although the sample provides a Cognitive Services authorization provider, we highly recommend that you create your own implementation to handle token caching.
* `EnableAudioBuffering`: An advanced option. See [Connection management](#connection-management).

### Speech input

The SpeechInput object consists of two fields:

* **Audio**: A stream implementation of your choice from which the SDK pulls audio. It can be any [stream](https://msdn.microsoft.com/library/system.io.stream(v=vs.110).aspx) that supports reading.
   > [!NOTE]
   > The SDK detects the end of the stream when the stream returns **0** in read.

* **RequestMetadata**: Metadata about the speech request. For more information, see the [reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary/master/docs/index.html).

### Speech request

After you have instantiated a SpeechClient and SpeechInput objects, use RecognizeAsync to make a request to Speech Service.

```cs
    var task = speechClient.RecognizeAsync(speechInput);
```

After the request finishes, the task returned by RecognizeAsync finishes. The last RecognitionResult is the end of the recognition. The task can fail if the service or the SDK fails unexpectedly.

### Speech recognition events

#### Partial results event

This event gets called every time Speech Service predicts what you might be saying, even before you finish speaking (if you use `MicrophoneRecognitionClient`) or finish sending data (if you use `DataRecognitionClient`). You can subscribe to the event by using `SpeechClient.SubscribeToPartialResult()`. Or you can use the generic events subscription method `SpeechClient.SubscribeTo<RecognitionPartialResult>()`.

**Return format** | Description |
------|------
**LexicalForm** | This form is optimal for use by applications that need raw, unprocessed speech recognition results.
**DisplayText** | The recognized phrase with inverse text normalization, capitalization, punctuation, and profanity masking applied. Profanity is masked with asterisks after the initial character, for example, "d***." This form is optimal for use by applications that display the speech recognition results to a user.
**Confidence** | The level of confidence the recognized phrase represents for the associated audio as defined by the speech recognition server.
**MediaTime** | The current time relative to the start of the audio stream (in 100-nanosecond units of time).
**MediaDuration** | The current phrase duration/length relative to the audio segment (in 100-nanosecond units of time).

#### Result event
When you finish speaking (in `ShortPhrase` mode), this event is called. You're provided with n-best choices for the result. In `LongDictation` mode, the event can be called multiple times, based on where the server indicates sentence pauses. You can subscribe to the event by using `SpeechClient.SubscribeToRecognitionResult()`. Or you can use the generic events subscription method `SpeechClient.SubscribeTo<RecognitionResult>()`.

**Return format** | Description |
------|------|
**RecognitionStatus** | The status on how the recognition was produced. For example, was it produced as a result of successful recognition or as a result of canceling the connection, etc.
**Phrases** | The set of n-best recognized phrases with the recognition confidence.

For more information on recognition results, see [Output format](../Concepts.md#output-format).

### Speech recognition response

Speech response example:
```
--- Partial result received by OnPartialResult  
---what  
--- Partial result received by OnPartialResult  
--what's  
--- Partial result received by OnPartialResult  
---what's the web  
--- Partial result received by OnPartialResult   
---what's the weather like  
---***** Phrase Recognition Status = [Success]   
***What's the weather like? (Confidence:High)  
What's the weather like? (Confidence:High) 
```

## Connection management

The API utilizes a single WebSocket connection per request. For optimal user experience, the SDK attempts to reconnect to Speech Service and start the recognition from the last RecognitionResult that it received. For example, if the audio request is two minutes long, the SDK received a RecognitionEvent at the one-minute mark, and a network failure occurred after five seconds, the SDK starts a new connection that starts from the one-minute mark.

>[!NOTE]
>The SDK doesn't seek back to the one-minute mark because the stream might not support seeking. Instead, the SDK keeps an internal buffer that it uses to buffer the audio and clears the buffer as it receives RecognitionResult events.

## Buffering behavior

By default, the SDK buffers audio so that it can recover when a network interrupt occurs. In a scenario where it's preferable to discard the audio lost during the network disconnect and restart the connection, it's best to disable audio buffering by setting `EnableAudioBuffering` in the Preferences object to `false`.

## Related topics

[Microsoft Speech C# service library reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary/master/docs/index.html)
