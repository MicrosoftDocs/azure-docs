---
title: Standalone language identification - Speech service
titleSuffix: Azure Cognitive Services
description: Standalone language identification is used to determine the language being spoken when compared against a list of provided languages.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/09/2022
ms.author: eur
zone_pivot_groups: programming-languages-cs-cpp-py
---

# Standalone language identification

You use standalone language identification when you only need to detect the natural language in an audio source. 

For other language identification scenarios such as transcriptions or translations, see [Speech-to-text language identification](language-identification-speech-to-text.md) or [Speech translation language identification](language-identification-speech-translation.md).

> [!NOTE]
> Standalone language identification is only supported with Speech SDKs in C#, C++, and Python.

## Source language recognizer example

Here's how it works:

* Set your priority to `"Latency"` or `"Accuracy"`. If neither is set, then latency is prioritized by default. 
* Define a list of candidate languages that you want to identify.
* Use the translation recognizer with your configured languages and audio source.
* Await the results

The returned results for at-start and continuous recognition will vary by priority. For more information see [Accuracy and Latency prioritization](language-identification.md#accuracy-and-latency-prioritization).  

::: zone pivot="programming-language-csharp"

### [At-start](#tab/at-start)

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var speechConfig = SpeechConfig.FromSubscription("<paste-your-subscription-key>","<paste-your-region>");

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


### [Continuous](#tab/continuous)

:::code language="csharp" source="~/samples-cognitive-services-speech-sdk/samples/csharp/sharedcontent/console/standalone_language_detection_samples.cs" id="languageDetectionContinuousWithFile":::

---

See more examples of standalone language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/standalone_language_detection_samples.cs).

::: zone-end

::: zone pivot="programming-language-cpp"

### [At-start](#tab/at-start)

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


### [Continuous](#tab/continuous)

:::code language="cpp" source="~/samples-cognitive-services-speech-sdk/samples/cpp/windows/console/samples/standalone_language_detection_samples.cpp" id="StandaloneLanguageDetectionInContinuousModeWithFileInput":::

---

See more examples of standalone language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/standalone_language_detection_samples.cpp).


::: zone-end

::: zone pivot="programming-language-python"

### [At-start](#tab/at-start)


```python
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    
speech_config.set_property(property_id=speechsdk.PropertyId.SpeechServiceConnection_SingleLanguageIdPriority, value='Latency')

speech_language_detection = speechsdk.SourceLanguageRecognizer(speech_config=speech_config, auto_detect_source_language_config=auto_detect_source_language_config)

result = speech_language_detection.recognize_once()

if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print("RECOGNIZED: {}".format(result))
    detectedSrcLang = result.properties[speechsdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult]
    print("Detected Language: {}".format(detectedSrcLang))
elif result.reason == speechsdk.ResultReason.NoMatch:
    print("No speech could be recognized")
elif result.reason == speechsdk.ResultReason.Canceled:
    cancellation_details = result.cancellation_details
    print("Speech Recognition canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == speechsdk.CancellationReason.Error:
        print("Error details: {}".format(cancellation_details.error_details))
```


### [Continuous](#tab/continuous)


Need continuous sample

---

See more examples of standalone language identification on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_language_detection_sample.py).


::: zone-end

