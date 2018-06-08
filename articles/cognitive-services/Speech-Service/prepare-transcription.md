---
title: Transcription guidelines for Speech training | Microsoft Docs
description: Learn how to prepare text to customize acoustic and language models and voice fonts for the Speech service.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---

# Transcription guidelines for using Speech service

To customize **Speech to Text** or **Text to Speech**, you must provide text along with speech. Each line in the text corresponds to a single utterance. The text is called a *transcript*, and you must create it in a specific format.

The Speech service performs some normalizations for you in order to make your text consistent. Other normalization tasks must be performed before the text is submitted for training. 

This article describes both types of normalizations. The guidelines vary slightly for various languages.

## US English (en-US)

Text data uploaded to this service should be written in plain text using only the ASCII character set. Each line of the file should contain the text for a single utterance.

It is important to avoid the use of extended (Latin-1) or Unicode punctuation characters. These characters can be included inadvertently when preparing the data in a word-processing program or scraping data from web pages. Replace these characters with appropriate ASCII substitutions. For example:

| Characters to avoid | Substitution |
|----- | ----- |
| “Hello world” (open and close double quotes) | "Hello world" (double quotes) |
| John’s day (right single quotation mark) | John's day (apostrophe) |
| it was good—no, it was great! (em dash) | it was good--no, it was great! (hyphens) |

### Text normalization performed by the service

The Speech service performs the following text normalization on text transcripts.

*   Lower-casing all text
*   Removing all punctuation except word-internal apostrophes
*   Expansion of numbers to spoken form, including dollar amounts

Here are some examples

| Original Text | After Normalization |
|----- | ----- |
| Starbucks Coffee | starbucks coffee |
| "Holy cow!" said Batman. | holy cow said batman |
| "What?" said Batman's sidekick, Robin. | what said batman's sidekick robin |
| Go get -em! | go get em |
| I'm double-jointed | i'm double jointed |
| 104 Main Street | one oh four main street |
| Tune to 102.7 | tune to one oh two point seven |
| Pi is about 3.14 | pi is about three point one four |
| It costs $3.14 | it costs three fourteen |

### Text normalization you must perform

Apply the following normalization to your text transcripts.

*   Abbreviations should be written out in words to reflect spoken form
*   Non-standard numeric strings (such as some date or accounting forms) should be written out in words
*   Words with non-alphabetic characters or mixed alphanumeric characters should be transcribed as pronounced
*   Leave abbreviations pronounced as words untouched. For example, radar, laser, RAM, NATO, and Mr.
*   Write abbreviations pronounced as separate letters, with letters separated by spaces. For example, IBM, CPU, FBI, TBD, NaN. 

Here are some examples:

| Original Text | After Normalization |
|----- | ----- |
| 14 NE 3rd Dr. | fourteen northeast third drive |
| Dr. Strangelove | Doctor Strangelove |
| James Bond 007 | James Bond double oh seven |
| Ke$ha | Kesha |
| How long is the 2x4 | How long is the two by four |
| The meeting goes from 1-3pm | The meeting goes from one to three pm |
| my blood type is O+ | My blood type is O positive |
| water is H20 | water is H 2 O |
| play OU812 by Van Halen | play O U 8 1 2 by Van Halen |
| UTF-8 with BOM | U T F 8 with BOM |

## Chinese (zh-CN)

Text data uploaded to the Custom Speech Service should use UTF-8 encoding with byte-order marker. Each line of the file should contain the text for a single utterance.

It is important to avoid the use of half-width punctuation characters. These characters can be included inadvertently when preparing the data in a word-processing program or scraping data from web pages. Replace them with appropriate full-width substitutions. For example:

| Characters to avoid | Substitution |
|----- | ----- |
| "你好" (open and close double quotes) | "你好" (double quotes) |
| 需要什么帮助? (question mark) | 需要什么帮助？ |

### Text normalization performed by the service

The Speech service performs the following text normalization on text transcripts.

*   Removing all punctuation
*   Expanding numbers to spoken form
*   Converting full-width letters to half-width letters
*   Upper-casing all English words

Here are some examples.

| Original Text | After Normalization |
|----- | ----- |
| 3.1415 | 三 点 一 四 一 五 |
| ￥3.5 | 三 元 五 角 |
| w f y z | W F Y Z |
| 1992年8月8日 | 一 九 九 二 年 八 月 八 日 |
| 你吃饭了吗 ? | 你 吃饭 了 吗 |
| 下午5:00的航班 | 下午 五点 的 航班 |
| 我今年21岁 | 我 今年 二十 一 岁 |

### Text normalization you must perform

Apply the following normalization to your text before importing it.

*   Abbreviations should be written out in words to reflect spoken form
*   This service does not cover all numeric quantities. It is more reliable to write out numeric strings in spoken form.

Here are some examples.

| Original Text | After Normalization |
|----- | ----- |
| 我今年21 | 我今年二十一 |
| 3号楼504 | 三号 楼 五 零 四 |

## Other languages

Text data uploaded to the **Speech to Text** service must use UTF-8 encoding with byte-order marker. Each line of the file should contain the text for a single utterance.

> [!NOTE]
> These examples use German. However, these guidelines apply to all languages that are not US English or Chinese.

### Text normalization performed by the service

The Speech service performs the following text normalization on text transcripts.

*   Lower-casing all text
*   Removing all punctuation including various types of quotes ("test", 'test', "test„ or «test» are ok)
*   Discarding any row containing any special character from the set ^ ¢ £ ¤ ¥ ¦ § © ª ¬ ® ° ± ² µ × ÿ Ø¬¬
*   Expansion of numbers to word form, including dollar or euro amounts
*   Umlauts are accepted only for a, o, u; others will be replaced by "th" or be discarded

Here are some examples

| Original Text | After Normalization |
|----- | ----- |
| Frankfurter Ring | frankfurter ring |
| "Hallo, Mama!" sagt die Tochter. | hallo mama sagt die tochter |
| ¡Eine Frage! | eine frage |
| wir, haben | wir haben |
| Das macht $10 | das macht zehn dollars |

### Text normalization you must perform

Apply the following normalization to your text before importing it.

*   Decimal point should be "," and not ".": 2,3% and not 2.3%
*   Time separator between hours and minutes should be ":" and not ".": 12:00 Uhr
*   Abbreviations such as 'ca.', 'bzw.' are not replaced. We recommend you use the full form.
*   The five main mathematical operators are removed: +, -, \*, /. We recommend replacing them with their literal form: plus, minus, mal, geteilt.
*   Same applies for comparison operators (=, <, >) - gleich, kleiner als, grösser als
*   Use fractions, such as 3/4, in word form (such as 'drei viertel' instead of ¾)
*   Replace the € symbol with the word form "Euro"

Here are some examples.

| Original Text | After user's normalization | After system normalization
|--------  | ----- | -------- |
| Es ist 12.23Uhr | Es ist 12:23Uhr | es ist zwölf uhr drei und zwanzig uhr |
| {12.45} | {12,45} | zwölf komma vier fünf |
| 3 < 5 | 3 kleiner als 5 | drei kleiner als vier |
| 2 + 3 - 4 | 2 plus 3 minus 4 | zwei plus drei minus vier|
| Das macht 12€ | Das macht 12 Euros | das macht zwölf euros |

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Recognize speech in C#](quickstart-csharp-windows.md)
