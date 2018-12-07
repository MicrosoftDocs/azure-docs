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

This document shows how to use the Speech Service through its Python API. It illustrates how the SDK can be used to recognize speech from microphone input.

## Prerequisites

Before you get started, here's a list of prerequisites:

* A [subscription key](get-started.md) for the Speech Service
* Python 3.5 or later needs to be installed
* The Python package is available for Windows(x64), Mac (macOS X version 10.12 or later) and Linux (x64)

## Get the Speech SDK Python Package

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

The Cognitive Services Speech SDK Python package can be installed from [pyPI](https://pypi.org/project/azure-cognitiveservices-speech/) using this command:

    pip install azure-cognitiveservices-speech

The current version of the Cognitive Services Speech SDK is `1.2.0`.

## Create a Python application using the SDK

You can either copy the code from this quickstart to a source file `speech.py` and run it in your IDE or in the console

    python speech.py

or you can download this quickstart tutorial as a [Jupyter](https://jupyter.org) notebook from the [Cognitive Services Speech samples repository](https://github.com/Azure-Samples/cognitive-services-speech-sdk/) and run it as a notebook.

```python
import azure.cognitiveservices.speech as speechsdk

speech_key, service_region = "YourSubscriptionKey", "YourServiceRegion"

speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)

result = speech_recognizer.recognize_once()

if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print("Recognized: {}".format(result.text))
elif result.reason == speechsdk.ResultReason.NoMatch:
    print("No speech could be recognized")
elif result.reason == speechsdk.ResultReason.Canceled:
    cancellation_details = result.cancellation_details
    print("Speech Recognition canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == speechsdk.CancellationReason.Error:
        print("Error details: {}".format(cancellation_details.error_details))
```

## Support

If you have a problem or are missing a feature, please have a look at our [support page](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/support).

## Next steps

> [!div class="nextstepaction"]
> [Get our samples](speech-sdk.md#get-the-samples)

