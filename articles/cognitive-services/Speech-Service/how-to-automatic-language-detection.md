---
title: How to use language identification
titleSuffix: Azure Cognitive Services
description: Language identification is used to determine the language being spoken in audio passed to the Speech SDK when compared against a list of provided languages.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/21/2021
ms.author: lajanuar
zone_pivot_groups: programming-languages-speech-services-nomore-variant
---

# How to use language identification

Language identification is used to determine the language being spoken in audio passed to the Speech SDK when compared against a list of provided languages. The value returned by language identification is then used to select the language model for speech to text, providing you with a more accurate transcription. 

Language identification can also be used while doing [speech translation](./get-started-speech-translation.md?pivots=programming-language-csharp&tabs=script%2cwindowsinstall#multi-lingual-translation-with-language-identification), or by doing [standalone identification](#standalone-language-identification). To see which languages are available, see [Language support](language-support.md).

## Prerequisites

This article assumes you have an Azure subscription and speech resource, and also assumes knowledge of speech recognition basics. [Complete the quickstart](get-started-speech-to-text.md) if you haven't already.

## Language identification with speech-to-text

Language identification currently has a limit of **four languages** for single-shot recognition, and **10 languages** for continuous recognition. Keep this limitation in mind when constructing your `AutoDetectSourceLanguageConfig` object. In the samples below, you use `AutoDetectSourceLanguageConfig` to define a list of possible languages that you want to identify, and then reference those languages when running speech recognition.

> [!IMPORTANT]
> Continuous language identification is only supported in C#, C++, and Python.

::: zone pivot="programming-language-csharp"

The following example runs single-shot recognition, prioritizing `Latency`. This property can also be set to `Accuracy` depending on the priority for your use-case. `Latency` is the best option to use if you need a low-latency result (e.g. for live streaming scenarios), but don't know the language in the audio sample. 

`Accuracy` should be used in scenarios where the audio quality may be poor, and more latency is acceptable. For example, a voicemail could have background noise, or some silence at the beginning, and allowing the engine more time will improve recognition results.

In either case, single-shot recognition as shown below should **not be used** for scenarios where the language may be changing within the same audio sample. See below for continuous recognition for these types of scenarios.

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var speechConfig = SpeechConfig.FromSubscription("<paste-your-subscription-key>","<paste-your-region>");
// can switch "Latency" to "Accuracy" depending on priority
speechConfig.SetProperty(PropertyId.SpeechServiceConnection_SingleLanguageIdPriority, "Latency");

var autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.FromLanguages(
        new string[] { "en-US", "de-DE", "ja-JP", "de-DE" });

using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
using (var recognizer = new SpeechRecognizer(
    speechConfig,
    autoDetectSourceLanguageConfig,
    audioConfig))
{
    var speechRecognitionResult = await recognizer.RecognizeOnceAsync();
    var autoDetectSourceLanguageResult =
        AutoDetectSourceLanguageResult.FromResult(speechRecognitionResult);
    var detectedLanguage = autoDetectSourceLanguageResult.Language;
}
```

The following example shows continuous speech recognition set up for a multilingual scenario. This example only uses `en-US` and `ja-JP` in the language config, but you can use up to **ten languages** for this design pattern. Each time speech is detected, the source language is identified and the audio is also converted to text output. This example uses `Latency` mode, which prioritizes response time.

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var region = "<paste-your-region>";
// currently the v2 endpoint is required for this design pattern
var endpointString = $"wss://{region}.stt.speech.microsoft.com/speech/universal/v2";
var endpointUrl = new Uri(endpointString);

var config = SpeechConfig.FromEndpoint(endpointUrl, "<paste-your-subscription-key>");
// can switch "Latency" to "Accuracy" depending on priority
config.SetProperty(PropertyId.SpeechServiceConnection_ContinuousLanguageIdPriority, "Latency");

var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.FromLanguages(new string[] { "en-US", "ja-JP" });

var stopRecognition = new TaskCompletionSource<int>();
using (var audioInput = AudioConfig.FromWavFileInput(@"path-to-your-audio-file.wav"))
{
    using (var recognizer = new SpeechRecognizer(config, autoDetectSourceLanguageConfig, audioInput))
    {
        // Subscribes to events.
        recognizer.Recognizing += (s, e) =>
        {
            if (e.Result.Reason == ResultReason.RecognizingSpeech)
            {
                Console.WriteLine($"RECOGNIZING: Text={e.Result.Text}");
                var autoDetectSourceLanguageResult = AutoDetectSourceLanguageResult.FromResult(e.Result);
                Console.WriteLine($"DETECTED: Language={autoDetectSourceLanguageResult.Language}");
            }
        };

        recognizer.Recognized += (s, e) =>
        {
            if (e.Result.Reason == ResultReason.RecognizedSpeech)
            {
                Console.WriteLine($"RECOGNIZED: Text={e.Result.Text}");
                var autoDetectSourceLanguageResult = AutoDetectSourceLanguageResult.FromResult(e.Result);
                Console.WriteLine($"DETECTED: Language={autoDetectSourceLanguageResult.Language}");
            }
            else if (e.Result.Reason == ResultReason.NoMatch)
            {
                Console.WriteLine($"NOMATCH: Speech could not be recognized.");
            }
        };

        recognizer.Canceled += (s, e) =>
        {
            Console.WriteLine($"CANCELED: Reason={e.Reason}");

            if (e.Reason == CancellationReason.Error)
            {
                Console.WriteLine($"CANCELED: ErrorCode={e.ErrorCode}");
                Console.WriteLine($"CANCELED: ErrorDetails={e.ErrorDetails}");
                Console.WriteLine($"CANCELED: Did you update the subscription info?");
            }

            stopRecognition.TrySetResult(0);
        };

        recognizer.SessionStarted += (s, e) =>
        {
            Console.WriteLine("\n    Session started event.");
        };

        recognizer.SessionStopped += (s, e) =>
        {
            Console.WriteLine("\n    Session stopped event.");
            Console.WriteLine("\nStop recognition.");
            stopRecognition.TrySetResult(0);
        };

        // Starts continuous recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
        await recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);

        // Waits for completion.
        // Use Task.WaitAny to keep the task rooted.
        Task.WaitAny(new[] { stopRecognition.Task });

        // Stops recognition.
        await recognizer.StopContinuousRecognitionAsync().ConfigureAwait(false);
    }
}
```

> [!NOTE]
> `Latency` and `Accuracy` modes, and multilingual continuous recognition, are currently only supported in C#, C++, and Python.
 
::: zone-end

::: zone pivot="programming-language-cpp"

The following example runs single-shot recognition, prioritizing `Latency`. This property can also be set to `Accuracy` depending on the priority for your use-case. `Latency` is the best option to use if you need a low-latency result (e.g. for a live streaming case), but don't know the language in the audio sample. 

`Accuracy` should be used in scenarios where the audio quality may be poor, and more latency is acceptable. For example, a voicemail could have background noise, or some silence at the beginning, and allowing the engine more time will improve recognition results.

In either case, single-shot recognition as shown below should **not be used** for scenarios where the language may be changing within the same audio sample. See below for continuous recognition for these types of scenarios.

```cpp
using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto speechConfig = SpeechConfig::FromSubscription("<paste-your-subscription-key>","<paste-your-region>");
speechConfig->SetProperty(PropertyId::SpeechServiceConnection_SingleLanguageIdPriority, "Latency");

auto autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE", "ja-JP", "de-DE" });

auto recognizer = SpeechRecognizer::FromConfig(
    speechConfig,
    autoDetectSourceLanguageConfig
    );

speechRecognitionResult = recognizer->RecognizeOnceAsync().get();
auto autoDetectSourceLanguageResult =
    AutoDetectSourceLanguageResult::FromResult(speechRecognitionResult);
auto detectedLanguage = autoDetectSourceLanguageResult->Language;
```

The following example shows continuous speech recognition set up for a multilingual scenario. This example only uses `en-US` and `ja-JP` in the language config, but you can use up to **ten languages** for this design pattern. Each time speech is detected, the source language is identified and the audio is also converted to text output. This example uses `Latency` mode, which prioritizes response time.

```cpp
using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto region = "<paste-your-region>";
// currently the v2 endpoint is required for this design pattern
auto endpointString = std::format("wss://{}.stt.speech.microsoft.com/speech/universal/v2", region);
auto config = SpeechConfig::FromEndpoint(endpointString, "<paste-your-subscription-key>");

config->SetProperty(PropertyId::SpeechServiceConnection_ContinuousLanguageIdPriority, "Latency");
auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "ja-JP" });

auto audioInput = AudioConfig::FromWavFileInput("path-to-your-audio-file.wav");
auto recognizer = SpeechRecognizer::FromConfig(config, autoDetectSourceLanguageConfig, audioInput);

// promise for synchronization of recognition end.
promise<void> recognitionEnd;

// Subscribes to events.
recognizer->Recognizing.Connect([](const SpeechRecognitionEventArgs& e)
    {
        auto lidResult = AutoDetectSourceLanguageResult::FromResult(e.Result);
        cout << "Recognizing in " << lidResult->Language << ": Text =" << e.Result->Text << std::endl;
    });

recognizer->Recognized.Connect([](const SpeechRecognitionEventArgs& e)
    {
        if (e.Result->Reason == ResultReason::RecognizedSpeech)
        {
            auto lidResult = AutoDetectSourceLanguageResult::FromResult(e.Result);
            cout << "RECOGNIZED in " << lidResult->Language << ": Text=" << e.Result->Text << "\n"
                << "  Offset=" << e.Result->Offset() << "\n"
                << "  Duration=" << e.Result->Duration() << std::endl;
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
                << "CANCELED: Did you update the subscription info?" << std::endl;

            recognitionEnd.set_value(); // Notify to stop recognition.
        }
    });

recognizer->SessionStopped.Connect([&recognitionEnd](const SessionEventArgs& e)
    {
        cout << "Session stopped.";
        recognitionEnd.set_value(); // Notify to stop recognition.
    });

recognizer->StartContinuousRecognitionAsync().get();

// Waits for recognition end.
recognitionEnd.get_future().get();

// Stops recognition.
recognizer->StopContinuousRecognitionAsync().get();
```

> [!NOTE]
> `Latency` and `Accuracy` modes, and multilingual continuous recognition, are currently only supported in C#, C++, and Python.

::: zone-end

::: zone pivot="programming-language-java"

```java
AutoDetectSourceLanguageConfig autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.fromLanguages(Arrays.asList("en-US", "de-DE"));

SpeechRecognizer recognizer = new SpeechRecognizer(
    speechConfig,
    autoDetectSourceLanguageConfig,
    audioConfig);

Future<SpeechRecognitionResult> future = recognizer.recognizeOnceAsync();
SpeechRecognitionResult result = future.get(30, TimeUnit.SECONDS);
AutoDetectSourceLanguageResult autoDetectSourceLanguageResult =
    AutoDetectSourceLanguageResult.fromResult(result);
String detectedLanguage = autoDetectSourceLanguageResult.getLanguage();

recognizer.close();
speechConfig.close();
autoDetectSourceLanguageConfig.close();
audioConfig.close();
result.close();
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
auto_detect_source_language_config = \
        speechsdk.languageconfig.AutoDetectSourceLanguageConfig(languages=["en-US", "de-DE"])
speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, 
        auto_detect_source_language_config=auto_detect_source_language_config, 
        audio_config=audio_config)
result = speech_recognizer.recognize_once()
auto_detect_source_language_result = speechsdk.AutoDetectSourceLanguageResult(result)
detected_language = auto_detect_source_language_result.language
```

::: zone-end

::: zone pivot="programming-language-objectivec"

```Objective-C
NSArray *languages = @[@"zh-CN", @"de-DE"];
SPXAutoDetectSourceLanguageConfiguration* autoDetectSourceLanguageConfig = \
        [[SPXAutoDetectSourceLanguageConfiguration alloc]init:languages];
SPXSpeechRecognizer* speechRecognizer = \
        [[SPXSpeechRecognizer alloc] initWithSpeechConfiguration:speechConfig
                           autoDetectSourceLanguageConfiguration:autoDetectSourceLanguageConfig
                                              audioConfiguration:audioConfig];
SPXSpeechRecognitionResult *result = [speechRecognizer recognizeOnce];
SPXAutoDetectSourceLanguageResult *languageDetectionResult = [[SPXAutoDetectSourceLanguageResult alloc] init:result];
NSString *detectedLanguage = [languageDetectionResult language];
```

::: zone-end

::: zone pivot="programming-language-javascript"

```Javascript
var autoDetectConfig = SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "de-DE"]);
var speechRecognizer = SpeechSDK.SpeechRecognizer.FromConfig(speechConfig, autoDetectConfig, audioConfig);
speechRecognizer.recognizeOnceAsync((result: SpeechSDK.SpeechRecognitionResult) => {
        var languageDetectionResult = SpeechSDK.AutoDetectSourceLanguageResult.fromResult(result);
        var detectedLanguage = languageDetectionResult.language;
},
{});
```

::: zone-end

## Standalone language identification

::: zone pivot="programming-language-csharp"

In uses cases where you only want to detect the source language being spoken, you can use standalone language identification as shown in the following code sample. `SourceLanguageRecognizer` can also be used in continuous recognition scenarios.

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var speechConfig = SpeechConfig.FromSubscription("<paste-your-subscription-key>","<paste-your-region>");
// can switch "Latency" to "Accuracy" depending on priority
speechConfig.SetProperty(PropertyId.SpeechServiceConnection_SingleLanguageIdPriority, "Latency");

var autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.FromLanguages(
        new string[] { "en-US", "de-DE" });

using (var recognizer = new SourceLanguageRecognizer(speechConfig, autoDetectSourceLanguageConfig))
{
    var result = await recognizer.RecognizeOnceAsync();
    if (result.Reason == ResultReason.RecognizedSpeech)
    {
        var lang = AutoDetectSourceLanguageResult.FromResult(result).Language;
        Console.WriteLine($"DETECTED: Language={lang}");
    }
}
```

See the [sample on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/standalone_language_detection_samples.cs) for more examples of standalone language identification, including an example of continuous identification.

::: zone-end

::: zone pivot="programming-language-cpp"

In uses cases where you only want to detect the source language being spoken, you can use standalone language identification as shown in the following code sample. `SourceLanguageRecognizer` can also be used in continuous recognition scenarios.

```cpp
using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto config = SpeechConfig::FromSubscription("<paste-your-subscription-key>","<paste-your-region>");
config->SetProperty(PropertyId::SpeechServiceConnection_SingleLanguageIdPriority, "Latency");

auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE" });

auto recognizer = SourceLanguageRecognizer::FromConfig(config, autoDetectSourceLanguageConfig);
cout << "Say something...\n";

auto result = recognizer->RecognizeOnceAsync().get();
if (result->Reason == ResultReason::RecognizedSpeech)
{
    auto lidResult = AutoDetectSourceLanguageResult::FromResult(result);
    cout << "DETECTED: Language="<< lidResult->Language << std::endl;
}
```

See the [sample on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/standalone_language_detection_samples.cpp) for more examples of standalone language identification, including an example of continuous identification.

::: zone-end

::: zone pivot="programming-language-java"
> [!IMPORTANT]
> This feature is currently only supported in C#, C++, and Python.
::: zone-end

::: zone pivot="programming-language-python"
> [!IMPORTANT]
> This feature is currently only supported in C#, C++, and Python.
::: zone-end

::: zone pivot="programming-language-objectivec"
> [!IMPORTANT]
> This feature is currently only supported in C#, C++, and Python.
::: zone-end

::: zone pivot="programming-language-javascript"
> [!IMPORTANT]
> This feature is currently only supported in C#, C++, and Python.
::: zone-end

## Use a custom model for language identification

In addition to language identification using Speech service base models, you can also specify a custom model for enhanced recognition. If a custom model isn't provided, the service will use the default language model.

The snippets below illustrate how to specify a custom model in your call to the Speech service. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the endpoint for the custom model is used:

::: zone pivot="programming-language-csharp"

```csharp
var sourceLanguageConfigs = new SourceLanguageConfig[]
{
    SourceLanguageConfig.FromLanguage("en-US"),
    SourceLanguageConfig.FromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR")
};
var autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.FromSourceLanguageConfigs(
        sourceLanguageConfigs);
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
std::vector<std::shared_ptr<SourceLanguageConfig>> sourceLanguageConfigs;
sourceLanguageConfigs.push_back(
    SourceLanguageConfig::FromLanguage("en-US"));
sourceLanguageConfigs.push_back(
    SourceLanguageConfig::FromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR"));

auto autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig::FromSourceLanguageConfigs(
        sourceLanguageConfigs);
```

::: zone-end

::: zone pivot="programming-language-java"

```java
List sourceLanguageConfigs = new ArrayList<SourceLanguageConfig>();
sourceLanguageConfigs.add(
    SourceLanguageConfig.fromLanguage("en-US"));
sourceLanguageConfigs.add(
    SourceLanguageConfig.fromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR"));

AutoDetectSourceLanguageConfig autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs(
        sourceLanguageConfigs);
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
 en_language_config = speechsdk.languageconfig.SourceLanguageConfig("en-US")
 fr_language_config = speechsdk.languageconfig.SourceLanguageConfig("fr-FR", "The Endpoint Id for custom model of fr-FR")
 auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(
        sourceLanguageConfigs=[en_language_config, fr_language_config])
```

::: zone-end

::: zone pivot="programming-language-objectivec"

```Objective-C
SPXSourceLanguageConfiguration* enLanguageConfig = [[SPXSourceLanguageConfiguration alloc]init:@"en-US"];
SPXSourceLanguageConfiguration* frLanguageConfig = \
        [[SPXSourceLanguageConfiguration alloc]initWithLanguage:@"fr-FR"
                                                     endpointId:@"The Endpoint Id for custom model of fr-FR"];
NSArray *languageConfigs = @[enLanguageConfig, frLanguageConfig];
SPXAutoDetectSourceLanguageConfiguration* autoDetectSourceLanguageConfig = \
        [[SPXAutoDetectSourceLanguageConfiguration alloc]initWithSourceLanguageConfigurations:languageConfigs];
```

::: zone-end

::: zone pivot="programming-language-javascript"

```Javascript
var enLanguageConfig = SpeechSDK.SourceLanguageConfig.fromLanguage("en-US");
var frLanguageConfig = SpeechSDK.SourceLanguageConfig.fromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR");
var autoDetectConfig = SpeechSDK.AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs([enLanguageConfig, frLanguageConfig]);
```

::: zone-end

## Next steps

::: zone pivot="programming-language-csharp"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#L741) on GitHub for language identification
::: zone-end

::: zone pivot="programming-language-cpp"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp#L507) on GitHub for language identification
::: zone-end

::: zone pivot="programming-language-java"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechRecognitionSamples.java#L521) on GitHub for language identification
::: zone-end

::: zone pivot="programming-language-python"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py#L458) on GitHub for language identification
::: zone-end

::: zone pivot="programming-language-objectivec"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/objective-c/ios/speech-samples/speech-samples/ViewController.m#L525) on GitHub for language identification
::: zone-end

* [Speech SDK reference documentation](speech-sdk.md)