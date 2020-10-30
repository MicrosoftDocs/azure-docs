---
title: How to use speech SDK for pronunciation assessment
titleSuffix: Azure Cognitive Services
description: The Speech SDK supports pronunciation assessment, which assesses the pronunciation quality of speech input, with indicators of accuracy, fluency, completeness, etc.
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/29/2020
ms.author: yulili
ms.custom: references_regions 
zone_pivot_groups: programming-languages-set-nineteen
---

# Pronunciation assessment

Pronunciation assessment evaluates speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio.
With pronunciation assessment, language learners can practice, get instant feedback, and improve their pronunciation so that they can speak and present with confidence.
 Educators can use the capability to evaluate pronunciation of multiple speakers in real-time.

In this article, you'll learn how to set up `PronunciationAssessmentConfig` and retrieve the `PronunciationAssessmentResult` using the speech SDK.

> [!NOTE]
> The pronunciation assessment feature is currently only available in regions `westus`, `eastasia` and `centralindia`, and only supports language `en-US`.

## Pronunciation assessment with the Speech SDK

In the samples below, you'll create a `PronunciationAssessmentConfig`, then apply it to a `SpeechRecognizer`.

The following snippets illustrate how to use automatic language detection in your apps:

::: zone pivot="programming-language-csharp"

```csharp
var pronunciationAssessmentConfig = new PronunciationAssessmentConfig(
    "reference text", GradingSystem.HundredMark, Granularity.Phoneme);

using (var recognizer = new SpeechRecognizer(
    speechConfig,
    audioConfig))
{
    // apply the pronunciation assessment configuration to the speech recognizer
    pronunciationAssessmentConfig.ApplyTo(recognizer);
    var speechRecognitionResult = await recognizer.RecognizeOnceAsync();
    var pronunciationAssessmentResult =
        PronunciationAssessmentResult.FromResult(speechRecognitionResult);
    var pronunciationScore = pronunciationAssessmentResult.PronunciationScore;
}
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
auto pronunciationAssessmentConfig =
    PronunciationAssessmentConfig::Create("reference text",
        PronunciationAssessmentGradingSystem::HundredMark,
        PronunciationAssessmentGranularity::Phoneme);

auto recognizer = SpeechRecognizer::FromConfig(
    speechConfig,
    audioConfig);

// apply the pronunciation assessment configuration to the speech recognizer
pronunciationAssessmentConfig->ApplyTo(recognizer);
speechRecognitionResult = recognizer->RecognizeOnceAsync().get();
auto pronunciationAssessmentResult =
    PronunciationAssessmentResult::FromResult(speechRecognitionResult);
auto pronunciationScore = pronunciationAssessmentResult->PronunciationScore;
```

::: zone-end

::: zone pivot="programming-language-java"

```java
PronunciationAssessmentConfig pronunciationAssessmentConfig =
    new PronunciationAssessmentConfig("reference text", 
        PronunciationAssessmentGradingSystem.HundredMark,
        PronunciationAssessmentGranularity.Phoneme);

SpeechRecognizer recognizer = new SpeechRecognizer(
    speechConfig,
    audioConfig);

// apply the pronunciation assessment configuration to the speech recognizer
pronunciationAssessmentConfig.applyTo(recognizer);
Future<SpeechRecognitionResult> future = recognizer.recognizeOnceAsync();
SpeechRecognitionResult result = future.get(30, TimeUnit.SECONDS);
PronunciationAssessmentResult pronunciationAssessmentResult =
    PronunciationAssessmentResult.fromResult(result);
Double pronunciationScore = pronunciationAssessmentResult.getPronunciationScore();

recognizer.close();
speechConfig.close();
audioConfig.close();
pronunciationAssessmentConfig.close();
result.close();
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
pronunciation_assessment_config = \
        speechsdk.PronunciationAssessmentConfig(reference_text='reference text',
                grading_system=msspeech.PronunciationAssessmentGradingSystem.HundredMark,
                granularity=msspeech.PronunciationAssessmentGranularity.Phoneme)
speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, \
        audio_config=audio_config)

# apply the pronunciation assessment configuration to the speech recognizer
pronunciation_assessment_config.apply_to(speech_recognizer)
result = speech_recognizer.recognize_once()
pronunciation_assessment_result = speechsdk.PronunciationAssessmentResult(result)
pronunciation_score = pronunciation_assessment_result.pronunciation_score
```

::: zone-end

::: zone pivot="programming-language-objectivec"

```Objective-C
SPXPronunciationAssessmentConfiguration* pronunciationAssessmentConfig =
    [[SPXPronunciationAssessmentConfiguration alloc]init:@"reference text"
                                           gradingSystem:SPXPronunciationAssessmentGradingSystem_HundredMark
                                             granularity:SPXPronunciationAssessmentGranularity_Phoneme];

SPXSpeechRecognizer* speechRecognizer = \
        [[SPXSpeechRecognizer alloc] initWithSpeechConfiguration:speechConfig
                                              audioConfiguration:audioConfig];

// apply the pronunciation assessment configuration to the speech recognizer
[pronunciationAssessmentConfig applyToRecognizer:speechRecognizer];

SPXSpeechRecognitionResult *result = [speechRecognizer recognizeOnce];
SPXPronunciationAssessmentResult* pronunciationAssessmentResult = [[SPXPronunciationAssessmentResult alloc] init:result];
double pronunciationScore = pronunciationAssessmentResult.pronunciationScore;
```

::: zone-end

### Pronunciation assessment configuration parameters

This table lists the configuration parameters for pronunciation assessment.

| Parameter | Description | Required / Optional |
|-----------|-------------|---------------------|
| ReferenceText | The text that the pronunciation will be evaluated against. | Required |
| GradingSystem | The point system for score calibration. Accepted values are `FivePoint` and `HundredMark`. The default setting is `FivePoint`. | Optional |
| Granularity | The evaluation granularity. Accepted values are `Phoneme`, which shows the score on the full text, word and phoneme level, `Word`, which shows the score on the full text and word level, `FullText`, which shows the score on the full text level only. The default setting is `Phoneme`. | Optional |
| EnableMiscue | Enables miscue calculation. With this enabled, the pronounced words will be compared to the reference text, and will be marked with omission/insertion based on the comparison. Accepted values are `False` and `True`. The default setting is `False`. | Optional |
| ScenarioId | A GUID indicating a customized point system. | Optional |

### Pronunciation assessment result parameters

This table lists the result parameters of pronunciation assessment.

| Parameter | Description |
|-----------|-------------|
| `AccuracyScore` | Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Word and full text level accuracy score is aggregated from phoneme level accuracy score. |
| `FluencyScore` | Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words. |
| `CompletenessScore` | Completeness of the speech, determined by calculating the ratio of pronounced words to reference text input. |
| `PronunciationScore` | Overall score indicating the pronunciation quality of the given speech. This is aggregated from `AccuracyScore`, `FluencyScore` and `CompletenessScore` with weight. |
| `ErrorType` | This value indicates whether a word is omitted, inserted or badly pronounced, compared to `ReferenceText`. Possible values are `None` (meaning no error on this word), `Omission`, `Insertion` and `Mispronunciation`. |

## Next steps

<!-- TODO: update the sample links after release -->

<!-- ::: zone pivot="programming-language-csharp"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#L741) on GitHub for automatic language detection
::: zone-end

::: zone pivot="programming-language-cpp"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp#L507) on GitHub for automatic language detection
::: zone-end

::: zone pivot="programming-language-java"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechRecognitionSamples.java#L521) on GitHub for automatic language detection
::: zone-end

::: zone pivot="programming-language-python"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_synthesis_sample.py#L434) on GitHub for automatic language detection
::: zone-end

::: zone pivot="programming-language-objectivec"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/objective-c/ios/speech-samples/speech-samples/ViewController.m#L494) on GitHub for automatic language detection
::: zone-end -->

* [Speech SDK reference documentation](speech-sdk.md)
