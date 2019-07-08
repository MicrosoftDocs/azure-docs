---
title: Get started with the Bing Speech Recognition API in Objective-C on iOS | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use the Bing Speech Recognition API to develop iOS applications that convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.subservice: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
ROBOTS: NOINDEX,NOFOLLOW
---
# Quickstart: Use the Bing Speech Recognition API in Objective-C on iOS

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

With the Speech Recognition API, you can develop iOS applications that use cloud-based Speech Service to convert spoken audio to text. The API supports real-time streaming, so your application can simultaneously and asynchronously receive partial recognition results at the same time it's sending audio to the service.

This article uses a sample application to demonstrate the basics of how to get started with the  Speech Recognition API to develop an iOS application. For a complete API reference, see the [Speech SDK client library reference](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-iOS/master/com.Microsoft.SpeechSDK-1_0-for-iOS.docset/Contents/Resources/Documents/index.html).

## Prerequisites

### Platform requirements

Make sure that the Mac XCode IDE is installed.

### Get the client library and examples

The Speech client library and examples for iOS are available on the [Speech client SDK for iOS](https://github.com/microsoft/cognitive-speech-stt-ios).

### Subscribe to the Speech Recognition API, and get a free trial subscription key

The Speech API is part of Cognitive Services (previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, select **Get API Key** to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you can use either key.

If you want to use *recognition with intent*, you also need to sign up for the [Language Understanding Intelligent Service (LUIS)](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/).

> [!IMPORTANT]
> * Get a subscription key. Before you can use Speech client libraries, you must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/).
>
> * Use your subscription key. With the provided iOS sample application, you need to update the file Samples/SpeechRecognitionServerExample/settings.plist with your subscription key. For more information, see [Build and run samples](#build-and-run-samples).

## Use the Speech client library

To add the client library into an XCode project, follow these [instructions](https://github.com/Azure-Samples/Cognitive-Speech-STT-iOS#the-client-library).

To find the client library reference for iOS, see this [webpage](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-iOS/master/com.Microsoft.SpeechSDK-1_0-for-iOS.docset/Contents/Resources/Documents/index.html).

## Build and run samples

For information on how to build and run samples, see this [README page](https://github.com/Azure-Samples/Cognitive-Speech-STT-iOS#the-sample).

## Samples explained

### Create recognition clients

The following code in the sample shows how to create recognition client classes based on user scenarios:

```
{
    NSString* language = @"en-us";

    NSString* path = [[NSBundle mainBundle] pathForResource:@"settings" ofType:@"plist"];
    NSDictionary* settings = [[NSDictionary alloc] initWithContentsOfFile:path];

    NSString* primaryOrSecondaryKey = [settings objectForKey:(@"primaryKey")];
    NSString* luisAppID = [settings objectForKey:(@"luisAppID")];
    NSString* luisSubscriptionID = [settings objectForKey:(@"luisSubscriptionID")];

    if (isMicrophoneReco) {
        if (!isIntent) {
            micClient = [SpeechRecognitionServiceFactory createMicrophoneClient:(recoMode)
                                                                   withLanguage:(language)
                                                                        withKey:(primaryOrSecondaryKey)
                                                                   withProtocol:(self)];
        }
        else {
            MicrophoneRecognitionClientWithIntent* micIntentClient;
            micIntentClient = [SpeechRecognitionServiceFactory createMicrophoneClientWithIntent:(language)
                                                                                        withKey:(primaryOrSecondaryKey)
                                                                                  withLUISAppID:(luisAppID)
                                                                                 withLUISSecret:(luisSubscriptionID)
                                                                                   withProtocol:(self)];
            micClient = micIntentClient;
        }
    }
    else {
        if (!isIntent) {
            dataClient = [SpeechRecognitionServiceFactory createDataClient:(recoMode)
                                                              withLanguage:(language)
                                                                   withKey:(primaryOrSecondaryKey)
                                                              withProtocol:(self)];
        }
        else {
            DataRecognitionClientWithIntent* dataIntentClient;
            dataIntentClient = [SpeechRecognitionServiceFactory createDataClientWithIntent:(language)
                                                                                   withKey:(primaryOrSecondaryKey)
                                                                             withLUISAppID:(luisAppID)
                                                                            withLUISSecret:(luisSubscriptionID)
                                                                              withProtocol:(self)];
            dataClient = dataIntentClient;
        }
    }
}

```

The client library provides pre-implemented recognition client classes for typical scenarios in speech recognition:

* `DataRecognitionClient`: Speech recognition with PCM data (for example, from a file or audio source). The data is broken up into buffers, and each buffer is sent to Speech Service. No modification is done to the buffers, so users can apply their own silence detection, if desired. If the data is provided from WAV files, you can send data from the file right to the server. If you have raw data, for example, audio coming over Bluetooth, you first send a format header to the server followed by the data.
* `MicrophoneRecognitionClient`: Speech recognition with audio coming from the microphone. Make sure the microphone is turned on and that data from the microphone is sent to the speech recognition service. A built-in "Silence Detector" is applied to the microphone data before it's sent to the recognition service.
* `DataRecognitionClientWithIntent` and `MicrophoneRecognitionClientWithIntent`: In addition to recognition text, these clients return structured information about the intent of the speaker, which your applications can use to drive further actions. To use "Intent," you need to first train a model by using [LUIS](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/).

### Recognition language

When you use `SpeechRecognitionServiceFactory` to create the client, you must select a language. For the complete list of languages supported by Speech Service, see [Supported languages](../API-Reference-REST/supportedlanguages.md).

### SpeechRecognitionMode

You also need to specify `SpeechRecognitionMode` when you create the client with `SpeechRecognitionServiceFactory`:

* `SpeechRecognitionMode_ShortPhrase`: An utterance up to 15 seconds long. As data is sent to the service, the client receives multiple partial results and one final result with multiple n-best choices.
* `SpeechRecognitionMode_LongDictation`: An utterance up to two minutes long. As data is sent to the service, the client receives multiple partial results and multiple final results, based on where the server identifies sentence pauses.

### Attach event handlers

You can attach various event handlers to the client you created:

* **Partial Results events**: This event gets called every time that Speech Service predicts what you might be saying, even before you finish speaking (if you use `MicrophoneRecognitionClient`) or finish sending data (if you use `DataRecognitionClient`).
* **Error events**: Called when the service detects an error.
* **Intent events**: Called on "WithIntent" clients (only in ShortPhrase mode) after the final recognition result is parsed into a structured JSON intent.
* **Result events**:
  * In `SpeechRecognitionMode_ShortPhrase` mode, this event is called and returns n-best results after you finish speaking.
  * In `SpeechRecognitionMode_LongDictation` mode, the event handler is called multiple times, based on where the service identifies sentence pauses.
  * **For each of the n-best choices**, a confidence value and a few different forms of the recognized text are returned. For more information, see [Output format](../Concepts.md#output-format).

## Related topics

* [Client library reference for iOS](https://cdn.rawgit.com/Microsoft/Cognitive-Speech-STT-iOS/master/com.Microsoft.SpeechSDK-1_0-for-iOS.docset/Contents/Resources/Documents/index.html)
* [Get started with Microsoft speech recognition and/or Intent in Java on Android](GetStartedJavaAndroid.md)
* [Get started with the Microsoft Speech API in JavaScript](GetStartedJSWebsockets.md)
* [Get started with the Microsoft Speech API via REST](GetStartedREST.md)
