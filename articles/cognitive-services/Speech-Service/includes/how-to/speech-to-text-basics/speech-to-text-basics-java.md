---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2020
ms.custom: devx-track-java
ms.author: trbye
---

One of the core features of the Speech service is the ability to recognize and transcribe human speech (often referred to as speech-to-text). In this quickstart, you learn how to use the Speech SDK in your apps and products to perform high-quality speech-to-text conversion.

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [Java quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/jre) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Install the Speech SDK

Before you can do anything, you'll need to install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=jre&pivots=programming-language-java" target="_blank">Java Runtime <span class="docon docon-navigate-external x-hidden-focus"></span></a>
* <a href="https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstarts/setup-platform?tabs=android&pivots=programming-language-java" target="_blank">Android <span class="docon docon-navigate-external x-hidden-focus"></span></a>

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](/java/api/com.microsoft.cognitiveservices.speech.speechconfig?view=azure-java-stable). This class includes information about your subscription, like your key and associated region, endpoint, host, or authorization token. Create a [`SpeechConfig`](/java/api/com.microsoft.cognitiveservices.speech.speechconfig?view=azure-java-stable) by using your key and region. See the [Find keys and region](../../../overview.md#find-keys-and-region) page to find your key-region pair.

```java
import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class Program {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        SpeechConfig speechConfig = SpeechConfig.fromSubscription("<paste-your-subscription-key>", "<paste-your-region>");
    }
}
```

There are a few other ways that you can initialize a [`SpeechConfig`](/java/api/com.microsoft.cognitiveservices.speech.speechconfig?view=azure-java-stable):

* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

## Recognize from microphone

To recognize speech using your device microphone, create an `AudioConfig` using `fromDefaultMicrophoneInput()`. Then initialize a[`SpeechRecognizer`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer?view=azure-java-stable), passing your `audioConfig` and `config`.

```java
import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class Program {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        SpeechConfig speechConfig = SpeechConfig.fromSubscription("<paste-your-subscription-key>", "<paste-your-region>");
        fromMic(speechConfig);
    }

    public static void fromMic(SpeechConfig speechConfig) throws InterruptedException, ExecutionException {
        AudioConfig audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);

        System.out.println("Speak into your microphone.");
        Future<SpeechRecognitionResult> task = recognizer.recognizeOnceAsync();
        SpeechRecognitionResult result = task.get();
        System.out.println("RECOGNIZED: Text=" + result.getText());
    }
}
```

If you want to use a *specific* audio input device, you need to specify the device ID in the `AudioConfig`. Learn [how to get the device ID](../../../how-to-select-audio-input-devices.md) for your audio input device.

## Recognize from file

If you want to recognize speech from an audio file instead of using a microphone, you still need to create an `AudioConfig`. However, when you create the [`AudioConfig`](/java/api/com.microsoft.cognitiveservices.speech.audio.audioconfig?view=azure-java-stable), instead of calling `fromDefaultMicrophoneInput()`, call `fromWavFileInput()` and pass the file path.

```java
import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class Program {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        SpeechConfig speechConfig = SpeechConfig.fromSubscription("<paste-your-subscription-key>", "<paste-your-region>");
        fromFile(speechConfig);
    }

    public static void fromFile(SpeechConfig speechConfig) throws InterruptedException, ExecutionException {
        AudioConfig audioConfig = AudioConfig.fromWavFileInput("YourAudioFile.wav");
        SpeechRecognizer recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        
        Future<SpeechRecognitionResult> task = recognizer.recognizeOnceAsync();
        SpeechRecognitionResult result = task.get();
        System.out.println("RECOGNIZED: Text=" + result.getText());
    }
}
```

## Error handling

The previous examples simply get the recognized text using `result.getText()`, but to handle errors and other responses, you'll need to write some code to handle the result. The following  example evaluates [`result.getReason()`](/java/api/com.microsoft.cognitiveservices.speech.resultreason?view=azure-java-stable&preserve-view=true) and:

* Prints the recognition result: `ResultReason.RecognizedSpeech`
* If there is no recognition match, inform the user: `ResultReason.NoMatch`
* If an error is encountered, print the error message: `ResultReason.Canceled`

```java
switch (result.getReason()) {
    case ResultReason.RecognizedSpeech:
        System.out.println("We recognized: " + result.getText());
        exitCode = 0;
        break;
    case ResultReason.NoMatch:
        System.out.println("NOMATCH: Speech could not be recognized.");
        break;
    case ResultReason.Canceled: {
            CancellationDetails cancellation = CancellationDetails.fromResult(result);
            System.out.println("CANCELED: Reason=" + cancellation.getReason());

            if (cancellation.getReason() == CancellationReason.Error) {
                System.out.println("CANCELED: ErrorCode=" + cancellation.getErrorCode());
                System.out.println("CANCELED: ErrorDetails=" + cancellation.getErrorDetails());
                System.out.println("CANCELED: Did you update the subscription info?");
            }
        }
        break;
}
```

## Continuous recognition

The previous examples use single-shot recognition, which recognizes a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.

In contrast, continuous recognition is used when you want to **control** when to stop recognizing. It requires you to subscribe to the `recognizing`, `recognized`, and `canceled` events to get the recognition results. To stop recognition, you must call [`stopContinuousRecognitionAsync`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer.stopcontinuousrecognitionasync). Here's an example of how continuous recognition is performed on an audio input file.

Let's start by defining the input and initializing a [`SpeechRecognizer`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer?preserve-view=true&view=azure-java-stable):

```java
AudioConfig audioConfig = AudioConfig.fromWavFileInput("YourAudioFile.wav");
SpeechRecognizer recognizer = new SpeechRecognizer(config, audioConfig);
```

Next, let's create a variable to manage the state of speech recognition. To start, we'll declare a `Semaphore` at the class scope.

```java
private static Semaphore stopTranslationWithFileSemaphore;
```

We'll subscribe to the events sent from the [`SpeechRecognizer`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer?preserve-view=true&view=azure-java-stable).

* [`recognizing`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer.recognizing?preserve-view=true&view=azure-java-stable): Signal for events containing intermediate recognition results.
* [`recognized`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer.recognized?preserve-view=true&view=azure-java-stable): Signal for events containing final recognition results (indicating a successful recognition attempt).
* [`sessionStopped`](/java/api/com.microsoft.cognitiveservices.speech.recognizer.sessionstopped?preserve-view=true&view=azure-java-stable): Signal for events indicating the end of a recognition session (operation).
* [`canceled`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer.canceled?preserve-view=true&view=azure-java-stable): Signal for events containing canceled recognition results (indicating a recognition attempt that was canceled as a result or a direct cancellation request or, alternatively, a transport or protocol failure).

```java
// First initialize the semaphore.
stopTranslationWithFileSemaphore = new Semaphore(0);

recognizer.recognizing.addEventListener((s, e) -> {
    System.out.println("RECOGNIZING: Text=" + e.getResult().getText());
});

recognizer.recognized.addEventListener((s, e) -> {
    if (e.getResult().getReason() == ResultReason.RecognizedSpeech) {
        System.out.println("RECOGNIZED: Text=" + e.getResult().getText());
    }
    else if (e.getResult().getReason() == ResultReason.NoMatch) {
        System.out.println("NOMATCH: Speech could not be recognized.");
    }
});

recognizer.canceled.addEventListener((s, e) -> {
    System.out.println("CANCELED: Reason=" + e.getReason());

    if (e.getReason() == CancellationReason.Error) {
        System.out.println("CANCELED: ErrorCode=" + e.getErrorCode());
        System.out.println("CANCELED: ErrorDetails=" + e.getErrorDetails());
        System.out.println("CANCELED: Did you update the subscription info?");
    }

    stopTranslationWithFileSemaphore.release();
});

recognizer.sessionStopped.addEventListener((s, e) -> {
    System.out.println("\n    Session stopped event.");
    stopTranslationWithFileSemaphore.release();
});
```

With everything set up, we can call [`startContinuousRecognitionAsync`](/java/api/com.microsoft.cognitiveservices.speech.speechrecognizer.startcontinuousrecognitionasync).

```java
// Starts continuous recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
recognizer.startContinuousRecognitionAsync().get();

// Waits for completion.
stopTranslationWithFileSemaphore.acquire();

// Stops recognition.
recognizer.stopContinuousRecognitionAsync().get();
```

### Dictation mode

When using continuous recognition, you can enable dictation processing by using the corresponding "enable dictation" function. This mode will cause the speech config instance to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

To enable dictation mode, use the [`enableDictation`](/java/api/com.microsoft.cognitiveservices.speech.speechconfig.enabledictation?preserve-view=true&view=azure-java-stable) method on your [`SpeechConfig`](/java/api/com.microsoft.cognitiveservices.speech.speechconfig?preserve-view=true&view=azure-java-stable).

```java
config.enableDictation();
```

## Change source language

A common task for speech recognition is specifying the input (or source) language. Let's take a look at how you would change the input language to French. In your code, find your [`SpeechConfig`](/java/api/com.microsoft.cognitiveservices.speech.speechconfig?preserve-view=true&view=azure-java-stable), then add this line directly below it.

```java
config.setSpeechRecognitionLanguage("fr-FR");
```

[`setSpeechRecognitionLanguage`](/java/api/com.microsoft.cognitiveservices.speech.speechconfig.setspeechrecognitionlanguage?preserve-view=true&view=azure-java-stable) is a parameter that takes a string as an argument. You can provide any value in the list of supported [locales/languages](../../../language-support.md).

## Improve recognition accuracy

There are a few ways to improve recognition accuracy with the Speech SDK. Let's take a look at Phrase Lists. Phrase Lists are used to identify known phrases in audio data, like a person's name or a specific location. Single words or complete phrases can be added to a Phrase List. During recognition, an entry in a phrase list is used if an exact match for the entire phrase is included in the audio. If an exact match to the phrase is not found, recognition is not assisted.

> [!IMPORTANT]
> The Phrase List feature is only available in English.

To use a phrase list, first create a [`PhraseListGrammar`](/java/api/com.microsoft.cognitiveservices.speech.phraselistgrammar?preserve-view=true&view=azure-java-stable) object, then add specific words and phrases with [`AddPhrase`](/java/api/com.microsoft.cognitiveservices.speech.phraselistgrammar.addphrase?view=azure-java-stable#com_microsoft_cognitiveservices_speech_PhraseListGrammar_addPhrase_String_).

Any changes to [`PhraseListGrammar`](/java/api/com.microsoft.cognitiveservices.speech.phraselistgrammar?preserve-view=true&view=azure-java-stable) take effect on the next recognition or after a reconnection to the Speech service.

```java
PhraseListGrammar phraseList = PhraseListGrammar.fromRecognizer(recognizer);
phraseList.addPhrase("Supercalifragilisticexpialidocious");
```

If you need to clear your phrase list: 

```java
phraseList.clear();
```

### Other options to improve recognition accuracy

Phrase lists are only one option to improve recognition accuracy. You can also: 

* [Improve accuracy with Custom Speech](../../../how-to-custom-speech.md)
* [Improve accuracy with tenant models](../../../tutorial-tenant-model.md)