---
title: Language support - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech service supports numerous languages for speech-to-text and text-to-speech conversion, along with speech translation. This article provides a comprehensive list of language support by service feature.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/02/2022
ms.author: eur
ms.custom: references_regions, ignite-fall-2021
---

# Language and voice support for the Speech service

Language support varies by Speech service functionality. The following tables summarize language support for [speech-to-text](#speech-to-text), [text-to-speech](#text-to-speech), [speech translation](#speech-translation), and [speaker recognition](#speaker-recognition) service offerings.

## Speech-to-text

The Speech service supports the languages (locales) in the following tables.

To improve accuracy, customization is available for some languages and base model versions by uploading audio + human-labeled transcripts, plain text, structured text, and pronunciation. By default, plain text customization is supported for all available base models. To learn more about customization, see [Custom Speech](./custom-speech-overview.md).

### [Speech-to-text](#tab/speechtotext)

| Language                          | Locale (BCP-47) |
|-----------------------------------|-----------------|
| Afrikaans (South Africa)          | `af-ZA`         |
| Amharic (Ethiopia)                | `am-ET`         |
| Arabic (Algeria)                  | `ar-DZ`         |
| Arabic (Bahrain), modern standard | `ar-BH`         |
| Arabic (Egypt)                    | `ar-EG`         |
| Arabic (Iraq)                     | `ar-IQ`         |
| Arabic (Israel)                   | `ar-IL`         |
| Arabic (Jordan)                   | `ar-JO`         |
| Arabic (Kuwait)                   | `ar-KW`         |
| Arabic (Lebanon)                  | `ar-LB`         |
| Arabic (Libya)                    | `ar-LY`         |
| Arabic (Morocco)                  | `ar-MA`         |
| Arabic (Oman)                     | `ar-OM`         |
| Arabic (Palestinian Authority)    | `ar-PS`         |
| Arabic (Qatar)                    | `ar-QA`         |
| Arabic (Saudi Arabia)             | `ar-SA`         |
| Arabic (Syria)                    | `ar-SY`         |
| Arabic (Tunisia)                  | `ar-TN`         |
| Arabic (United Arab Emirates)     | `ar-AE`         |
| Arabic (Yemen)                    | `ar-YE`         |
| Bengali (India)                   | `bn-IN`         |
| Bulgarian (Bulgaria)              | `bg-BG`         |
| Burmese (Myanmar)                 | `my-MM`         |
| Catalan (Spain)                   | `ca-ES`         |
| Chinese (Cantonese, Traditional)  | `zh-HK`         |
| Chinese (Mandarin, Simplified)    | `zh-CN`         |
| Chinese (Taiwanese Mandarin)      | `zh-TW`         |
| Croatian (Croatia)                | `hr-HR`         |
| Czech (Czech)                     | `cs-CZ`         |
| Danish (Denmark)                  | `da-DK`         |
| Dutch (Belgium)                   | `nl-BE`         |
| Dutch (Netherlands)               | `nl-NL`         |
| English (Australia)               | `en-AU`         |
| English (Canada)                  | `en-CA`         |
| English (Ghana)                   | `en-GH`         |
| English (Hong Kong)               | `en-HK`         |
| English (India)                   | `en-IN`         |
| English (Ireland)                 | `en-IE`         |
| English (Kenya)                   | `en-KE`         |
| English (New Zealand)             | `en-NZ`         |
| English (Nigeria)                 | `en-NG`         |
| English (Philippines)             | `en-PH`         |
| English (Singapore)               | `en-SG`         |
| English (South Africa)            | `en-ZA`         |
| English (Tanzania)                | `en-TZ`         |
| English (United Kingdom)          | `en-GB`         |
| English (United States)           | `en-US`         |
| Estonian (Estonia)                | `et-EE`         |
| Filipino (Philippines)            | `fil-PH`        |
| Finnish (Finland)                 | `fi-FI`         |
| French (Belgium)                  | `fr-BE`         |
| French (Canada)                   | `fr-CA`         |
| French (France)                   | `fr-FR`         |
| French (Switzerland)              | `fr-CH`         |
| German (Austria)                  | `de-AT`         |
| German (Germany)                  | `de-DE`         |
| German (Switzerland)              | `de-CH`         |
| Greek (Greece)                    | `el-GR`         |
| Gujarati (Indian)                 | `gu-IN`         |
| Hebrew (Israel)                   | `he-IL`         |
| Hindi (India)                     | `hi-IN`         |
| Hungarian (Hungary)               | `hu-HU`         |
| Icelandic (Iceland)               | `is-IS`         |
| Indonesian (Indonesia)            | `id-ID`         |
| Irish (Ireland)                   | `ga-IE`         |
| Italian (Italy)                   | `it-IT`         |
| Japanese (Japan)                  | `ja-JP`         |
| Javanese (Indonesia)              | `jv-ID`         |
| Kannada (India)                   | `kn-IN`         |
| Khmer (Cambodia)                  | `km-KH`         |
| Korean (Korea)                    | `ko-KR`         |
| Lao (Laos)                        | `lo-LA`         |
| Latvian (Latvia)                  | `lv-LV`         |
| Lithuanian (Lithuania)            | `lt-LT`         |
| Macedonian (North Macedonia)      | `mk-MK`         |
| Malay (Malaysia)                  | `ms-MY`         |
| Maltese (Malta)                   | `mt-MT`         |
| Marathi (India)                   | `mr-IN`         |
| Norwegian (Bokmål, Norway)        | `nb-NO`         |
| Persian (Iran)                    | `fa-IR`         |
| Polish (Poland)                   | `pl-PL`         |
| Portuguese (Brazil)               | `pt-BR`         |
| Portuguese (Portugal)             | `pt-PT`         |
| Romanian (Romania)                | `ro-RO`         |
| Russian (Russia)                  | `ru-RU`         |
| Serbian (Serbia)                  | `sr-RS`         |
| Sinhala (Sri Lanka)               | `si-LK`         |
| Slovak (Slovakia)                 | `sk-SK`         |
| Slovenian (Slovenia)              | `sl-SI`         |
| Spanish (Argentina)               | `es-AR`         |
| Spanish (Bolivia)                 | `es-BO`         |
| Spanish (Chile)                   | `es-CL`         |
| Spanish (Colombia)                | `es-CO`         |
| Spanish (Costa Rica)              | `es-CR`         |
| Spanish (Cuba)                    | `es-CU`         |
| Spanish (Dominican Republic)      | `es-DO`         |
| Spanish (Ecuador)                 | `es-EC`         |
| Spanish (El Salvador)             | `es-SV`         |
| Spanish (Equatorial Guinea)       | `es-GQ`         |
| Spanish (Guatemala)               | `es-GT`         |
| Spanish (Honduras)                | `es-HN`         |
| Spanish (Mexico)                  | `es-MX`         |
| Spanish (Nicaragua)               | `es-NI`         |
| Spanish (Panama)                  | `es-PA`         |
| Spanish (Paraguay)                | `es-PY`         |
| Spanish (Peru)                    | `es-PE`         |
| Spanish (Puerto Rico)             | `es-PR`         |
| Spanish (Spain)                   | `es-ES`         |
| Spanish (Uruguay)                 | `es-UY`         |
| Spanish (USA)                     | `es-US`         |
| Spanish (Venezuela)               | `es-VE`         |
| Swahili (Kenya)                   | `sw-KE`         |
| Swahili (Tanzania)                | `sw-TZ`         |
| Swedish (Sweden)                  | `sv-SE`         |
| Tamil (India)                     | `ta-IN`         |
| Telugu (India)                    | `te-IN`         |
| Thai (Thailand)                   | `th-TH`         |
| Turkish (Turkey)                  | `tr-TR`         |
| Ukrainian (Ukraine)               | `uk-UA`         |
| Uzbek (Uzbekistan)                | `uz-UZ`         |
| Vietnamese (Vietnam)              | `vi-VN`         |
| Zulu (South Africa)               | `zu-ZA`         |

### [Plain text](#tab/plaintext)

| Language                          | Locale (BCP-47) |
|-----------------------------------|-----------------|
| Afrikaans (South Africa)          | `af-ZA`         |
| Amharic (Ethiopia)                | `am-ET`         |
| Arabic (Algeria)                  | `ar-DZ`         |
| Arabic (Bahrain), modern standard | `ar-BH`         |
| Arabic (Egypt)                    | `ar-EG`         |
| Arabic (Iraq)                     | `ar-IQ`         |
| Arabic (Israel)                   | `ar-IL`         |
| Arabic (Jordan)                   | `ar-JO`         |
| Arabic (Kuwait)                   | `ar-KW`         |
| Arabic (Lebanon)                  | `ar-LB`         |
| Arabic (Libya)                    | `ar-LY`         |
| Arabic (Morocco)                  | `ar-MA`         |
| Arabic (Oman)                     | `ar-OM`         |
| Arabic (Palestinian Authority)    | `ar-PS`         |
| Arabic (Qatar)                    | `ar-QA`         |
| Arabic (Saudi Arabia)             | `ar-SA`         |
| Arabic (Syria)                    | `ar-SY`         |
| Arabic (Tunisia)                  | `ar-TN`         |
| Arabic (United Arab Emirates)     | `ar-AE`         |
| Arabic (Yemen)                    | `ar-YE`         |
| Bulgarian (Bulgaria)              | `bg-BG`         |
| Burmese (Myanmar)                 | `my-MM`         |
| Catalan (Spain)                   | `ca-ES`         |
| Chinese (Cantonese, Traditional)  | `zh-HK`         |
| Chinese (Mandarin, Simplified)    | `zh-CN`         |
| Chinese (Taiwanese Mandarin)      | `zh-TW`         |
| Croatian (Croatia)                | `hr-HR`         |
| Czech (Czech)                     | `cs-CZ`         |
| Danish (Denmark)                  | `da-DK`         |
| Dutch (Belgium)                   | `nl-BE`         |
| Dutch (Netherlands)               | `nl-NL`         |
| English (Australia)               | `en-AU`         |
| English (Canada)                  | `en-CA`         |
| English (Ghana)                   | `en-GH`         |
| English (Hong Kong)               | `en-HK`         |
| English (India)                   | `en-IN`         |
| English (Ireland)                 | `en-IE`         |
| English (Kenya)                   | `en-KE`         |
| English (New Zealand)             | `en-NZ`         |
| English (Nigeria)                 | `en-NG`         |
| English (Philippines)             | `en-PH`         |
| English (Singapore)               | `en-SG`         |
| English (South Africa)            | `en-ZA`         |
| English (Tanzania)                | `en-TZ`         |
| English (United Kingdom)          | `en-GB`         |
| English (United States)           | `en-US`         |
| Estonian (Estonia)                | `et-EE`         |
| Filipino (Philippines)            | `fil-PH`        |
| Finnish (Finland)                 | `fi-FI`         |
| French (Belgium)                  | `fr-BE`         |
| French (Canada)                   | `fr-CA`         |
| French (France)                   | `fr-FR`         |
| French (Switzerland)              | `fr-CH`         |
| German (Austria)                  | `de-AT`         |
| German (Germany)                  | `de-DE`         |
| German (Switzerland)              | `de-CH`         |
| Greek (Greece)                    | `el-GR`         |
| Gujarati (Indian)                 | `gu-IN`         |
| Hebrew (Israel)                   | `he-IL`         |
| Hindi (India)                     | `hi-IN`         |
| Hungarian (Hungary)               | `hu-HU`         |
| Icelandic (Iceland)               | `is-IS`         |
| Indonesian (Indonesia)            | `id-ID`         |
| Irish (Ireland)                   | `ga-IE`         |
| Italian (Italy)                   | `it-IT`         |
| Japanese (Japan)                  | `ja-JP`         |
| Javanese (Indonesia)              | `jv-ID`         |
| Kannada (India)                   | `kn-IN`         |
| Khmer (Cambodia)                  | `km-KH`         |
| Korean (Korea)                    | `ko-KR`         |
| Lao (Laos)                        | `lo-LA`         |
| Latvian (Latvia)                  | `lv-LV`         |
| Lithuanian (Lithuania)            | `lt-LT`         |
| Macedonian (North Macedonia)      | `mk-MK`         |
| Malay (Malaysia)                  | `ms-MY`         |
| Maltese (Malta)                   | `mt-MT`         |
| Marathi (India)                   | `mr-IN`         |
| Norwegian (Bokmål, Norway)        | `nb-NO`         |
| Persian (Iran)                    | `fa-IR`         |
| Polish (Poland)                   | `pl-PL`         |
| Portuguese (Brazil)               | `pt-BR`         |
| Portuguese (Portugal)             | `pt-PT`         |
| Romanian (Romania)                | `ro-RO`         |
| Russian (Russia)                  | `ru-RU`         |
| Serbian (Serbia)                  | `sr-RS`         |
| Sinhala (Sri Lanka)               | `si-LK`         |
| Slovak (Slovakia)                 | `sk-SK`         |
| Slovenian (Slovenia)              | `sl-SI`         |
| Spanish (Argentina)               | `es-AR`         |
| Spanish (Bolivia)                 | `es-BO`         |
| Spanish (Chile)                   | `es-CL`         |
| Spanish (Colombia)                | `es-CO`         |
| Spanish (Costa Rica)              | `es-CR`         |
| Spanish (Cuba)                    | `es-CU`         |
| Spanish (Dominican Republic)      | `es-DO`         |
| Spanish (Ecuador)                 | `es-EC`         |
| Spanish (El Salvador)             | `es-SV`         |
| Spanish (Equatorial Guinea)       | `es-GQ`         |
| Spanish (Guatemala)               | `es-GT`         |
| Spanish (Honduras)                | `es-HN`         |
| Spanish (Mexico)                  | `es-MX`         |
| Spanish (Nicaragua)               | `es-NI`         |
| Spanish (Panama)                  | `es-PA`         |
| Spanish (Paraguay)                | `es-PY`         |
| Spanish (Peru)                    | `es-PE`         |
| Spanish (Puerto Rico)             | `es-PR`         |
| Spanish (Spain)                   | `es-ES`         |
| Spanish (Uruguay)                 | `es-UY`         |
| Spanish (USA)                     | `es-US`         |
| Spanish (Venezuela)               | `es-VE`         |
| Swahili (Kenya)                   | `sw-KE`         |
| Swahili (Tanzania)                | `sw-TZ`         |
| Swedish (Sweden)                  | `sv-SE`         |
| Tamil (India)                     | `ta-IN`         |
| Telugu (India)                    | `te-IN`         |
| Thai (Thailand)                   | `th-TH`         |
| Turkish (Turkey)                  | `tr-TR`         |
| Ukrainian (Ukraine)               | `uk-UA`         |
| Uzbek (Uzbekistan)                | `uz-UZ`         |
| Vietnamese (Vietnam)              | `vi-VN`         |
| Zulu (South Africa)               | `zu-ZA`         |


### [Structured text](#tab/structuredtext)

| Language                          | Locale (BCP-47) |
|-----------------------------------|-----------------|
| English (India)                   | `en-IN`         |
| English (United Kingdom)          | `en-GB`         |
| English (United States)           | `en-US`         |
| French (Canada)                   | `fr-CA`         |
| French (France)                   | `fr-FR`         |
| German (Switzerland)              | `de-CH`         |
| Spanish (Mexico)                  | `es-MX`         |
| Spanish (Spain)                   | `es-ES`         |

### [Pronunciation data](#tab/pronunciation)

| Language                          | Locale (BCP-47) |
|-----------------------------------|-----------------|
| Catalan (Spain)                   | `ca-ES`         |
| Croatian (Croatia)                | `hr-HR`         |
| Czech (Czech)                     | `cs-CZ`         |
| Danish (Denmark)                  | `da-DK`         |
| Dutch (Netherlands)               | `nl-NL`         |
| English (Australia)               | `en-AU`         |
| English (Canada)                  | `en-CA`         |
| English (Ghana)                   | `en-GH`         |
| English (Hong Kong)               | `en-HK`         |
| English (India)                   | `en-IN`         |
| English (Ireland)                 | `en-IE`         |
| English (Kenya)                   | `en-KE`         |
| English (New Zealand)             | `en-NZ`         |
| English (Nigeria)                 | `en-NG`         |
| English (Philippines)             | `en-PH`         |
| English (Singapore)               | `en-SG`         |
| English (South Africa)            | `en-ZA`         |
| English (Tanzania)                | `en-TZ`         |
| English (United Kingdom)          | `en-GB`         |
| English (United States)           | `en-US`         |
| Estonian (Estonia)                | `et-EE`         |
| Filipino (Philippines)            | `fil-PH`        |
| Finnish (Finland)                 | `fi-FI`         |
| French (Canada)                   | `fr-CA`         |
| French (France)                   | `fr-FR`         |
| French (Switzerland)              | `fr-CH`         |
| German (Austria)                  | `de-AT`         |
| German (Germany)                  | `de-DE`         |
| German (Switzerland)              | `de-CH`         |
| Hungarian (Hungary)               | `hu-HU`         |
| Indonesian (Indonesia)            | `id-ID`         |
| Irish (Ireland)                   | `ga-IE`         |
| Italian (Italy)                   | `it-IT`         |
| Latvian (Latvia)                  | `lv-LV`         |
| Lithuanian (Lithuania)            | `lt-LT`         |
| Polish (Poland)                   | `pl-PL`         |
| Portuguese (Brazil)               | `pt-BR`         |
| Portuguese (Portugal)             | `pt-PT`         |
| Romanian (Romania)                | `ro-RO`         |
| Slovak (Slovakia)                 | `sk-SK`         |
| Slovenian (Slovenia)              | `sl-SI`         |
| Spanish (Argentina)               | `es-AR`         |
| Spanish (Bolivia)                 | `es-BO`         |
| Spanish (Chile)                   | `es-CL`         |
| Spanish (Colombia)                | `es-CO`         |
| Spanish (Costa Rica)              | `es-CR`         |
| Spanish (Cuba)                    | `es-CU`         |
| Spanish (Dominican Republic)      | `es-DO`         |
| Spanish (Ecuador)                 | `es-EC`         |
| Spanish (El Salvador)             | `es-SV`         |
| Spanish (Guatemala)               | `es-GT`         |
| Spanish (Honduras)                | `es-HN`         |
| Spanish (Mexico)                  | `es-MX`         |
| Spanish (Nicaragua)               | `es-NI`         |
| Spanish (Panama)                  | `es-PA`         |
| Spanish (Paraguay)                | `es-PY`         |
| Spanish (Peru)                    | `es-PE`         |
| Spanish (Puerto Rico)             | `es-PR`         |
| Spanish (Spain)                   | `es-ES`         |
| Spanish (Uruguay)                 | `es-UY`         |
| Spanish (USA)                     | `es-US`         |
| Spanish (Venezuela)               | `es-VE`         |
| Swedish (Sweden)                  | `sv-SE`         |

### [Audio data](#tab/audiodata)

| Language                          | Locale (BCP-47) |
|-----------------------------------|-----------------|
| English (United Kingdom)          | `en-GB`         |
| English (United States)           | `en-US`         |
| French (Canada)                   | `fr-CA`         |
| French (France)                   | `fr-FR`         |
| German (Switzerland)              | `de-CH`         |
| Italian (Italy)                   | `it-IT`         |
| Korean (Korea)                    | `ko-KR`         |
| Portuguese (Brazil)               | `pt-BR`         |
| Spanish (Spain)                   | `es-ES`         |

### [Phrase list](#tab/phraselist)

You can use the locales in this table with [phrase list](improve-accuracy-phrase-list.md). 

| Language | Locale |
|---|---|
| Chinese (Mandarin, Simplified) | `zh-CN` |
| English (Australia) | `en-AU` |
| English (Canada) | `en-CA` |
| English (India) | `en-IN` |
| English (United Kingdom)) | `en-GB` |
| English (United States) | `en-US` |
| French (France) | `fr-FR` |
| German (Germany) | `de-DE` |
| Italian (Italy) | `it-IT` |
| Japanese (Japan) | `ja-JP` |
| Portuguese (Brazil) | `pt-BR` |
| Spanish (Spain) | `es-ES` |

---

## Text-to-speech

Both the Microsoft Speech SDK and REST APIs support these neural voices, each of which supports a specific language and dialect, identified by locale. You can try the demo and hear the voices on [this website](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

You can also get a full list of languages and voices supported for each specific region or endpoint through the [voices list API](rest-text-to-speech.md#get-a-list-of-voices). To learn how you can configure and adjust neural voices, such as Speaking Styles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!IMPORTANT]
> Pricing varies for Prebuilt Neural Voice (referred to as *Neural* on the pricing page) and Custom Neural Voice (referred to as *Custom Neural* on the pricing page). For more information, see the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page.


### Prebuilt neural voices

Prebuilt neural voices are created from samples that use a 24-khz sample rate. All voices can upsample or downsample to other sample rates when synthesizing.

> [!IMPORTANT]
> The English (United Kingdom) voice `en-GB-MiaNeural` retired on October 30, 2021. All service requests to `en-GB-MiaNeural` will be redirected to `en-GB-SoniaNeural` automatically as of October 30, 2021.
> 
> If you're using container Neural TTS, [download](speech-container-howto.md#get-the-container-image-with-docker-pull) and deploy the latest version. Starting from October 30, 2021, all requests with previous versions will not succeed.
> 
> The `en-US-JessaNeural` voice has changed to `en-US-AriaNeural`. If you were using "Jessa" before, convert  to "Aria." You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)" in your speech synthesis requests.

The following table lists the prebuilt neural voices supported in each language. 

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| Afrikaans (South Africa) | `af-ZA` | Female | `af-ZA-AdriNeural` | General |
| Afrikaans (South Africa) | `af-ZA` | Male | `af-ZA-WillemNeural` | General |
| Amharic (Ethiopia) | `am-ET` | Female | `am-ET-MekdesNeural` | General |
| Amharic (Ethiopia) | `am-ET` | Male | `am-ET-AmehaNeural` | General |
| Arabic (Algeria) | `ar-DZ` | Female | `ar-DZ-AminaNeural` | General |
| Arabic (Algeria) | `ar-DZ` | Male | `ar-DZ-IsmaelNeural` | General |
| Arabic (Bahrain) | `ar-BH` | Female | `ar-BH-LailaNeural` | General |
| Arabic (Bahrain) | `ar-BH` | Male | `ar-BH-AliNeural` | General |
| Arabic (Egypt) | `ar-EG` | Female | `ar-EG-SalmaNeural` | General |
| Arabic (Egypt) | `ar-EG` | Male | `ar-EG-ShakirNeural` | General |
| Arabic (Iraq) | `ar-IQ` | Female | `ar-IQ-RanaNeural` | General |
| Arabic (Iraq) | `ar-IQ` | Male | `ar-IQ-BasselNeural` | General |
| Arabic (Jordan) | `ar-JO` | Female | `ar-JO-SanaNeural` | General |
| Arabic (Jordan) | `ar-JO` | Male | `ar-JO-TaimNeural` | General |
| Arabic (Kuwait) | `ar-KW` | Female | `ar-KW-NouraNeural` | General |
| Arabic (Kuwait) | `ar-KW` | Male | `ar-KW-FahedNeural` | General |
| Arabic (Libya) | `ar-LY` | Female | `ar-LY-ImanNeural` | General |
| Arabic (Libya) | `ar-LY` | Male | `ar-LY-OmarNeural` | General |
| Arabic (Morocco) | `ar-MA` | Female | `ar-MA-MounaNeural` | General |
| Arabic (Morocco) | `ar-MA` | Male | `ar-MA-JamalNeural` | General |
| Arabic (Qatar) | `ar-QA` | Female | `ar-QA-AmalNeural` | General |
| Arabic (Qatar) | `ar-QA` | Male | `ar-QA-MoazNeural` | General |
| Arabic (Saudi Arabia) | `ar-SA` | Female | `ar-SA-ZariyahNeural` | General |
| Arabic (Saudi Arabia) | `ar-SA` | Male | `ar-SA-HamedNeural` | General |
| Arabic (Syria) | `ar-SY` | Female | `ar-SY-AmanyNeural` | General |
| Arabic (Syria) | `ar-SY` | Male | `ar-SY-LaithNeural` | General |
| Arabic (Tunisia) | `ar-TN` | Female | `ar-TN-ReemNeural` | General |
| Arabic (Tunisia) | `ar-TN` | Male | `ar-TN-HediNeural` | General |
| Arabic (United Arab Emirates) | `ar-AE` | Female | `ar-AE-FatimaNeural` | General |
| Arabic (United Arab Emirates) | `ar-AE` | Male | `ar-AE-HamdanNeural` | General |
| Arabic (Yemen) | `ar-YE` | Female | `ar-YE-MaryamNeural` | General |
| Arabic (Yemen) | `ar-YE` | Male | `ar-YE-SalehNeural` | General |
| Bangla (Bangladesh) | `bn-BD` | Female | `bn-BD-NabanitaNeural` | General |
| Bangla (Bangladesh) | `bn-BD` | Male | `bn-BD-PradeepNeural` | General |
| Bengali (India) | `bn-IN` | Female | `bn-IN-TanishaaNeural` <sup>New</sup> | General |
| Bengali (India) | `bn-IN` | Male | `bn-IN-BashkarNeural` <sup>New</sup> | General |
| Bulgarian (Bulgaria) | `bg-BG` | Female | `bg-BG-KalinaNeural` | General |
| Bulgarian (Bulgaria) | `bg-BG` | Male | `bg-BG-BorislavNeural` | General |
| Burmese (Myanmar) | `my-MM` | Female | `my-MM-NilarNeural` | General |
| Burmese (Myanmar) | `my-MM` | Male | `my-MM-ThihaNeural` | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-AlbaNeural` | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-JoanaNeural` | General |
| Catalan (Spain) | `ca-ES` | Male | `ca-ES-EnricNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuGaaiNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuMaanNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Male | `zh-HK-WanLungNeural` | General |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaochenNeural`  | Optimized for spontaneous conversation |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaohanNeural` | General, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaomoNeural` | General, multiple role-play and styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoqiuNeural`  | Optimized for narrating |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoruiNeural` | Senior voice, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoshuangNeural`  | Child voice, optimized for child story and chat; multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles)|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxiaoNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxuanNeural` | General, multiple role-play and styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoyanNeural`  | Optimized for customer service |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoyouNeural` | Child voice, optimized for story narrating |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male   | `zh-CN-YunxiNeural` | General, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunyangNeural` | Optimized for news reading,<br /> multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunyeNeural` | Optimized for story narrating, multiple role-play and styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Taiwanese Mandarin) | `zh-TW` | Female | `zh-TW-HsiaoChenNeural` | General |
| Chinese (Taiwanese Mandarin) | `zh-TW` | Female | `zh-TW-HsiaoYuNeural` | General |
| Chinese (Taiwanese Mandarin) | `zh-TW` | Male | `zh-TW-YunJheNeural` | General |
| Croatian (Croatia) | `hr-HR` | Female | `hr-HR-GabrijelaNeural` | General |
| Croatian (Croatia) | `hr-HR` | Male | `hr-HR-SreckoNeural` | General |
| Czech (Czech) | `cs-CZ` | Female | `cs-CZ-VlastaNeural` | General |
| Czech (Czech) | `cs-CZ` | Male | `cs-CZ-AntoninNeural` | General |
| Danish (Denmark) | `da-DK` | Female | `da-DK-ChristelNeural` | General |
| Danish (Denmark) | `da-DK` | Male | `da-DK-JeppeNeural` | General |
| Dutch (Belgium) | `nl-BE` | Female | `nl-BE-DenaNeural` | General | 
| Dutch (Belgium) | `nl-BE` | Male | `nl-BE-ArnaudNeural` | General | 
| Dutch (Netherlands) | `nl-NL` | Female | `nl-NL-ColetteNeural` | General |
| Dutch (Netherlands) | `nl-NL` | Female | `nl-NL-FennaNeural` | General |
| Dutch (Netherlands) | `nl-NL` | Male | `nl-NL-MaartenNeural` | General |
| English (Australia) | `en-AU` | Female | `en-AU-NatashaNeural` | General |
| English (Australia) | `en-AU` | Male | `en-AU-WilliamNeural` | General |
| English (Canada) | `en-CA` | Female | `en-CA-ClaraNeural` | General |
| English (Canada) | `en-CA` | Male | `en-CA-LiamNeural` | General |
| English (Hongkong) | `en-HK` | Female | `en-HK-YanNeural` | General |
| English (Hongkong) | `en-HK` | Male | `en-HK-SamNeural` | General |
| English (India) | `en-IN` | Female | `en-IN-NeerjaNeural` | General |
| English (India) | `en-IN` | Male | `en-IN-PrabhatNeural` | General |
| English (Ireland) | `en-IE` | Female | `en-IE-EmilyNeural` | General |
| English (Ireland) | `en-IE` | Male | `en-IE-ConnorNeural` | General |
| English (Kenya) | `en-KE` | Female | `en-KE-AsiliaNeural` | General |
| English (Kenya) | `en-KE` | Male | `en-KE-ChilembaNeural` | General |
| English (New Zealand) | `en-NZ` | Female | `en-NZ-MollyNeural` | General |
| English (New Zealand) | `en-NZ` | Male | `en-NZ-MitchellNeural` | General |
| English (Nigeria) | `en-NG` | Female | `en-NG-EzinneNeural` | General |
| English (Nigeria) | `en-NG` | Male | `en-NG-AbeoNeural` | General |
| English (Philippines) | `en-PH` | Female | `en-PH-RosaNeural` | General | 
| English (Philippines) | `en-PH` | Male | `en-PH-JamesNeural` | General | 
| English (Singapore) | `en-SG` | Female | `en-SG-LunaNeural` | General |
| English (Singapore) | `en-SG` | Male | `en-SG-WayneNeural` | General |
| English (South Africa) | `en-ZA` | Female | `en-ZA-LeahNeural` | General |
| English (South Africa) | `en-ZA` | Male | `en-ZA-LukeNeural` | General |
| English (Tanzania) | `en-TZ` | Female | `en-TZ-ImaniNeural` | General |
| English (Tanzania) | `en-TZ` | Male | `en-TZ-ElimuNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-LibbyNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-MiaNeural` <sup>Retired on 30 October 2021, see below</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-SoniaNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-RyanNeural` | General |
| English (United States) | `en-US` | Female | `en-US-AmberNeural` | General |
| English (United States) | `en-US` | Female | `en-US-AriaNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Female | `en-US-AshleyNeural` | General |
| English (United States) | `en-US` | Female | `en-US-CoraNeural` | General |
| English (United States) | `en-US` | Female | `en-US-ElizabethNeural` | General |
| English (United States) | `en-US` | Female | `en-US-JennyNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` as the primary default. Additional locales are supported [using SSML](speech-synthesis-markup.md#adjust-speaking-languages) | Female | `en-US-JennyMultilingualNeural`  | General |
| English (United States) | `en-US` | Female | `en-US-MichelleNeural`| General |
| English (United States) | `en-US` | Female | `en-US-MonicaNeural` | General |
| English (United States) | `en-US` | Female | `en-US-SaraNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Kid | `en-US-AnaNeural`| General |
| English (United States) | `en-US` | Male | `en-US-BrandonNeural` | General |
| English (United States) | `en-US` | Male | `en-US-ChristopherNeural`  | General |
| English (United States) | `en-US` | Male | `en-US-EricNeural` | General |
| English (United States) | `en-US` | Male | `en-US-GuyNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Male | `en-US-JacobNeural` | General |
| Estonian (Estonia) | `et-EE` | Female | `et-EE-AnuNeural` | General |
| Estonian (Estonia) | `et-EE` | Male | `et-EE-KertNeural` | General |
| Filipino (Philippines) | `fil-PH` | Female | `fil-PH-BlessicaNeural` | General |
| Filipino (Philippines) | `fil-PH` | Male | `fil-PH-AngeloNeural` | General |
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-NooraNeural` | General |
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-SelmaNeural` | General |
| Finnish (Finland) | `fi-FI` | Male | `fi-FI-HarriNeural` | General |
| French (Belgium) | `fr-BE` | Female | `fr-BE-CharlineNeural` | General | 
| French (Belgium) | `fr-BE` | Male | `fr-BE-GerardNeural` | General | 
| French (Canada) | `fr-CA` | Female | `fr-CA-SylvieNeural` | General |
| French (Canada) | `fr-CA` | Male | `fr-CA-AntoineNeural` | General |
| French (Canada) | `fr-CA` | Male | `fr-CA-JeanNeural` | General |
| French (France) | `fr-FR` | Female | `fr-FR-DeniseNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) <sup>Public preview</sup> |
| French (France) | `fr-FR` | Male | `fr-FR-HenriNeural` | General |
| French (Switzerland) | `fr-CH` | Female | `fr-CH-ArianeNeural` | General |
| French (Switzerland) | `fr-CH` | Male | `fr-CH-FabriceNeural` | General |
| Galician (Spain) | `gl-ES` | Female | `gl-ES-SabelaNeural` | General |
| Galician (Spain) | `gl-ES` | Male | `gl-ES-RoiNeural` | General |
| German (Austria) | `de-AT` | Female | `de-AT-IngridNeural` | General |
| German (Austria) | `de-AT` | Male | `de-AT-JonasNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-KatjaNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-ConradNeural` | General |
| German (Switzerland) | `de-CH` | Female | `de-CH-LeniNeural` | General |
| German (Switzerland) | `de-CH` | Male | `de-CH-JanNeural` | General |
| Greek (Greece) | `el-GR` | Female | `el-GR-AthinaNeural` | General |
| Greek (Greece) | `el-GR` | Male | `el-GR-NestorasNeural` | General |
| Gujarati (India) | `gu-IN` | Female | `gu-IN-DhwaniNeural` | General |
| Gujarati (India) | `gu-IN` | Male | `gu-IN-NiranjanNeural` | General |
| Hebrew (Israel) | `he-IL` | Female | `he-IL-HilaNeural` | General |
| Hebrew (Israel) | `he-IL` | Male | `he-IL-AvriNeural` | General |
| Hindi (India) | `hi-IN` | Female | `hi-IN-SwaraNeural` | General |
| Hindi (India) | `hi-IN` | Male | `hi-IN-MadhurNeural` | General |
| Hungarian (Hungary) | `hu-HU` | Female | `hu-HU-NoemiNeural` | General |
| Hungarian (Hungary) | `hu-HU` | Male | `hu-HU-TamasNeural` | General |
| Icelandic (Iceland) | `is-IS` | Female | `is-IS-GudrunNeural` <sup>New</sup> | General |
| Icelandic (Iceland) | `is-IS` | Male | `is-IS-GunnarNeural` <sup>New</sup> | General |
| Indonesian (Indonesia) | `id-ID` | Female | `id-ID-GadisNeural` | General |
| Indonesian (Indonesia) | `id-ID` | Male | `id-ID-ArdiNeural` | General |
| Irish (Ireland) | `ga-IE` | Female | `ga-IE-OrlaNeural` | General |
| Irish (Ireland) | `ga-IE` | Male | `ga-IE-ColmNeural` | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-ElsaNeural` | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-IsabellaNeural` | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-DiegoNeural` | General |
| Japanese (Japan) | `ja-JP` | Female | `ja-JP-NanamiNeural` | General |
| Japanese (Japan) | `ja-JP` | Male | `ja-JP-KeitaNeural` | General |
| Javanese (Indonesia) | `jv-ID` | Female | `jv-ID-SitiNeural` | General |
| Javanese (Indonesia) | `jv-ID` | Male | `jv-ID-DimasNeural` | General |
| Kannada (India) | `kn-IN` | Female | `kn-IN-SapnaNeural` <sup>New</sup> | General |
| Kannada (India) | `kn-IN` | Male | `kn-IN-GaganNeural` <sup>New</sup> | General |
| Kazakh (Kazakhstan) | `kk-KZ` | Female | `kk-KZ-AigulNeural` <sup>New</sup> | General |
| Kazakh (Kazakhstan) | `kk-KZ` | Male | `kk-KZ-DauletNeural` <sup>New</sup> | General |
| Khmer (Cambodia) | `km-KH` | Female | `km-KH-SreymomNeural` | General |
| Khmer (Cambodia) | `km-KH` | Male | `km-KH-PisethNeural` | General |
| Korean (Korea) | `ko-KR` | Female | `ko-KR-SunHiNeural` | General |
| Korean (Korea) | `ko-KR` | Male | `ko-KR-InJoonNeural` | General |
| Lao (Laos) | `lo-LA` | Female | `lo-LA-KeomanyNeural` <sup>New</sup> | General |
| Lao (Laos) | `lo-LA` | Male | `lo-LA-ChanthavongNeural` <sup>New</sup> | General |
| Latvian (Latvia) | `lv-LV` | Female | `lv-LV-EveritaNeural` | General |
| Latvian (Latvia) | `lv-LV` | Male | `lv-LV-NilsNeural` | General |
| Lithuanian (Lithuania) | `lt-LT` | Female | `lt-LT-OnaNeural` | General |
| Lithuanian (Lithuania) | `lt-LT` | Male | `lt-LT-LeonasNeural` | General |
| Macedonian (Republic of North Macedonia) | `mk-MK` | Female | `mk-MK-MarijaNeural` <sup>New</sup> | General |
| Macedonian (Republic of North Macedonia) | `mk-MK` | Male | `mk-MK-AleksandarNeural` <sup>New</sup> | General |
| Malay (Malaysia) | `ms-MY` | Female | `ms-MY-YasminNeural` | General |
| Malay (Malaysia) | `ms-MY` | Male | `ms-MY-OsmanNeural` | General |
| Malayalam (India) | `ml-IN` | Female | `ml-IN-SobhanaNeural` <sup>New</sup> | General |
| Malayalam (India) | `ml-IN` | Male | `ml-IN-MidhunNeural` <sup>New</sup> | General |
| Maltese (Malta) | `mt-MT` | Female | `mt-MT-GraceNeural` | General |
| Maltese (Malta) | `mt-MT` | Male | `mt-MT-JosephNeural` | General |
| Marathi (India) | `mr-IN` | Female | `mr-IN-AarohiNeural` | General |
| Marathi (India) | `mr-IN` | Male | `mr-IN-ManoharNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-IselinNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-PernilleNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Male | `nb-NO-FinnNeural` | General |
| Pashto (Afghanistan) | `ps-AF` | Female | `ps-AF-LatifaNeural` <sup>New</sup> | General |
| Pashto (Afghanistan) | `ps-AF` | Male | `ps-AF-GulNawazNeural` <sup>New</sup> | General |
| Persian (Iran) | `fa-IR` | Female | `fa-IR-DilaraNeural` | General |
| Persian (Iran) | `fa-IR` | Male | `fa-IR-FaridNeural` | General |
| Polish (Poland) | `pl-PL` | Female | `pl-PL-AgnieszkaNeural` | General |
| Polish (Poland) | `pl-PL` | Female | `pl-PL-ZofiaNeural` | General |
| Polish (Poland) | `pl-PL` | Male | `pl-PL-MarekNeural` | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-FranciscaNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-AntonioNeural` | General |
| Portuguese (Portugal) | `pt-PT` | Female | `pt-PT-FernandaNeural` | General |
| Portuguese (Portugal) | `pt-PT` | Female | `pt-PT-RaquelNeural` | General |
| Portuguese (Portugal) | `pt-PT` | Male | `pt-PT-DuarteNeural` | General |
| Romanian (Romania) | `ro-RO` | Female | `ro-RO-AlinaNeural` | General |
| Romanian (Romania) | `ro-RO` | Male | `ro-RO-EmilNeural` | General |
| Russian (Russia) | `ru-RU` | Female | `ru-RU-DariyaNeural` | General |
| Russian (Russia) | `ru-RU` | Female | `ru-RU-SvetlanaNeural` | General |
| Russian (Russia) | `ru-RU` | Male | `ru-RU-DmitryNeural` | General |
| Serbian (Serbia, Cyrillic) | `sr-RS` | Female | `sr-RS-SophieNeural` <sup>New</sup> | General |
| Serbian (Serbia, Cyrillic) | `sr-RS` | Male | `sr-RS-NicholasNeural` <sup>New</sup> | General |
| Sinhala (Sri Lanka) | `si-LK` | Female | `si-LK-ThiliniNeural` <sup>New</sup> | General |
| Sinhala (Sri Lanka) | `si-LK` | Male | `si-LK-SameeraNeural` <sup>New</sup> | General |
| Slovak (Slovakia) | `sk-SK` | Female | `sk-SK-ViktoriaNeural` | General |
| Slovak (Slovakia) | `sk-SK` | Male | `sk-SK-LukasNeural` | General |
| Slovenian (Slovenia) | `sl-SI` | Female | `sl-SI-PetraNeural` | General |
| Slovenian (Slovenia) | `sl-SI` | Male | `sl-SI-RokNeural` | General |
| Somali (Somalia) | `so-SO` | Female | `so-SO-UbaxNeural` | General |
| Somali (Somalia) | `so-SO`| Male | `so-SO-MuuseNeural` | General |
| Spanish (Argentina) | `es-AR` | Female | `es-AR-ElenaNeural` | General |
| Spanish (Argentina) | `es-AR` | Male | `es-AR-TomasNeural` | General |
| Spanish (Bolivia) | `es-BO` | Female | `es-BO-SofiaNeural` | General |
| Spanish (Bolivia) | `es-BO` | Male | `es-BO-MarceloNeural` | General |
| Spanish (Chile) | `es-CL` | Female | `es-CL-CatalinaNeural` | General |
| Spanish (Chile) | `es-CL` | Male | `es-CL-LorenzoNeural` | General |
| Spanish (Colombia) | `es-CO` | Female | `es-CO-SalomeNeural` | General |
| Spanish (Colombia) | `es-CO` | Male | `es-CO-GonzaloNeural` | General |
| Spanish (Costa Rica) | `es-CR` | Female | `es-CR-MariaNeural` | General |
| Spanish (Costa Rica) | `es-CR` | Male | `es-CR-JuanNeural` | General |
| Spanish (Cuba) | `es-CU` | Female | `es-CU-BelkysNeural` | General |
| Spanish (Cuba) | `es-CU` | Male | `es-CU-ManuelNeural` | General |
| Spanish (Dominican Republic) | `es-DO` | Female | `es-DO-RamonaNeural` | General |
| Spanish (Dominican Republic) | `es-DO` | Male | `es-DO-EmilioNeural` | General |
| Spanish (Ecuador) | `es-EC` | Female | `es-EC-AndreaNeural` | General |
| Spanish (Ecuador) | `es-EC` | Male | `es-EC-LuisNeural` | General |
| Spanish (El Salvador) | `es-SV` | Female | `es-SV-LorenaNeural` | General |
| Spanish (El Salvador) | `es-SV` | Male | `es-SV-RodrigoNeural` | General |
| Spanish (Equatorial Guinea) | `es-GQ` | Female | `es-GQ-TeresaNeural` | General |
| Spanish (Equatorial Guinea) | `es-GQ` | Male | `es-GQ-JavierNeural` | General |
| Spanish (Guatemala) | `es-GT` | Female | `es-GT-MartaNeural` | General |
| Spanish (Guatemala) | `es-GT` | Male | `es-GT-AndresNeural` | General |
| Spanish (Honduras) | `es-HN` | Female | `es-HN-KarlaNeural` | General |
| Spanish (Honduras) | `es-HN` | Male | `es-HN-CarlosNeural` | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-DaliaNeural` | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-JorgeNeural` | General |
| Spanish (Nicaragua) | `es-NI` | Female | `es-NI-YolandaNeural` | General |
| Spanish (Nicaragua) | `es-NI` | Male | `es-NI-FedericoNeural` | General |
| Spanish (Panama) | `es-PA` | Female | `es-PA-MargaritaNeural` | General |
| Spanish (Panama) | `es-PA` | Male | `es-PA-RobertoNeural` | General |
| Spanish (Paraguay) | `es-PY` | Female | `es-PY-TaniaNeural` | General |
| Spanish (Paraguay) | `es-PY` | Male | `es-PY-MarioNeural` | General |
| Spanish (Peru) | `es-PE` | Female | `es-PE-CamilaNeural` | General |
| Spanish (Peru) | `es-PE` | Male | `es-PE-AlexNeural` | General |
| Spanish (Puerto Rico) | `es-PR` | Female | `es-PR-KarinaNeural` | General |
| Spanish (Puerto Rico) | `es-PR` | Male | `es-PR-VictorNeural` | General |
| Spanish (Spain) | `es-ES` | Female | `es-ES-ElviraNeural` | General |
| Spanish (Spain) | `es-ES` | Male | `es-ES-AlvaroNeural` | General |
| Spanish (Uruguay) | `es-UY` | Female | `es-UY-ValentinaNeural` | General |
| Spanish (Uruguay) | `es-UY` | Male | `es-UY-MateoNeural` | General |
| Spanish (US) | `es-US` | Female | `es-US-PalomaNeural` | General |
| Spanish (US) | `es-US` | Male | `es-US-AlonsoNeural` | General |
| Spanish (Venezuela) | `es-VE` | Female | `es-VE-PaolaNeural` | General |
| Spanish (Venezuela) | `es-VE` | Male | `es-VE-SebastianNeural` | General |
| Sundanese (Indonesia) | `su-ID` | Female | `su-ID-TutiNeural` | General |
| Sundanese (Indonesia) | `su-ID` | Male | `su-ID-JajangNeural` | General |
| Swahili (Kenya) | `sw-KE` | Female | `sw-KE-ZuriNeural` | General |
| Swahili (Kenya) | `sw-KE` | Male | `sw-KE-RafikiNeural` | General |
| Swahili (Tanzania) | `sw-TZ` | Female | `sw-TZ-RehemaNeural` | General |
| Swahili (Tanzania) | `sw-TZ` | Male | `sw-TZ-DaudiNeural` | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-HilleviNeural` | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-SofieNeural` | General |
| Swedish (Sweden) | `sv-SE` | Male | `sv-SE-MattiasNeural` | General |
| Tamil (India) | `ta-IN` | Female | `ta-IN-PallaviNeural` | General |
| Tamil (India) | `ta-IN` | Male | `ta-IN-ValluvarNeural` | General |
| Tamil (Singapore) | `ta-SG` | Female | `ta-SG-VenbaNeural` | General |
| Tamil (Singapore) | `ta-SG` | Male | `ta-SG-AnbuNeural` | General |
| Tamil (Sri Lanka) | `ta-LK` | Female | `ta-LK-SaranyaNeural` | General |
| Tamil (Sri Lanka) | `ta-LK` | Male | `ta-LK-KumarNeural` | General |
| Telugu (India) | `te-IN` | Female | `te-IN-ShrutiNeural` | General |
| Telugu (India) | `te-IN` | Male | `te-IN-MohanNeural` | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-AcharaNeural` | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-PremwadeeNeural` | General |
| Thai (Thailand) | `th-TH` | Male | `th-TH-NiwatNeural` | General |
| Turkish (Turkey) | `tr-TR` | Female | `tr-TR-EmelNeural` | General |
| Turkish (Turkey) | `tr-TR` | Male | `tr-TR-AhmetNeural` | General |
| Ukrainian (Ukraine) | `uk-UA` | Female | `uk-UA-PolinaNeural` | General | 
| Ukrainian (Ukraine) | `uk-UA` | Male | `uk-UA-OstapNeural` | General | 
| Urdu (India) | `ur-IN` | Female | `ur-IN-GulNeural` | General |
| Urdu (India) | `ur-IN` | Male | `ur-IN-SalmanNeural` | General |
| Urdu (Pakistan) | `ur-PK` | Female | `ur-PK-UzmaNeural`  | General | 
| Urdu (Pakistan) | `ur-PK` | Male | `ur-PK-AsadNeural` | General | 
| Uzbek (Uzbekistan) | `uz-UZ` | Female | `uz-UZ-MadinaNeural` | General |
| Uzbek (Uzbekistan) | `uz-UZ` | Male | `uz-UZ-SardorNeural` | General |
| Vietnamese (Vietnam) | `vi-VN` | Female | `vi-VN-HoaiMyNeural` | General |
| Vietnamese (Vietnam) | `vi-VN` | Male | `vi-VN-NamMinhNeural` | General |
| Welsh (United Kingdom) | `cy-GB` | Female | `cy-GB-NiaNeural` | General | 
| Welsh (United Kingdom) | `cy-GB` | Male | `cy-GB-AledNeural` | General | 
| Zulu (South Africa) | `zu-ZA` | Female | `zu-ZA-ThandoNeural` | General |
| Zulu (South Africa) | `zu-ZA` | Male | `zu-ZA-ThembaNeural` | General |

### Prebuilt neural voices in preview

The following neural voices are in public preview.

> [!NOTE]
> Voices and styles in public preview are only available in three service [regions](regions.md#prebuilt-neural-voices): East US, West Europe, and Southeast Asia. 

| Language                         | Locale  | Gender | Voice name                             | Style support |
|----------------------------------|---------|--------|----------------------------------------|---------------|
| English (United Kingdom) | `en-GB` | Female | `en-GB-AbbiNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-BellaNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-HollieNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-OliviaNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-MaisieNeural` <sup>New</sup> | General, child voice |
| English (United Kingdom) | `en-GB` | Male | `en-GB-AlfieNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-ElliotNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-EthanNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-NoahNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-OliverNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-ThomasNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Male | `en-US-DavisNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Female | `en-US-JaneNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Male | `en-US-JasonNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Female | `en-US-NancyNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Male | `en-US-TonyNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| French (France) | `fr-FR` | Female | `fr-FR-BrigitteNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-CelesteNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-CoralieNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-JacquelineNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-JosephineNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-YvetteNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-EloiseNeural` <sup>New</sup> | General, child voice |
| French (France) | `fr-FR` | Male | `fr-FR-AlainNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-ClaudeNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-JeromeNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-MauriceNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-YvesNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-AmalaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-ElkeNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-KlarissaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-LouisaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-MajaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-TanjaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-GiselaNeural` <sup>New</sup> | General, child voice |
| German (Germany) | `de-DE` | Male | `de-DE-BerndNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-ChristophNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-KasperNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-KillianNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-KlausNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-RalfNeural` <sup>New</sup> | General |


### Voice styles and roles

In some cases, you can adjust the speaking style to express different emotions like cheerfulness, empathy, and calm. You can optimize the voice for different scenarios like customer service, newscast, and voice assistant. With roles, the same voice can act as a different age and gender.

> [!NOTE]
> The angry, cheerful, excited, friendly, hopeful, sad, shouting, terrified, unfriendly, and whispering styles for DavisNeural, JaneNeural, JasonNeural, NancyNeural and TonyNeural are only available in three service regions: East US, West Europe, and Southeast Asia. 
To learn how you can configure and adjust neural voice styles and roles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

Use the following table to determine supported styles and roles for each neural voice.

|Voice|Styles|Style degree|Roles|
|-----|-----|-----|-----|
|en-US-AriaNeural|`angry`, `chat`, `cheerful`, `customerservice`, `empathetic`, `excited`, `friendly`, `hopeful`, `narration-professional`, `newscast-casual`, `newscast-formal`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-DavisNeural|`angry`, `chat`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-GuyNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `newscast`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-JaneNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-JasonNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-JennyNeural|`angry`, `assistant`, `chat`, `cheerful`,`customerservice`, `excited`, `friendly`, `hopeful`, `newscast`, `sad`, `shouting`, `terrified`, , `unfriendly`, `whispering`|||
|en-US-NancyNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-SaraNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-TonyNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|fr-FR-DeniseNeural |`cheerful` <sup>Public preview</sup>, `sad`<sup>Public preview</sup>||| 
|ja-JP-NanamiNeural|`chat`, `cheerful`, `customerservice`|||
|pt-BR-FranciscaNeural|`calm`|||
|zh-CN-XiaohanNeural|`affectionate`, `angry`, `calm`, `cheerful`, `disgruntled`, `embarrassed`, `fearful`, `gentle`, `sad`, `serious`|Supported||
|zh-CN-XiaomoNeural|`affectionate`, `angry`, `calm`, `cheerful`, `depressed`, `disgruntled`, `embarrassed`, `envious`, `fearful`, `gentle`, `sad`, `serious`|Supported|Supported|
|zh-CN-XiaoruiNeural|`angry`, `calm`, `fearful`, `sad`|Supported||
|zh-CN-XiaoshuangNeural|`chat`|Supported||
|zh-CN-XiaoxiaoNeural|`affectionate`, `angry`, `assistant`, `calm`, `chat`, `cheerful`, `customerservice`, `disgruntled`, `fearful`, `gentle`, `lyrical`, `newscast`, `sad`, `serious`|Supported||
|zh-CN-XiaoxuanNeural|`angry`, `calm`, `cheerful`, `depressed`, `disgruntled`, `fearful`, `gentle`, `serious`|Supported|Supported|
|zh-CN-YunxiNeural|`angry`, `assistant`, `cheerful`, `depressed`, `disgruntled`, `embarrassed`, `fearful`, `narration-relaxed`, `sad`, `serious`|Supported|Supported|
|zh-CN-YunyangNeural|`customerservice`, `narration-professional`, `newscast-casual`|Supported||
|zh-CN-YunyeNeural|`angry`, `calm`, `cheerful`, `disgruntled`, `embarrassed`, `fearful`, `sad`, `serious`|Supported|Supported|


### Custom Neural Voice

Custom Neural Voice lets you create synthetic voices that are rich in speaking styles. You can create a unique brand voice in multiple languages and styles by using a small set of recording data.  

Select the right locale that matches the training data you have to train a custom neural voice model. For example, if the recording data you have is spoken in English with a British accent, select `en-GB`.

With the cross-lingual feature (preview), you can transfer your custom neural voice model to speak a second language. For example, with the `zh-CN` data, you can create a voice that speaks `en-AU` or any of the languages marked "Yes" in the Cross-lingual column in the following table.  

| Language | Locale | Cross-lingual (preview) |
|--|--|--|
| Arabic (Egypt) | `ar-EG` | No |
| Arabic (Saudi Arabia) | `ar-SA` | No |
| Bulgarian (Bulgaria) | `bg-BG` | No |
| Catalan (Spain) | `ca-ES` | No |
| Chinese (Cantonese, Traditional) | `zh-HK` | No |
| Chinese (Mandarin, Simplified) | `zh-CN` | Yes |
| Chinese (Mandarin, Simplified), English bilingual | `zh-CN` bilingual | Yes |
| Chinese (Taiwanese Mandarin) | `zh-TW` | No |
| Croatian (Croatia) | `hr-HR` | No |
| Czech (Czech) | `cs-CZ` | No |
| Danish (Denmark) | `da-DK` | No |
| Dutch (Netherlands) | `nl-NL` | No |
| English (Australia) | `en-AU` | Yes |
| English (Canada) | `en-CA` | No |
| English (India) | `en-IN` | No |
| English (Ireland) | `en-IE` | No |
| English (United Kingdom) | `en-GB` | Yes |
| English (United States) | `en-US` | Yes |
| Finnish (Finland) | `fi-FI` | No |
| French (Canada) | `fr-CA` | Yes |
| French (France) | `fr-FR` | Yes |
| French (Switzerland) | `fr-CH` | No |
| German (Austria) | `de-AT` | No |
| German (Germany) | `de-DE` | Yes |
| German (Switzerland) | `de-CH` | No |
| Greek (Greece) | `el-GR` | No |
| Hebrew (Israel) | `he-IL` | No |
| Hindi (India) | `hi-IN` | No |
| Hungarian (Hungary) | `hu-HU` | No |
| Indonesian (Indonesia) | `id-ID` | No |
| Italian (Italy) | `it-IT` | Yes |
| Japanese (Japan) | `ja-JP` | Yes |
| Korean (Korea) | `ko-KR` | Yes |
| Malay (Malaysia) | `ms-MY` | No |
| Norwegian (Bokmål, Norway) | `nb-NO` | No |
| Polish (Poland) | `pl-PL` | No |
| Portuguese (Brazil) | `pt-BR` | Yes |
| Portuguese (Portugal) | `pt-PT` | No |
| Romanian (Romania) | `ro-RO` | No |
| Russian (Russia) | `ru-RU` | Yes |
| Slovak (Slovakia) | `sk-SK` | No |
| Slovenian (Slovenia) | `sl-SI` | No |
| Spanish (Mexico) | `es-MX` | Yes |
| Spanish (Spain) | `es-ES` | Yes |
| Swedish (Sweden) | `sv-SE` | No |
| Tamil (India) | `ta-IN` | No | 
| Telugu (India) | `te-IN` | No | 
| Thai (Thailand) | `th-TH` | No | 
| Turkish (Turkey) | `tr-TR` | No |
| Vietnamese (Vietnam) | `vi-VN` | No |

## Language identification

With language identification, you set and get one of the supported locales in the following table. We only compare at the language level, such as English and German. If you include multiple locales of the same language, for example, `en-IN` and `en-US`, we'll only compare English (`en`) with the other candidate languages.

|Language|Locale (BCP-47)|
|-----|-----|
Arabic|`ar-DZ`<br/>`ar-BH`<br/>`ar-EG`<br/>`ar-IQ`<br/>`ar-OM`<br/>`ar-SY`|
|Bulgarian|`bg-BG`|
|Catalan|`ca-ES`|
|Chinese, Mandarin|`zh-CN`<br/>`zh-TW`|
|Chinese, Traditional|`zh-HK`|
|Croatian|`hr-HR`|
|Czech|`cs-CZ`|
|Danish|`da-DK`|
|Dutch|`nl-NL`|
|English|`en-AU`<br/>`en-CA`<br/>`en-GH`<br/>`en-HK`<br/>`en-IN`<br/>`en-IE`<br/>`en-KE`<br/>`en-NZ`<br/>`en-NG`<br/>`en-PH`<br/>`en-SG`<br/>`en-ZA`<br/>`en-TZ`<br/>`en-GB`<br/>`en-US`|
|Finnish|`fi-FI`|
|French|`fr-CA`<br/>`fr-FR`|
|German|`de-DE`|
|Greek|`el-GR`|
|Hindi|`hi-IN`|
|Hungarian|`hu-HU`|
|Indonesian|`id-ID`|
|Italian|`it-IT`|
|Japanese|`ja-JP`|
|Korean|`ko-KR`|
|Latvian|`lv-LV`|
|Lithuanian|`lt-LT`|
|Norwegian|`nb-NO`|
|Polish|`pl-PL`|
|Portuguese|`pt-BR`<br/>`pt-PT`|
|Romanian|`ro-RO`|
|Russian|`ru-RU`|
|Slovak|`sk-SK`|
|Slovenian|`sl-SI`|
|Spanish|`es-AR`<br/>`es-BO`<br/>`es-CL`<br/>`es-CO`<br/>`es-CR`<br/>`es-CU`<br/>`es-DO`<br/>`es-EC`<br/>`es-SV`<br/>`es-GQ`<br/>`es-GT`<br/>`es-HN`<br/>`es-MX`<br/>`es-NI`<br/>`es-PA`<br/>`es-PY`<br/>`es-PE`<br/>`es-PR`<br/>`es-ES`<br/>`es-UY`<br/>`es-US`<br/>`es-VE`|
|Swedish|`sv-SE`|
|Tamil|`ta-IN`|
|Thai|`th-TH`|
|Turkish|`tr-TR`|

## Pronunciation assessment

The following table lists the released languages and public preview languages.

| Language | Locale |
|--|--|
|Chinese (Mandarin, Simplified)|`zh-CN`<sup>Public preview</sup> |
|English (Australia)|`en-AU`<sup>Public preview</sup> |
|English (United Kingdom)|`en-GB`<sup>Public preview</sup> |
|English (United States)|`en-US`<sup>General available</sup>|
|French (France)|`fr-FR`<sup>Public preview</sup> |
|Spanish (Spain)|`es-ES`<sup>Public preview</sup> |

> [!NOTE]
> If you want to use languages that aren't listed here, please contact us by email at [mspafeedback@microsoft.com](mailto:mspafeedback@microsoft.com). 
>  
> For pronunciation assessment supported regions, see [available regions](regions.md#speech-to-text-pronunciation-assessment-text-to-speech-and-translation).

## Speech translation

The Speech Translation API supports different languages for speech-to-speech and speech-to-text translation. The source language must always be from the speech-to-text language table. The available target languages depend on whether the translation target is speech or text. You may translate incoming speech into any of the [supported languages](https://www.microsoft.com/translator/business/languages/). A subset of languages is available for [speech synthesis](language-support.md#text-languages).

### Text languages

| Text language           | Language code |
|:------------------------|:-------------:|
| Afrikaans | `af` |
| Albanian | `sq` |
| Amharic | `am` |
| Arabic | `ar` |
| Armenian | `hy` |
| Assamese | `as` |
| Azerbaijani | `az` |
| Bangla | `bn` |
| Bosnian (Latin) | `bs` |
| Bulgarian | `bg` |
| Cantonese (Traditional) | `yue` |
| Catalan | `ca` |
| Chinese (Literary) | `lzh` |
| Chinese Simplified | `zh-Hans` |
| Chinese Traditional | `zh-Hant` |
| Croatian | `hr` |
| Czech | `cs` |
| Danish | `da` |
| Dari | `prs` |
| Dutch | `nl` |
| English | `en` |
| Estonian | `et` |
| Fijian | `fj` |
| Filipino | `fil` |
| Finnish | `fi` |
| French | `fr` |
| French (Canada) | `fr-ca` |
| German | `de` |
| Greek | `el` |
| Gujarati | `gu` |
| Haitian Creole | `ht` |
| Hebrew | `he` |
| Hindi | `hi` |
| Hmong Daw | `mww` |
| Hungarian | `hu` |
| Icelandic | `is` |
| Indonesian | `id` |
| Inuktitut | `iu` |
| Irish | `ga` |
| Italian | `it` |
| Japanese | `ja` |
| Kannada | `kn` |
| Kazakh | `kk` |
| Khmer | `km` |
| Klingon | `tlh-Latn` |
| Klingon (plqaD) | `tlh-Piqd` |
| Korean | `ko` |
| Kurdish (Central) | `ku` |
| Kurdish (Northern) | `kmr` |
| Lao | `lo` |
| Latvian | `lv` |
| Lithuanian | `lt` |
| Malagasy | `mg` |
| Malay | `ms` |
| Malayalam | `ml` |
| Maltese | `mt` |
| Maori | `mi` |
| Marathi | `mr` |
| Myanmar | `my` |
| Nepali | `ne` |
| Norwegian | `nb` |
| Odia | `or` |
| Pashto | `ps` |
| Persian | `fa` |
| Polish | `pl` |
| Portuguese (Brazil) | `pt` |
| Portuguese (Portugal) | `pt-pt` |
| Punjabi | `pa` |
| Queretaro Otomi | `otq` |
| Romanian | `ro` |
| Russian | `ru` |
| Samoan | `sm` |
| Serbian (Cyrillic) | `sr-Cyrl` |
| Serbian (Latin) | `sr-Latn` |
| Slovak | `sk` |
| Slovenian | `sl` |
| Spanish | `es` |
| Swahili | `sw` |
| Swedish | `sv` |
| Tahitian | `ty` |
| Tamil | `ta` |
| Telugu | `te` |
| Thai | `th` |
| Tigrinya | `ti` |
| Tongan | `to` |
| Turkish | `tr` |
| Ukrainian | `uk` |
| Urdu | `ur` |
| Vietnamese | `vi` |
| Welsh | `cy` |
| Yucatec Maya | `yua` |

## Speaker recognition

Speaker recognition is mostly language agnostic. We built a universal model for text-independent speaker recognition by combining various data sources from multiple languages. We've tuned and evaluated the model on the languages and locales that appear in the following table. For more information on speaker recognition, see the [overview](speaker-recognition-overview.md).

| Language | Locale (BCP-47) | Text-dependent verification | Text-independent verification | Text-independent identification |
|----|----|----|----|----|
|English (US)  |  `en-US`  |  Yes  |  Yes  |  Yes |
|Chinese (Mandarin, simplified) | `zh-CN`     |     n/a |     Yes |     Yes|
|English (Australia)     | `en-AU`    | n/a     | Yes     | Yes|
|English (Canada)     | `en-CA`     | n/a |     Yes |     Yes|
|English (India)     | `en-IN`     | n/a |     Yes |     Yes|
|English (UK)     | `en-GB`     | n/a     | Yes     | Yes|
|French (Canada)     | `fr-CA`     | n/a     | Yes |     Yes|
|French (France)     | `fr-FR`     | n/a     | Yes     | Yes|
|German (Germany)     | `de-DE`     | n/a     | Yes     | Yes|
|Italian | `it-IT`     |     n/a     | Yes |     Yes|
|Japanese     | `ja-JP` | n/a     | Yes     | Yes|
|Portuguese (Brazil) | `pt-BR` |     n/a |     Yes |     Yes|
|Spanish (Mexico)     | `es-MX`     | n/a |     Yes |     Yes|
|Spanish (Spain)     | `es-ES` | n/a     | Yes |     Yes|

## Custom keyword and keyword verification

The following table outlines supported languages for custom keyword and keyword verification.

| Language | Locale (BCP-47) | Custom keyword | Keyword verification |
| -------- | --------------- | -------------- | -------------------- |
| Chinese (Mandarin, Simplified) | zh-CN | Yes | Yes |
| English (United States) | en-US | Yes | Yes |
| Japanese (Japan) | ja-JP | No | Yes |
| Portuguese (Brazil) | pt-BR | No | Yes |

## Intent Recognition Pattern Matcher

The Intent Recognizer Pattern Matcher supports the following locales:

| Locale                            | Locale (BCP-47) |
|-----------------------------------|-----------------|
| English (United States)           | `en-US`         |

## Next steps

* [Region support](regions.md)
