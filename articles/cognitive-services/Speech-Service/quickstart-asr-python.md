---
title: 'Quickstart: Recognize speech in Python using the Speech Service SDK'
titleSuffix: Azure Cognitive Services
description: Learn how to recognize speech in Python using the Speech Service SDK
services: cognitive-services
author: chlandsi
manager: wolfma

ms.service: cognitive-services
ms.component: speech-service
ms.topic: quickstart
ms.date: 12/17/2018
ms.author: chlandsi
---

# Quickstart: Using the Speech Service from Python

This document shows how to use the Speech Service through its python API. It illustrates how the SDK can be used to recognize speech from microphone input or from a file.

## Prerequisites

Before you get started, here's a list of prerequisites:

* A [subscription key](get-started.md) for the Speech Service
* Python 3.5 or later needs to be installed

## Get the Speech SDK Python Package

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

The current version of the Cognitive Services Speech SDK is `1.2.0`.

Then, the Cognitive Services Speech SDK can be installed as a Python package from pyPI using this command

    pip install azure-cognitiveservices-speech

## Create a Python application using the SDK

You can either copy the code from this quickstart to a source file `csspeech.py` and run them in your IDE or in the console

    python cssppech.py

or you can download this quickstart tutorial as a [jupyter](http://jupyter.org) notebook from the [Cognitive Services Speech samples repository](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/python/) and run it as a notebook.

First, setup some general items. Import the Speech SDK python module and some additional modules:


```python
import azure.cognitiveservices.speech as csspeech
import time
import wave
import os
```

Setup the subscription info for the Speech Service:


```python
speech_key, service_region = "YourSubscriptionKey", "YourServiceRegion"
```

To demonstrate how to recognize speech from an audio file, either use a file of your own or [our sample](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-speech-sdk/f9807b1079f3a85f07cbb6d762c6b5449d536027/samples/cpp/windows/console/samples/whatstheweatherlike.wav).
The supported format is single-channel (mono) WAV / PCM with a sampling rate of 16 kHz.
Put the file alongside the source file and specify the path:


```python
weatherfilename = "whatstheweatherlike.wav"
```

## Speech Recognition

### One Shot Speech Recognition from Microphone

The following code snippet shows how speech can be recognized from audio input from the default microphone (make sure the audio settings are correct), and how to interpret the results.


```python
speech_config = csspeech.SpeechConfig(subscription=speech_key, region=service_region)
speech_recognizer = csspeech.SpeechRecognizer(speech_config=speech_config)

result = speech_recognizer.recognize_once()

if result.reason == csspeech.ResultReason.RecognizedSpeech:
    print("Recognized: {}".format(result.text))
elif result.reason == csspeech.ResultReason.NoMatch:
    print("No speech could be recognized")
elif result.reason == csspeech.ResultReason.Canceled:
    cancellation_details = result.cancellation_details
    print("Speech Recognition canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == csspeech.CancellationReason.Error:
        print("Error details: {}".format(cancellation_details.error_details))
```

### One Shot Speech Recognition from File

The following code snippet shows how speech can be recognized with audio input from an audio file.

```python
speech_config = csspeech.SpeechConfig(subscription=speech_key, region=service_region)
speech_recognizer = csspeech.SpeechRecognizer(speech_config=speech_config)

result = speech_recognizer.recognize_once()

if result.reason == csspeech.ResultReason.RecognizedSpeech:
    print("Recognized: {}".format(result.text))
elif result.reason == csspeech.ResultReason.NoMatch:
    print("No speech could be recognized")
elif result.reason == csspeech.ResultReason.Canceled:
    cancellation_details = result.cancellation_details
    print("Speech Recognition canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == csspeech.CancellationReason.Error:
        print("Error details: {}".format(cancellation_details.error_details))
```

## Next steps

> [!div class="nextstepaction"]
> [Get our samples](speech-sdk.md#get-the-samples)

