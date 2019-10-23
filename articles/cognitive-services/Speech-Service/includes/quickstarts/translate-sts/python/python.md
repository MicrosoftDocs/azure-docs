---
title: 'Quickstart: Recognize speech, Python - Speech Service'
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: chlandsi
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: chlandsi
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Create an Azure Speech Resource](../../../../get-started.md)
> * [Setup your development environment](../../../../quickstarts/setup-platform.md?tabs=python)
> * [Create an empty sample project](../../../../quickstarts/create-project.md?tabs=python)

## Add sample code

1. Open `quickstart.py`, and replace all the code in it with the following.

    ````python
    try:
        import azure.cognitiveservices.speech as speechsdk
    except ImportError:
        print("""
        Importing the Speech SDK for Python failed.
        Refer to https://aka.ms/speech/setup-development-python for installation instructions.
        """)
        import sys
        sys.exit(1)

    # Set up the subscription info for the Speech Service:
    # Replace with your own subscription key and service region (e.g., "westus").
    speech_key, service_region = "YourSubscriptionKey", "YourServiceRegion"

    def translation_once_from_mic():
        """performs one-shot speech translation from input from an audio file"""
        # <TranslationOnceWithMic>
        # set up translation parameters: source language and target languages
        translation_config = speechsdk.translation.SpeechTranslationConfig(
            subscription=speech_key, region=service_region,
            speech_recognition_language='en-US',
            target_languages=('de', 'fr', 'zh-Hans'))
        audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)

        # Creates a translation recognizer using and audio file as input.
        recognizer = speechsdk.translation.TranslationRecognizer(
            translation_config=translation_config, audio_config=audio_config)

        # Starts translation, and returns after a single utterance is recognized. The end of a
        # single utterance is determined by listening for silence at the end or until a maximum of 15
        # seconds of audio is processed. It returns the recognized text as well as the translation.
        # Note: Since recognize_once() returns only a single utterance, it is suitable only for single
        # shot recognition like command or query.
        # For long-running multi-utterance recognition, use start_continuous_recognition() instead.
        result = recognizer.recognize_once()

        # Check the result
        if result.reason == speechsdk.ResultReason.TranslatedSpeech:
            print("""Recognized: {}
            German translation: {}
            French translation: {}
            Chinese translation: {}""".format(
                result.text, result.translations['de'],
                result.translations['fr'],
                result.translations['zh-Hans'],))
        elif result.reason == speechsdk.ResultReason.RecognizedSpeech:
            print("Recognized: {}".format(result.text))
        elif result.reason == speechsdk.ResultReason.NoMatch:
            print("No speech could be recognized: {}".format(result.no_match_details))
        elif result.reason == speechsdk.ResultReason.Canceled:
            print("Translation canceled: {}".format(result.cancellation_details.reason))
            if result.cancellation_details.reason == speechsdk.CancellationReason.Error:
                print("Error details: {}".format(result.cancellation_details.error_details))
    ````

1. In the same file, replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](../../../../regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save the changes you've made to `quickstart.py`.

## Build and run your app

Run the sample from the console or in your IDE:

    ```
    python quickstart.py
    ```

1. Speak an English phrase or sentence. The application transmits your speech to the Speech Services, which translates and transcribes to text (in this case, to German). The Speech Services then sends the text back to the application for display.

    ````
    Say something...
    RECOGNIZED 'en-US': What's the weather in Seattle?
    TRANSLATED into 'de': Wie ist das Wetter in Seattle?
    ````

## Next steps

> [!div class="nextstepaction"]
> [Explore Python samples on GitHub](https://aka.ms/csspeech/samples)
