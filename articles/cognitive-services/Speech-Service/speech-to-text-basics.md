---
title: "Speech recognition basics - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech SDK to convert speech-to-text. In this article, you'll learn about object construction, supported audio input formats, and configuration options for speech recognition.
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

* You have an Azure account and Speech service subscription. If you don't have and account and subscription -- [Try the Speech service for free](get-started.md).

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

## Initialize a recognizer

After you've created a [`SpeechConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python), the next step is to initialize a [`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python). When you initialize a [`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python), you'll need to pass it your `speech_config`. This ensures that the credentials that the service requires to validate your request are provided.

If you're recognizing speech using your device's default microphone, here's what the [`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python) should look like:

```Python
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)
```

If you want to specify the audio input device, then you'll need to create an [`AudioConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audioconfig?view=azure-python) and  provide the `audio_config` parameter when initializing your [`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python).

> [!TIP]
> [Learn how to get the device ID for your audio input device](how-to-select-audio-input-devices.md).

```Python
audio_config = AudioConfig(device_name="<device id>");
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
```

If you don't want to use a microphone, and want to provide an audio file, you'll still need to provide an `audio_config`. However, when you create an [`AudioConfig`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audioconfig?view=azure-python), instead of providing the `device_name`, you'll use the `filename` parameter.

```Python
audio_filename = "whatstheweatherlike.wav"
audio_input = speechsdk.AudioConfig(filename=audio_filename)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)
```

## Recognize speech

The [Recognizer class](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python) for the Speech SDK for Python exposes a few methods that you can use for speech recognition.

* Single-shot recognition (sync) - Performs recognition in a blocking (synchronous) mode. Returns after a single utterance is recognized. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed. The task returns the recognition text as result.
* Single-shot recognition (async) - Performs recognition in a non-blocking (asynchronous) mode. This will recognize a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.
* Continuous recognition (sync) - Synchronously initiates continuous recognition. The client must connect to `EventSignal` to receive recognition results. To stop recognition, call [stop_continuous_recognition()](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#stop-continuous-recognition--).
* Continuous recognition (async) - Asynchronously initiates continuous recognition operation. User has to connect to EventSignal to receive recognition results. To stop asynchronous continuous recognition, call [stop_continuous_recognition_async()](To stop recognition, call [stop_continuous_recognition()](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#stop-continuous-recognition-async--).

> [!NOTE]
> Learn more about how to [choose a speech recognition mode](how-to-choose-recognition-mode.md).

### Single-shot recognition

Here's an example of synchronous single-shot recognition using [`recognize_once()`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#recognize-once):

```Python
result = speech_recognizer.recognize_once()
```

Here's an example of synchronous single-shot recognition using [`recognize_once_async()`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#recognize-once-async------azure-cognitiveservices-speech-resultfuture):

```Python
result = speech_recognizer.recognize_once_async()
```

Regardless of whether you've used the synchronous or asynchronous method, you'll need to write some code to iterate through the result. This sample does a few things with the [`result.reason`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.resultreason?view=azure-python):

* Prints the recognition result: `speechsdk.ResultReason.RecognizedSpeech`
* If there is no recognition match, informs the user: `speechsdk.ResultReason.NoMatch `
* If an error is encountered, prints the error message: `speechsdk.ResultReason.Canceled`

```Python
if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print("Recognized: {}".format(result.text))
elif result.reason == speechsdk.ResultReason.NoMatch:
    print("No speech could be recognized: {}".format(result.no_match_details))
elif result.reason == speechsdk.ResultReason.Canceled:
    cancellation_details = result.cancellation_details
    print("Speech Recognition canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == speechsdk.CancellationReason.Error:
        print("Error details: {}".format(cancellation_details.error_details))
```

### Continuous recognition

Continuous recognition is a bit more involved than single-shot recognition. It requires you to connect to the `EventSignal` to get the recognition results, and in to stop recognition, you must call [stop_continuous_recognition()](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#stop-continuous-recognition--) or [stop_continuous_recognition_async()](To stop recognition, call [stop_continuous_recognition()](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#stop-continuous-recognition-async--). Here's an example of how continuous recognition is performed on an audio input file.

Let's start by defining the input and initializing a [`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer?view=azure-python):

```Python
audio_config = speechsdk.audio.AudioConfig(filename=weatherfilename)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
```

Next, let's create a variable to manage the state of speech recognition. To start, we'll set this to `False`, since at the start of recognition we can safely assume that it's not finished.

```Python
done = False
```

Now, we're going to create a callback to stop continuous recognition when an `evt` is received. There's a few things to keep in mind.

* When an `evt` is received, the `evt` message is printed.
* After an `evt` is received, [stop_continuous_recognition()](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#stop-continuous-recognition--) is called to stop recognition.
* The recognition state is changed to `True`.

```Python
def stop_cb(evt):
    print('CLOSING on {}'.format(evt))
    speech_recognizer.stop_continuous_recognition()
    nonlocal done
    done = True
```

This code sample shows how to connect callbacks to events sent from the [`SpeechRecognizer`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#start-continuous-recognition--).

* [`recognizing`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#recognizing): Signal for events containing intermediate recognition results.
* [`recognized`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#recognized): Signal for events containing final recognition results (indicating a successful recognition attempt).
* [`session_started`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#session-started): Signal for events indicating the start of a recognition session (operation).
* [`session_stopped`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#session-stopped): Signal for events indicating the end of a recognition session (operation).
* [`canceled`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#canceled): Signal for events containing canceled recognition results (indicating a recognition attempt that was canceled as a result or a direct cancellation request or, alternatively, a transport or protocol failure).

```Python
speech_recognizer.recognizing.connect(lambda evt: print('RECOGNIZING: {}'.format(evt)))
speech_recognizer.recognized.connect(lambda evt: print('RECOGNIZED: {}'.format(evt)))
speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))

speech_recognizer.session_stopped.connect(stop_cb)
speech_recognizer.canceled.connect(stop_cb)
```

With everything set up, we can call [start_continuous_recognition()](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer?view=azure-python#session-stopped).

```Python
speech_recognizer.start_continuous_recognition()
while not done:
    time.sleep(.5)
```

## Change source language for recognition

A common task for speech recognition is specifying the input (or source) language. Let's take a look at how you would change the input language to German. In your code, find your SpeechConfig, then add this line directly below it.

```Python
speech_config.speech_recognition_language="de-DE"
```

[`speech_recognition_language`](https://docs.microsoft.com/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig?view=azure-python#speech-recognition-language) is a parameter that takes a string as an argument. You can provide any value in the list of supported [locales/languages](language-support.md).

## Next steps

* [Improve speech recognition accuracy with Phrase Lists](how-to-phrase-lists.md)
* [Use codec compressed audio formats](how-to-use-codec-compressed-audio-input-streams.md)
