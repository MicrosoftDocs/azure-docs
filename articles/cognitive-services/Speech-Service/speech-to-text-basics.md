---
title: "Speech recognition basics - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech SDK to convert speech-to-text. In this article, you'll learn about object construction, supported audio input formats, and configuration options for speech recognition...
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 02/10/2020
ms.author: erhopf
---

# Learn the basics of speech recognition

One of the core features of the Speech service is the ability to recognize and transcribe human speech (often referred to as speech to text). In this article, you'll learn how to use the Speech SDK in your apps and products to perform high quality speech recognition.

> [!TIP]
> If you haven't had a chance to complete one of our quickstarts, we encourage you to kick the tires and try speech recognition out for yourself.
> * [Recognize speech from a microphone](quickstarts/speech-to-text-from-microphone.md)

## Prerequisites

This article assumes:

* You have an Azure account and Speech service subscription. If you don't have and account and subscription -- [Try the Speech service for free](get-started).

## Install and import the Speech SDK

Before you can do anything, you'll need to install the Speech SDK.

```Python
pip install azure-cognitiveservices-speech
```

If you're on macOS and run into install issues, you may need to run this command first.

```Python
python3 -m pip install --upgrade pip
```

After the Speech SDK is installed, import it into your Python project with this statement.

```Python
import azure.cognitiveservices.speech as speechsdk
```

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

There are a few ways that you can initialize a [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python):

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token are optional.
* With a host: pass in a host address. A key or authorization token are optional.
* With an authorization token: pass in an authorization token and the associated region.

Let's take a look at how a [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python) is created using a key and region.

```Python
speech_key, service_region = "YourSubscriptionKey", "YourServiceRegion"
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
```

## Create a recognizer

[`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python)

When you initialize a [`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python), you'll need to pass it your `speech_config`. This ensures that the credentials that the service requires to validate your request are provided.

```Python
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)
```

Additionally, you can specify the audio input device that's used to recognize speech.

> [!TIP]
> [Learn how to get the device ID for your audio input device.](how-to-select-audio-input-devices.md)

```Python
audio_config = AudioConfig(device_name="<device id>");
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
```
