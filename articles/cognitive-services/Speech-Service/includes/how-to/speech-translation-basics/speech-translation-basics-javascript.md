---
author: v-demjoh
ms.service: cognitive-services
ms.topic: include
ms.date: 07/14/2020
ms.author: v-demjoh
ms.custom: devx-track-js
---

One of the core features of the Speech service is the ability to recognize human speech and translate it to other languages. In this quickstart you learn how to use the Speech SDK in your apps and products to perform high-quality speech translation. This quickstart covers topics including:

* Translating speech-to-text
* Translating speech to multiple target languages
* Performing direct speech-to-speech translation

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [JavaScript quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Install the Speech SDK

Before you can do anything, you'll need to install the <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">Speech SDK for JavaScript <span class="docon docon-navigate-external x-hidden-focus"></span></a>. Depending on your platform, use the following instructions:
- <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk?tabs=nodejs#get-the-speech-sdk" target="_blank">Node.js <span 
class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk?tabs=browser#get-the-speech-sdk" target="_blank">Web Browser <span class="docon docon-navigate-external x-hidden-focus"></span></a>

Additionally, depending on the target environment use one of the following:

# [script](#tab/script)

Download and extract the <a href="https://aka.ms/csspeech/jsbrowserpackage" target="_blank">Speech SDK for JavaScript <span class="docon docon-navigate-external x-hidden-focus"></span></a> *microsoft.cognitiveservices.speech.sdk.bundle.js* file, and place it in a folder accessible to your HTML file.

```html
<script src="microsoft.cognitiveservices.speech.sdk.bundle.js"></script>;
```

> [!TIP]
> If you're targeting a web browser, and using the `<script>` tag; the `sdk` prefix is not needed. The `sdk` prefix is an alias used to name the `require` module.

# [import](#tab/import)

```javascript
import * from "microsoft-cognitiveservices-speech-sdk";
```

For more information on `import`, see <a href="https://javascript.info/import-export" target="_blank">export and import <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

# [require](#tab/require)

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```

For more information on `require`, see <a href="https://nodejs.org/en/knowledge/getting-started/what-is-require/" target="_blank">what is require? <span class="docon docon-navigate-external x-hidden-focus"></span></a>.

---

## Create a translation configuration

To call the translation service using the Speech SDK, you need to create a [`SpeechTranslationConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig?view=azure-node-latest&preserve-view=true). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.
There are a few ways that you can initialize a [`SpeechTranslationConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig?view=azure-node-latest&preserve-view=true):

* With a subscription: pass in a key and the associated region.
* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

Let's take a look at how a [`SpeechTranslationConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig?view=azure-node-latest&preserve-view=true) is created using a key and region. See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier.

```javascript
const speechTranslationConfig = SpeechTranslationConfig.fromSubscription("YourSubscriptionKey", "YourServiceRegion");
```

## Initialize a translator

After you've created a [`SpeechTranslationConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig?view=azure-node-latest&preserve-view=true), the next step is to initialize a [`TranslationRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true). When you initialize a [`TranslationRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true), you'll need to pass it your `speechTranslationConfig`. This provides the credentials that the translation service requires to validate your request.

If you're translating speech provided through your device's default microphone, here's what the [`TranslationRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true) should look like:

```javascript
const translator = new TranslationRecognizer(speechTranslationConfig);
```

If you want to specify the audio input device, then you'll need to create an [`AudioConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig?view=azure-node-latest&preserve-view=true) and provide the `audioConfig` parameter when initializing your [`TranslationRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true).

> [!TIP]
> [Learn how to get the device ID for your audio input device](../../../how-to-select-audio-input-devices.md).
Reference the `AudioConfig` object as follows:

```javascript
const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig);
```

If you want to provide an audio file instead of using a microphone, you'll still need to provide an `audioConfig`. However, this can only be done when targeting **Node.js** and when you create an [`AudioConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/audioconfig?view=azure-node-latest&preserve-view=true), instead of calling `fromDefaultMicrophoneInput`, you'll call `fromWavFileOutput` and pass the `filename` parameter.

```javascript
const audioConfig = AudioConfig.fromWavFileInput("YourAudioFile.wav");
const recognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig);
```

## Translate speech

The [TranslationRecognizer class](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true) for the Speech SDK for JavaScript exposes a few methods that you can use for speech translation.

* Single-shot translation (async) - Performs translation in a non-blocking (asynchronous) mode. This will translate a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.
* Continuous translation (async) - Asynchronously initiates continuous translation operation. The user registers to events and handles various application states. To stop asynchronous continuous translation, call [`stopContinuousRecognitionAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true#stopcontinuousrecognitionasync).

> [!NOTE]
> Learn more about how to [choose a speech recognition mode](../../../how-to-choose-recognition-mode.md).
### Specify a target language

To translate, you must specify both a source language and at least one target language.
You can choose a source language using a locale listed in the [Speech translation table](../../../language-support.md#speech-translation). Find your options for translated language at the same link. 
Your options for target languages differ when you want to view text, or
want to hear synthesized translated speech. To translate from English to German, modify
the translation config object:

```javascript
speechTranslationConfig.speechRecognitionLanguage = "en-US";
speechTranslationConfig.addTargetLanguage("de");
```

### Single-shot recognition

Here's an example of asynchronous single-shot translation using [`recognizeOnceAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true#recognizeonceasync):

```javascript
recognizer.recognizeOnceAsync(result => {
    // Interact with result
});
```

You'll need to write some code to handle the result. This sample evaluates the [`result.reason`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognitionresult?view=azure-node-latest&preserve-view=true) for a translation to German:

```javascript
recognizer.recognizeOnceAsync(
  function (result) {
    let translation = result.translations.get("de");
    window.console.log(translation);
    recognizer.close();
  },
  function (err) {
    window.console.log(err);
    recognizer.close();
});
```

Your code can also handle updates provided while the translation is processing.
You can use these updates to provide visual feedback about the translation progress.
See [this JavaScript
Node.js example](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/node/translation.js) for sample code that shows updates provided during the translation process. The following code also
displays details produced during the translation process.

```javascript
recognizer.recognizing = function (s, e) {
    var str = ("(recognizing) Reason: " + SpeechSDK.ResultReason[e.result.reason] +
            " Text: " +  e.result.text +
            " Translation:");
    str += e.result.translations.get("de");
    console.log(str);
};
recognizer.recognized = function (s, e) {
    var str = "\r\n(recognized)  Reason: " + SpeechSDK.ResultReason[e.result.reason] +
            " Text: " + e.result.text +
            " Translation:";
    str += e.result.translations.get("de");
    str += "\r\n";
    console.log(str);
};
```

### Continuous translation

Continuous translation is a bit more involved than single-shot recognition. It requires you to subscribe to the `recognizing`, `recognized`, and `canceled` events to get the recognition results. To stop translation, you must call [`stopContinuousRecognitionAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true#stopcontinuousrecognitionasync). Here's an example of how continuous translation is performed on an audio input file.

Let's start by defining the input and initializing a [`TranslationRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true):

```javascript
const translator = new TranslationRecognizer(speechTranslationConfig);
```

We'll subscribe to the events sent from the [`TranslationRecognizer`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true).

* [`recognizing`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true#recognizing): Signal for events containing intermediate translation results.
* [`recognized`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true#recognized): Signal for events containing final translation results (indicating a successful translation attempt).
* [`sessionStopped`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true#sessionstopped): Signal for events indicating the end of a translation session (operation).
* [`canceled`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/translationrecognizer?view=azure-node-latest&preserve-view=true#canceled): Signal for events containing canceled translation results (indicating a translation attempt that was canceled as a result or a direct cancellation request or, alternatively, a transport or protocol failure).

```javascript
recognizer.recognizing = (s, e) => {
    console.log(`TRANSLATING: Text=${e.result.text}`);
};
recognizer.recognized = (s, e) => {
    if (e.result.reason == ResultReason.RecognizedSpeech) {
        console.log(`TRANSLATED: Text=${e.result.text}`);
    }
    else if (e.result.reason == ResultReason.NoMatch) {
        console.log("NOMATCH: Speech could not be translated.");
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

With everything set up, we can call [`startContinuousRecognitionAsync`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognizer?view=azure-node-latest&preserve-view=true#startcontinuousrecognitionasync).

```javascript
// Starts continuous recognition. Uses stopContinuousRecognitionAsync() to stop recognition.
recognizer.startContinuousRecognitionAsync();
// Something later can call, stops recognition.
// recognizer.StopContinuousRecognitionAsync();
```

## Choose a source language

A common task for speech translation is specifying the input (or source) language. Let's take a look at how you would change the input language to Italian. In your code, find your [`SpeechTranslationConfig`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig?view=azure-node-latest&preserve-view=true), then add the following line directly below it.

```javascript
speechTranslationConfig.speechRecognitionLanguage = "it-IT";
```

The [`speechRecognitionLanguage`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig?view=azure-node-latest&preserve-view=true#speechrecognitionlanguage) property expects a language-locale format string. You can provide any value in the **Locale** column in the list of supported [locales/languages](../../../language-support.md).

## Choose one or more target languages

The Speech SDK can translate to multiple target languages in parallel. 
The target languages available are somewhat different from the source language list,
and you specify target languages using a language code, rather than a locale.
See a list of language codes for text targets in 
[the speech translation table on the language support page](../../../language-support.md#speech-translation). You can also find details about translation into synthesized languages there.

The following code adds German as a target language:

```javascript
translationConfig.addTargetLanguage("de");
```

Since multiple target language translations are possible, your code must specify the target language when examining the result. The following code gets translation results for German.

```javascript
recognizer.recognized = function (s, e) {
    var str = "\r\n(recognized)  Reason: " +
            sdk.ResultReason[e.result.reason] +
            " Text: " + e.result.text + " Translations:";
    var language = "de";
    str += " [" + language + "] " + e.result.translations.get(language);
    str += "\r\n";
    // show str somewhere
};
```
