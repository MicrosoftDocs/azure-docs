---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2020
ms.author: eur
---

One of the core features of the Speech service is the ability to recognize and transcribe human speech (often referred to as speech-to-text). In this quickstart, you learn how to use the Speech SDK in your apps and products to perform high-quality speech-to-text conversion.

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [Python quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/python) on GitHub.

## Prerequisites

This article assumes:

* You have an Azure account and Speech service subscription. If you don't have and account and subscription -- [Try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Install the Speech SDK

[!INCLUDE [Get the Speech SDK include](../../get-speech-sdk-python.md)]

## Create a speech configuration

To call the Speech service with the Speech SDK, create a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig). This class includes information about your subscription, like your speech key and associated location/region, endpoint, host, or authorization token. Create a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) with your speech key and location/region. See the [Find keys and location/region](../../../overview.md#find-keys-and-locationregion) page to find your speech key-location/region pair.

```Python
speech_config = speechsdk.SpeechConfig(subscription="<paste-your-speech-key-here>", region="<paste-your-speech-location/region-here>")
```

There are a few other ways that you can initialize a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig):

* With an endpoint: pass in a Speech service endpoint. A speech key or authorization token is optional.
* With a host: pass in a host address. A speech key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

## Recognize from microphone

To recognize speech using your device microphone, create a `SpeechRecognizer` without passing an `AudioConfig`, and pass your `speech_config`.

```Python
import azure.cognitiveservices.speech as speechsdk

def from_mic():
    speech_config = speechsdk.SpeechConfig(subscription="<paste-your-speech-key-here>", region="<paste-your-speech-location/region-here>")
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)
    
    print("Speak into your microphone.")
    result = speech_recognizer.recognize_once_async().get()
    print(result.text)

from_mic()
```

If you want to use a *specific* audio input device, you specify the device ID in an `AudioConfig`, and pass it to the `SpeechRecognizer` constructor's `audio_config` param. Learn [how to get the device ID](../../../how-to-select-audio-input-devices.md) for your audio input device.

## Recognize from file

If you want to recognize speech from an audio file instead of using a microphone, create an [`AudioConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audioconfig) and use the `filename` parameter.

```Python
import azure.cognitiveservices.speech as speechsdk

def from_file():
    speech_config = speechsdk.SpeechConfig(subscription="<paste-your-speech-key-here>", region="<paste-your-speech-location/region-here>")
    audio_input = speechsdk.AudioConfig(filename="your_file_name.wav")
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)
    
    result = speech_recognizer.recognize_once_async().get()
    print(result.text)

from_file()
```

## Error handling

The previous examples simply get the recognized text from `result.text`, but to handle errors and other responses, you'll write some code to handle the result. The following code evaluates the [`result.reason`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.resultreason) property and:

* Prints the recognition result: `speechsdk.ResultReason.RecognizedSpeech`
* If there is no recognition match, inform the user: `speechsdk.ResultReason.NoMatch`
* If an error is encountered, print the error message: `speechsdk.ResultReason.Canceled`

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

## Continuous recognition

The previous examples use at-start recognition, which recognizes a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.

In contrast, continuous recognition is used when you want to **control** when to stop recognizing. It requires you to connect to the `EventSignal` to get the recognition results, and to stop recognition, you must call [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition--) or [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition-async--). Here's an example of how continuous recognition is performed on an audio input file.

Let's start by defining the input and initializing a [`SpeechRecognizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer):

```Python
audio_config = speechsdk.audio.AudioConfig(filename=weatherfilename)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
```

Next, let's create a variable to manage the state of speech recognition. To start, set this to `False`, since at the start of recognition you can assume that it's not finished.

```Python
done = False
```

Now, we're going to create a callback to stop continuous recognition when an `evt` is received. There's a few things to keep in mind.

* When an `evt` is received, the `evt` message is printed.
* After an `evt` is received, [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition--) is called to stop recognition.
* The recognition state is changed to `True`.

```Python
def stop_cb(evt):
    print('CLOSING on {}'.format(evt))
    speech_recognizer.stop_continuous_recognition()
    nonlocal done
    done = True
```

This code sample shows how to connect callbacks to events sent from the [`SpeechRecognizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#start-continuous-recognition--).

* [`recognizing`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#recognizing): Signal for events containing intermediate recognition results.
* [`recognized`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#recognized): Signal for events containing final recognition results (indicates a successful recognition attempt).
* [`session_started`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#session-started): Signal for events indicating the start of a recognition session (operation).
* [`session_stopped`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#session-stopped): Signal for events indicating the end of a recognition session (operation).
* [`canceled`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#canceled): Signal for events containing canceled recognition results (indicates a recognition attempt that was canceled as a result or a direct cancellation request or, alternatively, a transport or protocol failure).

```Python
speech_recognizer.recognizing.connect(lambda evt: print('RECOGNIZING: {}'.format(evt)))
speech_recognizer.recognized.connect(lambda evt: print('RECOGNIZED: {}'.format(evt)))
speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))

speech_recognizer.session_stopped.connect(stop_cb)
speech_recognizer.canceled.connect(stop_cb)
```

With everything set up, call [start_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#session-stopped).

```Python
speech_recognizer.start_continuous_recognition()
while not done:
    time.sleep(.5)
```

### Dictation mode

When using continuous recognition, you can enable dictation processing by using the corresponding "enable dictation" function. This mode causes the speech config instance to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

To enable dictation mode, use the [`enable_dictation()`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig#enable-dictation--) method on your [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig).

```Python 
SpeechConfig.enable_dictation()
```

## Change source language

A common task for speech recognition is specifying the input (or source) language. Let's take a look at how you would change the input language to German. In your code, find your SpeechConfig, then add this line directly below it.

```Python
speech_config.speech_recognition_language="de-DE"
```

[`speech_recognition_language`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig#speech-recognition-language) is a parameter that takes a string as an argument. You can provide any value in the list of supported [locales/languages](../../../language-support.md).

