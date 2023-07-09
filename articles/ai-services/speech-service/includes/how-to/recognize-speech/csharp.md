---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2020
ms.author: eur
ms.custom: devx-track-csharp
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Create a speech configuration

To call the Speech service by using the Speech SDK, you need to create a [`SpeechConfig`](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig) instance. This class includes information about your subscription, like your key and associated location/region, endpoint, host, or authorization token. 

Create a `SpeechConfig` instance by using your key and location/region. Create a Speech resource on the [Azure portal](https://portal.azure.com). For more information, see [Create a multi-service resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal).

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

class Program 
{
    async static Task Main(string[] args)
    {
        var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
    }
}
```

You can initialize `SpeechConfig` in a few other ways:

* With an endpoint: pass in a Speech service endpoint. A key or authorization token is optional.
* With a host: pass in a host address. A key or authorization token is optional.
* With an authorization token: pass in an authorization token and the associated region/location.

> [!NOTE]
> Regardless of whether you're performing speech recognition, speech synthesis, translation, or intent recognition, you'll always create a configuration.

## Recognize speech from a microphone

To recognize speech by using your device microphone, create an [`AudioConfig`](/dotnet/api/microsoft.cognitiveservices.speech.audio.audioconfig) instance by using `FromDefaultMicrophoneInput()`. Then initialize [`SpeechRecognizer`](/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer) by passing `audioConfig` and `speechConfig`.

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

class Program 
{
    async static Task FromMic(SpeechConfig speechConfig)
    {
        using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
        using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

        Console.WriteLine("Speak into your microphone.");
        var result = await speechRecognizer.RecognizeOnceAsync();
        Console.WriteLine($"RECOGNIZED: Text={result.Text}");
    }

    async static Task Main(string[] args)
    {
        var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
        await FromMic(speechConfig);
    }
}
```

If you want to use a *specific* audio input device, you need to specify the device ID in `AudioConfig`. Learn [how to get the device ID](../../../how-to-select-audio-input-devices.md) for your audio input device.

## Recognize speech from a file

If you want to recognize speech from an audio file instead of a microphone, you still need to create an `AudioConfig` instance. But instead of calling `FromDefaultMicrophoneInput()`, you call `FromWavFileInput()` and pass the file path:

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

class Program 
{
    async static Task FromFile(SpeechConfig speechConfig)
    {
        using var audioConfig = AudioConfig.FromWavFileInput("PathToFile.wav");
        using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

        var result = await speechRecognizer.RecognizeOnceAsync();
        Console.WriteLine($"RECOGNIZED: Text={result.Text}");
    }

    async static Task Main(string[] args)
    {
        var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
        await FromFile(speechConfig);
    }
}
```

## Recognize speech from an in-memory stream

For many use cases, it's likely that your audio data will come from blob storage or will otherwise already be in memory as a `byte[]` instance or a similar raw data structure. The following example uses [`PushAudioInputStream`](/dotnet/api/microsoft.cognitiveservices.speech.audio.pushaudioinputstream) to recognize speech, which is essentially an abstracted memory stream. The sample code does the following:

* Writes raw audio data (PCM) to `PushAudioInputStream` by using the `Write()` function, which accepts a `byte[]` instance.
* Reads a `.wav` file by using `FileReader` for demonstration purposes. If you already have audio data in a `byte[]` instance, you can skip directly to writing the content to the input stream.
* The default format is 16-bit, 16-KHz mono PCM. To customize the format, you can pass an [`AudioStreamFormat`](/dotnet/api/microsoft.cognitiveservices.speech.audio.audiostreamformat) object to `CreatePushStream()` by using the static function `AudioStreamFormat.GetWaveFormatPCM(sampleRate, (byte)bitRate, (byte)channels)`.

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

class Program 
{
    async static Task FromStream(SpeechConfig speechConfig)
    {
        var reader = new BinaryReader(File.OpenRead("PathToFile.wav"));
        using var audioConfigStream = AudioInputStream.CreatePushStream();
        using var audioConfig = AudioConfig.FromStreamInput(audioConfigStream);
        using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

        byte[] readBytes;
        do
        {
            readBytes = reader.ReadBytes(1024);
            audioConfigStream.Write(readBytes, readBytes.Length);
        } while (readBytes.Length > 0);

        var result = await speechRecognizer.RecognizeOnceAsync();
        Console.WriteLine($"RECOGNIZED: Text={result.Text}");
    }

    async static Task Main(string[] args)
    {
        var speechConfig = SpeechConfig.FromSubscription("YourSpeechKey", "YourSpeechRegion");
        await FromStream(speechConfig);
    }
}
```

Using a push stream as input assumes that the audio data is a raw PCM and skips any headers. The API will still work in certain cases if the header has not been skipped. But for the best results, consider implementing logic to read off the headers so that `byte[]` starts at the *start of the audio data*.

## Handle errors

The previous examples simply get the recognized text from `result.text`. To handle errors and other responses, you need to write some code to handle the result. The following code evaluates the [`result.Reason`](/dotnet/api/microsoft.cognitiveservices.speech.recognitionresult.reason) property and:

* Prints the recognition result: `ResultReason.RecognizedSpeech`.
* If there is no recognition match, informs the user: `ResultReason.NoMatch`.
* If an error is encountered, prints the error message: `ResultReason.Canceled`.

```csharp
switch (result.Reason)
{
    case ResultReason.RecognizedSpeech:
        Console.WriteLine($"RECOGNIZED: Text={result.Text}");
        break;
    case ResultReason.NoMatch:
        Console.WriteLine($"NOMATCH: Speech could not be recognized.");
        break;
    case ResultReason.Canceled:
        var cancellation = CancellationDetails.FromResult(result);
        Console.WriteLine($"CANCELED: Reason={cancellation.Reason}");

        if (cancellation.Reason == CancellationReason.Error)
        {
            Console.WriteLine($"CANCELED: ErrorCode={cancellation.ErrorCode}");
            Console.WriteLine($"CANCELED: ErrorDetails={cancellation.ErrorDetails}");
            Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
        }
        break;
}
```

## Use continuous recognition

The previous examples use single-shot recognition, which recognizes a single utterance. The end of a single utterance is determined by listening for silence at the end or until a maximum of 15 seconds of audio is processed.

In contrast, you use continuous recognition when you want to control when to stop recognizing. It requires you to subscribe to the `Recognizing`, `Recognized`, and `Canceled` events to get the recognition results. To stop recognition, you must call [`StopContinuousRecognitionAsync`](/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer.stopcontinuousrecognitionasync). Here's an example of how continuous recognition is performed on an audio input file.

Start by defining the input and initializing [`SpeechRecognizer`](/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer):

```csharp
using var audioConfig = AudioConfig.FromWavFileInput("YourAudioFile.wav");
using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
```

Then create a `TaskCompletionSource<int>` instance to manage the state of speech recognition:

```csharp
var stopRecognition = new TaskCompletionSource<int>();
```

Next, subscribe to the events that `SpeechRecognizer` sends:

* [`Recognizing`](/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer.recognizing): Signal for events that contain intermediate recognition results.
* [`Recognized`](/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer.recognized): Signal for events that contain final recognition results, which indicate a successful recognition attempt.
* [`SessionStopped`](/dotnet/api/microsoft.cognitiveservices.speech.recognizer.sessionstopped): Signal for events that indicate the end of a recognition session (operation).
* [`Canceled`](/dotnet/api/microsoft.cognitiveservices.speech.speechrecognizer.canceled): Signal for events that contain canceled recognition results. These results indicate a recognition attempt that was canceled as a result of a direct cancellation request. Alternatively, they indicate a transport or protocol failure.

```csharp
speechRecognizer.Recognizing += (s, e) =>
{
    Console.WriteLine($"RECOGNIZING: Text={e.Result.Text}");
};

speechRecognizer.Recognized += (s, e) =>
{
    if (e.Result.Reason == ResultReason.RecognizedSpeech)
    {
        Console.WriteLine($"RECOGNIZED: Text={e.Result.Text}");
    }
    else if (e.Result.Reason == ResultReason.NoMatch)
    {
        Console.WriteLine($"NOMATCH: Speech could not be recognized.");
    }
};

speechRecognizer.Canceled += (s, e) =>
{
    Console.WriteLine($"CANCELED: Reason={e.Reason}");

    if (e.Reason == CancellationReason.Error)
    {
        Console.WriteLine($"CANCELED: ErrorCode={e.ErrorCode}");
        Console.WriteLine($"CANCELED: ErrorDetails={e.ErrorDetails}");
        Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
    }

    stopRecognition.TrySetResult(0);
};

speechRecognizer.SessionStopped += (s, e) =>
{
    Console.WriteLine("\n    Session stopped event.");
    stopRecognition.TrySetResult(0);
};
```

With everything set up, call `StartContinuousRecognitionAsync` to start recognizing:

```csharp
await speechRecognizer.StartContinuousRecognitionAsync();

// Waits for completion. Use Task.WaitAny to keep the task rooted.
Task.WaitAny(new[] { stopRecognition.Task });

// Make the following call at some point to stop recognition:
// await speechRecognizer.StopContinuousRecognitionAsync();
```

## Change the source language

A common task for speech recognition is specifying the input (or source) language. The following example shows how you would change the input language to Italian. In your code, find your [`SpeechConfig`](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig) instance and add this line directly below it:

```csharp
speechConfig.SpeechRecognitionLanguage = "it-IT";
```

The [`SpeechRecognitionLanguage`](/dotnet/api/microsoft.cognitiveservices.speech.speechconfig.speechrecognitionlanguage) property expects a language-locale format string. Refer to the [list of supported speech to text locales](../../../language-support.md?tabs=stt).

## Language identification

You can use [language identification](../../../language-identification.md?pivots=programming-language-csharp#speech-to-text) with Speech to text recognition when you need to identify the language in an audio source and then transcribe it to text.

For a complete code sample, see [language identification](../../../language-identification.md?pivots=programming-language-csharp#speech-to-text).

## Use a custom endpoint

With [Custom Speech](../../../custom-speech-overview.md), you can upload your own data, test and train a custom model, compare accuracy between models, and deploy a model to a custom endpoint. The following example shows how to set a custom endpoint.

```csharp
var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey", "YourServiceRegion");
speechConfig.EndpointId = "YourEndpointId";
var speechRecognizer = new SpeechRecognizer(speechConfig);
```

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

For more information about containers, see the [speech containers](../../../speech-container-howto.md#host-urls) how-to guide.

## Change how silence is handled

If a user is expected to speak faster or slower than usual, the default behaviors for non-speech silence in input audio may not result in what you expect. Common problems with silence handling include:

- Fast speech chaining many sentences together into a single recognition result instead of breaking sentences into individual results
- Slow speech separating parts of a single sentence into multiple results
- A single-shot recognition ending too quickly while waiting for speech to begin

These problems can be addressed by setting one of two *timeout properties* on the `SpeechConfig` used to create a `SpeechRecognizer`:

- **Segmentation silence timeout** adjusts how much non-speech audio is allowed within a phrase that's currently being spoken before that phrase is considered "done."
  - *Higher* values generally make results longer and allow longer pauses from the speaker within a phrase, but will make results take longer to arrive can also make separate phrases combine together into a single result when set too high
  - *Lower* values generally make results shorter and ensure more prompt and frequent breaks between phrases, but can also cause single phrases to separate into multiple results when set too low
  - This timeout can be set to integer values between 100 and 5000, in milliseconds, with 500 a typical default
- **Initial silence timeout** adjusts how much non-speech audio is allowed *before* a phrase before the recognition attempt ends in a "no match" result.
  - *Higher* values give speakers more time to react and start speaking, but can also result in slow responsiveness when nothing is spoken 
  - *Lower* values ensure a prompt "no match" for faster user experience and more controlled audio handling, but may cut a speaker off too quickly when set too low
  - Because continuous recognition generates many results, this value determines how often "no match" results will arrive but doesn't otherwise affect the content of recognition results
  - This timeout can be set to any non-negative integer value, in milliseconds, or set to 0 to disable it entirely; 5000 is a typical default for single-shot recognition while 15000 is a typical default for continuous recognition 

As there are tradeoffs when modifying these timeouts, it's only recommended to change the settings when a problem related to silence handling is observed. Default values optimally handle the majority of spoken audio and only uncommon scenarios should encounter problems.

**Example:** users speaking a serial number like "ABC-123-4567" pause between character groups long enough for the serial number to be broken into multiple results. In this case, setting the segmentation silence timeout to a higher value like 2000ms could help:

```csharp
speechConfig.SetProperty(PropertyId.Speech_SegmentationSilenceTimeoutMs, "2000");
```

**Example:** a recorded presenter's speech is fast enough that several sentences in a row get combined, with big recognition results only arriving once or twice per minute. In this case, setting the segmentation silence timeout to a lower value like 300ms could help:

```csharp
speechConfig.SetProperty(PropertyId.Speech_SegmentationSilenceTimeoutMs, "300");
```

**Example:** a single-shot recognition asking a speaker to find and read a serial number ends too quickly while the number is being found. In this case, a longer initial silence timeout like 10000ms could help:

```csharp
speechConfig.SetProperty(PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, "10000");
```
