---
title: Use Pronunciation Assessment
titleSuffix: Azure Cognitive Services
description: Learn about pronunciation assessment features that are currently publicly available.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/17/2022
ms.author: v-baolianzou
ms.devlang: cpp, csharp, java, javascript, objective-c, python
ms.custom: references_regions 
zone_pivot_groups: programming-languages-speech-services-nomore-variant
---

# Use Pronunciation Assessment

In this article, you'll learn how to use Pronunciation Assessment features through the Speech SDK.


The following features are available publicly for you to enhance mispronunciation feedback. 

- Syllable support
- Phoneme in IPA format
- Spoken phoneme

> [!NOTE]
> Spoken phoneme is only available in `en-US`. 
> 
> If you want to use languages that aren't supported or have other requirements for these features , please contact us by email at [mspafeedback@microsoft.com](mailto:mspafeedback@microsoft.com).
>  
> For pronunciation assessment supported regions, see [available regions](regions.md#speech-to-text-pronunciation-assessment-text-to-speech-and-translation).


## Configuration parameters

This table lists the configuration parameters for pronunciation assessment.

| Parameter | Description | Required? |
|-----------|-------------|---------------------|
| `ReferenceText` | The text that the pronunciation will be evaluated against. | Required |
| `GradingSystem` | The point system for score calibration. The `FivePoint` system gives a 0-5 floating point score, and `HundredMark` gives a 0-100 floating point score. Default: `FivePoint`. | Optional |
| `Granularity` | The evaluation granularity. Accepted values are `Phoneme`, which shows the score on the full text, word and phoneme level, `Syllable`, which shows the score on the full text, word and syllable level, `Word`, which shows the score on the full text and word level, `FullText`, which shows the score on the full text level only. Default: `Phoneme`. | Optional |
| `EnableMiscue` | Enables miscue calculation when the pronounced words are compared to the reference text. If this value is `True`, the `ErrorType` result value can be set to `Omission` or `Insertion` based on the comparison. Accepted values are `False` and `True`. Default: `False`. | Optional |
| `ScenarioId` | A GUID indicating a customized point system. | Optional |


## Syllable support

With this new feature, Pronunciation Assessment provides syllable-level assessment results along with other existing granularities. Currently, the Pronunciation Assessment can return accuracy scores for specific phonemes, syllables, words, sentences, or even whole articles.

To learn about the advantages of syllable support:

- Grouping in syllables is more readable than single phonemes. For example, the word “
technological”, / tek·nə·lɑː·dʒɪkl / is more readable than / teknəlɑːdʒɪkl /.
- Grouping in syllables is more aligned with the speaking habits, as a word is typically pronounced syllable by syllable rather than phoneme by phoneme.

Below are a few samples showing the difference before and after grouping to syllable.

| Sample word | Phonemes | Syllables |
|-----------|-------------|-------------|
|hello|hɛloʊ|hɛ·loʊ|
|luck|lʌk|lʌk|
|photosynthesis|foʊtəsɪnθəsɪs|foʊ·tə·sɪn·θə·sɪs|

### How to get syllables

In this section, you'll learn how to update the Pronunciation Assessment configuration to get syllables. But before reading this section, you need to follow [how to use speech SDK for pronunciation assessment](how-to-pronunciation-assessment.md) to learn how to set up `PronunciationAssessmentConfig` and retrieve the `PronunciationAssessmentResult` using the speech SDK.

1. Modify the code of creating pronunciationAssessmentConfig as below.
   
  ::: zone pivot="programming-language-csharp"

  ```csharp
  var pronunciationAssessmentConfig = PronunciationAssessmentConfig.FromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
  ```

  ::: zone-end

  ::: zone pivot="programming-language-cpp"

  ```cpp
  auto pronunciationAssessmentConfig = PronunciationAssessmentConfig::CreateFromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
  ```

  ::: zone-end

  ::: zone pivot="programming-language-java"

  ```Java
    PronunciationAssessmentConfig pronunciationAssessmentConfig = PronunciationAssessmentConfig.fromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
  ```

  ::: zone-end

  ::: zone pivot="programming-language-python"

  ```Python
  pronunciation_assessment_config = speechsdk.PronunciationAssessmentConfig(json_string="{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}")
  ```

 ::: zone-end

 ::: zone pivot="programming-language-javascript"

  ```JavaScript
  var pronunciationAssessmentConfig = SpeechSDK.PronunciationAssessmentConfig.fromJSON("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
  ```

 ::: zone-end

 ::: zone pivot="programming-language-objectivec"
   
 ```ObjectiveC
 SPXPronunciationAssessmentConfiguration* pronunciationAssessmentConfig = [[SPXPronunciationAssessmentConfiguration alloc]initWithJson:[@"{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}"]];
```

 ::: zone-end

2. Based on the code in step 1, insert a code line to receive the Pronunciation Assessment result in JSON, as below:
 
::: zone pivot="programming-language-csharp"

```csharp
var pronunciationAssessmentResultJson = speechRecognitionResult.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult);
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
auto pronunciationAssessmentResultJson = speechRecognitionResult ->Properties.GetProperty(PropertyId::SpeechServiceResponse_JsonResult);
```

::: zone-end

::: zone pivot="programming-language-java"

```Java
String pronunciationAssessmentResultJson = result.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult);
```
   
::: zone-end

::: zone pivot="programming-language-python"

```Python
pronunciation_assessment_result_json = result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)
```

::: zone-end

::: zone pivot="programming-language-javascript"

```JavaScript
var pronunciationAssessmentResultJson = result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult);
```

::: zone-end

::: zone pivot="programming-language-objectivec"
   
```ObjectiveC
NSString* pronunciationAssessmentResultJson = [result.properties getPropertyByName:@"RESULT-Json"];
```

::: zone-end

3. After you run the updated code, the content of `pronunciationAssessmentResultJson` will be displayed as the following JSON example. You can parse it with any JSON parsing library. Within each `Words` array, there's a `Syllables` element, which contains the syllables for this word. For word `good`, there's only one syllable / ɡʊd /, and for word `morning`, you can see two syllables / mɔr / and / nɪŋ /. Each syllable also has a `AccuracyScore` field within the `PronunciationAssessment` element, which means the syllable-level score. This score can tell how accurately the speaker pronounces this syllable.

```json
    {
        "Format": "Detailed",
        "RecognitionStatus": "Success",
        "DisplayText": "Good morning.",
        "Offset": 400000,
        "Duration": 11000000,
        "SNR": 37.3953,
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

## Phoneme in IPA format

At the phoneme level, Pronunciation Assessment provides accuracy scores of each phoneme, helping learners to better understand the pronunciation details of their speech. When giving the phoneme-level score, we need to show the phoneme name together with the score, so that users can know which phoneme they pronounced better, and which phoneme they pronounced worse. 

Previously our API can only show the phoneme name in [SAPI](/previous-versions/windows/desktop/ee431828(v=vs.85)#american-english-phoneme-table) format, which most users are not familiar with. With this preview feature, the API can also show the phonemes in [IPA](https://en.wikipedia.org/wiki/IPA) format, which is much better known by users. 

Below are a few samples for comparison between SAPI phonemes and IPA phonemes.

| Sample word | SAPI Phonemes | IPA phonemes |
|-----------|-------------|-------------|
|hello|h eh l ow|h ɛ l oʊ|
|luck|l ah k|l ʌ k|
|photosynthesis|f ow t ax s ih n th ax s ih s|f oʊ t ə s ɪ n θ ə s ɪ s|

### How to get phonemes in IPA format

In this section, you'll learn how to update the Pronunciation Assessment configuration to get phonemes in IPA format. But before reading this section, you need to follow [how to use speech SDK for pronunciation assessment](how-to-pronunciation-assessment.md) to learn how to set up `PronunciationAssessmentConfig` and retrieve the `PronunciationAssessmentResult` using the speech SDK.

1. Modify the code of creating pronunciationAssessmentConfig as below.
   
::: zone pivot="programming-language-csharp"

   ```csharp
   var pronunciationAssessmentConfig = PronunciationAssessmentConfig.FromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
   ```
   
::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
auto pronunciationAssessmentConfig = PronunciationAssessmentConfig::CreateFromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
```
   
::: zone-end 

::: zone pivot="programming-language-java"

```Java
PronunciationAssessmentConfig pronunciationAssessmentConfig = PronunciationAssessmentConfig.fromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
pronunciation_assessment_config = speechsdk.PronunciationAssessmentConfig(json_string="{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}")
```

::: zone-end

::: zone pivot="programming-language-javascript"

```JavaScript
var pronunciationAssessmentConfig = SpeechSDK.PronunciationAssessmentConfig.fromJSON("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");
```

::: zone-end

::: zone pivot="programming-language-objectivec"
   
```ObjectiveC
SPXPronunciationAssessmentConfiguration* pronunciationAssessmentConfig = [[SPXPronunciationAssessmentConfiguration alloc]initWithJson:[@"{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}"]];
```

::: zone-end

2. Based on the code in step 1, insert a code line to receive the Pronunciation Assessment result in JSON, as below:
 
::: zone pivot="programming-language-csharp"

   ```csharp
    var pronunciationAssessmentResultJson = speechRecognitionResult.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult);
   ```
   
::: zone-end   

::: zone pivot="programming-language-cpp"

   ```cpp
    auto pronunciationAssessmentResultJson = speechRecognitionResult ->Properties.GetProperty(PropertyId::SpeechServiceResponse_JsonResult);
   ```
   
::: zone-end 

::: zone pivot="programming-language-java"

   ```Java
    String pronunciationAssessmentResultJson = result.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult);
   ```

::: zone-end 

::: zone pivot="programming-language-python"

   ```Python
    pronunciation_assessment_result_json = result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)
   ```
   
::: zone-end  

::: zone pivot="programming-language-javascript"

   ```JavaScript
    var pronunciationAssessmentResultJson = result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult);
   ```
   
::: zone-end  

::: zone pivot="programming-language-objectivec"
   
   ```ObjectiveC
    NSString* pronunciationAssessmentResultJson = [result.properties getPropertyByName:@"RESULT-Json"];
   ```

::: zone-end   

3. After you run the updated code, the content of `pronunciationAssessmentResultJson` will be displayed as the following JSON example. As you specified "phonemeAlphabet":"IPA" in step 1, you can see the phonemes in IPA format. If you don't specify this attribute, the phonemes will be in SAPI format by default.

    ```json
    {
        "Format": "Detailed",
        "RecognitionStatus": "Success",
        "DisplayText": "Good morning.",
        "Offset": 400000,
        "Duration": 11000000,
        "SNR": 37.3953,
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

## Spoken phoneme

Previously Pronunciation Assessment API detects miscues and provides an accuracy score and error types in the given speech. But we can only show the targeted phonemes for each word from the reference text. With this new feature, it can also show the phoneme that a user speaks as a clear comparison to the targeted phonemes. For example, for the word “hello”, when a user incorrectly speaks one of the phonemes as another one (such as / ɛ / was spoken as / ʌ /), previously the API can just give its targeted phonemes / h ɛ l oʊ / and low score on this phoneme, but can't give the actually spoken phoneme. Now with this new feature, the API not only gives targeted phonemes / h ɛ l oʊ / and low score on / ɛ /, but also gives the actual spoken phonemes / h ʌ l oʊ /. Thus, this feature can help you better understand the pronunciation issue.

### How to get spoken phoneme

In this section, you'll learn how to update the Pronunciation Assessment configuration to get spoken phoneme. But before reading this section, you need to follow [how to use speech SDK for pronunciation assessment](how-to-pronunciation-assessment.md) to learn how to set up `PronunciationAssessmentConfig` and retrieve the `PronunciationAssessmentResult` using the speech SDK.

1. Modify the code of creating pronunciationAssessmentConfig as below.
   
::: zone pivot="programming-language-csharp"

   ```csharp
   var pronunciationAssessmentConfig = PronunciationAssessmentConfig.FromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\",\"nBestPhonemeCount\":5}");
   ```
   
::: zone-end      

::: zone pivot="programming-language-cpp"

   ```cpp
   auto pronunciationAssessmentConfig = PronunciationAssessmentConfig::CreateFromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\",\"nBestPhonemeCount\":5}");
   ```
   
::: zone-end

::: zone pivot="programming-language-java"

   ```Java
    PronunciationAssessmentConfig pronunciationAssessmentConfig = PronunciationAssessmentConfig.fromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\",\"nBestPhonemeCount\":5}");
   ```
   
::: zone-end   

::: zone pivot="programming-language-python"

   ```Python
   pronunciation_assessment_config = speechsdk.PronunciationAssessmentConfig(json_string="{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\",\"nBestPhonemeCount\":5}")
   ```

::: zone-end

::: zone pivot="programming-language-javascript"

   ```JavaScript
   var pronunciationAssessmentConfig = SpeechSDK.PronunciationAssessmentConfig.fromJSON("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\",\"nBestPhonemeCount\":5}");
   ```

::: zone-end

::: zone pivot="programming-language-objectivec"
   
   ```ObjectiveC
    SPXPronunciationAssessmentConfiguration* pronunciationAssessmentConfig = [[SPXPronunciationAssessmentConfiguration alloc]initWithJson:[@"{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\",\"nBestPhonemeCount\":5}"]];
   ```

::: zone-end

2. Based on the code in step 1, insert a code line to receive the Pronunciation Assessment result in JSON, as below:
 
::: zone pivot="programming-language-csharp"

```csharp
var pronunciationAssessmentResultJson = speechRecognitionResult.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult);
```

::: zone-end

::: zone pivot="programming-language-cpp"

```cpp
auto pronunciationAssessmentResultJson = speechRecognitionResult ->Properties.GetProperty(PropertyId::SpeechServiceResponse_JsonResult);
```

::: zone-end

::: zone pivot="programming-language-java"

```Java
String pronunciationAssessmentResultJson = result.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult);
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
pronunciation_assessment_result_json = result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)
```

::: zone-end

::: zone pivot="programming-language-javascript"

```JavaScript
var pronunciationAssessmentResultJson = result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult);
```

::: zone-end

::: zone pivot="programming-language-objectivec"
   
```ObjectiveC
 NSString* pronunciationAssessmentResultJson = [result.properties getPropertyByName:@"RESULT-Json"];
```

::: zone-end

3. After you run the updated code, the content of `pronunciationAssessmentResultJson` will be displayed as the following JSON example. Within each element of `Phonemes` array, there's also a `PronunciationAssessment` element. This element has a `Phoneme` field and a `NBestPhonemes` element. The `Phoneme` field indicates the expected phoneme, and the `NBestPhonemes` element indicates the spoken phonemes. Each expected phoneme may have more than one spoken phoneme, ranked by pronunciation probability. For example, for the first phoneme of word `good`, the expected phoneme is / ɡ /, and it has `NBestPhonemes`: / ɡ /, / k /, and so on. There should be 5 `NBestPhonemes` if you specify "nBestPhonemeCount":5 in step 1.
The phoneme / ɡ / is in the first position within `NBestPhonemes` element and scores the highest. It means that the speaker's pronunciation is mostly closed to / ɡ /.
The phoneme / k / in the second position has the second high score. It means that the speaker's pronunciation is secondly closed to / k /. In this example, the speaker pronounced the phoneme / ɡ / well, because the top spoken phoneme / ɡ / is consistent with expected phoneme / ɡ /. If the  `NBestPhonemes`: / k / is at the top with higher score than other following `NBestPhonemes`, it means that the speaker pronounced the word `good` more like `kood`.

    ```json
    {
        "Format": "Detailed",
        "RecognitionStatus": "Success",
        "DisplayText": "Good morning.",
        "Offset": 400000,
        "Duration": 11000000,
        "SNR": 37.3953,
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
                        "AccuracyScore": 100.0,
                        "NBestPhonemes": [
                        {
                            "Phoneme": "ɡ",
                            "Score": 100.0
                        },
                        {
                            "Phoneme": "k",
                            "Score": 5.0
                        },
                        ... // omitted n best phonemes
                        ]
                    }
                },
                {
                    "Phoneme" : "ʊ",
                    "Offset" : 1800000,
                    "Duration": 500000,
                    "PronunciationAssessment": {
                        "AccuracyScore": 100.0
                        "NBestPhonemes": [
                            ... // omitted n best phonemes
                        ]
                    }
                },
                {
                    "Phoneme" : "d",
                    "Offset" : 2400000,
                    "Duration": 800000,
                    "PronunciationAssessment": {
                        "AccuracyScore": 100.0
                        "NBestPhonemes": [
                            ... // omitted n best phonemes
                        ]
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

- Try out [pronunciation assessment with the Speech SDK](how-to-pronunciation-assessment.md)
- Try out [pronunciation assessment tool through Speech Studio](how-to-use-pronunciation-assessment-tool.md)
