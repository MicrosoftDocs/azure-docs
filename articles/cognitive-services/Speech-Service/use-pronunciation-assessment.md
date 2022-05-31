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
> For pronunciation assessment supported languages and regions, see [supported languages](language-support.md#pronunciation-assessment) and [available regions](regions.md#speech-to-text-pronunciation-assessment-text-to-speech-and-translation).

## Configuration parameters

This table lists the configuration parameters for pronunciation assessment.

| Parameter | Description | Required? |
|-----------|-------------|---------------------|
| `ReferenceText` | The text that the pronunciation will be evaluated against. | Required |
| `GradingSystem` | The point system for score calibration. The `FivePoint` system gives a 0-5 floating point score, and `HundredMark` gives a 0-100 floating point score. Default: `FivePoint`. | Optional |
| `Granularity` | The evaluation granularity. Accepted values are `Phoneme`, which shows the score on the full text, word and phoneme level, `Syllable`, which shows the score on the full text, word and syllable level, `Word`, which shows the score on the full text and word level, `FullText`, which shows the score on the full text level only. Default: `Phoneme`. | Optional |
| `EnableMiscue` | Enables miscue calculation when the pronounced words are compared to the reference text. If this value is `True`, the `ErrorType` result value can be set to `Omission` or `Insertion` based on the comparison. Accepted values are `False` and `True`. Default: `False`. | Optional |


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


Within each `Words` array in the result, there's a `Syllables` element, which contains the syllables for this word. For word `good`, there's only one syllable / ɡʊd /, and for word `morning`, you can see two syllables / mɔr / and / nɪŋ /. Each syllable also has a `AccuracyScore` field within the `PronunciationAssessment` element, which means the syllable-level score. This score can tell how accurately the speaker pronounces this syllable.

Get syllable support by setting the `Granularity` parameter to `Phoneme`.

::: zone pivot="programming-language-csharp"

```csharp
var pronunciationConfig = new PronunciationAssessmentConfig(
    referenceText: "Evaluate speech with this text",
    gradingSystem: GradingSystem.HundredMark, 
    granularity: Granularity.Phoneme, 
    enableMiscue: true);
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
SPXPronunciationAssessmentConfiguration *pronunicationConfig =
[[SPXPronunciationAssessmentConfiguration alloc] init:@"Hello world! Today is a nice day!"
                                            gradingSystem:SPXPronunciationAssessmentGradingSystem_HundredMark
                                            granularity:SPXPronunciationAssessmentGranularity_Phoneme
                                            enableMiscue:true];
[self.pronunicationConfig setPropertyTo:5 byId:SPXSpeechServiceResponseStablePartialResultThreshold];
```

::: zone-end


::: zone pivot="programming-language-swift"

```swift
var pronunciationConfig: SPXPronunciationAssessmentConfiguration?
do {
    try pronunciationConfig = SPXPronunciationAssessmentConfiguration.init(referenceText, gradingSystem: SPXPronunciationAssessmentGradingSystem.hundredMark, granularity: SPXPronunciationAssessmentGranularity.phoneme, enableMiscue: true)
} catch {
    print("error \(error) happened")
    pronunciationConfig = nil
    return
}
```

::: zone-end


## Phoneme in IPA format

At the phoneme level, Pronunciation Assessment provides accuracy scores of each phoneme, helping learners to better understand the pronunciation details of their speech. When giving the phoneme-level score, we need to show the phoneme name together with the score, so that users can know which phoneme they pronounced better, and which phoneme they pronounced worse. 

Previously our API can only show the phoneme name in [SAPI](/previous-versions/windows/desktop/ee431828(v=vs.85)#american-english-phoneme-table) format, which most users are not familiar with. With this preview feature, the API can also show the phonemes in [IPA](https://en.wikipedia.org/wiki/IPA) format, which is much better known by users. 

Below are a few samples for comparison between SAPI phonemes and IPA phonemes.

| Sample word | SAPI Phonemes | IPA phonemes |
|-----------|-------------|-------------|
|hello|h eh l ow|h ɛ l oʊ|
|luck|l ah k|l ʌ k|
|photosynthesis|f ow t ax s ih n th ax s ih s|f oʊ t ə s ɪ n θ ə s ɪ s|


If you don't specify this attribute, the phonemes will be in SAPI format by default.

::: zone pivot="programming-language-csharp"

```csharp
var pronunciationConfig = new PronunciationAssessmentConfig(
    referenceText: "Evaluate speech with this text",
    gradingSystem: GradingSystem.HundredMark, 
    granularity: Granularity.Phoneme, 
    enableMiscue: true);
pronunciationConfig.PhonemeAlphabet = "IPA";
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


::: zone pivot="programming-language-swift"

```swift
var pronunciationConfig: SPXPronunciationAssessmentConfiguration?
do {
    try pronunciationConfig = SPXPronunciationAssessmentConfiguration.init(referenceText, gradingSystem: SPXPronunciationAssessmentGradingSystem.hundredMark, granularity: SPXPronunciationAssessmentGranularity.phoneme, enableMiscue: true)
} catch {
    print("error \(error) happened")
    pronunciationConfig = nil
    return
}
pronunciationConfig?.phonemeAlphabet = "IPA"
```

::: zone-end


## Spoken phoneme

> [!NOTE]
> Spoken phoneme is only available in `en-US`. 
> 
> If you want to use languages that aren't supported or have other requirements for these features , please contact us by email at [mspafeedback@microsoft.com](mailto:mspafeedback@microsoft.com).
>  
> For pronunciation assessment supported regions, see [available regions](regions.md#speech-to-text-pronunciation-assessment-text-to-speech-and-translation).

Previously Pronunciation Assessment API detects miscues and provides an accuracy score and error types in the given speech. But we can only show the targeted phonemes for each word from the reference text. With this new feature, it can also show the phoneme that a user speaks as a clear comparison to the targeted phonemes. For example, for the word “hello”, when a user incorrectly speaks one of the phonemes as another one (such as / ɛ / was spoken as / ʌ /), previously the API can just give its targeted phonemes / h ɛ l oʊ / and low score on this phoneme, but can't give the actually spoken phoneme. Now with this new feature, the API not only gives targeted phonemes / h ɛ l oʊ / and low score on / ɛ /, but also gives the actual spoken phonemes / h ʌ l oʊ /. Thus, this feature can help you better understand the pronunciation issue.

Must set 
   
::: zone pivot="programming-language-csharp"

```csharp
var pronunciationConfig = new PronunciationAssessmentConfig(
    referenceText: "Evaluate speech with this text",
    gradingSystem: GradingSystem.HundredMark, 
    granularity: Granularity.Phoneme, 
    enableMiscue: true);
pronunciationConfig.NBestPhonemeCount = 5;
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


::: zone pivot="programming-language-swift"

```swift
var pronunciationConfig: SPXPronunciationAssessmentConfiguration?
do {
    try pronunciationConfig = SPXPronunciationAssessmentConfiguration.init(referenceText, gradingSystem: SPXPronunciationAssessmentGradingSystem.hundredMark, granularity: SPXPronunciationAssessmentGranularity.phoneme, enableMiscue: true)
} catch {
    print("error \(error) happened")
    pronunciationConfig = nil
    return
}
pronunciationConfig?.nbestPhonemeCount = 5
```

::: zone-end

## Get pronunciation assessment results 

For recognized speech.


```csharp
if (result.Reason == ResultReason.RecognizedSpeech)
{
    Console.WriteLine($"RECOGNIZED: Text={result.Text}");
    Console.WriteLine("  PRONUNCIATION ASSESSMENT RESULTS:");

    var pronunciationResult = PronunciationAssessmentResult.FromResult(result);
    Console.WriteLine(
        $"    Accuracy score: {pronunciationResult.AccuracyScore}, Pronunciation score: {pronunciationResult.PronunciationScore}, Completeness score : {pronunciationResult.CompletenessScore}, FluencyScore: {pronunciationResult.FluencyScore}");

    Console.WriteLine("  Word-level details:");

    // Granularity must be set to Word or Phoneme in PronunciationAssessmentConfig
    // to get word-level details.
    foreach (var word in pronunciationResult.Words)
    {
        Console.WriteLine($"    Word: {word.Word}, Accuracy score: {word.AccuracyScore}, Error type: {word.ErrorType}.");

        // Granularity must be set to Phoneme in PronunciationAssessmentConfig
        // to get syllable-level details.
        if(null != word.Syllables) {
            foreach (var syllable in word.Syllables) {
                Console.WriteLine($"      Syllable: {syllable.Syllable}, Accuracy score: {syllable.AccuracyScore}, Offset: {syllable.Offset}, Duration: {syllable.Duration}, Grapheme: {syllable.Grapheme}");
            }
        }

        // Granularity must be set to Phoneme in PronunciationAssessmentConfig
        // to get phoneme-level details.
        if(null != word.Phonemes) {
            foreach (var phoneme in word.Phonemes) {
                Console.WriteLine($"        Target Phoneme: {phoneme.Phoneme}, Accuracy score: {phoneme.AccuracyScore}, Offset: {phoneme.Offset}, Duration: {phoneme.Duration}");

                // NBestPhonemeCount must be set in PronunciationAssessmentConfig
                // to get spoken phoneme details.
                if(null != phoneme.NBestPhonemes) {
                    foreach (var nBestPhoneme in phoneme.NBestPhonemes) {
                        Console.WriteLine($"            Spoken Phoneme: {nBestPhoneme.Phoneme}, Score: {nBestPhoneme.Score}");
                    }
                }
            }
        }
    }
}
```


```cpp

```
   
::: zone-end

::: zone pivot="programming-language-java"

```Java

```
   
::: zone-end   

::: zone pivot="programming-language-python"

```Python

```

::: zone-end

::: zone pivot="programming-language-javascript"

```JavaScript

```

::: zone-end

::: zone pivot="programming-language-objectivec"
   
```ObjectiveC

```

::: zone-end


::: zone pivot="programming-language-swift"

```swift

```

::: zone-end

After you run the updated code, the content of `pronunciationAssessmentResultJson` will be displayed as the following JSON example. Within each element of `Phonemes` array, there's also a `PronunciationAssessment` element. This element has a `Phoneme` field and a `NBestPhonemes` element. The `Phoneme` field indicates the expected phoneme, and the `NBestPhonemes` element indicates the spoken phonemes. Each expected phoneme may have more than one spoken phoneme, ranked by pronunciation probability. For example, for the first phoneme of word `good`, the expected phoneme is / ɡ /, and it has `NBestPhonemes`: / ɡ /, / k /, and so on. There should be 5 `NBestPhonemes` if you specify "nBestPhonemeCount":5 in step 1.
The phoneme / ɡ / is in the first position within `NBestPhonemes` element and scores the highest. It means that the speaker's pronunciation is mostly closed to / ɡ /.
The phoneme / k / in the second position has the second high score. It means that the speaker's pronunciation is secondly closed to / k /. In this example, the speaker pronounced the phoneme / ɡ / well, because the top spoken phoneme / ɡ / is consistent with expected phoneme / ɡ /. If the  `NBestPhonemes`: / k / is at the top with higher score than other following `NBestPhonemes`, it means that the speaker pronounced the word `good` more like `kood`.

Example output for IPA phonemes and NBestPhonemeCount set to 5.

```console
Accuracy score: 97, Pronunciation score: 98, Completeness score : 100, FluencyScore: 99
  Word-level details:
    Word: hello, Accuracy score: 100, Error type: None.
      Syllable: hɛ, Accuracy score: 96, Offset: 9600000, Duration: 5400000, Grapheme: 
      Syllable: loʊ, Accuracy score: 100, Offset: 15100000, Duration: 4900000, Grapheme: 
        Target Phoneme: h, Accuracy score: 99, Offset: 9600000, Duration: 4800000
            Spoken Phoneme: h, Score: 100
            Spoken Phoneme: oʊ, Score: 54
            Spoken Phoneme: ə, Score: 32
            Spoken Phoneme: t, Score: 19
            Spoken Phoneme: s, Score: 16
```

## Next steps

- Try out [pronunciation assessment with the Speech SDK](how-to-pronunciation-assessment.md)
- Try out [pronunciation assessment tool through Speech Studio](pronunciation-assessment-tool.md)
