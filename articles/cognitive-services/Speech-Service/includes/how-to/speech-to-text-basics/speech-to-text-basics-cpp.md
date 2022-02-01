---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/06/2020
ms.author: eur
---
One of the core features of the Speech service is the ability to recognize and transcribe human speech (often referred to as speech-to-text). In this quickstart, you learn how to use the Speech SDK in your apps and products to perform high-quality speech-to-text conversion.

## Skip to samples on GitHub

If you want to skip straight to sample code, see the [C++ quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/cpp/windows) on GitHub.

## Prerequisites

This article assumes that you have an Azure account and Speech service subscription. If you don't have an account and subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

## Install the Speech SDK

Before you can do anything, install the Speech SDK. Depending on your platform, use the following instructions:

* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=linux" target="_blank">Linux </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=macos" target="_blank">macOS </a>
* <a href="/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-cpp&tabs=windows" target="_blank">Windows </a>

## Create a speech configuration

To call the Speech service with the Speech SDK, you create a [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig). This class includes information about your subscription, like your key and associated location/region, endpoint, host, or authorization token. Create a [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig) with your key and region. See the [Find keys and location/region](../../../overview.md#find-keys-and-locationregion) page to find your key-location/region pair.

```cpp
using namespace std;
using namespace Microsoft::CognitiveServices::Speech;

auto config = SpeechConfig::FromSubscription("<paste-your-speech-key-here>", "<paste-your-speech-location/region-here>");
```

There are a few other ways that you can initialize a [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig):

* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

## Recognize from microphone

To recognize speech using your device microphone, create an `AudioConfig` using `FromDefaultMicrophoneInput()`. Then initialize a [`SpeechRecognizer`](/cpp/cognitive-services/speech/speechrecognizer) with your `audioConfig` and `config`.

```cpp
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
auto recognizer = SpeechRecognizer::FromConfig(config, audioConfig);

cout << "Speak into your microphone." << std::endl;
auto result = recognizer->RecognizeOnceAsync().get();
cout << "RECOGNIZED: Text=" << result->Text << std::endl;
```

If you want to use a *specific* audio input device, you specify the device ID in the `AudioConfig`. Learn [how to get the device ID](../../../how-to-select-audio-input-devices.md) for your audio input device.

## Recognize from file

If you want to recognize speech from an audio file instead of a microphone, you still create an `AudioConfig`. However, when you create the [`AudioConfig`](/cpp/cognitive-services/speech/audio-audioconfig), instead of calling `FromDefaultMicrophoneInput()`, you call `FromWavFileInput()` and pass the file path.

```cpp
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
auto recognizer = SpeechRecognizer::FromConfig(config, audioInput);

auto result = recognizer->RecognizeOnceAsync().get();
cout << "RECOGNIZED: Text=" << result->Text << std::endl;
```

## Recognize speech

The [Recognizer class](/cpp/cognitive-services/speech/speechrecognizer) for the Speech SDK for C++ exposes a few methods that you can use for speech recognition.

### At-start recognition

At-start recognition asynchronously recognizes a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed. Here's an example of asynchronous at-start recognition using [`RecognizeOnceAsync`](/cpp/cognitive-services/speech/speechrecognizer#recognizeonceasync):

```cpp
auto result = recognizer->RecognizeOnceAsync().get();
```

You'll write some code to handle the result. This sample evaluates the [`result->Reason`](/cpp/cognitive-services/speech/recognitionresult#reason):

* Prints the recognition result: `ResultReason::RecognizedSpeech`
* If there is no recognition match, inform the user: `ResultReason::NoMatch`
* If an error is encountered, print the error message: `ResultReason::Canceled`

```cpp
switch (result->Reason)
{
    case ResultReason::RecognizedSpeech:
        cout << "We recognized: " << result->Text << std::endl;
        break;
    case ResultReason::NoMatch:
        cout << "NOMATCH: Speech could not be recognized." << std::endl;
        break;
    case ResultReason::Canceled:
        {
            auto cancellation = CancellationDetails::FromResult(result);
            cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;
    
            if (cancellation->Reason == CancellationReason::Error) {
                cout << "CANCELED: ErrorCode= " << (int)cancellation->ErrorCode << std::endl;
                cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails << std::endl;
                cout << "CANCELED: Did you update the speech key and location/region info?" << std::endl;
            }
        }
        break;
    default:
        break;
}
```

### Continuous recognition

Continuous recognition is a bit more involved than at-start recognition. It requires you to subscribe to the `Recognizing`, `Recognized`, and `Canceled` events to get the recognition results. To stop recognition, you must call [StopContinuousRecognitionAsync](/cpp/cognitive-services/speech/speechrecognizer#stopcontinuousrecognitionasync). Here's an example of how continuous recognition is performed on an audio input file.

Let's start by defining the input and initializing a [`SpeechRecognizer`](/cpp/cognitive-services/speech/speechrecognizer):

```cpp
auto audioInput = AudioConfig::FromWavFileInput("YourAudioFile.wav");
auto recognizer = SpeechRecognizer::FromConfig(config, audioInput);
```

Next, let's create a variable to manage the state of speech recognition. To start, declare a `promise<void>`, since at the start of recognition you can assume that it's not finished.

```cpp
promise<void> recognitionEnd;
```

Subscribe to the events sent from the [`SpeechRecognizer`](/cpp/cognitive-services/speech/speechrecognizer).

* [`Recognizing`](/cpp/cognitive-services/speech/asyncrecognizer#recognizing): Signal for events containing intermediate recognition results.
* [`Recognized`](/cpp/cognitive-services/speech/asyncrecognizer#recognized): Signal for events containing final recognition results (indicating a successful recognition attempt).
* [`SessionStopped`](/cpp/cognitive-services/speech/asyncrecognizer#sessionstopped): Signal for events indicating the end of a recognition session (operation).
* [`Canceled`](/cpp/cognitive-services/speech/asyncrecognizer#canceled): Signal for events containing canceled recognition results (indicating a recognition attempt that was canceled as a result or a direct cancellation request or, alternatively, a transport or protocol failure).

```cpp
recognizer->Recognizing.Connect([](const SpeechRecognitionEventArgs& e)
    {
        cout << "Recognizing:" << e.Result->Text << std::endl;
    });

recognizer->Recognized.Connect([](const SpeechRecognitionEventArgs& e)
    {
        if (e.Result->Reason == ResultReason::RecognizedSpeech)
        {
            cout << "RECOGNIZED: Text=" << e.Result->Text 
                 << " (text could not be translated)" << std::endl;
        }
        else if (e.Result->Reason == ResultReason::NoMatch)
        {
            cout << "NOMATCH: Speech could not be recognized." << std::endl;
        }
    });

recognizer->Canceled.Connect([&recognitionEnd](const SpeechRecognitionCanceledEventArgs& e)
    {
        cout << "CANCELED: Reason=" << (int)e.Reason << std::endl;
        if (e.Reason == CancellationReason::Error)
        {
            cout << "CANCELED: ErrorCode=" << (int)e.ErrorCode << "\n"
                 << "CANCELED: ErrorDetails=" << e.ErrorDetails << "\n"
                 << "CANCELED: Did you update the speech key and location/region info?" << std::endl;

            recognitionEnd.set_value(); // Notify to stop recognition.
        }
    });

recognizer->SessionStopped.Connect([&recognitionEnd](const SessionEventArgs& e)
    {
        cout << "Session stopped.";
        recognitionEnd.set_value(); // Notify to stop recognition.
    });
```

With everything set up, we can call [`StopContinuousRecognitionAsync`](/cpp/cognitive-services/speech/speechrecognizer#startcontinuousrecognitionasync).

```cpp
// Starts continuous recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
recognizer->StartContinuousRecognitionAsync().get();

// Waits for recognition end.
recognitionEnd.get_future().get();

// Stops recognition.
recognizer->StopContinuousRecognitionAsync().get();
```

### Dictation mode

When using continuous recognition, you can enable dictation processing by using the corresponding "enable dictation" function. This mode will cause the speech config instance to interpret word descriptions of sentence structures such as punctuation. For example, the utterance "Do you live in town question mark" would be interpreted as the text "Do you live in town?".

To enable dictation mode, use the [`EnableDictation`](/cpp/cognitive-services/speech/speechconfig#enabledictation) method on your [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig).

```cpp
config->EnableDictation();
```

## Change source language

A common task for speech recognition is specifying the input (or source) language. Let's take a look at how you would change the input language to German. In your code, find your [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig), then add this line directly below it.

```cpp
config->SetSpeechRecognitionLanguage("de-DE");
```

[`SetSpeechRecognitionLanguage`](/cpp/cognitive-services/speech/speechconfig#setspeechrecognitionlanguage) is a parameter that takes a string as an argument. You can provide any value in the list of supported [locales/languages](../../../language-support.md).

