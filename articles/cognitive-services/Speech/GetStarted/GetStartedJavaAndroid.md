---
title: Get started with the Microsoft Speech Recognition API in Java on Android | Microsoft Docs
titlesuffix: Azure Cognitive Services
description: Use the Microsoft Speech API to develop Android applications that convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/18/2018
ms.author: zhouwang
---

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-bing-speech-api-deprecation-note.md)]

# Quickstart: Use the Bing Speech recognition API in Java on Android

With the Bing Speech Recognition API, you can develop Android applications that use the cloud-based Bing Speech Service to convert spoken audio to text. The API supports real-time streaming, so your application can simultaneously and asynchronously receive partial recognition results at the same time it's sending audio to the service.

This article uses a sample application to demonstrate how to use the Speech client library for Android to develop speech-to-text applications in Java for Android devices.

## Prerequisites

### Platform requirements

The sample is developed by [Android Studio](http://developer.android.com/sdk/index.html) for Windows in Java.

### Get the client library and sample application

The Speech client library and samples for Android are available in the [Speech client SDK for Android](https://github.com/microsoft/cognitive-speech-stt-android). You can find the buildable sample under the samples/SpeechRecoExample directory. You can find the two libraries you need to use in your own apps in SpeechSDK/libs under the armeabi and the x86 folder. The size of the libandroid_platform.so file is 22 MB, but it's reduced to 4 MB at deployment time.

#### Subscribe to the Speech API, and get a free trial subscription key

The Speech API is part of Cognitive Services (previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, select **Get API Key** to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you can use either key.

If you want to use *recognition with intent*, you also need to sign up for the [Language Understanding Intelligent Service (LUIS)](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/).

> [!IMPORTANT]
>* Get a subscription key. Before you can use Speech client libraries, you must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/).
>
>* Use your subscription key. With the provided Android sample application, update the file samples/SpeechRecoExample/res/values/strings.xml with your subscription keys. For more information, see [Build and run samples](#build-and-run-samples).

## Use the Speech client library

To use the client library in your application, follow the [instructions](https://github.com/microsoft/cognitive-speech-stt-android#the-client-library).

You can find the client library reference for Android in the docs folder of the [Speech client SDK for Android](https://github.com/microsoft/cognitive-speech-stt-android).

## Build and run samples

To learn how to build and run samples, see this [README page](https://github.com/microsoft/cognitive-speech-stt-android#the-sample).

## Samples explained

### Create recognition clients

The code in the following sample shows how to create recognition client classes based on user scenarios:

```java
void initializeRecoClient()
    {
        String language = "en-us";

        String subscriptionKey = this.getString(R.string.subscription_key);
        String luisAppID = this.getString(R.string.luisAppID);
        String luisSubscriptionID = this.getString(R.string.luisSubscriptionID);

        if (m_isMicrophoneReco && null == m_micClient) {
            if (!m_isIntent) {
                m_micClient = SpeechRecognitionServiceFactory.createMicrophoneClient(this,
                                                                                     m_recoMode,
                                                                                     language,
                                                                                     this,
                                                                                     subscriptionKey);
            }
            else {
                MicrophoneRecognitionClientWithIntent intentMicClient;
                intentMicClient = SpeechRecognitionServiceFactory.createMicrophoneClientWithIntent(this,
                                                                                                   language,
                                                                                                   this,
                                                                                                   subscriptionKey,
                                                                                                   luisAppID,
                                                                                                   luisSubscriptionID);
                m_micClient = intentMicClient;

            }
        }
        else if (!m_isMicrophoneReco && null == m_dataClient) {
            if (!m_isIntent) {
                m_dataClient = SpeechRecognitionServiceFactory.createDataClient(this,
                                                                                m_recoMode,
                                                                                language,
                                                                                this,
                                                                                subscriptionKey);
            }
            else {
                DataRecognitionClientWithIntent intentDataClient;
                intentDataClient = SpeechRecognitionServiceFactory.createDataClientWithIntent(this,
                                                                                              language,
                                                                                              this,
                                                                                              subscriptionKey,
                                                                                              luisAppID,
                                                                                              luisSubscriptionID);
                m_dataClient = intentDataClient;
            }
        }
    }

```

The client library provides pre-implemented recognition client classes for typical scenarios in speech recognition:

* `DataRecognitionClient`: Speech recognition with PCM data (for example, from a file or audio source). The data is broken up into buffers, and each buffer is sent to Speech Service. No modification is done to the buffers, so the user can apply their own silence detection if desired. If the data is provided from WAV files, you can send data from the file right to Speech Service. If you have raw data, for example, audio coming over Bluetooth, you first send a format header to Speech Service followed by the data.
* `MicrophoneRecognitionClient`: Speech recognition with audio coming from the microphone. Make sure the microphone is turned on and the data from the microphone is sent to the speech recognition service. A built-in "Silence Detector" is applied to the microphone data before it's sent to the recognition service.
* `DataRecognitionClientWithIntent` and `MicrophoneRecognitionClientWithIntent`: These clients return, in addition to recognition text, structured information about the intent of the speaker, which can be used to drive further actions by your applications. To use "Intent," you need to first train a model by using [LUIS](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/).

### Recognition language

When you use `SpeechRecognitionServiceFactory` to create the client, you must select a language. For the complete list of languages supported by Speech Service, see [Supported languages](../API-Reference-REST/supportedlanguages.md).

### `SpeechRecognitionMode`

You also need to specify `SpeechRecognitionMode` when you create the client with `SpeechRecognitionServiceFactory`:

* `ShortPhrase`: An utterance up to 15 seconds long. As data is sent to the service, the client receives multiple partial results and one final result with multiple n-best choices.
* `LongDictation`: An utterance up to two minutes long. As data is sent to the service, the client receives multiple partial results and multiple final results, based on where the service identifies sentence pauses.

### Attach event handlers

You can attach various event handlers to the client you created:

* **Partial Results events**: This event gets called every time Speech Service predicts what you might be saying, even before you finish speaking (if you use `MicrophoneRecognitionClient`) or finish sending data (if you use `DataRecognitionClient`).
* **Error events**: Called when the service detects an error.
* **Intent events**: Called on "WithIntent" clients (only in `ShortPhrase` mode) after the final recognition result is parsed into a structured JSON intent.
* **Result events**:
  * In `ShortPhrase` mode, this event is called and returns n-best results after you finish speaking.
  * In `LongDictation` mode, the event handler is called multiple times, based on where the service identifies sentence pauses.
  * **For each of the n-best choices**, a confidence value and a few different forms of the recognized text are returned. For more information, see [Output format](../Concepts.md#output-format).

## Related topics

* [Client library reference for Android](https://github.com/Azure-Samples/Cognitive-Speech-STT-Android/tree/master/docs)
* [Get started with the Microsoft Speech API in C# for Windows in .NET](GetStartedCSharpDesktop.md)
* [Get started with the Microsoft Speech API in Objective-C on iOS](Get-Started-ObjectiveC-iOS.md)
* [Get started with the Microsoft Speech API in JavaScript](GetStartedJSWebsockets.md)
* [Get started with the Microsoft Speech API via REST](GetStartedREST.md)
