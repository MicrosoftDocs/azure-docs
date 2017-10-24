---
title: Get Started with Microsoft Speech Recognition API Using C# Service Library | Microsoft Docs
description: Use the Microsoft speech recognition service library to convert spoken language to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/17/2017
ms.author: zhouwang
---
# Get started with Microsoft speech recognition service library in C&#35; for .NET Windows

The service library is for developers who have their own cloud service and wish to call Microsoft Speech Recognition Service from their service. This SDK should not be used by developers who wish to call our Speech Recognition service from a device bound apps (use other client libraries or REST APIs for that).

To use the C# service library, you need to install [NuGet package Microsoft.Bing.Speech](https://www.nuget.org/packages/Microsoft.Bing.Speech/). For library API reference, see the [Microsoft Speech C# Service Library](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary/master/docs/index.html).

The following sections describe how to install, build, and run the C# sample application using C# service Library.

## Prerequisites

### Platform requirements

The following example has been developed for Windows 8+ and .NET 4.5+ Framework using [Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs).

### Get the sample application

You may clone the sample from the [Speech C# Service Library Sample](https://github.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary) repository.

### Subscribe to Speech API and get a free trial subscription key

Microsoft Speech API is part of Microsoft Cognitive Services on Azure(previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services Subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, click Get API Key to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you may use either key.

> [!IMPORTANT]
> **Get a subscription key**
>
> You must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/) before using speech client libraries.
>
> **Use your subscription key**
>
>  With the provided C# service library sample application, you need to provide your subscription key as one of command line parameters. See more information below: [Run the sample application](#step-3-run-the-sample-application).

## Step 1: Install the sample application

1. Start Microsoft Visual Studio 2015 and click `File`, select `Open`, then `Project/Solution`.
2. Double-click to open the Visual Studio 2015 Solution (.sln) file named `SpeechClient.sln`. This opens the solution in Visual Studio.

## Step 2: Build the sample application

Press Ctrl+Shift+B, or click `Build` on the ribbon menu, then select `Build Solution`.

## Step 3: Run the sample application

1. After the build is complete, press F5 or click `Start` on the ribbon menu to run the example.
2. Open the output directory for the sample, e.g. `SpeechClientSample\bin\Debug`, press Shift+Right Click, press `Open command window here`.
3. Run `SpeechClientSample.exe` with the following arguments:
 * Arg[0]: Specify an input audio wav file.
 * Arg[1]: Specify the audio locale.
 * Arg[2]: Specify the [recognition mode](#recognition-modes]: *Short* for the `ShortPhrase` mode, and *Long* for the `LongDictation` mode.
 * Arg[3]: Specify the subscription key to access the speech recognition Service.

## Samples explained

### Recognition modes

* `ShortPhrase` mode: an utterance up to 15 seconds long. As data is sent to the server, the client receives multiple partial results and one final best result.
* `LongDictation` mode: an utterance up to 10 minutes long. As data is sent to the server, the client receives multiple partial results and multiple final results, based on where the server indicates sentence pauses.

### Supported audio formats

The Speech API supports audio/wav using the following codecs:

* PCM single channel
* Siren
* SirenSR

### Preferences

To create a SpeechClient, you need to first create a Preferences object. The Preferences object is a set of parameters
that configures the behavior of the speech service. It consists of the following fields:

* `SpeechLanguage`: The locale of the audio being sent to the speech service.
* `ServiceUri`: The endpoint use to call the speech service.
* `AuthorizationProvider`: An IAuthorizationProvider implementation used to fetch tokens in order to access the speech service. Although the sample provides a Cognitive Services authorization provider, it is highly recommended to create your own implementation to handle token caching.
* `EnableAudioBuffering`: An advanced option, see [Connection Management](#connection-management).

### Speech input

The SpeechInput object consists of 2 fields:

* **Audio**: A stream implementation of your choice that the SDK pulls audio from. It could be any [Stream](https://msdn.microsoft.com/library/system.io.stream(v=vs.110).aspx) that supports reading.

> [!NOTE]
> The SDK detects the end of the stream when the stream returns **0** in read.

* **RequestMetadata**: Metadata about the speech request. For more information, see the [Reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary/master/docs/index.html)

### Speech request

Once you have instantiated a SpeechClient and SpeechInput objects, use RecognizeAsync to make a request to the Speech Service.

```cs
    var task = speechClient.RecognizeAsync(speechInput);
```

The task returned by RecognizeAsync completes once the request completes. The last RecognitionResult is the end of the recognition. The task can fail if the service or the SDK fails unexpectedly.

### speech recognition events

#### Partial results event

This event gets called every time the Speech Service has an idea of what the speaker might be saying - even before the user has finished speaking if you are using `MicrophoneRecognitionClient`) or have finished sending data (if you are using `DataRecognitionClient`). You can subscribe to the event using `SpeechClient.SubscribeToPartialResult()`, or use the generic events subscription method `SpeechClient.SubscribeTo<RecognitionPartialResult>()`.

**Return Format** | Description |
------|------
**LexicalForm** | This form is optimal for use by applications that need raw, unprocessed speech recognition results.
**DisplayText** | The recognized phrase with inverse text normalization, capitalization, punctuation, and profanity masking applied. Profanity is masked with asterisks after the initial character, e.g. "d***". This form is optimal for use by applications that display the speech recognition results to a user.
**Confidence** | Indicates the level of confidence the recognized phrase represents the audio associated as defined by the speech recognition Server.
**MediaTime** | The current time relative to the start of the audio stream (In 100-nanosecond units of time).
**MediaDuration** | The current phrase duration/length relative to the audio segment (In 100-nanosecond units of time).

#### Result event
When you have finished speaking (in `ShortPhrase` mode), this event is called. You are provided with n-best choices for the result. In `LongDictation` mode, the event can be called multiple times, based on where the server thinks sentence pauses are. You can subscribe to the event using `SpeechClient.SubscribeToRecognitionResult()` or Use the generic events subscription method `SpeechClient.SubscribeTo<RecognitionResult>()`.

**Return Format** | Description |
------|------|
**RecognitionStatus** | The status on how the recognition was produced. For example, was it produced as a result of successful recognition, or as a result of canceling the connection, etc.
**Phrases** | The set of n-best recognized phrases with the recognition confidence.

For more information on recognition results, see the [output format](../Concepts.md#output-format) page.

### speech recognition response

Speech Response example:
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

The API utilizes a single web-socket connection per request. For optimal user experience, the SDK attempts to reconnect to the speech service and start the recognition from the last RecognitionResult that it received. For example, if the audio request is 2 minutes long and the SDK received a RecognitionEvent at the 1 minute mark, then a network failure occurred after 5 seconds, the SDK will start a new connection starting from the 1 minute mark.

>[!NOTE]
>The SDK does not seek back to the 1 minute mark, as the Stream may not support seeking. Instead the SDK keeps internal buffer that it uses to buffer the audio and clears the buffer as it received RecognitionResult events.

## Buffering behavior

By default, the SDK buffers audio so it can recover when a network interrupt occurs. In some scenario where it is preferable to discard the audio lost during the network disconnect and restart the connection where the stream at due to performance considerations, it is best to disable audio buffering by setting `EnableAudioBuffering` in the Preferences object to `false`.

## Related topics

* [Microsoft Speech C# Service Library Reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-ServiceLibrary/master/docs/index.html)