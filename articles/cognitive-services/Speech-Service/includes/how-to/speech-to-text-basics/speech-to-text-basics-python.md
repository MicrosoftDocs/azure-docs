---
author: laujan
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2020
ms.author: lajanuar
---

One of the core features of the Speech service is the ability to recognize and transcribe human speech (often referred to as speech-to-text). In this quickstart, you learn how to use the Speech SDK in your apps and products to perform high-quality speech-to-text conversion.

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [Python quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/python) on GitHub.

## Prerequisites

This article assumes:

* You have an Azure account and Speech service subscription. If you don't have and account and subscription -- [Try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Install and import the Speech SDK

Before you can do anything, you'll need to install the Speech SDK.

```Python
pip install azure-cognitiveservices-speech
```

If you're on macOS and run into install issues, you may need to run this command first.

```Python
python3 -m pip install --upgrade pip
```

After the Speech SDK is installed, import it into your Python project.

```Python
import azure.cognitiveservices.speech as speechsdk
```

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig). This class includes information about your subscription, like your key and associated location/region, endpoint, host, or authorization token. Create a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig) using your key and location/region. See the [Find keys and location/region](../../../overview.md#find-keys-and-locationregion) page to find your key-location/region pair.

```Python
speech_config = speechsdk.SpeechConfig(subscription="<paste-your-speech-key-here>", region="<paste-your-speech-location/region-here>")
```

There are a few other ways that you can initialize a [`SpeechConfig`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechconfig):

* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

## Recognize from microphone

To recognize speech using your device microphone, simply create a `SpeechRecognizer` without passing an `AudioConfig`, and pass your `speech_config`.

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

If you want to use a *specific* audio input device, you need to specify the device ID in an `AudioConfig`, and pass it to the `SpeechRecognizer` constructor's `audio_config` param. Learn [how to get the device ID](../../../how-to-select-audio-input-devices.md) for your audio input device.

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

The previous examples simply get the recognized text from `result.text`, but to handle errors and other responses, you'll need to write some code to handle the result. The following code evaluates the [`result.reason`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.resultreason) property and:

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

The previous examples use single-shot recognition, which recognizes a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.

In contrast, continuous recognition is used when you want to **control** when to stop recognizing. It requires you to connect to the `EventSignal` to get the recognition results, and to stop recognition, you must call [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition--) or [stop_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#stop-continuous-recognition-async--). Here's an example of how continuous recognition is performed on an audio input file.

Let's start by defining the input and initializing a [`SpeechRecognizer`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.speechrecognizer):

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
* [`recognized`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#recognized): Signal for events containing final recognition results (indicating a successful recognition attempt).
* [`session_started`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#session-started): Signal for events indicating the start of a recognition session (operation).
* [`session_stopped`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#session-stopped): Signal for events indicating the end of a recognition session (operation).
* [`canceled`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#canceled): Signal for events containing canceled recognition results (indicating a recognition attempt that was canceled as a result or a direct cancellation request or, alternatively, a transport or protocol failure).

```Python
speech_recognizer.recognizing.connect(lambda evt: print('RECOGNIZING: {}'.format(evt)))
speech_recognizer.recognized.connect(lambda evt: print('RECOGNIZED: {}'.format(evt)))
speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))

speech_recognizer.session_stopped.connect(stop_cb)
speech_recognizer.canceled.connect(stop_cb)
```

With everything set up, we can call [start_continuous_recognition()](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.recognizer#session-stopped).

```Python
speech_recognizer.start_continuous_recognition()
while not done:
    time.sleep(.5)
```

### Dictation mode

When using continuous recognition, you can enable dictation processing by using the corresponding "enable dictation" function. This mode will cause the speech config instance to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

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

## Improve recognition accuracy

Phrase Lists are used to identify known phrases in audio data, like a person's name or a specific location. By providing a list of phrases, you improve the accuracy of speech recognition.

As an example, if you have a command "Move to" and a possible destination of "Ward" that may be spoken, you can add an entry of "Move to Ward". Adding a phrase will increase the probability that when the audio is recognized that "Move to Ward" will be recognized instead of "Move toward"

Single words or complete phrases can be added to a Phrase List. During recognition, an entry in a phrase list is used to boost recognition of the words and phrases in the list even when the entries appear in the middle of the utterance. 

> [!IMPORTANT]
> The Phrase List feature is available in the following languages: en-US, de-DE, en-AU, en-CA, en-GB, en-IN, es-ES, fr-FR, it-IT, ja-JP, pt-BR, zh-CN
>
> The Phrase List feature should be used with no more than a few hundred phrases. If you have a larger list or for languages that are not currently supported, [training a custom model](../../../custom-speech-overview.md) will likely be the better choice to improve accuracy.
>
> Do not use the Phrase List feature with custom endpoints. Instead, train a custom model that includes the phrases.

To use a phrase list, first create a [`PhraseListGrammar`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.phraselistgrammar) object, then add specific words and phrases with [`addPhrase`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.phraselistgrammar#addphrase-phrase--str-).

Any changes to [`PhraseListGrammar`](/python/api/azure-cognitiveservices-speech/azure.cognitiveservices.speech.phraselistgrammar) take effect on the next recognition or after a reconnection to the Speech service.

```Python
phrase_list_grammar = speechsdk.PhraseListGrammar.from_recognizer(reco)
phrase_list_grammar.addPhrase("Supercalifragilisticexpialidocious")
```

If you need to clear your phrase list: 

```Python
phrase_list_grammar.clear()
```

### Other options to improve recognition accuracy

Phrase lists are only one option to improve recognition accuracy. You can also: 

* [Improve accuracy with Custom Speech](../../../custom-speech-overview.md)
* [Improve accuracy with tenant models](../../../tutorial-tenant-model.md)
