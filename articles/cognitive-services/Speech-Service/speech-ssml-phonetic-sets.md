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
ms.date: 01/13/2022
ms.author: jiajzhan
---

# SSML phonetic alphabets

Phonetic alphabets are used with the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) to improve the pronunciation of text-to-speech voices. To learn when and how to use each alphabet, see [Use phonemes to improve pronunciation](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation).

Speech service support the [International Phonetic Alphabet (IPA)](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet). You could set `ipa` as the `alphabet` in [SSML](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation). 

IPA stress and syllable symbols that are listed here:

|`ipa` | Symbol         | 
|-------|-------------------|
| `ˈ`   | Primary stress     | 
| `ˌ`   | Secondary stress   | 
| `.`   | Syllable boundary  | 

Besides for some locale, Speech service defines its own phonetic alphabets, which ordinarily map to the [International Phonetic Alphabet (IPA)](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet). The seven locales that support the Microsoft Speech API (SAPI, or `sapi`) are en-US, fr-FR, de-DE, es-ES, ja-JP, zh-CN, and zh-TW. So for these locales, you could set `sapi` or `ipa` as the `alphabet` in [SSML](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation).

Select a tab to view the phonemes that are specific to each locale.

## ca-ES
[!INCLUDE [ca-ES](./text-to-speech-phonetic-set/ca-ES.md)]

## de-DE
[!INCLUDE [de-DE](./text-to-speech-phonetic-set/de-DE.md)]

## en-GB
[!INCLUDE [en-GB](./text-to-speech-phonetic-set/en-GB.md)]

## en-US
[!INCLUDE [en-US](./text-to-speech-phonetic-set/en-US.md)]

## es-ES
[!INCLUDE [es-ES](./text-to-speech-phonetic-set/es-ES.md)]

## es-MX
[!INCLUDE [es-MX](./text-to-speech-phonetic-set/es-MX.md)]

## fr-FR
[!INCLUDE [fr-FR](./text-to-speech-phonetic-set/fr-FR.md)]

## it-IT
[!INCLUDE [it-IT](./text-to-speech-phonetic-set/it-IT.md)]

## ja-JP
[!INCLUDE [ja-JP](./text-to-speech-phonetic-set/ja-JP.md)]

## pt-BR
[!INCLUDE [pt-BR](./text-to-speech-phonetic-set/pt-BR.md)]

## pt-PT
[!INCLUDE [pt-PT](./text-to-speech-phonetic-set/pt-PT.md)]

## ru-RU
[!INCLUDE [ru-RU](./text-to-speech-phonetic-set/ru-RU.md)]

## zh-CN
[!INCLUDE [zh-CN](./text-to-speech-phonetic-set/zh-CN.md)]

## zh-TW
[!INCLUDE [zh-TW](./text-to-speech-phonetic-set/zh-TW.md)]


***

