---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 04/15/2020
ms.author: trbye
---

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../get-started.md).

## Install the Speech SDK

Before you can do anything, you'll need to install the <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">JavaScript Speech SDK <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Depending on your platform, use the following instructions:

- <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk?tabs=nodejs#get-the-speech-sdk" target="_blank">Node.js <span 
class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk?tabs=browser#get-the-speech-sdk" target="_blank">Web Browser <span class="docon docon-navigate-external x-hidden-focus"></span></a>

Additionally, depending on the target environment use one of the following:

# [import](#tab/import)

```javascript
import {
    AudioConfig,
    CancellationDetails,
    CancellationReason,
    PhraseListGrammar,
    ResultReason,
    SpeechConfig,
    SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk";
```

For more information on `import`, see <a href="https://javascript.info/import-export" target="_blank">export and import <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

# [require](#tab/require)

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```

For more information on `require`, see <a href="https://nodejs.org/en/knowledge/getting-started/what-is-require/" target="_blank">what is require? <span class="docon docon-navigate-external x-hidden-focus"></span></a>.


# [script](#tab/script)

Download and extract the <a href="https://aka.ms/csspeech/jsbrowserpackage" target="_blank">JavaScript Speech SDK <span class="docon docon-navigate-external x-hidden-focus"></span></a> *microsoft.cognitiveservices.speech.bundle.js* file, and place it in a folder accessible to your HTML file.

```html
<script src="microsoft.cognitiveservices.speech.bundle.js"></script>;
```

> [!TIP]
> If you're targeting a web browser, and using the `<script>` tag; the `sdk` prefix is not needed. The `sdk` prefix is an alias used to name the `require` module.

---

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

There are a few ways that you can initialize a [`SpeechConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest):

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

Let's take a look at how a [`SpeechConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest) is created using a key and region. See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier.

```javascript
const speechConfig = SpeechConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

## Initialize a recognizer

After you've created a [`SpeechConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest), the next step is to initialize a [`SpeechRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest). When you initialize a [`SpeechRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest), you'll need to pass it your `speechConfig`. This provides the credentials that the speech service requires to validate your request.

If you're recognizing speech using your device's default microphone, here's what the [`SpeechRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest) should look like:

```javascript
const recognizer = new SpeechRecognizer(speechConfig);
```

If you want to specify the audio input device, then you'll need to create an [`AudioConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig?view=azure-node-latest) and provide the `audioConfig` parameter when initializing your [`SpeechRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest).

> [!TIP]
> [Learn how to get the device ID for your audio input device](../../../how-to-select-audio-input-devices.md).

Reference the `AudioConfig` object as follows:

```javascript
const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
```

If you want to provide an audio file instead of using a microphone, you'll still need to provide an `audioConfig`. However, this can only be done when targeting **Node.js** and when you create an [`AudioConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig?view=azure-node-latest), instead of calling `fromDefaultMicrophoneInput`, you'll call `fromWavFileOutput` and pass the `filename` parameter.

```javascript
const audioConfig = AudioConfig.fromWavFileInput("YourAudioFile.wav");
const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
```

## Recognize speech

The [Recognizer class](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest) for the Speech SDK for C# exposes a few methods that you can use for speech recognition.

* Single-shot recognition (async) - Performs recognition in a non-blocking (asynchronous) mode. This will recognize a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.
* Continuous recognition (async) - Asynchronously initiates continuous recognition operation. The user registers to events and handles various application state. To stop asynchronous continuous recognition, call [`stopContinuousRecognitionAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#stopcontinuousrecognitionasync).

> [!NOTE]
> Learn more about how to [choose a speech recognition mode](../../../how-to-choose-recognition-mode.md).

### Single-shot recognition

Here's an example of asynchronous single-shot recognition using [`recognizeOnceAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#recognizeonceasync):

```javascript
recognizer.recognizeOnceAsync(result => {
    // Interact with result
});
```

You'll need to write some code to handle the result. This sample evaluates the [`result.reason`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitionresult?view=azure-node-latest#reason):

* Prints the recognition result: `ResultReason.RecognizedSpeech`
* If there is no recognition match, inform the user: `ResultReason.NoMatch`
* If an error is encountered, print the error message: `ResultReason.Canceled`

```javascript
switch (result.reason) {
    case ResultReason.RecognizedSpeech:
        console.log(`RECOGNIZED: Text=${result.text}`);
        console.log("    Intent not recognized.");
        break;
    case ResultReason.NoMatch:
        console.log("NOMATCH: Speech could not be recognized.");
        break;
    case ResultReason.Canceled:
        const cancellation = CancellationDetails.fromResult(result);
        console.log(`CANCELED: Reason=${cancellation.reason}`);

        if (cancellation.reason == CancellationReason.Error) {
            console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
            console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
            console.log("CANCELED: Did you update the subscription info?");
        }
        break;
    }
}
```

### Continuous recognition

Continuous recognition is a bit more involved than single-shot recognition. It requires you to subscribe to the `Recognizing`, `Recognized`, and `Canceled` events to get the recognition results. To stop recognition, you must call [`stopContinuousRecognitionAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#stopcontinuousrecognitionasync). Here's an example of how continuous recognition is performed on an audio input file.

Let's start by defining the input and initializing a [`SpeechRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest):

```javascript
const recognizer = new SpeechRecognizer(speechConfig);
```

We'll subscribe to the events sent from the [`SpeechRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest).

* [`recognizing`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#recognizing): Signal for events containing intermediate recognition results.
* [`recognized`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#recognized): Signal for events containing final recognition results (indicating a successful recognition attempt).
* [`sessionStopped`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#sessionstopped): Signal for events indicating the end of a recognition session (operation).
* [`canceled`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#canceled): Signal for events containing canceled recognition results (indicating a recognition attempt that was canceled as a result or a direct cancellation request or, alternatively, a transport or protocol failure).

```javascript
recognizer.recognizing = (s, e) => {
    console.log(`RECOGNIZING: Text=${e.result.text}`);
};

recognizer.recognized = (s, e) => {
    if (e.result.reason == ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
    }
    else if (e.result.reason == ResultReason.NoMatch) {
        console.log("NOMATCH: Speech could not be recognized.");
    }
};

recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason == CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log("CANCELED: Did you update the subscription info?");
    }

    recognizer.stopContinuousRecognitionAsync();
};

recognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    recognizer.stopContinuousRecognitionAsync();
};
```

With everything set up, we can call [`stopContinuousRecognitionAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest#stopcontinuousrecognitionasync).

```javascript
// Starts continuous recognition. Uses stopContinuousRecognitionAsync() to stop recognition.
recognizer.startContinuousRecognitionAsync();

// Something later can call, stops recognition.
// recognizer.StopContinuousRecognitionAsync();
```

### Dictation mode

When using continuous recognition, you can enable dictation processing by using the corresponding "enable dictation" function. This mode will cause the speech config instance to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

To enable dictation mode, use the [`enableDictation`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest#enabledictation--) method on your [`SpeechConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest).

```javascript
speechConfig.enableDictation();
```

## Change source language

A common task for speech recognition is specifying the input (or source) language. Let's take a look at how you would change the input language to Italian. In your code, find your [`SpeechConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest), then add this line directly below it.

```javascript
speechConfig.speechRecognitionLanguage = "it-IT";
```

The [`speechRecognitionLanguage`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest#speechrecognitionlanguage) property expects a language-locale format string. You can provide any value in the **Locale** column in the list of supported [locales/languages](../../../language-support.md).

## Improve recognition accuracy

There are a few ways to improve recognition accuracy with the Speech  Let's take a look at Phrase Lists. Phrase Lists are used to identify known phrases in audio data, like a person's name or a specific location. Single words or complete phrases can be added to a Phrase List. During recognition, an entry in a phrase list is used if an exact match for the entire phrase is included in the audio. If an exact match to the phrase is not found, recognition is not assisted.

> [!IMPORTANT]
> The Phrase List feature is only available in English.

To use a phrase list, first create a [`PhraseListGrammar`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/phraselistgrammar?view=azure-node-latest) object, then add specific words and phrases with [`addPhrase`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/phraselistgrammar?view=azure-node-latest#addphrase-string-).

Any changes to [`PhraseListGrammar`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/phraselistgrammar?view=azure-node-latest) take effect on the next recognition or after a reconnection to the Speech service.

```javascript
const phraseList = PhraseListGrammar.fromRecognizer(recognizer);
phraseList.addPhrase("Supercalifragilisticexpialidocious");
```

If you need to clear your phrase list:

```javascript
phraseList.clear();
```

### Other options to improve recognition accuracy

Phrase lists are only one option to improve recognition accuracy. You can also: 

* [Improve accuracy with Custom Speech](../../../how-to-custom-speech.md)
* [Improve accuracy with tenant models](../../../tutorial-tenant-model.md)
