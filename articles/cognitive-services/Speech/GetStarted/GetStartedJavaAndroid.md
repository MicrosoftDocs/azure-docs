---
title: Get Started with Microsoft Speech Recognition API in Java on Android | Microsoft Docs
description: Use Microsoft Speech API to develop Android applications that convert spoken audio to text.
services: cognitive-services
author: zhouwangzw
manager: wolfma

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 09/29/2017
ms.author: zhouwang
---
# Get started with Microsoft speech recognition in Java on Android

With Microsoft speech recognition API, you can develop iOS applications that use Microsoft cloud-based Speech Service to convert spoken audio to text. The API supports real-time streaming, so your application can simultaneously and asynchronously receive partial recognition results at the same time it is sending audio to the service.

This article uses a sample application to demonstrate how to use the Microsoft speech client library for Android to develop speech to text applications in Java for Android devices.

## Prerequisites

### Platform requirements

The sample is developed by [Android Studio](http://developer.android.com/sdk/index.html) for Windows in Java.

### Get the client library and sample application

The Microsoft speech client library and samples for Android is available on [Speech Client SDK for Android](https://github.com/microsoft/cognitive-speech-stt-android). The buildable sample can be found under the `samples/SpeechRecoExample` directory. The two libraries you need to use in your own apps can be found in `SpeechSDK/libs` under the `armeabi` and the `x86` folder. The size of `libandroid_platform.so` file is 22 MB but gets reduced to 4 MB at deploy time.

#### Subscribe to Speech API and get a free trial subscription key

Microsoft Speech API is part of Microsoft Cognitive Services on Azure(previously Project Oxford). You can get free trial subscription keys from the [Cognitive Services Subscription](https://azure.microsoft.com/try/cognitive-services/) page. After you select the Speech API, click Get API Key to get the key. It returns a primary and secondary key. Both keys are tied to the same quota, so you may use either key.

If you want to use *Recognition with intent*, you also need to sign up to the [Language Understanding Intelligent Service (LUIS)](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/).

> [!IMPORTANT]
> **Get a subscription key**
>
> You must have a [subscription key](https://azure.microsoft.com/try/cognitive-services/) before using speech client libraries.
>
> **Use your subscription key**
>
>  With the provided Android sample application, you need to update the file samples/SpeechRecoExample/res/values/strings.xml with your subscription keys. See more information below: [Build and run samples](#build-and-run-samples).

## Use speech client library

Follow the [instructions](https://github.com/microsoft/cognitive-speech-stt-android#the-client-library) to use the client library in your application.

The Client Library Reference for iOS can be found in the `docs` folder of the [Speech Client SDK for Android](https://github.com/microsoft/cognitive-speech-stt-android).

## Build and run samples

This [README page](https://github.com/microsoft/cognitive-speech-stt-android#the-sample) describes how to build and run samples.

## Samples explained

### Create recognition clients

The following code in the sample shows how to create recognition client classes based on user scenarios.

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

The client library provides pre-implemented recognition client classes for typical scenarios in speech recognition.

* `DataRecognitionClient`: speech recognition with PCM data (for example from a file or audio source). The data is broken up into buffers and each buffer is sent to the Speech Service. No modification is done to the buffers, so the user can apply their own Silence Detection if desired. If the data is provided from wave files, you can send data from the file right to the Speech Service. If you have raw data, for example audio coming over Bluetooth, then you first send a format header to the Speech Service followed by the data.

* `MicrophoneRecognitionClient`: speech recognition with audio coming from the microphone. Make sure the microphone is turned on and data from the microphone is sent to the speech recognition service. A built-in "Silence Detector" is applied to the microphone data before it is sent to the recognition service.

* `DataRecognitionClientWithIntent` and `MicrophoneRecognitionClientWithIntent`: these clients return, in addition to recognition text, structured information about the intent of the speaker, which could be used drive further actions by your applications. To use Intent, you need to first train a model using [LUIS](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/).

### Recognition language

When you use the `SpeechRecognitionServiceFactory` to create the Client, you must select a language. The complete list of languages supported by the Speech Service can be found in the page [Supported Languages](../API-Reference-REST/supportedlanguages.md).

### `SpeechRecognitionMode`

You also need to specify `SpeechRecognitionMode` when creating the Client with `SpeechRecognitionServiceFactory`.

* `ShortPhrase`: An utterance up to 15 seconds long. As data is sent to the service, the client receives multiple partial results and one final result with multiple n-best choices.

* `LongDictation`: An utterance up to 2 minutes long. As data is sent to the service, the client receives multiple partial results and multiple final results, based on where the service identifies sentence pauses.

### Attach event handlers

You can attach various event handlers to the client you created.

* **Partial Results Events:** This event gets called every time when the Speech Service predicts what you might be saying - even before you finish speaking (if you are using `MicrophoneRecognitionClient`) or have finished sending data (if you are using `DataRecognitionClient`).

* **Error Events:** Called when the service detects an Error.

* **Intent Events:** Called on "WithIntent" clients (only in ShortPhrase mode) after the final recognition result has been parsed into a structured JSON intent.

* **Result Events:**
  * In `ShortPhrase` mode, this event is called and returns n-best results after you finish speaking.
  * In `LongDictation` mode, the event handler is called multiple times, based on where the service identifies sentence pauses.
  * **For each of the n-best choices**, a confidence value and a few different forms of the recognized text are returned. For more information, see the [output format](../Concepts.md#output-format) page.

## Related topics

* [Client Library Reference for Android](https://github.com/Azure-Samples/Cognitive-Speech-STT-Android/tree/master/docs)
* [Get Started with Microsoft Speech API in C# for Windows in .NET](GetStartedCSharpDesktop.md)
* [Get Started with Microsoft Speech API in Objective C on iOS](Get-Started-ObjectiveC-iOS.md)
* [Get started with Microsoft Speech API in JavaScript](GetStartedJSWebsockets.md)
* [Get started with Microsoft Speech API via REST](GetStartedREST.md)
