---
title: Use pronunciation assessment
titleSuffix: Azure AI services
description: Learn about pronunciation assessment features that are currently publicly available.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.custom: devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 06/05/2023
ms.author: eur
zone_pivot_groups: programming-languages-speech-sdk
---

# Use pronunciation assessment

In this article, you learn how to evaluate pronunciation with speech to text through the Speech SDK. To [get pronunciation assessment results](#get-pronunciation-assessment-results), you apply the `PronunciationAssessmentConfig` settings to a `SpeechRecognizer` object.

> [!NOTE]
> Usage of pronunciation assessment costs the same as standard Speech to text, whether pay-as-you-go or commitment tier [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services). If you [purchase a commitment tier](../commitment-tier.md) for standard Speech to text, the spend for pronunciation assessment goes towards meeting the commitment.

You can get pronunciation assessment scores for:

- Full text
- Words
- Syllable groups
- Phonemes in [SAPI](/previous-versions/windows/desktop/ee431828(v=vs.85)#american-english-phoneme-table) or [IPA](https://en.wikipedia.org/wiki/IPA) format

> [!NOTE]
> The syllable group, phoneme name, and spoken phoneme of pronunciation assessment are currently only available for the en-US locale. For information about availability of pronunciation assessment, see [supported languages](language-support.md?tabs=pronunciation-assessment) and [available regions](regions.md#speech-service).

## Configuration parameters

::: zone pivot="programming-language-go"
> [!NOTE]
> Pronunciation assessment is not available with the Speech SDK for Go. You can read about the concepts in this guide, but you must select another programming language for implementation details. 
::: zone-end

You must create a `PronunciationAssessmentConfig` object with the reference text, grading system, and granularity. Enabling miscue and other configuration settings are optional. 

::: zone pivot="programming-language-csharp"

```csharp
var pronunciationAssessmentConfig = new PronunciationAssessmentConfig(
    referenceText: "good morning",
    gradingSystem: GradingSystem.HundredMark, 
    granularity: Granularity.Phoneme, 
    enableMiscue: true);
```
   
::: zone-end  

::: zone pivot="programming-language-cpp"

```cpp
auto pronunciationAssessmentConfig = PronunciationAssessmentConfig::CreateFromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"enableMiscue\":true}");
```

::: zone-end

::: zone pivot="programming-language-java"

```Java
PronunciationAssessmentConfig pronunciationAssessmentConfig = PronunciationAssessmentConfig.fromJson("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"enableMiscue\":true}");
```

::: zone-end

::: zone pivot="programming-language-python"

```Python
pronunciation_assessment_config = speechsdk.PronunciationAssessmentConfig(json_string="{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"EnableMiscue\":true}")
```

::: zone-end

::: zone pivot="programming-language-javascript"

```JavaScript
var pronunciationAssessmentConfig = SpeechSDK.PronunciationAssessmentConfig.fromJSON("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"EnableMiscue\":true}");
```

::: zone-end

::: zone pivot="programming-language-objectivec"

```ObjectiveC
SPXPronunciationAssessmentConfiguration *pronunciationAssessmentConfig =
[[SPXPronunciationAssessmentConfiguration alloc] init:@"good morning"
                            gradingSystem:SPXPronunciationAssessmentGradingSystem_HundredMark
                            granularity:SPXPronunciationAssessmentGranularity_Phoneme
                            enableMiscue:true];
```

::: zone-end


::: zone pivot="programming-language-swift"

```swift
var pronunciationAssessmentConfig: SPXPronunciationAssessmentConfiguration?
do {
    try pronunciationAssessmentConfig = SPXPronunciationAssessmentConfiguration.init(referenceText, gradingSystem: SPXPronunciationAssessmentGradingSystem.hundredMark, granularity: SPXPronunciationAssessmentGranularity.phoneme, enableMiscue: true)
} catch {
    print("error \(error) happened")
    pronunciationAssessmentConfig = nil
    return
}
```

::: zone-end

::: zone pivot="programming-language-go"

::: zone-end


This table lists some of the key configuration parameters for pronunciation assessment.

| Parameter | Description | 
|-----------|-------------|
| `ReferenceText` | The text that the pronunciation is evaluated against. | 
| `GradingSystem` | The point system for score calibration. The `FivePoint` system gives a 0-5 floating point score, and `HundredMark` gives a 0-100 floating point score. Default: `FivePoint`. | 
| `Granularity` | Determines the lowest level of evaluation granularity. Scores for levels greater than or equal to the minimal value are returned. Accepted values are `Phoneme`, which shows the score on the full text, word, syllable, and phoneme level, `Syllable`, which shows the score on the full text, word, and syllable level, `Word`, which shows the score on the full text and word level, or `FullText`, which shows the score on the full text level only. The provided full reference text can be a word, sentence, or paragraph, and it depends on your input reference text. Default: `Phoneme`.| 
| `EnableMiscue` | Enables miscue calculation when the pronounced words are compared to the reference text. If this value is `True`, the `ErrorType` result value can be set to `Omission` or `Insertion` based on the comparison. Accepted values are `False` and `True`. Default: `False`. To enable miscue calculation, set the `EnableMiscue` to `True`. You can refer to the code snippet below the table.|
| `ScenarioId` | A GUID indicating a customized point system. |

## Syllable groups

Pronunciation assessment can provide syllable-level assessment results. Grouping in syllables is more legible and aligned with speaking habits, as a word is typically pronounced syllable by syllable rather than phoneme by phoneme.

The following table compares example phonemes with the corresponding syllables.

| Sample word | Phonemes | Syllables |
|-----------|-------------|-------------|
|technological|teknələdʒɪkl|tek·nə·lɑ·dʒɪkl|
|hello|hɛloʊ|hɛ·loʊ|
|luck|lʌk|lʌk|
|photosynthesis|foʊtəsɪnθəsɪs|foʊ·tə·sɪn·θə·sɪs|

To request syllable-level results along with phonemes, set the granularity [configuration parameter](#configuration-parameters) to `Phoneme`.

## Phoneme alphabet format

For the `en-US` locale, the phoneme name is provided together with the score, to help identify which phonemes were pronounced accurately or inaccurately. For other locales, you can only get the phoneme score. 

The following table compares example SAPI phonemes with the corresponding IPA phonemes.

| Sample word | SAPI Phonemes | IPA phonemes |
|-----------|-------------|-------------|
|hello|h eh l ow|h ɛ l oʊ|
|luck|l ah k|l ʌ k|
|photosynthesis|f ow t ax s ih n th ax s ih s|f oʊ t ə s ɪ n θ ə s ɪ s|

To request IPA phonemes, set the phoneme alphabet to `"IPA"`. If you don't specify the alphabet, the phonemes are in SAPI format by default.

::: zone pivot="programming-language-csharp"

```csharp
pronunciationAssessmentConfig.PhonemeAlphabet = "IPA";
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
pronunciationAssessmentConfig.phonemeAlphabet = @"IPA";
```

::: zone-end


::: zone pivot="programming-language-swift"

```swift
pronunciationAssessmentConfig?.phonemeAlphabet = "IPA"
```

::: zone-end

::: zone pivot="programming-language-go"

::: zone-end


## Spoken phoneme

With spoken phonemes, you can get confidence scores indicating how likely the spoken phonemes matched the expected phonemes. 

For example, to obtain the complete spoken sound for the word "Hello", you can concatenate the first spoken phoneme for each expected phoneme with the highest confidence score. In the following assessment result, when you speak the word "hello", the expected IPA phonemes are "h ɛ l oʊ". However, the actual spoken phonemes are "h ə l oʊ". You have five possible candidates for each expected phoneme in this example. The assessment result shows that the most likely spoken phoneme was `"ə"` instead of the expected phoneme `"ɛ"`. The expected phoneme `"ɛ"` only received a confidence score of 47. Other potential matches received confidence scores of 52, 17, and 2. 

```json
{
	"Id": "bbb42ea51bdb46d19a1d685e635fe173",
	"RecognitionStatus": 0,
	"Offset": 7500000,
	"Duration": 13800000,
	"DisplayText": "Hello.",
	"NBest": [
		{
			"Confidence": 0.975003,
			"Lexical": "hello",
			"ITN": "hello",
			"MaskedITN": "hello",
			"Display": "Hello.",
			"PronunciationAssessment": {
				"AccuracyScore": 100,
				"FluencyScore": 100,
				"CompletenessScore": 100,
				"PronScore": 100
			},
			"Words": [
				{
					"Word": "hello",
					"Offset": 7500000,
					"Duration": 13800000,
					"PronunciationAssessment": {
						"AccuracyScore": 99.0,
						"ErrorType": "None"
					},
					"Syllables": [
						{
							"Syllable": "hɛ",
							"PronunciationAssessment": {
								"AccuracyScore": 91.0
							},
							"Offset": 7500000,
                            "Duration": 4100000
						},
						{
							"Syllable": "loʊ",
							"PronunciationAssessment": {
								"AccuracyScore": 100.0
							},
							"Offset": 11700000,
                            "Duration": 9600000
						}
					],
					"Phonemes": [
						{
							"Phoneme": "h",
							"PronunciationAssessment": {
								"AccuracyScore": 98.0,
								"NBestPhonemes": [
									{
										"Phoneme": "h",
										"Score": 100.0
									},
									{
										"Phoneme": "oʊ",
										"Score": 52.0
									},
									{
										"Phoneme": "ə",
										"Score": 35.0
									},
									{
										"Phoneme": "k",
										"Score": 23.0
									},
									{
										"Phoneme": "æ",
										"Score": 20.0
									}
								]
							},
							"Offset": 7500000,
                            "Duration": 3500000
						},
						{
							"Phoneme": "ɛ",
							"PronunciationAssessment": {
								"AccuracyScore": 47.0,
								"NBestPhonemes": [
									{
										"Phoneme": "ə",
										"Score": 100.0
									},
									{
										"Phoneme": "l",
										"Score": 52.0
									},
									{
										"Phoneme": "ɛ",
										"Score": 47.0
									},
									{
										"Phoneme": "h",
										"Score": 17.0
									},
									{
										"Phoneme": "æ",
										"Score": 2.0
									}
								]
							},
							"Offset": 11100000,
                            "Duration": 500000
						},
						{
							"Phoneme": "l",
							"PronunciationAssessment": {
								"AccuracyScore": 100.0,
								"NBestPhonemes": [
									{
										"Phoneme": "l",
										"Score": 100.0
									},
									{
										"Phoneme": "oʊ",
										"Score": 46.0
									},
									{
										"Phoneme": "ə",
										"Score": 5.0
									},
									{
										"Phoneme": "ɛ",
										"Score": 3.0
									},
									{
										"Phoneme": "u",
										"Score": 1.0
									}
								]
							},
							"Offset": 11700000,
                            "Duration": 1100000
						},
						{
							"Phoneme": "oʊ",
							"PronunciationAssessment": {
								"AccuracyScore": 100.0,
								"NBestPhonemes": [
									{
										"Phoneme": "oʊ",
										"Score": 100.0
									},
									{
										"Phoneme": "d",
										"Score": 29.0
									},
									{
										"Phoneme": "t",
										"Score": 24.0
									},
									{
										"Phoneme": "n",
										"Score": 22.0
									},
									{
										"Phoneme": "l",
										"Score": 18.0
									}
								]
							},
							"Offset": 12900000,
                            "Duration": 8400000
						}
					]
				}
			]
		}
	]
}
```

To indicate whether, and how many potential spoken phonemes to get confidence scores for, set the `NBestPhonemeCount` parameter to an integer value such as `5`. 
   
::: zone pivot="programming-language-csharp"

```csharp
pronunciationAssessmentConfig.NBestPhonemeCount = 5;
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
pronunciationAssessmentConfig.nbestPhonemeCount = 5;
```

::: zone-end


::: zone pivot="programming-language-swift"

```swift
pronunciationAssessmentConfig?.nbestPhonemeCount = 5
```

::: zone-end

::: zone pivot="programming-language-go"

::: zone-end

## Get pronunciation assessment results 

In the `SpeechRecognizer`, you can specify the language that you're learning or practicing improving pronunciation. The default locale is `en-US` if not otherwise specified. 

> [!TIP]
> If you aren't sure which locale to set when a language has multiple locales (such as Spanish), try each locale (such as `es-ES` and `es-MX`) separately. Evaluate the results to determine which locale scores higher for your specific scenario.

When speech is recognized, you can request the pronunciation assessment results as SDK objects or a JSON string. 

::: zone pivot="programming-language-csharp"

```csharp
using (var speechRecognizer = new SpeechRecognizer(
    speechConfig,
    audioConfig))
{
    pronunciationAssessmentConfig.ApplyTo(speechRecognizer);
    var speechRecognitionResult = await speechRecognizer.RecognizeOnceAsync();

    // The pronunciation assessment result as a Speech SDK object
    var pronunciationAssessmentResult =
        PronunciationAssessmentResult.FromResult(speechRecognitionResult);

    // The pronunciation assessment result as a JSON string
    var pronunciationAssessmentResultJson = speechRecognitionResult.Properties.GetProperty(PropertyId.SpeechServiceResponse_JsonResult);
}
```

To learn how to specify the learning language for pronunciation assessment in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#LL1086C13-L1086C98).

::: zone-end   

::: zone pivot="programming-language-cpp"

Word, syllable, and phoneme results aren't available via SDK objects with the Speech SDK for C++. Word, syllable, and phoneme results are only available in the JSON string.

```cpp
auto speechRecognizer = SpeechRecognizer::FromConfig(
    speechConfig,
    audioConfig);

pronunciationAssessmentConfig->ApplyTo(speechRecognizer);
speechRecognitionResult = speechRecognizer->RecognizeOnceAsync().get();

// The pronunciation assessment result as a Speech SDK object
auto pronunciationAssessmentResult =
    PronunciationAssessmentResult::FromResult(speechRecognitionResult);

// The pronunciation assessment result as a JSON string
auto pronunciationAssessmentResultJson = speechRecognitionResult->Properties.GetProperty(PropertyId::SpeechServiceResponse_JsonResult);
```

To learn how to specify the learning language for pronunciation assessment in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp#L624).
   
::: zone-end 

::: zone pivot="programming-language-java"
For Android application development, the word, syllable, and phoneme results are available via SDK objects with the Speech SDK for Java. The results are also available in the JSON string. For Java Runtime (JRE) application development, the word, syllable, and phoneme results are only available in the JSON string.

```Java
SpeechRecognizer speechRecognizer = new SpeechRecognizer(
    speechConfig,
    audioConfig);

pronunciationAssessmentConfig.applyTo(speechRecognizer);
Future<SpeechRecognitionResult> future = speechRecognizer.recognizeOnceAsync();
SpeechRecognitionResult speechRecognitionResult = future.get(30, TimeUnit.SECONDS);

// The pronunciation assessment result as a Speech SDK object
PronunciationAssessmentResult pronunciationAssessmentResult =
    PronunciationAssessmentResult.fromResult(speechRecognitionResult);

// The pronunciation assessment result as a JSON string
String pronunciationAssessmentResultJson = speechRecognitionResult.getProperties().getProperty(PropertyId.SpeechServiceResponse_JsonResult);

recognizer.close();
speechConfig.close();
audioConfig.close();
pronunciationAssessmentConfig.close();
speechRecognitionResult.close();
```

::: zone-end 


::: zone pivot="programming-language-javascript"

```JavaScript
var speechRecognizer = SpeechSDK.SpeechRecognizer.FromConfig(speechConfig, audioConfig);

pronunciationAssessmentConfig.applyTo(speechRecognizer);

speechRecognizer.recognizeOnceAsync((speechRecognitionResult: SpeechSDK.SpeechRecognitionResult) => {
    // The pronunciation assessment result as a Speech SDK object
	var pronunciationAssessmentResult = SpeechSDK.PronunciationAssessmentResult.fromResult(speechRecognitionResult);

	// The pronunciation assessment result as a JSON string
	var pronunciationAssessmentResultJson = speechRecognitionResult.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult);
},
{});
```

To learn how to specify the learning language for pronunciation assessment in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/node/pronunciationAssessmentContinue.js#LL37C4-L37C52).

::: zone-end  

::: zone pivot="programming-language-python"

```Python
speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, \
        audio_config=audio_config)

pronunciation_assessment_config.apply_to(speech_recognizer)
speech_recognition_result = speech_recognizer.recognize_once()

# The pronunciation assessment result as a Speech SDK object
pronunciation_assessment_result = speechsdk.PronunciationAssessmentResult(speech_recognition_result)

# The pronunciation assessment result as a JSON string
pronunciation_assessment_result_json = speech_recognition_result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)
```

To learn how to specify the learning language for pronunciation assessment in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py#LL937C1-L937C1).

::: zone-end  


::: zone pivot="programming-language-objectivec"
   
```ObjectiveC
SPXSpeechRecognizer* speechRecognizer = \
        [[SPXSpeechRecognizer alloc] initWithSpeechConfiguration:speechConfig
                                              audioConfiguration:audioConfig];

[pronunciationAssessmentConfig applyToRecognizer:speechRecognizer];

SPXSpeechRecognitionResult *speechRecognitionResult = [speechRecognizer recognizeOnce];

// The pronunciation assessment result as a Speech SDK object
SPXPronunciationAssessmentResult* pronunciationAssessmentResult = [[SPXPronunciationAssessmentResult alloc] init:speechRecognitionResult];

// The pronunciation assessment result as a JSON string
NSString* pronunciationAssessmentResultJson = [speechRecognitionResult.properties getPropertyByName:SPXSpeechServiceResponseJsonResult];
```

To learn how to specify the learning language for pronunciation assessment in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/objective-c/ios/speech-samples/speech-samples/ViewController.m#L862).

::: zone-end 

::: zone pivot="programming-language-swift"

```swift
let speechRecognizer = try! SPXSpeechRecognizer(speechConfiguration: speechConfig, audioConfiguration: audioConfig)

try! pronConfig.apply(to: speechRecognizer)

let speechRecognitionResult = try? speechRecognizer.recognizeOnce()

// The pronunciation assessment result as a Speech SDK object
let pronunciationAssessmentResult = SPXPronunciationAssessmentResult(speechRecognitionResult!)

// The pronunciation assessment result as a JSON string
let pronunciationAssessmentResultJson = speechRecognitionResult!.properties?.getPropertyBy(SPXPropertyId.speechServiceResponseJsonResult)
```

To learn how to specify the learning language for pronunciation assessment in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/swift/ios/speech-samples/speech-samples/ViewController.swift#L224).

::: zone-end

::: zone pivot="programming-language-go"

::: zone-end

### Result parameters

This table lists some of the key pronunciation assessment results.

| Parameter | Description |
|-----------|-------------|
| `AccuracyScore` | Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Syllable, word, and full text accuracy scores are aggregated from phoneme-level accuracy score, and refined with assessment objectives.|
| `FluencyScore` | Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words. |
| `CompletenessScore` | Completeness of the speech, calculated by the ratio of pronounced words to the input reference text. |
| `PronScore` | Overall score indicating the pronunciation quality of the given speech. `PronScore` is aggregated from `AccuracyScore`, `FluencyScore`, and `CompletenessScore` with weight. |
| `ErrorType` | This value indicates whether a word is omitted, inserted, or mispronounced, compared to the `ReferenceText`. Possible values are `None`, `Omission`, `Insertion`, and `Mispronunciation`. The error type can be `Mispronunciation` when the pronunciation `AccuracyScore` for a word is below 60.|

### JSON result example

Pronunciation assessment results for the spoken word "hello" are shown as a JSON string in the following example. Here's what you should know:
- The phoneme [alphabet](#phoneme-alphabet-format) is IPA.
- The [syllables](#syllable-groups) are returned alongside phonemes for the same word. 
- You can use the `Offset` and `Duration` values to align syllables with their corresponding phonemes. For example, the starting offset (11700000) of the second syllable ("loʊ") aligns with the third phoneme ("l"). The offset represents the time at which the recognized speech begins in the audio stream, and it's measured in 100-nanosecond units. To learn more about `Offset` and `Duration`, see [response properties](rest-speech-to-text-short.md#response-properties).
- There are five `NBestPhonemes` corresponding to the number of [spoken phonemes](#spoken-phoneme) requested.
- Within `Phonemes`, the most likely [spoken phonemes](#spoken-phoneme) was `"ə"` instead of the expected phoneme `"ɛ"`. The expected phoneme `"ɛ"` only received a confidence score of 47. Other potential matches received confidence scores of 52, 17, and 2. 

```json
{
	"Id": "bbb42ea51bdb46d19a1d685e635fe173",
	"RecognitionStatus": 0,
	"Offset": 7500000,
	"Duration": 13800000,
	"DisplayText": "Hello.",
	"NBest": [
		{
			"Confidence": 0.975003,
			"Lexical": "hello",
			"ITN": "hello",
			"MaskedITN": "hello",
			"Display": "Hello.",
			"PronunciationAssessment": {
				"AccuracyScore": 100,
				"FluencyScore": 100,
				"CompletenessScore": 100,
				"PronScore": 100
			},
			"Words": [
				{
					"Word": "hello",
					"Offset": 7500000,
					"Duration": 13800000,
					"PronunciationAssessment": {
						"AccuracyScore": 99.0,
						"ErrorType": "None"
					},
					"Syllables": [
						{
							"Syllable": "hɛ",
							"PronunciationAssessment": {
								"AccuracyScore": 91.0
							},
							"Offset": 7500000,
                            "Duration": 4100000
						},
						{
							"Syllable": "loʊ",
							"PronunciationAssessment": {
								"AccuracyScore": 100.0
							},
							"Offset": 11700000,
                            "Duration": 9600000
						}
					],
					"Phonemes": [
						{
							"Phoneme": "h",
							"PronunciationAssessment": {
								"AccuracyScore": 98.0,
								"NBestPhonemes": [
									{
										"Phoneme": "h",
										"Score": 100.0
									},
									{
										"Phoneme": "oʊ",
										"Score": 52.0
									},
									{
										"Phoneme": "ə",
										"Score": 35.0
									},
									{
										"Phoneme": "k",
										"Score": 23.0
									},
									{
										"Phoneme": "æ",
										"Score": 20.0
									}
								]
							},
							"Offset": 7500000,
                            "Duration": 3500000
						},
						{
							"Phoneme": "ɛ",
							"PronunciationAssessment": {
								"AccuracyScore": 47.0,
								"NBestPhonemes": [
									{
										"Phoneme": "ə",
										"Score": 100.0
									},
									{
										"Phoneme": "l",
										"Score": 52.0
									},
									{
										"Phoneme": "ɛ",
										"Score": 47.0
									},
									{
										"Phoneme": "h",
										"Score": 17.0
									},
									{
										"Phoneme": "æ",
										"Score": 2.0
									}
								]
							},
							"Offset": 11100000,
                            "Duration": 500000
						},
						{
							"Phoneme": "l",
							"PronunciationAssessment": {
								"AccuracyScore": 100.0,
								"NBestPhonemes": [
									{
										"Phoneme": "l",
										"Score": 100.0
									},
									{
										"Phoneme": "oʊ",
										"Score": 46.0
									},
									{
										"Phoneme": "ə",
										"Score": 5.0
									},
									{
										"Phoneme": "ɛ",
										"Score": 3.0
									},
									{
										"Phoneme": "u",
										"Score": 1.0
									}
								]
							},
							"Offset": 11700000,
                            "Duration": 1100000
						},
						{
							"Phoneme": "oʊ",
							"PronunciationAssessment": {
								"AccuracyScore": 100.0,
								"NBestPhonemes": [
									{
										"Phoneme": "oʊ",
										"Score": 100.0
									},
									{
										"Phoneme": "d",
										"Score": 29.0
									},
									{
										"Phoneme": "t",
										"Score": 24.0
									},
									{
										"Phoneme": "n",
										"Score": 22.0
									},
									{
										"Phoneme": "l",
										"Score": 18.0
									}
								]
							},
							"Offset": 12900000,
                            "Duration": 8400000
						}
					]
				}
			]
		}
	]
}
```

## Pronunciation assessment in streaming mode

Pronunciation assessment supports uninterrupted streaming mode. The recording time can be unlimited through the Speech SDK. As long as you don't stop recording, the evaluation process doesn't finish and you can pause and resume evaluation conveniently. In streaming mode, the `AccuracyScore`, `FluencyScore` , and `CompletenessScore`  will vary over time throughout the recording and evaluation process.

::: zone pivot="programming-language-csharp"

For how to use Pronunciation Assessment in streaming mode in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#:~:text=PronunciationAssessmentWithStream).

::: zone-end

::: zone pivot="programming-language-cpp"

For how to use Pronunciation Assessment in streaming mode in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp#:~:text=PronunciationAssessmentWithStream).

::: zone-end

::: zone pivot="programming-language-java"

For how to use Pronunciation Assessment in streaming mode in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/android/sdkdemo/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/sdkdemo/MainActivity.java#L548).

::: zone-end

::: zone pivot="programming-language-python"

For how to use Pronunciation Assessment in streaming mode in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py#L915).

::: zone-end

::: zone pivot="programming-language-javascript"

For how to use Pronunciation Assessment in streaming mode in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/node/pronunciationAssessment.js).

::: zone-end

::: zone pivot="programming-language-objectivec"

For how to use Pronunciation Assessment in streaming mode in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/objective-c/ios/speech-samples/speech-samples/ViewController.m#L831).

::: zone-end

::: zone pivot="programming-language-swift"

For how to use Pronunciation Assessment in streaming mode in your own application, see [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/swift/ios/speech-samples/speech-samples/ViewController.swift#L191).

::: zone-end

::: zone pivot="programming-language-go"

::: zone-end

## Next steps

- Learn our quality [benchmark](https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/speech-service-update-hierarchical-transformer-for-pronunciation/ba-p/3740866)
- Try out [pronunciation assessment in Speech Studio](pronunciation-assessment-tool.md)
- Check out easy-to-deploy Pronunciation Assessment [demo](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/PronunciationAssessment/BrowserJS) and watch the [video tutorial](https://www.youtube.com/watch?v=zFlwm7N4Awc) of pronunciation assessment.
