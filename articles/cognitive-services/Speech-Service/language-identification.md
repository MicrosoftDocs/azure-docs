---
title: Language identification - Speech service
titleSuffix: Azure Cognitive Services
description: Language identification is used to determine the language being spoken in audio passed to the Speech SDK when compared against a list of provided languages.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/27/2021
ms.author: lajanuar
zone_pivot_groups: programming-languages-cs-cpp-py
---

# Language identification

Language identification is used to determine the language being spoken in audio passed to the Speech SDK when compared against a list of provided languages. The value returned by language identification is then used to select the language model for speech to text, providing you with a more accurate transcription. 

Language identification can also be used while doing [speech translation](./get-started-speech-translation.md?pivots=programming-language-csharp&tabs=script%2cwindowsinstall#multi-lingual-translation-with-language-identification), or by doing [language identification duuring speech recognition](/azure/cognitive-services/speech-service/how-to-automatic-language-detection). To see which languages are available, see [Language support](language-support.md).

## Prerequisites

This article assumes you have an Azure subscription and speech resource, and also assumes knowledge of speech recognition basics.

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

::: zone pivot="programming-language-python"
> [!IMPORTANT]
> This feature is currently only supported in C#, C++, and Python.
::: zone-end
