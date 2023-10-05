---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/01/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/python.md)]

[!INCLUDE [Introduction](intro.md)]

## Create a speech configuration

To call the Speech service by using the Speech SDK, you need to create a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) instance. This class includes information about your subscription, like your speech key and associated location/region, endpoint, host, or authorization token. 

1. Create a `SpeechConfig` instance by using your speech key and location/region. 
1. Create a Speech resource on the [Azure portal](https://portal.azure.com). For more information, see [Create a multi-service resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal).

```Python
speech_config = speechsdk.SpeechConfig(subscription="YourSpeechKey", region="YourSpeechRegion")
```

You can initialize [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) in a few other ways:

* Use an endpoint, and pass in a Speech service endpoint. A speech key or authorization token is optional.
* Use a host, and pass in a host address. A speech key or authorization token is optional.
* Use an authorization token with the associated region/location.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you always create a configuration.

## Recognize speech from a microphone

To recognize speech by using your device microphone, create a `SpeechRecognizer` instance without passing [`AudioConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.audio.audioconfig), and then pass `speech_config`:

```Python
import azure.cognitiveservices.speech as speechsdk

def from_mic():
    speech_config = speechsdk.SpeechConfig(subscription="YourSpeechKey", region="YourSpeechRegion")
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)

    print("Speak into your microphone.")
    result = speech_recognizer.recognize_once_async().get()
    print(result.text)

from_mic()
```

If you want to use a *specific* audio input device, you need to specify the device ID in `AudioConfig`, and the pass it to the `SpeechRecognizer` constructor's `audio_config` parameter. For more information on how to get the device ID for your audio input device, see [Select an audio input device with the Speech SDK](../../../how-to-select-audio-input-devices.md)

## Recognize speech from a file

If you want to recognize speech from an audio file instead of using a microphone, create an `AudioConfig` instance and use the `filename` parameter:

```Python
import azure.cognitiveservices.speech as speechsdk

def from_file():
    speech_config = speechsdk.SpeechConfig(subscription="YourSpeechKey", region="YourSpeechRegion")
    audio_config = speechsdk.AudioConfig(filename="your_file_name.wav")
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    result = speech_recognizer.recognize_once_async().get()
    print(result.text)

from_file()
```

## Handle errors

The previous examples only get the recognized text from the `result.text` property. To handle errors and other responses, you need to write some code to handle the result. The following code evaluates the [`result.reason`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.resultreason) property and:

* Prints the recognition result: `speechsdk.ResultReason.RecognizedSpeech`.
* If there's no recognition match, it informs the user: `speechsdk.ResultReason.NoMatch`.
* If an error is encountered, it prints the error message: `speechsdk.ResultReason.Canceled`.

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
        print("Did you set the speech resource key and region values?")
```

## Use continuous recognition

The previous examples use single-shot recognition, which recognizes a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.

In contrast, you use continuous recognition when you want to control when to stop recognizing. It requires you to connect to `EventSignal` to get the recognition results. To stop recognition, you must call [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition--) or [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition-async--). Here's an example of how continuous recognition is performed on an audio input file.

Start by defining the input and initializing [`SpeechRecognizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer):

```Python
audio_config = speechsdk.audio.AudioConfig(filename=weatherfilename)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
```

Next, create a variable to manage the state of speech recognition. Set the variable to `False` because at the start of recognition, you can safely assume that it's not finished:

```Python
done = False
```

Now, create a callback to stop continuous recognition when `evt` is received. Keep these points in mind:

* When `evt` is received, the `evt` message is printed.
* After `evt` is received, [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition--) is called to stop recognition.
* The recognition state is changed to `True`.

```Python
def stop_cb(evt):
    print('CLOSING on {}'.format(evt))
    speech_recognizer.stop_continuous_recognition()
    nonlocal done
    done = True
```

The following code sample shows how to connect callbacks to events sent from [`SpeechRecognizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#start-continuous-recognition--). The events are:

* [`recognizing`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#azure-cognitiveservices-speech-recognizer-recognizing): Signal for events that contain intermediate recognition results.
* [`recognized`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#azure-cognitiveservices-speech-recognizer-recognized): Signal for events that contain final recognition results, which indicate a successful recognition attempt.
* [`session_started`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#azure-cognitiveservices-speech-recognizer-session-started): Signal for events that indicate the start of a recognition session (operation).
* [`session_stopped`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#azure-cognitiveservices-speech-recognizer-session-stopped): Signal for events that indicate the end of a recognition session (operation).
* [`canceled`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#azure-cognitiveservices-speech-recognizer-canceled): Signal for events that contain canceled recognition results. These results indicate a recognition attempt that was canceled as a result of a direct cancelation request. Alternatively, they indicate a transport or protocol failure.

```Python
speech_recognizer.recognizing.connect(lambda evt: print('RECOGNIZING: {}'.format(evt)))
speech_recognizer.recognized.connect(lambda evt: print('RECOGNIZED: {}'.format(evt)))
speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))

speech_recognizer.session_stopped.connect(stop_cb)
speech_recognizer.canceled.connect(stop_cb)
```

With everything set up, you can call [start_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#session-stopped):

```Python
speech_recognizer.start_continuous_recognition()
while not done:
    time.sleep(.5)
```

## Change the source language

A common task for speech recognition is specifying the input (or source) language. The following example shows how to change the input language to German. In your code, find your `SpeechConfig` instance and add this line directly below it:

```Python
speech_config.speech_recognition_language="de-DE"
```

[`speech_recognition_language`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig#speech-recognition-language) is a parameter that takes a string as an argument. For more information, see the [list of supported speech to text locales](../../../language-support.md?tabs=stt).

## Language identification

You can use [language identification](../../../language-identification.md?pivots=programming-language-python#speech-to-text) with Speech to text recognition when you need to identify the language in an audio source and then transcribe it to text.

For a complete code sample, see [Language identification](../../../language-identification.md?pivots=programming-language-python#speech-to-text).

## Use a custom endpoint

With [Custom Speech](../../../custom-speech-overview.md), you can upload your own data, test and train a custom model, compare accuracy between models, and deploy a model to a custom endpoint. The following example shows how to set a custom endpoint.

```python
speech_config = speechsdk.SpeechConfig(subscription="YourSubscriptionKey", region="YourServiceRegion")
speech_config.endpoint_id = "YourEndpointId"
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)
```

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see [Host URLs](../../../speech-container-howto.md#host-urls) in Install and run Speech containers with Docker.

