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
ms.date: 09/16/2022
ms.author: jiajzhan
---

# SSML phonetic alphabets

Phonetic alphabets are used with the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) to improve the pronunciation of text-to-speech voices. To learn when and how to use each alphabet, see [Use phonemes to improve pronunciation](speech-synthesis-markup-pronunciation.md#phoneme-element).

Speech service supports the [International Phonetic Alphabet (IPA)](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet) suprasegmentals that are listed here. You set `ipa` as the `alphabet` in [SSML](speech-synthesis-markup-pronunciation.md#phoneme-element). 

|`ipa` | Symbol         | Note|
|-------|-------------------|-------------------|
| `ˈ`   | Primary stress     |  Don’t use single quote ( ‘ or ' ) though it looks similar.  |
| `ˌ`   | Secondary stress   | Don’t use comma ( , ) though it looks similar.                 |
| `.`   | Syllable boundary  |                  |
| `ː`   | Long  | Don’t use colon ( : or ：) though it looks similar.         |
| `‿`   | Linking   |           |

> [!TIP]
> You can use [the international phonetic alphabet keyboard](https://www.internationalphoneticalphabet.org/html-ipa-keyboard-v1/keyboard/) to create the correct `ipa` suprasegmentals.

For some locales, Speech service defines its own phonetic alphabets, which ordinarily map to the [International Phonetic Alphabet (IPA)](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet). The eight locales that support the Microsoft Speech API (SAPI, or `sapi`) are en-US, fr-FR, de-DE, es-ES, ja-JP, zh-CN, zh-HK, and zh-TW. For those eight locales, you set `sapi` or `ipa` as the `alphabet` in [SSML](speech-synthesis-markup-pronunciation.md#phoneme-element). 

See the sections in this article for the phonemes that are specific to each locale.

> [!NOTE]
> The following tables list viseme IDs corresponding to phonemes for different locales. When viseme ID is 0, it indicates silence.

## ar-EG/ar-SA
[!INCLUDE [ar-EG](./includes/phonetic-sets/text-to-speech/ar-eg.md)]

## bg-BG
[!INCLUDE [bg-BG](./includes/phonetic-sets/text-to-speech/bg-bg.md)]

## ca-ES
[!INCLUDE [ca-ES](./includes/phonetic-sets/text-to-speech/ca-es.md)]

## cs-CZ
[!INCLUDE [cs-CZ](./includes/phonetic-sets/text-to-speech/cs-cz.md)]

## da-DK
[!INCLUDE [da-DK](./includes/phonetic-sets/text-to-speech/da-dk.md)]

## de-DE/de-CH/de-AT
[!INCLUDE [de-DE](./includes/phonetic-sets/text-to-speech/de-de.md)]

## el-GR
[!INCLUDE [el-GR](./includes/phonetic-sets/text-to-speech/el-gr.md)]

## en-GB/en-IE/en-AU
[!INCLUDE [en-GB](./includes/phonetic-sets/text-to-speech/en-gb.md)]

## :::no-loc text="en-US/en-CA":::
[!INCLUDE [en-US](./includes/phonetic-sets/text-to-speech/en-us.md)]

## es-ES
[!INCLUDE [es-ES](./includes/phonetic-sets/text-to-speech/es-es.md)]

## es-MX
[!INCLUDE [es-MX](./includes/phonetic-sets/text-to-speech/es-mx.md)]

## fi-FI
[!INCLUDE [fi-FI](./includes/phonetic-sets/text-to-speech/fi-Fi.md)]

## fr-FR/fr-CA/fr-CH
[!INCLUDE [fr-FR](./includes/phonetic-sets/text-to-speech/fr-fr.md)]

## he-IL
[!INCLUDE [he-IL](./includes/phonetic-sets/text-to-speech/he-il.md)]

## hr-HR
[!INCLUDE [hr-HR](./includes/phonetic-sets/text-to-speech/hr-hr.md)]

## hu-HU
[!INCLUDE [hu-HU](./includes/phonetic-sets/text-to-speech/hu-hu.md)]

## id-ID
[!INCLUDE [id-ID](./includes/phonetic-sets/text-to-speech/id-id.md)]

## it-IT
[!INCLUDE [it-IT](./includes/phonetic-sets/text-to-speech/it-it.md)]

## ja-JP
[!INCLUDE [ja-JP](./includes/phonetic-sets/text-to-speech/ja-jp.md)]

## ko-KR
[!INCLUDE [ko-KR](./includes/phonetic-sets/text-to-speech/ko-kr.md)]

## ms-MY
[!INCLUDE [ms-MY](./includes/phonetic-sets/text-to-speech/ms-my.md)]

## nb-NO
[!INCLUDE [nb-NO](./includes/phonetic-sets/text-to-speech/nb-no.md)]

## nl-NL/nl-BE
[!INCLUDE [nl-NL](./includes/phonetic-sets/text-to-speech/nl-nl.md)]

## pl-PL
[!INCLUDE [pl-PL](./includes/phonetic-sets/text-to-speech/pl-pl.md)]

## pt-BR
[!INCLUDE [pt-BR](./includes/phonetic-sets/text-to-speech/pt-br.md)]

## pt-PT
[!INCLUDE [pt-PT](./includes/phonetic-sets/text-to-speech/pt-pt.md)]

## ro-RO
[!INCLUDE [ro-RO](./includes/phonetic-sets/text-to-speech/ro-ro.md)]

## ru-RU
[!INCLUDE [ru-RU](./includes/phonetic-sets/text-to-speech/ru-ru.md)]

## sk-SK
[!INCLUDE [sk-SK](./includes/phonetic-sets/text-to-speech/sk-sk.md)]

## sl-SI
[!INCLUDE [sl-SI](./includes/phonetic-sets/text-to-speech/sl-si.md)]

## sv-SE
[!INCLUDE [sv-SE](./includes/phonetic-sets/text-to-speech/sv-se.md)]

## th-TH
[!INCLUDE [th-TH](./includes/phonetic-sets/text-to-speech/th-th.md)]

## tr-TR
[!INCLUDE [tr-TR](./includes/phonetic-sets/text-to-speech/tr-tr.md)]

## vi-VN
[!INCLUDE [vi-VN](./includes/phonetic-sets/text-to-speech/vi-vn.md)]

## zh-CN
[!INCLUDE [zh-CN](./includes/phonetic-sets/text-to-speech/zh-cn.md)]

## zh-HK
[!INCLUDE [zh-HK](./includes/phonetic-sets/text-to-speech/zh-hk.md)]

## zh-TW
[!INCLUDE [zh-TW](./includes/phonetic-sets/text-to-speech/zh-tw.md)]

## Map X-SAMPA to IPA
The table below shows a mapping relationship between X-SAMPA (Extended Speech Assessment Methods Phonetic Alphabet) and IPA alphabets.

|`x-sampa`   |`ipa`  |
|----------|-----------|
|`a`|`a`|
|`b`|	`b`|
|`b_<`|	`ɓ`|
|`c`|`c`|
|`d`	|`d`|
|d`|`ɖ`|
|`d_<`|	`ɗ`|
|`e`|	`e`|
|`f`|	`f`|
|`g`	|`ɡ`|
|`g_<`|	`ɠ`|
|`h`	|`h`|
|`h\`	|`ɦ`|
|`i`|	`i`|
|`j`|	`j`|
|`j\`	|`ʝ`|
|`k`|	`k`|
|`l`|	`l`|
|l`	|`ɭ`|
|`l\`	|`ɺ`|
|`m`|	`m`|
|`n`|	`n`|
|n`	|`ɳ`|
|`o`|	`o`|
|`p`	|`p`|
|`p\`	|`ɸ`|
|`q`|	`q`|
|`r`|	`r`|
|r`|`ɽ`|
|`r\`	|`ɹ`|
|r&#92;`|	`ɻ`|
|`s`	|`s`|
|s`|	`ʂ`|
|`s\`	|`ɕ`|
|`t`|	`t`|
|t`	|`ʈ`|
|`u`|	`u`|
|`v`|	`v`|
|`P`|	`ʋ`|
|`v\`	|`ʋ`|
|`w`|	`w`|
|`x`|	`x`|
|`x\`	|`ɧ`|
|`y`	|`y`|
|`z`|	`z`|
|z`	|`ʐ`|
|`z\`	|`ʑ`|
|`A`|	`ɑ`|
|`B`|	`β`|
|`B\`	|`ʙ`|
|`C`|	`ç`|
|`D`|	`ð`|
|`E`	|`ɛ`|
|`F`	|`ɱ`|
|`G`	|`ɣ`|
|`G\`|	`ɢ`|
|`G\_<`	|`ʛ`|
|`H`	|`ɥ`|
|`H\`	|`ʜ`|
|`I`	|`ɪ`|
|`I\`|	`ᵻ`|
|`J`|	`ɲ`|
|`J\`	|`ɟ`|
|`J\_<`	|`ʄ`|
|`K`|	`ɬ`|
|`K\`	|`ɮ`|
|`L`|	`ʎ`|
|`L\`	|`ʟ`|
|`M`|`ɯ`|
|`M\`	|`ɰ`|
|`N`|	`ŋ`|
|`N\`	|`ɴ`|
|`O`|	`ɔ`|
|`O\`|	`ʘ`|
|`Q`	|`ɒ`|
|`R`|	`ʁ`|
|`R\`	|`ʀ`|
|`S`|	`ʃ`|
|`T`|	`θ`|
|`U`	|`ʊ`|
|`U\`	|`ᵿ`|
|`V`|	`ʌ`|
|`W`|	`ʍ`|
|`X`|	`χ`|
|`X\`	|`ħ`|
|`Y`|	`ʏ`|
|`Z`	|`ʒ`|
|`.`	|`.`|
|`"`|	`ˈ`|
|`%`|	`ˌ`|
|`_j`|	`ʲ`|
|`'`	|`ʲ`|
|`:`	|`ː`|
|`:\`	|`ˑ`|
|`@`	|`ə`|
|`@\`|	`ɘ`|
|@`|`˞ɚ`|
|`{`	|`æ`|
|`}`	|`ʉ`|
|`1`	|`ɨ`|
|`2`|	`ø`|
|`3`	|`ɜ`|
|`3\`|	`ɞ`|
|`4`	|`ɾ`|
|`5`	|`ɫ`|
|`6`|	`ɐ`|
|`7`|	`ɤ`|
|`8`|	`ɵ`|
|`9`|	`œ`|
|`&`|	`ɶ`|
|`?`|	`ʔ`|
|`?\`|	`ʕ`|
|`<\`|	`ʢ`|
|`>\`|	`ʡ`|
|`^`|	`ꜛ`|
|`!`|	`ꜜ`|
|`!\`|	`ǃ`|
|`\|`|	`\|`|
|`\|\`|	`ǀ`|
|`‖`|	`‖`|
|`\|\\|\`|	`ǁ`|
|`=\`|	`ǂ`|
|`-\`|	`‿`|
|`_"`|	`̈`|
|`_+`|`̟`|
|`_-`|`̠`|
|`_0`|`̥`|
|`=`|`̩`|
|`_=`|`̩`|
|`_>`|`ʼ`|
|`_?\`|`ˤ`|
|`_\`|`̂`|
|`_^`|`̯`|
|`_}`|`̚`|
|`|`˞`|
|`~`|`̃`|
|`_~`|`̃`|
|`_A`|`̘`|
|`_a`|`̺`|
|`_B`|`̏`|
|`_B_L`|᷅ |
|`_c`|`̜`|
|`_d`|`̪`|
|`_e`|`̴`|
|&lt;F&gt;|`↘`|
|`_F`|`̂`|
|`_G`|`ˠ`|
|`_H`|`́`|
|`_H_T`|` ᷄`|
|`_h`|`ʰ`|
|`_k`|`̰`|
|`_L`|̀`|
|`_l`|`ˡ`|
|`_M`|`̄`|
|`_m`|`̻`|
|`_N`|`̼`|
|`_n`|`ⁿ`|
|`_O`|`̹`|
|`_o`|`̞`|
|`_q`|`̙`|
|`<R>`|`↗`|
|`_R`|̌|
|`_R_F`|`᷈`|
|`_r`|`̝`|
|`_T`|`̋`|
|`_t`|`̤`|
|`_v`|`̬`|
|`_w`|`ʷ`|
|`_X`|`̆`|
|`_x`|`̽`|


