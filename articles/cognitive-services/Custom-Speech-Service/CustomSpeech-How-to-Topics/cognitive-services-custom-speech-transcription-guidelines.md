---
title: Transcription guidelines in Custom Speech Service on Azure  | Microsoft Docs
description: Learn how to prepare your data for Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

# Transcription guidelines

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-custom-speech-deprecation-note.md)]

To ensure the best use of your text data for acoustic and language model customization, the following transcription guidelines should be followed. These guidelines are language specific.

## Text normalization

For optimal use in the acoustic or language model customization, the text data must be normalized, which means transformed into a standard, unambiguous form readable by the system. This section describes the text normalization performed by the Custom Speech Service when data is imported and the text normalization that the user must perform prior to data import.

## Inverse text normalization

The process of converting “raw” unformatted text back to formatted text, i.e. with capitalization and punctuation, is called inverse text normalization (ITN). ITN is performed on results returned by the Microsoft Cognitive Services Speech API. A custom endpoint deployed using the Custom Speech Service uses the same ITN as the Microsoft Cognitive Services Speech API. However, this service does not currently support custom ITN, so new terms introduced by a custom language model will not be formatted in the recognition results.

## Transcription guidelines for en-US

Text data uploaded to this service should be written in plain text using only the ASCII printable character set. Each line of the file should contain the text for a single utterance only.

It is important to avoid the use of Unicode punctuation characters. This can happen inadvertently if preparing the data in a word processing program or scraping data from web pages. Replace these characters with appropriate ASCII substitutions. For example:

| Unicode to avoid | ASCII substitution |
|----- | ----- |
| “Hello world” (open and close double quotes) | "Hello world" (double quotes) |
| John’s day (right single quotation mark) | John's day (apostrophe) |

### Text normalization performed by the Custom Speech Service

This service will perform the following text normalization on data imported as a language data set or transcriptions for an acoustic data set. This includes

*   Lower-casing all text
*   Removing all punctuation except word-internal apostrophes
*   Expansion of numbers to spoken form, including dollar amounts

Here are some examples

| Original Text | After Normalization |
|----- | ----- |
| Starbucks Coffee | starbucks coffee |
| “Holy cow!” said Batman. | holy cow said batman |
| “What?” said Batman’s sidekick, Robin. | what said batman’s sidekick robin |
| Go get -em! | go get em |
| I’m double-jointed | i’m double jointed |
| 104 Main Street | one oh four main street |
| Tune to 102.7 | tune to one oh two point seven |
| Pi is about 3.14 | pi is about three point one four |
| It costs $3.14 | it costs three fourteen |

### Text normalization required by users

To ensure the best use of your data, the following normalization rules should be applied to your data prior to importing it.

*   Abbreviations should be written out in words to reflect spoken form
*   Non-standard numeric strings should be written out in words
*   Words with non-alphabetic characters or mixed alphanumeric characters should be transcribed as pronounced
*   Common acronyms can be left as a single entity without periods or spaces between the letters, but all other acronyms should be written out in separate letters, with each letter separated by a single space

Here are some examples

| Original Text | After Normalization |
|----- | ----- |
| 14 NE 3rd Dr. | fourteen northeast third drive |
| Dr. Strangelove | Doctor Strangelove |
| James Bond 007 | james bond double oh seven |
| Ke$ha | Kesha |
| How long is the 2x4 | How long is the two by four |
| The meeting goes from 1-3pm | The meeting goes from one to three pm |
| my blood type is O+ | My blood type is O positive |
| water is H20 | water is H 2 O |
| play OU812 by Van Halen | play O U 8 1 2 by Van Halen |

## Transcription guidelines for zh-CN

Text data uploaded to the Custom Speech Service should use **UTF-8 encoding (incl. BOM)**. Each line of the file should contain the text for a single utterance only.

It is important to avoid the use of half-width punctuation characters. This can happen inadvertently if preparing the data in a word processing program or scraping data from web pages. Replace these characters with appropriate full-width substitutions. For example:

| Unicode to avoid | ASCII substitution |
|----- | ----- |
| “你好” (open and close double quotes) | "你好" (double quotes) |
| 需要什么帮助? (question mark) | 需要什么帮助？ |

### Text normalization performed by the Custom Speech Service

This speech service will perform the following text normalization on data imported as a language data set or transcriptions for an acoustic data set. This includes

*   Removing all punctuation
*   Expansion of numbers to spoken form
*   Convert full-width letters to half-width letters.
*   Upper-casing all English words

Here are some examples:

| Original Text | After Normalization |
|----- | ----- |
| 3.1415 | 三 点 一 四 一 五 |
| ￥3.5 | 三 元 五 角 |
| w f y z | W F Y Z |
| 1992年8月8日 | 一 九 九 二 年 八 月 八 日 |
| 你吃饭了吗 ? | 你 吃饭 了 吗 |
| 下午5:00的航班 | 下午 五点 的 航班 |
| 我今年21岁 | 我 今年 二十 一 岁 |

### Text normalization required by users

To ensure the best use of your data, the following normalization rules should be applied to your data _prior_ to importing it.

*   Abbreviations should be written out in words to reflect spoken form
*   This service doesn’t cover all numeric quantities. It is more reliable to write numeric strings out in spoken form

Here are some examples

| Original Text | After Normalization |
|----- | ----- |
| 我今年21 | 我今年二十一 |
| 3号楼504 | 三号 楼 五 零 四 |

## Transcription guidelines for de-DE

Text data uploaded to the Custom Speech Service should only use **UTF-8 encoding (incl. BOM)**. Each line of the file should contain the text for a single utterance only.

### Text normalization performed by the Custom Speech Service

This service will perform the following text normalization on data imported as a language data set or transcriptions for an acoustic data set. This includes

*   Lower-casing all text
*   Removing all punctuation including English or German quotes ("test", 'test', “test„ or «test» are ok)
*   Discard any row containing any special character including: ^ ¢ £ ¤ ¥ ¦ § © ª ¬ ® ° ± ² µ × ÿ Ø¬¬
*   Expansion of numbers to word form, including dollar or euro amounts
*   We accept only umlauts for a, o, u; others will be replaced by "th" or discarded

Here are some examples

| Original Text | After Normalization |
|----- | ----- |
| Frankfurter Ring | frankfurter ring |
| "Hallo, Mama!" sagt die Tochter. | hallo mama sagt die tochter |
| ¡Eine Frage! | eine frage |
| wir, haben | wir haben |
| Das macht $10 | das macht zehn dollars |


### Text normalization required by users

To ensure the best use of your data, the following normalization rules should be applied to your data prior to importing it.

*   Decimal point should be , and not . e.g., 2,3% and not 2.3%
*   Time separator between hours and minutes should be : and not ., e.g., 12:00 Uhr
*   Abbreviations such as 'ca.', 'bzw.' are not replaced. We recommend to use the full form in order to have the correct pronunciation.
*   The five main mathematical operators are removed: +, -, \*, /.
 We recommend to replace them by their literal form plus, minus, mal, geteilt.
*   Same applies for the comparators (=, <, >) - gleich, kleiner als, grösser als
*   Use fraction such as 3/4 in word form 'drei viertel' instead of ¾
*   Replace the € symbol with the word form "Euro"


Here are some examples

| Original Text | After user's normalization | After system normalization
|--------  | ----- | -------- |
| Es ist 12.23Uhr | Es ist 12:23Uhr | es ist zwölf uhr drei und zwanzig uhr |
| {12.45} | {12,45} | zwölf komma vier fünf |
| 3 < 5 | 3 kleiner als 5 | drei kleiner als vier |
| 2 + 3 - 4 | 2 plus 3 minus 4 | zwei plus drei minus vier|
| Das macht 12€ | Das macht 12 Euros | das macht zwölf euros |



## Next steps
* [How to use a custom speech-to-text endpoint](cognitive-services-custom-speech-create-endpoint.md)
* Improve accuracy with your [custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md)
* Improve accuracy with a [custom language model](cognitive-services-custom-speech-create-language-model.md)
