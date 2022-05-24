---
title: How to use pronunciation assessment
titleSuffix: Azure Cognitive Services
description: The Speech SDK supports pronunciation assessment, which assesses the pronunciation quality of speech input, with indicators of accuracy, fluency, completeness, etc.
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 01/23/2022
ms.author: yulili
ms.devlang: cpp, csharp, java, javascript, objective-c, python
ms.custom: references_regions 
zone_pivot_groups: programming-languages-speech-services-nomore-variant
---

# Pronunciation assessment

Pronunciation assessment evaluates speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio. With pronunciation assessment, language learners can practice, get instant feedback, and improve their pronunciation so that they can speak and present with confidence. Educators can use the capability to evaluate pronunciation of multiple speakers in real time. Pronunciation Assessment is announced generally available in US English, while [other languages](language-support.md#pronunciation-assessment) are available in preview. 

In this article, you'll learn how to set up `PronunciationAssessmentConfig` and retrieve the `PronunciationAssessmentResult` using the speech SDK.

## Pronunciation assessment with the Speech SDK

The following snippet illustrates how to create a `PronunciationAssessmentConfig`, then apply it to a `SpeechRecognizer`.

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
                grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
                granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme)
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

::: zone pivot="programming-language-javascript"

```Javascript
var pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig("reference text",
    PronunciationAssessmentGradingSystem.HundredMark,
    PronunciationAssessmentGranularity.Word, true);
var speechRecognizer = SpeechSDK.SpeechRecognizer.FromConfig(speechConfig, audioConfig);
// apply the pronunciation assessment configuration to the speech recognizer
pronunciationAssessmentConfig.applyTo(speechRecognizer);

speechRecognizer.recognizeOnceAsync((result: SpeechSDK.SpeechRecognitionResult) => {
        var pronunciationAssessmentResult = SpeechSDK.PronunciationAssessmentResult.fromResult(result);
        var pronunciationScore = pronunciationAssessmentResult.pronunciationScore;
        var wordLevelResult = pronunciationAssessmentResult.detailResult.Words;
},
{});
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

## Configuration parameters

This table lists the configuration parameters for pronunciation assessment.

| Parameter | Description | Required? |
|-----------|-------------|---------------------|
| `ReferenceText` | The text that the pronunciation will be evaluated against. | Required |
| `GradingSystem` | The point system for score calibration. The `FivePoint` system gives a 0-5 floating point score, and `HundredMark` gives a 0-100 floating point score. Default: `FivePoint`. | Optional |
| `Granularity` | The evaluation granularity. Accepted values are `Phoneme`, which shows the score on the full text, word and phoneme level, `Syllable`, which shows the score on the full text, word and syllable level, `Word`, which shows the score on the full text and word level, `FullText`, which shows the score on the full text level only. Default: `Phoneme`. | Optional |
| `EnableMiscue` | Enables miscue calculation when the pronounced words are compared to the reference text. If this value is `True`, the `ErrorType` result value can be set to `Omission` or `Insertion` based on the comparison. Accepted values are `False` and `True`. Default: `False`. | Optional |
| `ScenarioId` | A GUID indicating a customized point system. | Optional |

## Result parameters

This table lists the result parameters of pronunciation assessment.

| Parameter | Description |
|-----------|-------------|
| `AccuracyScore` | Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Syllable, word, and full text accuracy scores are aggregated from phoneme-level accuracy score. |
| `FluencyScore` | Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words. |
| `CompletenessScore` | Completeness of the speech, calculated by the ratio of pronounced words to the input reference text. |
| `PronScore` | Overall score indicating the pronunciation quality of the given speech. `PronScore` is aggregated from `AccuracyScore`, `FluencyScore`, and `CompletenessScore` with weight. |
| `ErrorType` | This value indicates whether a word is omitted, inserted, or mispronounced, compared to the `ReferenceText`. Possible values are `None`, `Omission`, `Insertion`, and `Mispronunciation`. |

### Sample responses

A typical pronunciation assessment result in JSON:

```json
{
  "RecognitionStatus": "Success",
  "Offset": "400000",
  "Duration": "11000000",
    "NBest": [
    {
        "Confidence": "0.87",
        "Lexical": "good morning",
        "ITN" : "good morning",
        "MaskedITN" : "good morning",
        "Display" : "Good morning.",
        "PronunciationAssessment" : {
            "PronScore" : 84.4,
            "AccuracyScore" : 100.0,
            "FluencyScore" : 74.0,
            "CompletenessScore" : 100.0,
        },
        "Words": [
        {
            "Word" : "good",
            "Offset" : 500000,
            "Duration" : 2700000,
            "PronunciationAssessment": {
                "AccuracyScore" : 100.0,
                "ErrorType" : "None"
            },
            "Syllables" : [
            {
                "Syllable" : "ɡʊd",
                "Offset" : 500000,
                "Duration" : 2700000,
                "PronunciationAssessment" : {
                    "AccuracyScore": 100.0
                }
            }],
            "Phonemes": [
            {
                "Phoneme" : "ɡ",
                "Offset" : 500000,
                "Duration": 1200000,
                "PronunciationAssessment": {
                    "AccuracyScore": 100.0
                }
            },
            {
                "Phoneme" : "ʊ",
                "Offset" : 1800000,
                "Duration": 500000,
                "PronunciationAssessment": {
                    "AccuracyScore": 100.0
                }
            },
            {
                "Phoneme" : "d",
                "Offset" : 2400000,
                "Duration": 800000,
                "PronunciationAssessment": {
                    "AccuracyScore": 100.0
                }
            }]
        },
        {
            "Word" : "morning",
            "Offset" : 3300000,
            "Duration" : 5500000,
            "PronunciationAssessment": {
                "AccuracyScore" : 100.0,
                "ErrorType" : "None"
            },
            "Syllables": [
            {
                "Syllable" : "mɔr",
                "Offset" : 3300000,
                "Duration": 2300000,
                "PronunciationAssessment": {
                    "AccuracyScore": 100.0
                }
            },
            {
                "Syllable" : "nɪŋ",
                "Offset" : 5700000,
                "Duration": 3100000,
                "PronunciationAssessment": {
                    "AccuracyScore": 100.0
                }
            }],
            "Phonemes": [
                ... // omitted phonemes
            ]
        }]
    }]
}
```

## Next steps

* Learn more about released [use cases](https://techcommunity.microsoft.com/t5/azure-ai-blog/speech-service-update-pronunciation-assessment-is-generally/ba-p/2505501)

* Try out the [pronunciation assessment demo](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/PronunciationAssessment/BrowserJS) and watch the [video tutorial](https://www.youtube.com/watch?v=zFlwm7N4Awc) of pronunciation assessment.

::: zone pivot="programming-language-csharp"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs) on GitHub for pronunciation assessment.
::: zone-end

::: zone pivot="programming-language-cpp"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp) on GitHub for pronunciation assessment.
::: zone-end

::: zone pivot="programming-language-java"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/jre/console/src/com/microsoft/cognitiveservices/speech/samples/console/SpeechRecognitionSamples.java) on GitHub for pronunciation assessment.
::: zone-end

::: zone pivot="programming-language-python"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py) on GitHub for pronunciation assessment.
::: zone-end

::: zone pivot="programming-language-objectivec"
* See the [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/objective-c/ios/speech-samples/speech-samples/ViewController.m) on GitHub for pronunciation assessment.
::: zone-end

