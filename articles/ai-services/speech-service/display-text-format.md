---
title: Display text formatting with speech to text - Speech service
titleSuffix: Azure AI services
description: An overview of key concepts for display text formatting with speech to text.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.custom: devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python
ms.topic: conceptual
ms.date: 09/19/2022
ms.author: eur
zone_pivot_groups: programming-languages-speech-sdk-cli
---

# Display text formatting with speech to text

Speech to text offers an array of formatting features to ensure that the transcribed text is clear and legible. Below is an overview of these features and how each one is used to improve the overall clarity of the final text output.

## ITN

Inverse Text Normalization (ITN) is a process that converts spoken words into their written form. For example, the spoken word "four" is converted to the written form "4". This process is performed by the speech to text service and isn't configurable. Some of the supported text formats include dates, times, decimals, currencies, addresses, emails, and phone numbers. You can speak naturally, and the service formats text as expected. The following table shows the ITN rules that are applied to the text output.

|Recognized speech|Display text|
|---|---|
|`that will cost nine hundred dollars`|`That will cost $900.`|
|`my phone number is one eight hundred, four five six, eight nine ten`|`My phone number is 1-800-456-8910.`|
|`the time is six forty five p m`|`The time is 6:45 PM.`|
|`I live on thirty five lexington avenue`|`I live on 35 Lexington Ave.`|
|`the answer is six point five`|`The answer is 6.5.`|
|`send it to support at help dot com`|`Send it to support@help.com.`|

## Capitalization

Speech to text models recognize words that should be capitalized to improve readability, accuracy, and grammar. For example, the Speech service will automatically capitalize proper nouns and words at the beginning of a sentence. Some examples are shown in this table.

|Recognized speech|Display text|
|---|---|
|`i got an x l t shirt`|`I got an XL t-shirt.`|
|`my name is jennifer smith`|`My name is Jennifer Smith.`|
|`i want to visit new york city`|`I want to visit New York City.`|

## Disfluency removal

When speaking, it's common for someone to stutter, duplicate words, and say filler words like "uhm" or "uh". Speech to text can recognize such disfluencies and remove them from the display text. Disfluency removal is great for transcribing live unscripted speeches to read them back later. Some examples are shown in this table.

|Recognized speech|Display text|
|---|---|
|`i uh said that we can go to the uhmm movies`|`I said that we can go to the movies.`|
|`its its not that big of uhm a deal`|`It's not that big of a deal.`|
|`umm i think tomorrow should work`|`I think tomorrow should work.`|

## Punctuation 

Speech to text automatically punctuates your text to improve clarity. Punctuation is helpful for reading back call or conversation transcriptions. Some examples are shown in this table.

|Recognized speech|Display text|
|---|---|
|`how are you`|`How are you?`|
|`we can go to the mall park or beach`|`We can go to the mall, park, or beach.`|

When you're using speech to text with continuous recognition, you can configure the Speech service to recognize explicit punctuation marks. Then you can speak punctuation aloud in order to make your text more legible. This is especially useful in a situation where you want to use complex punctuation without having to merge it later. Some examples are shown in this table.

|Recognized speech|Display text|
|---|---|
|`they entered the room dot dot dot`|`They entered the room...`|
|`i heart emoji you period`|`I <3 you.`|
|`the options are apple forward slash banana forward slash orange period`|`The options are apple/banana/orange.`|
|`are you sure question mark`|`Are you sure?`|

Use the Speech SDK to enable dictation mode when you're using speech to text with continuous recognition. This mode will cause the speech configuration instance to interpret word descriptions of sentence structures such as punctuation.

::: zone pivot="programming-language-csharp"
```csharp
speechConfig.EnableDictation();
```
::: zone-end
::: zone pivot="programming-language-cpp"
```cpp
speechConfig->EnableDictation();
```
::: zone-end
::: zone pivot="programming-language-go"
```go
speechConfig.EnableDictation()
```
::: zone-end
::: zone pivot="programming-language-java"
```java
speechConfig.enableDictation();
```
::: zone-end
::: zone pivot="programming-language-javascript"
```javascript
speechConfig.enableDictation();
```
::: zone-end
::: zone pivot="programming-language-objectivec"
```objective-c
[self.speechConfig enableDictation];
```
::: zone-end
::: zone pivot="programming-language-swift"
```swift
self.speechConfig!.enableDictation()
```
::: zone-end
::: zone pivot="programming-language-python"
```python
speech_config.enable_dictation()
```
::: zone-end

## Profanity filter 

You can specify whether to mask, remove, or show profanity in the final transcribed text. Masking replaces profane words with asterisk (*) characters so that you can keep the original sentiment of your text while making it more appropriate for certain situations 

> [!NOTE]
> Microsoft also reserves the right to mask or remove any word that is deemed inappropriate. Such words will not be returned by the Speech service, whether or not you enabled profanity filtering.

The profanity filter options are:
- `Masked`: Replaces letters in profane words with asterisk (*) characters. Masked is the default option.
- `Raw`: Include the profane words verbatim.
- `Removed`: Removes profane words.

For example, to remove profane words from the speech recognition result, set the profanity filter to `Removed` as shown here:

::: zone pivot="programming-language-csharp"
```csharp
speechConfig.SetProfanity(ProfanityOption.Removed);
```
::: zone-end
::: zone pivot="programming-language-cpp"
```cpp
speechConfig->SetProfanity(ProfanityOption::Removed);
```
::: zone-end
::: zone pivot="programming-language-go"
```go
speechConfig.SetProfanity(common.Removed)
```
::: zone-end
::: zone pivot="programming-language-java"
```java
speechConfig.setProfanity(ProfanityOption.Removed);
```
::: zone-end
::: zone pivot="programming-language-javascript"
```javascript
speechConfig.setProfanity(sdk.ProfanityOption.Removed);
```
::: zone-end
::: zone pivot="programming-language-objectivec"
```objective-c
[self.speechConfig setProfanityOptionTo:SPXSpeechConfigProfanityOption.SPXSpeechConfigProfanityOption_ProfanityRemoved];
```
::: zone-end
::: zone pivot="programming-language-swift"
```swift
self.speechConfig!.setProfanityOptionTo(SPXSpeechConfigProfanityOption_ProfanityRemoved)
```
::: zone-end
::: zone pivot="programming-language-python"
```python
speech_config.set_profanity(speechsdk.ProfanityOption.Removed)
```
::: zone-end
::: zone pivot="programming-language-cli"
```console
spx recognize --file caption.this.mp4 --format any --profanity masked --output vtt file - --output srt file -
```
::: zone-end

Profanity filter is applied to the result `Text` and `MaskedNormalizedForm` properties. Profanity filter isn't applied to the result `LexicalForm` and `NormalizedForm` properties. Neither is the filter applied to the word level results.


## Next steps

* [Speech to text quickstart](get-started-speech-to-text.md)
* [Get speech recognition results](get-speech-recognition-results.md)
