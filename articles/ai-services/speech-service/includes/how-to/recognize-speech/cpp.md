---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/06/2020
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Create a speech configuration

To call the Speech service using the Speech SDK, you need to create a [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig) instance. This class includes information about your subscription, like your key and associated location/region, endpoint, host, or authorization token. 

Create a `SpeechConfig` instance by using your key and region. Create a Speech resource on the [Azure portal](https://portal.azure.com). For more information, see [Create a multi-service resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal).

```cpp
using namespace std;
using namespace Microsoft::CognitiveServices::Speech;

auto speechConfig = SpeechConfig::FromSubscription("YourSpeechKey", "YourSpeechRegion");
```

You can initialize `SpeechConfig` in a few other ways:

* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

## Recognize speech from a microphone

To recognize speech by using your device microphone, create an [`AudioConfig`](/cpp/cognitive-services/speech/audio-audioconfig) instance by using `FromDefaultMicrophoneInput()`. Then initialize [`SpeechRecognizer`](/cpp/cognitive-services/speech/speechrecognizer) by passing `audioConfig` and `config`.

```cpp
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto audioConfig = AudioConfig::FromDefaultMicrophoneInput();
auto speechRecognizer = SpeechRecognizer::FromConfig(config, audioConfig);

cout << "Speak into your microphone." << std::endl;
auto result = speechRecognizer->RecognizeOnceAsync().get();
cout << "RECOGNIZED: Text=" << result->Text << std::endl;
```

If you want to use a *specific* audio input device, you need to specify the device ID in `AudioConfig`. Learn [how to get the device ID](../../../how-to-select-audio-input-devices.md) for your audio input device.

## Recognize speech from a file

If you want to recognize speech from an audio file instead of using a microphone, you still need to create an `AudioConfig` instance. But instead of calling `FromDefaultMicrophoneInput()`, you call `FromWavFileInput()` and pass the file path:

```cpp
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto audioConfig = AudioConfig::FromWavFileInput("YourAudioFile.wav");
auto speechRecognizer = SpeechRecognizer::FromConfig(config, audioConfig);

auto result = speechRecognizer->RecognizeOnceAsync().get();
cout << "RECOGNIZED: Text=" << result->Text << std::endl;
```

## Recognize speech by using the Recognizer class

The [Recognizer class](/cpp/cognitive-services/speech/speechrecognizer) for the Speech SDK for C++ exposes a few methods that you can use for speech recognition.

## Single-shot recognition

Single-shot recognition asynchronously recognizes a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed. Here's an example of asynchronous single-shot recognition via [`RecognizeOnceAsync`](/cpp/cognitive-services/speech/speechrecognizer#recognizeonceasync):

```cpp
auto result = speechRecognizer->RecognizeOnceAsync().get();
```

You need to write some code to handle the result. This sample evaluates [`result->Reason`](/cpp/cognitive-services/speech/recognitionresult#reason) and:

* Prints the recognition result: `ResultReason::RecognizedSpeech`.
* If there is no recognition match, informs the user: `ResultReason::NoMatch`.
* If an error is encountered, prints the error message: `ResultReason::Canceled`.

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
                cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
            }
        }
        break;
    default:
        break;
}
```

## Continuous recognition

Continuous recognition is a bit more involved than single-shot recognition. It requires you to subscribe to the `Recognizing`, `Recognized`, and `Canceled` events to get the recognition results. To stop recognition, you must call [StopContinuousRecognitionAsync](/cpp/cognitive-services/speech/speechrecognizer#stopcontinuousrecognitionasync). Here's an example of how continuous recognition is performed on an audio input file.

Start by defining the input and initializing [`SpeechRecognizer`](/cpp/cognitive-services/speech/speechrecognizer):

```cpp
auto audioConfig = AudioConfig::FromWavFileInput("YourAudioFile.wav");
auto speechRecognizer = SpeechRecognizer::FromConfig(config, audioConfig);
```

Next, create a variable to manage the state of speech recognition. Declare `promise<void>` because at the start of recognition, you can safely assume that it's not finished:

```cpp
promise<void> recognitionEnd;
```

Next, subscribe to the events that [`SpeechRecognizer`](/cpp/cognitive-services/speech/speechrecognizer) sends:

* [`Recognizing`](/cpp/cognitive-services/speech/asyncrecognizer#recognizing): Signal for events that contain intermediate recognition results.
* [`Recognized`](/cpp/cognitive-services/speech/asyncrecognizer#recognized): Signal for events that contain final recognition results, which indicate a successful recognition attempt.
* [`SessionStopped`](/cpp/cognitive-services/speech/asyncrecognizer#sessionstopped): Signal for events that indicate the end of a recognition session (operation).
* [`Canceled`](/cpp/cognitive-services/speech/asyncrecognizer#canceled): Signal for events that contain canceled recognition results. These results indicate a recognition attempt that was canceled as a result of a direct cancellation request. Alternatively, they indicate a transport or protocol failure.

```cpp
speechRecognizer->Recognizing.Connect([](const SpeechRecognitionEventArgs& e)
    {
        cout << "Recognizing:" << e.Result->Text << std::endl;
    });

speechRecognizer->Recognized.Connect([](const SpeechRecognitionEventArgs& e)
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

speechRecognizer->Canceled.Connect([&recognitionEnd](const SpeechRecognitionCanceledEventArgs& e)
    {
        cout << "CANCELED: Reason=" << (int)e.Reason << std::endl;
        if (e.Reason == CancellationReason::Error)
        {
            cout << "CANCELED: ErrorCode=" << (int)e.ErrorCode << "\n"
                 << "CANCELED: ErrorDetails=" << e.ErrorDetails << "\n"
                 << "CANCELED: Did you set the speech resource key and region values?" << std::endl;

            recognitionEnd.set_value(); // Notify to stop recognition.
        }
    });

speechRecognizer->SessionStopped.Connect([&recognitionEnd](const SessionEventArgs& e)
    {
        cout << "Session stopped.";
        recognitionEnd.set_value(); // Notify to stop recognition.
    });
```

With everything set up, call [`StopContinuousRecognitionAsync`](/cpp/cognitive-services/speech/speechrecognizer#startcontinuousrecognitionasync) to start recognizing:

```cpp
// Starts continuous recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
speechRecognizer->StartContinuousRecognitionAsync().get();

// Waits for recognition end.
recognitionEnd.get_future().get();

// Stops recognition.
speechRecognizer->StopContinuousRecognitionAsync().get();
```

## Change the source language

A common task for speech recognition is specifying the input (or source) language. The following example shows how you would change the input language to German. In your code, find your [`SpeechConfig`](/cpp/cognitive-services/speech/speechconfig) instance and add this line directly below it:

```cpp
speechConfig->SetSpeechRecognitionLanguage("de-DE");
```

[`SetSpeechRecognitionLanguage`](/cpp/cognitive-services/speech/speechconfig#setspeechrecognitionlanguage) is a parameter that takes a string as an argument. Refer to the [list of supported speech to text locales](../../../language-support.md?tabs=stt).

## Language identification

You can use [language identification](../../../language-identification.md?pivots=programming-language-cpp#speech-to-text) with Speech to text recognition when you need to identify the language in an audio source and then transcribe it to text.

For a complete code sample, see [language identification](../../../language-identification.md?pivots=programming-language-cpp#speech-to-text).

## Use a custom endpoint

With [Custom Speech](../../../custom-speech-overview.md), you can upload your own data, test and train a custom model, compare accuracy between models, and deploy a model to a custom endpoint. The following example shows how to set a custom endpoint.

```cpp
auto speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey", "YourServiceRegion");
speechConfig->SetEndpointId("YourEndpointId");
auto speechRecognizer = SpeechRecognizer::FromConfig(speechConfig);
```

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see the [speech containers](../../../speech-container-howto.md#host-urls) how-to guide.

