---
title: Language identification - Speech service
titleSuffix: Azure AI services
description: Language identification is used to determine the language being spoken in audio when compared against a list of provided languages.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 04/19/2023
ms.author: eur
zone_pivot_groups: programming-languages-speech-services-nomore-variant
---

# Language identification

Language identification is used to identify languages spoken in audio when compared against a list of [supported languages](language-support.md?tabs=language-identification).

Language identification (LID) use cases include:

* [Speech to text recognition](#speech-to-text) when you need to identify the language in an audio source and then transcribe it to text.
* [Speech translation](#speech-translation) when you need to identify the language in an audio source and then translate it to another language.

For speech recognition, the initial latency is higher with language identification. You should only include this optional feature as needed.

## Configuration options

> [!IMPORTANT]
> Language Identification APIs are simplified with the Speech SDK version 1.25 and later. The 
`SpeechServiceConnection_SingleLanguageIdPriority` and `SpeechServiceConnection_ContinuousLanguageIdPriority` properties have
been removed and replaced by a single property `SpeechServiceConnection_LanguageIdMode`. Prioritizing between low latency and high accuracy is no longer necessary following recent model improvements. Now, you only need to select whether to run at-start or continuous Language Identification when doing continuous speech recognition or translation.

Whether you use language identification with [speech to text](#speech-to-text) or with [speech translation](#speech-translation), there are some common concepts and configuration options.

- Define a list of [candidate languages](#candidate-languages) that you expect in the audio.
- Decide whether to use [at-start or continuous](#at-start-and-continuous-language-identification) language identification.

Then you make a [recognize once or continuous recognition](#recognize-once-or-continuous) request to the Speech service.

Code snippets are included with the concepts described next. Complete samples for each use case are provided later.

### Candidate languages

You provide candidate languages with the `AutoDetectSourceLanguageConfig` object, at least one of which is expected to be in the audio. You can include up to four languages for [at-start LID](#at-start-and-continuous-language-identification) or up to 10 languages for [continuous LID](#at-start-and-continuous-language-identification). The Speech service returns one of the candidate languages provided even if those languages weren't in the audio. For example, if `fr-FR` (French) and `en-US` (English) are provided as candidates, but German is spoken, either `fr-FR` or `en-US` would be returned. 

You must provide the full locale with dash (`-`) separator, but language identification only uses one locale per base language. Don't include multiple locales (for example, "en-US" and "en-GB") for the same language.

::: zone pivot="programming-language-csharp"

```csharp
var autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.FromLanguages(new string[] { "en-US", "de-DE", "zh-CN" });
```

::: zone-end
::: zone pivot="programming-language-cpp"

```cpp
auto autoDetectSourceLanguageConfig = 
    AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE", "zh-CN" });
```

::: zone-end
::: zone pivot="programming-language-python"

```python
auto_detect_source_language_config = \
    speechsdk.languageconfig.AutoDetectSourceLanguageConfig(languages=["en-US", "de-DE", "zh-CN"])
```

::: zone-end
::: zone pivot="programming-language-java"

```java
AutoDetectSourceLanguageConfig autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.fromLanguages(Arrays.asList("en-US", "de-DE", "zh-CN"));
```

::: zone-end
::: zone pivot="programming-language-javascript"

```javascript
var autoDetectSourceLanguageConfig = SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages([("en-US", "de-DE", "zh-CN"]);
```

::: zone-end
::: zone pivot="programming-language-objectivec"

```objective-c
NSArray *languages = @[@"en-US", @"de-DE", @"zh-CN"];
SPXAutoDetectSourceLanguageConfiguration* autoDetectSourceLanguageConfig = \
    [[SPXAutoDetectSourceLanguageConfiguration alloc]init:languages];
```

::: zone-end

For more information, see [supported languages](language-support.md?tabs=language-identification).

### At-start and Continuous language identification

Speech supports both at-start and continuous language identification (LID).

> [!NOTE]
> Continuous language identification is only supported with Speech SDKs in C#, C++, Java ([for speech to text only](#speech-to-text)), JavaScript ([for speech to text only](#speech-to-text)),and Python.
- At-start LID identifies the language once within the first few seconds of audio. Use at-start LID if the language in the audio won't change. With at-start LID, a single language is detected and returned in less than 5 seconds.
- Continuous LID can identify multiple languages for the duration of the audio. Use continuous LID if the language in the audio could change. Continuous LID doesn't support changing languages within the same sentence. For example, if you're primarily speaking Spanish and insert some English words, it will not detect the language change per word. 

You implement at-start LID or continuous LID by calling methods for [recognize once or continuous](#recognize-once-or-continuous). Continuous LID is only supported with continuous recognition.

### Recognize once or continuous

Language identification is completed with recognition objects and operations. You'll make a request to the Speech service for recognition of audio.

> [!NOTE]
> Don't confuse recognition with identification. Recognition can be used with or without language identification.

You'll either call the "recognize once" method, or the start and stop continuous recognition methods. You choose from:

- Recognize once with At-start LID. Continuous LID isn't supported for recognize once.
- Continuous recognition with at-start LID
- Continuous recognition with continuous LID

The `SpeechServiceConnection_LanguageIdMode` property is only required for continuous LID. Without it, the Speech service defaults to at-start lid. The supported values are "AtStart" for at-start LID or "Continuous" for continuous LID. 

::: zone pivot="programming-language-csharp"

```csharp
// Recognize once with At-start LID. Continuous LID isn't supported for recognize once.
var result = await recognizer.RecognizeOnceAsync();

// Start and stop continuous recognition with At-start LID
await recognizer.StartContinuousRecognitionAsync();
await recognizer.StopContinuousRecognitionAsync();

// Start and stop continuous recognition with Continuous LID
speechConfig.SetProperty(PropertyId.SpeechServiceConnection_LanguageIdMode, "Continuous");
await recognizer.StartContinuousRecognitionAsync();
await recognizer.StopContinuousRecognitionAsync();
```

::: zone-end
::: zone pivot="programming-language-cpp"

```cpp
// Recognize once with At-start LID. Continuous LID isn't supported for recognize once.
auto result = recognizer->RecognizeOnceAsync().get();

// Start and stop continuous recognition with At-start LID
recognizer->StartContinuousRecognitionAsync().get();
recognizer->StopContinuousRecognitionAsync().get();

// Start and stop continuous recognition with Continuous LID
speechConfig->SetProperty(PropertyId::SpeechServiceConnection_LanguageIdMode, "Continuous");
recognizer->StartContinuousRecognitionAsync().get();
recognizer->StopContinuousRecognitionAsync().get();
```

::: zone-end
::: zone pivot="programming-language-java"

```java
// Recognize once with At-start LID. Continuous LID isn't supported for recognize once.
SpeechRecognitionResult  result = recognizer->RecognizeOnceAsync().get();

// Start and stop continuous recognition with At-start LID
recognizer.startContinuousRecognitionAsync().get();
recognizer.stopContinuousRecognitionAsync().get();

// Start and stop continuous recognition with Continuous LID
speechConfig.setProperty(PropertyId.SpeechServiceConnection_LanguageIdMode, "Continuous");
recognizer.startContinuousRecognitionAsync().get();
recognizer.stopContinuousRecognitionAsync().get();
```

::: zone-end
::: zone pivot="programming-language-python"

```python
# Recognize once with At-start LID. Continuous LID isn't supported for recognize once.
result = recognizer.recognize_once()

# Start and stop continuous recognition with At-start LID
recognizer.start_continuous_recognition()
recognizer.stop_continuous_recognition()

# Start and stop continuous recognition with Continuous LID
speech_config.set_property(property_id=speechsdk.PropertyId.SpeechServiceConnection_LanguageIdMode, value='Continuous')
recognizer.start_continuous_recognition()
recognizer.stop_continuous_recognition()
```

::: zone-end

## Speech to text

You use Speech to text recognition when you need to identify the language in an audio source and then transcribe it to text. For more information, see [Speech to text overview](speech-to-text.md).

> [!NOTE]
> Speech to text recognition with at-start language identification is supported with Speech SDKs in C#, C++, Python, Java, JavaScript, and Objective-C. Speech to text recognition with continuous language identification is only supported with Speech SDKs in C#, C++, Java, JavaScript, and Python.
> 
> Currently for speech to text recognition with continuous language identification, you must create a SpeechConfig from the `wss://{region}.stt.speech.microsoft.com/speech/universal/v2` endpoint string, as shown in code examples. In a future SDK release you won't need to set it.

::: zone pivot="programming-language-csharp"

See more examples of speech to text recognition with language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_with_language_id_samples.cs).

### [Recognize once](#tab/once)

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var speechConfig = SpeechConfig.FromSubscription("YourSubscriptionKey","YourServiceRegion");

var autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig.FromLanguages(
        new string[] { "en-US", "de-DE", "zh-CN" });

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

### [Continuous recognition](#tab/continuous)

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var region = "YourServiceRegion";
// Currently the v2 endpoint is required. In a future SDK release you won't need to set it.
var endpointString = $"wss://{region}.stt.speech.microsoft.com/speech/universal/v2";
var endpointUrl = new Uri(endpointString);

var config = SpeechConfig.FromEndpoint(endpointUrl, "YourSubscriptionKey");

// Set the LanguageIdMode (Optional; Either Continuous or AtStart are accepted; Default AtStart)
config.SetProperty(PropertyId.SpeechServiceConnection_LanguageIdMode, "Continuous");

var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.FromLanguages(new string[] { "en-US", "de-DE", "zh-CN" });

var stopRecognition = new TaskCompletionSource<int>();
using (var audioInput = AudioConfig.FromWavFileInput(@"en-us_zh-cn.wav"))
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
                Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
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
---

::: zone-end

::: zone pivot="programming-language-cpp"

See more examples of speech to text recognition with language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp).

### [Recognize once](#tab/once)

```cpp
using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto speechConfig = SpeechConfig::FromSubscription("YourSubscriptionKey","YourServiceRegion");

auto autoDetectSourceLanguageConfig =
    AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE", "zh-CN" });

auto recognizer = SpeechRecognizer::FromConfig(
    speechConfig,
    autoDetectSourceLanguageConfig
    );

speechRecognitionResult = recognizer->RecognizeOnceAsync().get();
auto autoDetectSourceLanguageResult =
    AutoDetectSourceLanguageResult::FromResult(speechRecognitionResult);
auto detectedLanguage = autoDetectSourceLanguageResult->Language;
```

### [Continuous recognition](#tab/continuous)

:::code language="cpp" source="~/samples-cognitive-services-speech-sdk/samples/cpp/windows/console/samples/speech_recognition_samples.cpp" id="SpeechContinuousRecognitionAndLanguageIdWithMultiLingualFile":::

---

::: zone-end

::: zone pivot="programming-language-java"

See more examples of speech to text recognition with language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechRecognitionSamples.java).

### [Recognize once](#tab/once)

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

### [Continuous recognition](#tab/continuous)

:::code language="java" source="~/samples-cognitive-services-speech-sdk/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechRecognitionSamples.java" id="SpeechContinuousRecognitionAndLanguageId":::

---

::: zone-end

::: zone pivot="programming-language-python"

See more examples of speech to text recognition with language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py).

### [Recognize once](#tab/once)

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

### [Continuous recognition](#tab/continuous)

```python
import azure.cognitiveservices.speech as speechsdk
import time
import json

speech_key, service_region = "YourSubscriptionKey","YourServiceRegion"
weatherfilename="en-us_zh-cn.wav"

# Currently the v2 endpoint is required. In a future SDK release you won't need to set it. 
endpoint_string = "wss://{}.stt.speech.microsoft.com/speech/universal/v2".format(service_region)
speech_config = speechsdk.SpeechConfig(subscription=speech_key, endpoint=endpoint_string)
audio_config = speechsdk.audio.AudioConfig(filename=weatherfilename)

# Set the LanguageIdMode (Optional; Either Continuous or AtStart are accepted; Default AtStart)
speech_config.set_property(property_id=speechsdk.PropertyId.SpeechServiceConnection_LanguageIdMode, value='Continuous')

auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(
    languages=["en-US", "de-DE", "zh-CN"])

speech_recognizer = speechsdk.SpeechRecognizer(
    speech_config=speech_config, 
    auto_detect_source_language_config=auto_detect_source_language_config,
    audio_config=audio_config)

done = False

def stop_cb(evt):
    """callback that signals to stop continuous recognition upon receiving an event `evt`"""
    print('CLOSING on {}'.format(evt))
    nonlocal done
    done = True

# Connect callbacks to the events fired by the speech recognizer
speech_recognizer.recognizing.connect(lambda evt: print('RECOGNIZING: {}'.format(evt)))
speech_recognizer.recognized.connect(lambda evt: print('RECOGNIZED: {}'.format(evt)))
speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))
# stop continuous recognition on either session stopped or canceled events
speech_recognizer.session_stopped.connect(stop_cb)
speech_recognizer.canceled.connect(stop_cb)

# Start continuous speech recognition
speech_recognizer.start_continuous_recognition()
while not done:
    time.sleep(.5)

speech_recognizer.stop_continuous_recognition()
```

::: zone-end

::: zone pivot="programming-language-objectivec"

```Objective-C
NSArray *languages = @[@"en-US", @"de-DE", @"zh-CN"];
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
var autoDetectSourceLanguageConfig = SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages(["en-US", "de-DE"]);
var speechRecognizer = SpeechSDK.SpeechRecognizer.FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig);
speechRecognizer.recognizeOnceAsync((result: SpeechSDK.SpeechRecognitionResult) => {
        var languageDetectionResult = SpeechSDK.AutoDetectSourceLanguageResult.fromResult(result);
        var detectedLanguage = languageDetectionResult.language;
},
{});
```

::: zone-end

### Speech to text custom models

> [!NOTE]
> Language detection with custom models can only be used with real-time speech to text and speech translation. Batch transcription only supports language detection for base models. 

::: zone pivot="programming-language-csharp"
This sample shows how to use language detection with a custom endpoint. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the custom model endpoint is used. For more information, see [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md).

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
This sample shows how to use language detection with a custom endpoint. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the custom model endpoint is used. For more information, see [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md).

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
This sample shows how to use language detection with a custom endpoint. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the custom model endpoint is used. For more information, see [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md).

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
This sample shows how to use language detection with a custom endpoint. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the custom model endpoint is used. For more information, see [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md).

```Python
 en_language_config = speechsdk.languageconfig.SourceLanguageConfig("en-US")
 fr_language_config = speechsdk.languageconfig.SourceLanguageConfig("fr-FR", "The Endpoint Id for custom model of fr-FR")
 auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(
        sourceLanguageConfigs=[en_language_config, fr_language_config])
```

::: zone-end

::: zone pivot="programming-language-objectivec"
This sample shows how to use language detection with a custom endpoint. If the detected language is `en-US`, then the default model is used. If the detected language is `fr-FR`, then the custom model endpoint is used. For more information, see [Deploy a Custom Speech model](how-to-custom-speech-deploy-model.md).

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
Language detection with a custom endpoint isn't supported by the Speech SDK for JavaScript. For example, if you include "fr-FR" as shown here, the custom endpoint will be ignored.

```Javascript
var enLanguageConfig = SpeechSDK.SourceLanguageConfig.fromLanguage("en-US");
var frLanguageConfig = SpeechSDK.SourceLanguageConfig.fromLanguage("fr-FR", "The Endpoint Id for custom model of fr-FR");
var autoDetectSourceLanguageConfig = SpeechSDK.AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs([enLanguageConfig, frLanguageConfig]);
```

::: zone-end

## Speech translation

You use Speech translation when you need to identify the language in an audio source and then translate it to another language. For more information, see [Speech translation overview](speech-translation.md).

> [!NOTE]
> Speech translation with language identification is only supported with Speech SDKs in C#, C++, and Python. 
> Currently for speech translation with language identification, you must create a SpeechConfig from the `wss://{region}.stt.speech.microsoft.com/speech/universal/v2` endpoint string, as shown in code examples. In a future SDK release you won't need to set it.
::: zone pivot="programming-language-csharp"

See more examples of speech translation with language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/translation_samples.cs).

### [Recognize once](#tab/once)

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Translation;

public static async Task RecognizeOnceSpeechTranslationAsync()
{
    var region = "YourServiceRegion";
    // Currently the v2 endpoint is required. In a future SDK release you won't need to set it.
    var endpointString = $"wss://{region}.stt.speech.microsoft.com/speech/universal/v2";
    var endpointUrl = new Uri(endpointString);
    
    var config = SpeechTranslationConfig.FromEndpoint(endpointUrl, "YourSubscriptionKey");

    // Source language is required, but currently ignored. 
    string fromLanguage = "en-US";
    speechTranslationConfig.SpeechRecognitionLanguage = fromLanguage;

    speechTranslationConfig.AddTargetLanguage("de");
    speechTranslationConfig.AddTargetLanguage("fr");

    var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.FromLanguages(new string[] { "en-US", "de-DE", "zh-CN" });

    using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();

    using (var recognizer = new TranslationRecognizer(
        speechTranslationConfig, 
        autoDetectSourceLanguageConfig,
        audioConfig))
    {
        
        Console.WriteLine("Say something or read from file...");
        var result = await recognizer.RecognizeOnceAsync().ConfigureAwait(false);

        if (result.Reason == ResultReason.TranslatedSpeech)
        {
            var lidResult = result.Properties.GetProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult);

            Console.WriteLine($"RECOGNIZED in '{lidResult}': Text={result.Text}");
            foreach (var element in result.Translations)
            {
                Console.WriteLine($"    TRANSLATED into '{element.Key}': {element.Value}");
            }
        }
    }
}
```

### [Continuous recognition](#tab/continuous)

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Translation;

public static async Task MultiLingualTranslation()
{
    var region = "YourServiceRegion";
    // Currently the v2 endpoint is required. In a future SDK release you won't need to set it.
    var endpointString = $"wss://{region}.stt.speech.microsoft.com/speech/universal/v2";
    var endpointUrl = new Uri(endpointString);
    
    var config = SpeechTranslationConfig.FromEndpoint(endpointUrl, "YourSubscriptionKey");

    // Source language is required, but currently ignored. 
    string fromLanguage = "en-US";
    config.SpeechRecognitionLanguage = fromLanguage;

    config.AddTargetLanguage("de");
    config.AddTargetLanguage("fr");

    // Set the LanguageIdMode (Optional; Either Continuous or AtStart are accepted; Default AtStart)
    config.SetProperty(PropertyId.SpeechServiceConnection_LanguageIdMode, "Continuous");
    var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.FromLanguages(new string[] { "en-US", "de-DE", "zh-CN" });

    var stopTranslation = new TaskCompletionSource<int>();
    using (var audioInput = AudioConfig.FromWavFileInput(@"en-us_zh-cn.wav"))
    {
        using (var recognizer = new TranslationRecognizer(config, autoDetectSourceLanguageConfig, audioInput))
        {
            recognizer.Recognizing += (s, e) =>
            {
                var lidResult = e.Result.Properties.GetProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult);

                Console.WriteLine($"RECOGNIZING in '{lidResult}': Text={e.Result.Text}");
                foreach (var element in e.Result.Translations)
                {
                    Console.WriteLine($"    TRANSLATING into '{element.Key}': {element.Value}");
                }
            };

            recognizer.Recognized += (s, e) => {
                if (e.Result.Reason == ResultReason.TranslatedSpeech)
                {
                    var lidResult = e.Result.Properties.GetProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult);

                    Console.WriteLine($"RECOGNIZED in '{lidResult}': Text={e.Result.Text}");
                    foreach (var element in e.Result.Translations)
                    {
                        Console.WriteLine($"    TRANSLATED into '{element.Key}': {element.Value}");
                    }
                }
                else if (e.Result.Reason == ResultReason.RecognizedSpeech)
                {
                    Console.WriteLine($"RECOGNIZED: Text={e.Result.Text}");
                    Console.WriteLine($"    Speech not translated.");
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
                    Console.WriteLine($"CANCELED: Did you set the speech resource key and region values?");
                }

                stopTranslation.TrySetResult(0);
            };

            recognizer.SpeechStartDetected += (s, e) => {
                Console.WriteLine("\nSpeech start detected event.");
            };

            recognizer.SpeechEndDetected += (s, e) => {
                Console.WriteLine("\nSpeech end detected event.");
            };

            recognizer.SessionStarted += (s, e) => {
                Console.WriteLine("\nSession started event.");
            };

            recognizer.SessionStopped += (s, e) => {
                Console.WriteLine("\nSession stopped event.");
                Console.WriteLine($"\nStop translation.");
                stopTranslation.TrySetResult(0);
            };

            // Starts continuous recognition. Uses StopContinuousRecognitionAsync() to stop recognition.
            Console.WriteLine("Start translation...");
            await recognizer.StartContinuousRecognitionAsync().ConfigureAwait(false);

            Task.WaitAny(new[] { stopTranslation.Task });
            await recognizer.StopContinuousRecognitionAsync().ConfigureAwait(false);
        }
    }
}
```
---

::: zone-end

::: zone pivot="programming-language-cpp"

See more examples of speech translation with language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/translation_samples.cpp).

### [Recognize once](#tab/once)

```cpp
auto region = "YourServiceRegion";
// Currently the v2 endpoint is required. In a future SDK release you won't need to set it.
auto endpointString = std::format("wss://{}.stt.speech.microsoft.com/speech/universal/v2", region);
auto config = SpeechTranslationConfig::FromEndpoint(endpointString, "YourSubscriptionKey");

auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE" });

// Sets source and target languages
// The source language will be detected by the language detection feature. 
// However, the SpeechRecognitionLanguage still need to set with a locale string, but it will not be used as the source language.
// This will be fixed in a future version of Speech SDK.
auto fromLanguage = "en-US";
config->SetSpeechRecognitionLanguage(fromLanguage);
config->AddTargetLanguage("de");
config->AddTargetLanguage("fr");

// Creates a translation recognizer using microphone as audio input.
auto recognizer = TranslationRecognizer::FromConfig(config, autoDetectSourceLanguageConfig);
cout << "Say something...\n";

// Starts translation, and returns after a single utterance is recognized. The end of a
// single utterance is determined by listening for silence at the end or until a maximum of 15
// seconds of audio is processed. The task returns the recognized text as well as the translation.
// Note: Since RecognizeOnceAsync() returns only a single utterance, it is suitable only for single
// shot recognition like command or query.
// For long-running multi-utterance recognition, use StartContinuousRecognitionAsync() instead.
auto result = recognizer->RecognizeOnceAsync().get();

// Checks result.
if (result->Reason == ResultReason::TranslatedSpeech)
{
    cout << "RECOGNIZED: Text=" << result->Text << std::endl;

    for (const auto& it : result->Translations)
    {
        cout << "TRANSLATED into '" << it.first.c_str() << "': " << it.second.c_str() << std::endl;
    }
}
else if (result->Reason == ResultReason::RecognizedSpeech)
{
    cout << "RECOGNIZED: Text=" << result->Text << " (text could not be translated)" << std::endl;
}
else if (result->Reason == ResultReason::NoMatch)
{
    cout << "NOMATCH: Speech could not be recognized." << std::endl;
}
else if (result->Reason == ResultReason::Canceled)
{
    auto cancellation = CancellationDetails::FromResult(result);
    cout << "CANCELED: Reason=" << (int)cancellation->Reason << std::endl;

    if (cancellation->Reason == CancellationReason::Error)
    {
        cout << "CANCELED: ErrorCode=" << (int)cancellation->ErrorCode << std::endl;
        cout << "CANCELED: ErrorDetails=" << cancellation->ErrorDetails << std::endl;
        cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;
    }
}
```

### [Continuous recognition](#tab/continuous)

```cpp
using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;
using namespace Microsoft::CognitiveServices::Speech::Translation;

void MultiLingualTranslation()
{
    auto region = "YourServiceRegion";
    // Currently the v2 endpoint is required. In a future SDK release you won't need to set it.
    auto endpointString = std::format("wss://{}.stt.speech.microsoft.com/speech/universal/v2", region);
    auto config = SpeechTranslationConfig::FromEndpoint(endpointString, "YourSubscriptionKey");

    // Set the LanguageIdMode (Optional; Either Continuous or AtStart are accepted; Default AtStart)
    speechConfig->SetProperty(PropertyId::SpeechServiceConnection_LanguageIdMode, "Continuous");
    auto autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig::FromLanguages({ "en-US", "de-DE", "zh-CN" });

    promise<void> recognitionEnd;
    // Source language is required, but currently ignored. 
    auto fromLanguage = "en-US";
    config->SetSpeechRecognitionLanguage(fromLanguage);
    config->AddTargetLanguage("de");
    config->AddTargetLanguage("fr");

    auto audioInput = AudioConfig::FromWavFileInput("whatstheweatherlike.wav");
    auto recognizer = TranslationRecognizer::FromConfig(config, autoDetectSourceLanguageConfig, audioInput);

    recognizer->Recognizing.Connect([](const TranslationRecognitionEventArgs& e)
        {
            std::string lidResult = e.Result->Properties.GetProperty(PropertyId::SpeechServiceConnection_AutoDetectSourceLanguageResult);

            cout << "Recognizing in Language = "<< lidResult << ":" << e.Result->Text << std::endl;
            for (const auto& it : e.Result->Translations)
            {
                cout << "  Translated into '" << it.first.c_str() << "': " << it.second.c_str() << std::endl;
            }
        });

    recognizer->Recognized.Connect([](const TranslationRecognitionEventArgs& e)
        {
            if (e.Result->Reason == ResultReason::TranslatedSpeech)
            {
                std::string lidResult = e.Result->Properties.GetProperty(PropertyId::SpeechServiceConnection_AutoDetectSourceLanguageResult);
                cout << "RECOGNIZED in Language = " << lidResult << ": Text=" << e.Result->Text << std::endl;
            }
            else if (e.Result->Reason == ResultReason::RecognizedSpeech)
            {
                cout << "RECOGNIZED: Text=" << e.Result->Text << " (text could not be translated)" << std::endl;
            }
            else if (e.Result->Reason == ResultReason::NoMatch)
            {
                cout << "NOMATCH: Speech could not be recognized." << std::endl;
            }

            for (const auto& it : e.Result->Translations)
            {
                cout << "  Translated into '" << it.first.c_str() << "': " << it.second.c_str() << std::endl;
            }
        });

    recognizer->Canceled.Connect([&recognitionEnd](const TranslationRecognitionCanceledEventArgs& e)
        {
            cout << "CANCELED: Reason=" << (int)e.Reason << std::endl;
            if (e.Reason == CancellationReason::Error)
            {
                cout << "CANCELED: ErrorCode=" << (int)e.ErrorCode << std::endl;
                cout << "CANCELED: ErrorDetails=" << e.ErrorDetails << std::endl;
                cout << "CANCELED: Did you set the speech resource key and region values?" << std::endl;

                recognitionEnd.set_value();
            }
        });

    recognizer->Synthesizing.Connect([](const TranslationSynthesisEventArgs& e)
        {
            auto size = e.Result->Audio.size();
            cout << "Translation synthesis result: size of audio data: " << size
                << (size == 0 ? "(END)" : "");
        });

    recognizer->SessionStopped.Connect([&recognitionEnd](const SessionEventArgs& e)
        {
            cout << "Session stopped.";
            recognitionEnd.set_value();
        });

    // Starts continuos recognition. Use StopContinuousRecognitionAsync() to stop recognition.
    recognizer->StartContinuousRecognitionAsync().get();
    recognitionEnd.get_future().get();
    recognizer->StopContinuousRecognitionAsync().get();
}
```
---

::: zone-end

::: zone pivot="programming-language-python"

See more examples of speech translation with language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/translation_sample.py).

### [Recognize once](#tab/once)

```python
import azure.cognitiveservices.speech as speechsdk
import time
import json

speech_key, service_region = "YourSubscriptionKey","YourServiceRegion"
weatherfilename="en-us_zh-cn.wav"

# set up translation parameters: source language and target languages
# Currently the v2 endpoint is required. In a future SDK release you won't need to set it. 
endpoint_string = "wss://{}.stt.speech.microsoft.com/speech/universal/v2".format(service_region)
translation_config = speechsdk.translation.SpeechTranslationConfig(
    subscription=speech_key,
    endpoint=endpoint_string,
    speech_recognition_language='en-US',
    target_languages=('de', 'fr'))
audio_config = speechsdk.audio.AudioConfig(filename=weatherfilename)

# Specify the AutoDetectSourceLanguageConfig, which defines the number of possible languages
auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(languages=["en-US", "de-DE", "zh-CN"])

# Creates a translation recognizer using and audio file as input.
recognizer = speechsdk.translation.TranslationRecognizer(
    translation_config=translation_config, 
    audio_config=audio_config,
    auto_detect_source_language_config=auto_detect_source_language_config)

# Starts translation, and returns after a single utterance is recognized. The end of a
# single utterance is determined by listening for silence at the end or until a maximum of 15
# seconds of audio is processed. The task returns the recognition text as result.
# Note: Since recognize_once() returns only a single utterance, it is suitable only for single
# shot recognition like command or query.
# For long-running multi-utterance recognition, use start_continuous_recognition() instead.
result = recognizer.recognize_once()

# Check the result
if result.reason == speechsdk.ResultReason.TranslatedSpeech:
    print("""Recognized: {}
    German translation: {}
    French translation: {}""".format(
        result.text, result.translations['de'], result.translations['fr']))
elif result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print("Recognized: {}".format(result.text))
    detectedSrcLang = result.properties[speechsdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult]
    print("Detected Language: {}".format(detectedSrcLang))
elif result.reason == speechsdk.ResultReason.NoMatch:
    print("No speech could be recognized: {}".format(result.no_match_details))
elif result.reason == speechsdk.ResultReason.Canceled:
    print("Translation canceled: {}".format(result.cancellation_details.reason))
    if result.cancellation_details.reason == speechsdk.CancellationReason.Error:
        print("Error details: {}".format(result.cancellation_details.error_details))
```

### [Continuous recognition](#tab/continuous)

```python
import azure.cognitiveservices.speech as speechsdk
import time
import json

speech_key, service_region = "YourSubscriptionKey","YourServiceRegion"
weatherfilename="en-us_zh-cn.wav"

# Currently the v2 endpoint is required. In a future SDK release you won't need to set it. 
endpoint_string = "wss://{}.stt.speech.microsoft.com/speech/universal/v2".format(service_region)
translation_config = speechsdk.translation.SpeechTranslationConfig(
    subscription=speech_key,
    endpoint=endpoint_string,
    speech_recognition_language='en-US',
    target_languages=('de', 'fr'))
audio_config = speechsdk.audio.AudioConfig(filename=weatherfilename)

# Set the LanguageIdMode (Optional; Either Continuous or AtStart are accepted; Default AtStart)
translation_config.set_property(property_id=speechsdk.PropertyId.SpeechServiceConnection_LanguageIdMode, value='Continuous')

# Specify the AutoDetectSourceLanguageConfig, which defines the number of possible languages
auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(languages=["en-US", "de-DE", "zh-CN"])

# Creates a translation recognizer using and audio file as input.
recognizer = speechsdk.translation.TranslationRecognizer(
    translation_config=translation_config, 
    audio_config=audio_config,
    auto_detect_source_language_config=auto_detect_source_language_config)

def result_callback(event_type, evt):
    """callback to display a translation result"""
    print("{}: {}\n\tTranslations: {}\n\tResult Json: {}".format(
        event_type, evt, evt.result.translations.items(), evt.result.json))

done = False

def stop_cb(evt):
    """callback that signals to stop continuous recognition upon receiving an event `evt`"""
    print('CLOSING on {}'.format(evt))
    nonlocal done
    done = True

# connect callback functions to the events fired by the recognizer
recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
# event for intermediate results
recognizer.recognizing.connect(lambda evt: result_callback('RECOGNIZING', evt))
# event for final result
recognizer.recognized.connect(lambda evt: result_callback('RECOGNIZED', evt))
# cancellation event
recognizer.canceled.connect(lambda evt: print('CANCELED: {} ({})'.format(evt, evt.reason)))

# stop continuous recognition on either session stopped or canceled events
recognizer.session_stopped.connect(stop_cb)
recognizer.canceled.connect(stop_cb)

def synthesis_callback(evt):
    """
    callback for the synthesis event
    """
    print('SYNTHESIZING {}\n\treceived {} bytes of audio. Reason: {}'.format(
        evt, len(evt.result.audio), evt.result.reason))
    if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("RECOGNIZED: {}".format(evt.result.properties))
        if evt.result.properties.get(speechsdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult) == None:
            print("Unable to detect any language")
        else:
            detectedSrcLang = evt.result.properties[speechsdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult]
            jsonResult = evt.result.properties[speechsdk.PropertyId.SpeechServiceResponse_JsonResult]
            detailResult = json.loads(jsonResult)
            startOffset = detailResult['Offset']
            duration = detailResult['Duration']
            if duration >= 0:
                endOffset = duration + startOffset
            else:
                endOffset = 0
            print("Detected language = " + detectedSrcLang + ", startOffset = " + str(startOffset) + " nanoseconds, endOffset = " + str(endOffset) + " nanoseconds, Duration = " + str(duration) + " nanoseconds.")
            global language_detected
            language_detected = True

# connect callback to the synthesis event
recognizer.synthesizing.connect(synthesis_callback)

# start translation
recognizer.start_continuous_recognition()

while not done:
    time.sleep(.5)

recognizer.stop_continuous_recognition()
```

---

::: zone-end

## Run and use a container

Speech containers provide websocket-based query endpoint APIs that are accessed through the Speech SDK and Speech CLI. By default, the Speech SDK and Speech CLI use the public Speech service. To use the container, you need to change the initialization method. Use a container host URL instead of key and region.

When you run language ID in a container, use the `SourceLanguageRecognizer` object instead of `SpeechRecognizer` or `TranslationRecognizer`.

For more information about containers, see the [language identification speech containers](speech-container-lid.md#use-the-container) how-to guide.


## Speech to text batch transcription

To identify languages with [Batch transcription REST API](batch-transcription.md), you need to use `languageIdentification` property in the body of your [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) request. 

> [!WARNING]
> Batch transcription only supports language identification for base models. If both language identification and a custom model are specified in the transcription request, the service will fall back to use the base models for the specified candidate languages. This may result in unexpected recognition results.
>
> If your speech to text scenario requires both language identification and custom models, use [real-time speech to text](#speech-to-text-custom-models) instead of batch transcription.

The following example shows the usage of the `languageIdentification` property with four candidate languages. For more information about request properties see [Create a batch transcription](batch-transcription-create.md#request-configuration-options).

```json
{
    <...>
    
    "properties": {
    <...>
    
        "languageIdentification": {
            "candidateLocales": [
            "en-US",
            "ja-JP",
            "zh-CN",
            "hi-IN"
            ]
        },	
        <...>
    }
}
```

## Next steps

* [Try the speech to text quickstart](get-started-speech-to-text.md)
* [Improve recognition accuracy with custom speech](custom-speech-overview.md)
* [Use batch transcription](batch-transcription.md)
