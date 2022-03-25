---
title: Speech phonetic alphabets - Speech service
titleSuffix: Azure Cognitive Services
description: This article presents Speech service phonetic alphabet and International Phonetic Alphabet (IPA) examples.
services: cognitive-services
author: jiajzhan
manager: junwg
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/17/2022
ms.author: jiajzhan
---

# SSML phonetic alphabets

Phonetic alphabets are used with the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) to improve the pronunciation of text-to-speech voices. To learn when and how to use each alphabet, see [Use phonemes to improve pronunciation](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation).

Speech service supports the [International Phonetic Alphabet (IPA)](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet) stress and syllable symbols that are listed here. You set `ipa` as the `alphabet` in [SSML](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation). 

|`ipa` | Symbol         | 
|-------|-------------------|
| `ˈ`   | Primary stress     | 
| `ˌ`   | Secondary stress   | 
| `.`   | Syllable boundary  | 

For some locales, Speech service defines its own phonetic alphabets, which ordinarily map to the [International Phonetic Alphabet (IPA)](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet). The seven locales that support the Microsoft Speech API (SAPI, or `sapi`) are en-US, fr-FR, de-DE, es-ES, ja-JP, zh-CN, and zh-TW. For those seven locales, you set `sapi` or `ipa` as the `alphabet` in [SSML](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation). 

See the sections in this article for the phonemes that are specific to each locale.

## ca-ES
[!INCLUDE [ca-ES](./includes/phonetic-sets/text-to-speech/ca-es.md)]

## de-DE
[!INCLUDE [de-DE](./includes/phonetic-sets/text-to-speech/de-de.md)]

## en-GB
[!INCLUDE [en-GB](./includes/phonetic-sets/text-to-speech/en-gb.md)]

## en-US
[!INCLUDE [en-US](./includes/phonetic-sets/text-to-speech/en-us.md)]

## es-ES
[!INCLUDE [es-ES](./includes/phonetic-sets/text-to-speech/es-es.md)]

## es-MX
[!INCLUDE [es-MX](./includes/phonetic-sets/text-to-speech/es-mx.md)]

## fr-FR
[!INCLUDE [fr-FR](./includes/phonetic-sets/text-to-speech/fr-fr.md)]

## it-IT
[!INCLUDE [it-IT](./includes/phonetic-sets/text-to-speech/it-it.md)]

## ja-JP
[!INCLUDE [ja-JP](./includes/phonetic-sets/text-to-speech/ja-jp.md)]

## pt-BR
[!INCLUDE [pt-BR](./includes/phonetic-sets/text-to-speech/pt-br.md)]

## pt-PT
[!INCLUDE [pt-PT](./includes/phonetic-sets/text-to-speech/pt-pt.md)]

## ru-RU
[!INCLUDE [ru-RU](./includes/phonetic-sets/text-to-speech/ru-ru.md)]

## zh-CN
[!INCLUDE [zh-CN](./includes/phonetic-sets/text-to-speech/zh-cn.md)]

## zh-TW
[!INCLUDE [zh-TW](./includes/phonetic-sets/text-to-speech/zh-tw.md)]


***

