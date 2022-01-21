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
ms.date: 01/07/2022
ms.author: eur
ms.custom: references_regions, ignite-fall-2021
---

# Language and voice support for the Speech service

Language support varies by Speech service functionality. The following tables summarize language support for [Speech-to-Text](#speech-to-text), [Text-to-Speech](#text-to-speech), [Speech translation](#speech-translation), and [Speaker Recognition](#speaker-recognition) service offerings.

## Speech-to-Text

Both the Microsoft Speech SDK and the REST API support the following languages (locales). 

To improve accuracy, customization is available for some languages and baseline model versions by uploading **Audio + Human-labeled Transcripts**, **Plain Text**, **Structured Text**, and **Pronunciation**. By default, Plain Text customization is supported for all available baseline models. To learn more about customization, see [Get started with Custom Speech](./custom-speech-overview.md).


| Language                          | Locale (BCP-47) | Customizations                                                  |
|-----------------------------------|-----------------|-----------------------------------------------------------------|
| Arabic (Algeria)                  | `ar-DZ`         | Plain Text                                                            |
| Arabic (Bahrain), modern standard | `ar-BH`         | Plain Text                                                            |
| Arabic (Egypt)                    | `ar-EG`         | Plain Text                                                            |
| Arabic (Iraq)                     | `ar-IQ`         | Plain Text                                                            |
| Arabic (Israel)                   | `ar-IL`         | Plain Text                                                            |
| Arabic (Jordan)                   | `ar-JO`         | Plain Text                                                            |
| Arabic (Kuwait)                   | `ar-KW`         | Plain Text                                                            |
| Arabic (Lebanon)                  | `ar-LB`         | Plain Text                                                            |
| Arabic (Libya)                    | `ar-LY`         | Plain Text                                                            |
| Arabic (Morocco)                  | `ar-MA`         | Plain Text                                                            |
| Arabic (Oman)                     | `ar-OM`         | Plain Text                                                            |
| Arabic (Qatar)                    | `ar-QA`         | Plain Text                                                            |
| Arabic (Saudi Arabia)             | `ar-SA`         | Plain Text                                                            |
| Arabic (Palestinian Authority)    | `ar-PS`         | Plain Text                                                            |
| Arabic (Syria)                    | `ar-SY`         | Plain Text                                                            |
| Arabic (Tunisia)                  | `ar-TN`         | Plain Text                                                            |
| Arabic (United Arab Emirates)     | `ar-AE`         | Plain Text                                                            |
| Arabic (Yemen)                    | `ar-YE`         | Plain Text                                                            |
| Bulgarian (Bulgaria)              | `bg-BG`         | Plain Text                                                            |
| Catalan (Spain)                   | `ca-ES`         | Plain Text<br/>Pronunciation                                          |
| Chinese (Cantonese, Traditional)  | `zh-HK`         | Plain Text                                       |
| Chinese (Mandarin, Simplified)    | `zh-CN`         | Plain Text                                       |
| Chinese (Taiwanese Mandarin)      | `zh-TW`         | Plain Text                             |
| Croatian (Croatia)                | `hr-HR`         | Plain Text<br/>Pronunciation                                          |
| Czech (Czech)                     | `cs-CZ`         | Plain Text<br/>Pronunciation                                          |
| Danish (Denmark)                  | `da-DK`         | Plain Text<br/>Pronunciation                                          |
| Dutch (Netherlands)               | `nl-NL`         | Plain Text<br/>Pronunciation                     |
| English (Australia)               | `en-AU`         | Plain Text<br/>Pronunciation                     |
| English (Canada)                  | `en-CA`         | Plain Text<br/>Pronunciation                     |
| English (Ghana)                   | `en-GH`         | Plain Text<br/>Pronunciation                                          |
| English (Hong Kong)               | `en-HK`         | Plain Text<br/>Pronunciation                                          |
| English (India)                   | `en-IN`         | Plain Text<br>Structured Text (20210907)<br>Pronunciation                     |
| English (Ireland)                 | `en-IE`         | Plain Text<br/>Pronunciation                                          |
| English (Kenya)                   | `en-KE`         | Plain Text<br/>Pronunciation                                          |
| English (New Zealand)             | `en-NZ`         | Plain Text<br/>Pronunciation                     |
| English (Nigeria)                 | `en-NG`         | Plain Text<br/>Pronunciation                                          |
| English (Philippines)             | `en-PH`         | Plain Text<br/>Pronunciation                                          |
| English (Singapore)               | `en-SG`         | Plain Text<br/>Pronunciation                                          |
| English (South Africa)            | `en-ZA`         | Plain Text<br/>Pronunciation                                          |
| English (Tanzania)                | `en-TZ`         | Plain Text<br/>Pronunciation                                          |
| English (United Kingdom)          | `en-GB`         | Audio (20201019)<br>Plain Text<br>Structured Text (20210906)<br>Pronunciation                     |
| English (United States)           | `en-US`         | Audio (20201019, 20210223)<br>Plain Text<br>Structured Text (20211012)<br>Pronunciation           |
| Estonian(Estonia)                 | `et-EE`         | Plain Text<br/>Pronunciation                                          |
| Filipino (Philippines)            | `fil-PH`        | Plain Text<br/>Pronunciation                                          |
| Finnish (Finland)                 | `fi-FI`         | Plain Text<br/>Pronunciation                                          |
| French (Canada)                   | `fr-CA`         | Audio (20201015)<br>Plain Text<br>Structured Text (20210908)<br>Pronunciation                     |
| French (France)                   | `fr-FR`         | Audio (20201015)<br>Plain Text<br>Structured Text (20210908)<br>Pronunciation                     |
| French (Switzerland)              | `fr-CH`         | Plain Text<br/>Pronunciation                                          |
| German (Austria)                  | `de-AT`         | Plain Text<br/>Pronunciation                                          |
| German (Switzerland)              | `de-CH`         | Plain Text<br/>Pronunciation                                          |
| German (Germany)                  | `de-DE`         | Audio (20201127)<br>Plain Text<br>Structured Text (20210831)<br>Pronunciation |
| Greek (Greece)                    | `el-GR`         | Plain Text                                                            |
| Gujarati (Indian)                 | `gu-IN`         | Plain Text                                                            |
| Hebrew (Israel)                   | `he-IL`         | Plain Text                                                            |
| Hindi (India)                     | `hi-IN`         | Plain Text                                       |
| Hungarian (Hungary)               | `hu-HU`         | Plain Text<br/>Pronunciation                                          |
| Indonesian (Indonesia)            | `id-ID`         | Plain Text<br/>Pronunciation                                          |
| Irish (Ireland)                   | `ga-IE`         | Plain Text<br/>Pronunciation                                          |
| Italian (Italy)                   | `it-IT`         | Audio (20201016)<br>Plain Text<br>Pronunciation                     |
| Japanese (Japan)                  | `ja-JP`         | Plain Text                                                            |
| Kannada (India)                   | `kn-IN`         | Plain Text                                                            |
| Korean (Korea)                    | `ko-KR`         | Audio (20201015)<br>Plain Text                                       |
| Latvian (Latvia)                  | `lv-LV`         | Plain Text<br/>Pronunciation                                          |
| Lithuanian (Lithuania)            | `lt-LT`         | Plain Text<br/>Pronunciation                                          |
| Malay (Malaysia)                  | `ms-MY`         | Plain Text                                                            |
| Maltese (Malta)                   | `mt-MT`         | Plain Text                                                            |
| Marathi (India)                   | `mr-IN`         | Plain Text                                                            |
| Norwegian (Bokmål, Norway)        | `nb-NO`         | Plain Text                                                            |
| Persian (Iran)                    | `fa-IR`         | Plain Text                                                            |
| Polish (Poland)                   | `pl-PL`         | Plain Text<br/>Pronunciation                                          |
| Portuguese (Brazil)               | `pt-BR`         | Audio (20201015)<br>Plain Text<br>Pronunciation           |
| Portuguese (Portugal)             | `pt-PT`         | Plain Text<br/>Pronunciation                                          |
| Romanian (Romania)                | `ro-RO`         | Plain Text<br/>Pronunciation                                          |
| Russian (Russia)                  | `ru-RU`         | Plain Text                                       |
| Slovak (Slovakia)                 | `sk-SK`         | Plain Text<br/>Pronunciation                                          |
| Slovenian (Slovenia)              | `sl-SI`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Argentina)               | `es-AR`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Bolivia)                 | `es-BO`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Chile)                   | `es-CL`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Colombia)                | `es-CO`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Costa Rica)              | `es-CR`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Cuba)                    | `es-CU`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Dominican Republic)      | `es-DO`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Ecuador)                 | `es-EC`         | Plain Text<br/>Pronunciation                                          |
| Spanish (El Salvador)             | `es-SV`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Equatorial Guinea)       | `es-GQ`         | Plain Text                                                            |
| Spanish (Guatemala)               | `es-GT`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Honduras)                | `es-HN`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Mexico)                  | `es-MX`         | Plain Text<br>Structured Text (20210908)<br>Pronunciation                     |
| Spanish (Nicaragua)               | `es-NI`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Panama)                  | `es-PA`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Paraguay)                | `es-PY`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Peru)                    | `es-PE`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Puerto Rico)             | `es-PR`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Spain)                   | `es-ES`         | Audio (20201015)<br>Plain Text<br>Structured Text (20210908)<br>Pronunciation                     |
| Spanish (Uruguay)                 | `es-UY`         | Plain Text<br/>Pronunciation                                          |
| Spanish (USA)                     | `es-US`         | Plain Text<br/>Pronunciation                                          |
| Spanish (Venezuela)               | `es-VE`         | Plain Text<br/>Pronunciation                                          |
| Swahili (Kenya)                   | `sw-KE`         | Plain Text                                                            |
| Swedish (Sweden)                  | `sv-SE`         | Plain Text<br/>Pronunciation                                          |
| Tamil (India)                     | `ta-IN`         | Plain Text                                                            |
| Telugu (India)                    | `te-IN`         | Plain Text                                                            |
| Thai (Thailand)                   | `th-TH`         | Plain Text                                                            |
| Turkish (Turkey)                  | `tr-TR`         | Plain Text                                                            |
| Vietnamese (Vietnam)              | `vi-VN`         | Plain Text                                                            |

## Text-to-Speech

Both the Microsoft Speech SDK and REST APIs support these neural voices, each of which supports a specific language and dialect, identified by locale. You can also get a full list of languages and voices supported for each specific region/endpoint through the [voices list API](rest-text-to-speech.md#get-a-list-of-voices). 

> [!IMPORTANT]
> Pricing varies for Prebuilt Neural Voice (referred as *Neural* on the pricing page) and Custom Neural Voice (referred as *Custom Neural* on the pricing page). Please visit the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page for additional information.

### Prebuilt neural voices

Below table lists out the prebuilt neural voices supported in each language. You can [try the demo and hear the voices here](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).  

> [!NOTE]
> Prebuilt neural voices are created from samples that use a 24 khz sample rate.
> All voices can upsample or downsample to other sample rates when synthesizing.

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| Afrikaans (South Africa) | `af-ZA` | Female | `af-ZA-AdriNeural` <sup>New</sup>  | General |
| Afrikaans (South Africa) | `af-ZA` | Male | `af-ZA-WillemNeural` <sup>New</sup>  | General |
| Amharic (Ethiopia) | `am-ET` | Female | `am-ET-MekdesNeural` <sup>New</sup>  | General |
| Amharic (Ethiopia) | `am-ET` | Male | `am-ET-AmehaNeural` <sup>New</sup>  | General |
| Arabic (Algeria) | `ar-DZ` | Female | `ar-DZ-AminaNeural` <sup>New</sup>  | General |
| Arabic (Algeria) | `ar-DZ` | Male | `ar-DZ-IsmaelNeural` <sup>New</sup>  | General |
| Arabic (Bahrain) | `ar-BH` | Female | `ar-BH-LailaNeural` <sup>New</sup>  | General |
| Arabic (Bahrain) | `ar-BH` | Male | `ar-BH-AliNeural` <sup>New</sup>  | General |
| Arabic (Egypt) | `ar-EG` | Female | `ar-EG-SalmaNeural` | General |
| Arabic (Egypt) | `ar-EG` | Male | `ar-EG-ShakirNeural` | General |
| Arabic (Iraq) | `ar-IQ` | Female | `ar-IQ-RanaNeural` <sup>New</sup>  | General |
| Arabic (Iraq) | `ar-IQ` | Male | `ar-IQ-BasselNeural` <sup>New</sup>  | General |
| Arabic (Jordan) | `ar-JO` | Female | `ar-JO-SanaNeural` <sup>New</sup>  | General |
| Arabic (Jordan) | `ar-JO` | Male | `ar-JO-TaimNeural` <sup>New</sup>  | General |
| Arabic (Kuwait) | `ar-KW` | Female | `ar-KW-NouraNeural` <sup>New</sup>  | General |
| Arabic (Kuwait) | `ar-KW` | Male | `ar-KW-FahedNeural` <sup>New</sup>  | General |
| Arabic (Libya) | `ar-LY` | Female | `ar-LY-ImanNeural` <sup>New</sup>  | General |
| Arabic (Libya) | `ar-LY` | Male | `ar-LY-OmarNeural` <sup>New</sup>  | General |
| Arabic (Morocco) | `ar-MA` | Female | `ar-MA-MounaNeural` <sup>New</sup>  | General |
| Arabic (Morocco) | `ar-MA` | Male | `ar-MA-JamalNeural` <sup>New</sup>  | General |
| Arabic (Qatar) | `ar-QA` | Female | `ar-QA-AmalNeural` <sup>New</sup>  | General |
| Arabic (Qatar) | `ar-QA` | Male | `ar-QA-MoazNeural` <sup>New</sup>  | General |
| Arabic (Saudi Arabia) | `ar-SA` | Female | `ar-SA-ZariyahNeural` | General |
| Arabic (Saudi Arabia) | `ar-SA` | Male | `ar-SA-HamedNeural` | General |
| Arabic (Syria) | `ar-SY` | Female | `ar-SY-AmanyNeural` <sup>New</sup>  | General |
| Arabic (Syria) | `ar-SY` | Male | `ar-SY-LaithNeural` <sup>New</sup>  | General |
| Arabic (Tunisia) | `ar-TN` | Female | `ar-TN-ReemNeural` <sup>New</sup>  | General |
| Arabic (Tunisia) | `ar-TN` | Male | `ar-TN-HediNeural` <sup>New</sup>  | General |
| Arabic (United Arab Emirates) | `ar-AE` | Female | `ar-AE-FatimaNeural` <sup>New</sup>  | General |
| Arabic (United Arab Emirates) | `ar-AE` | Male | `ar-AE-HamdanNeural` <sup>New</sup>  | General |
| Arabic (Yemen) | `ar-YE` | Female | `ar-YE-MaryamNeural` <sup>New</sup>  | General |
| Arabic (Yemen) | `ar-YE` | Male | `ar-YE-SalehNeural` <sup>New</sup>  | General |
| Bangla (Bangladesh) | `bn-BD` | Female | `bn-BD-NabanitaNeural` <sup>New</sup>  | General |
| Bangla (Bangladesh) | `bn-BD` | Male | `bn-BD-PradeepNeural` <sup>New</sup>  | General |
| Bulgarian (Bulgaria) | `bg-BG` | Female | `bg-BG-KalinaNeural` | General |
| Bulgarian (Bulgaria) | `bg-BG` | Male | `bg-BG-BorislavNeural` | General |
| Burmese (Myanmar) | `my-MM` | Female | `my-MM-NilarNeural` <sup>New</sup>  | General |
| Burmese (Myanmar) | `my-MM` | Male | `my-MM-ThihaNeural` <sup>New</sup>  | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-AlbaNeural` | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-JoanaNeural` | General |
| Catalan (Spain) | `ca-ES` | Male | `ca-ES-EnricNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuGaaiNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuMaanNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Male | `zh-HK-WanLungNeural` | General |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaohanNeural` | General, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaomoNeural` | General, multiple role-play and styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoruiNeural` | Senior voice, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxiaoNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxuanNeural` | General, multiple role-play and styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
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
| English (Kenya) | `en-KE` | Female | `en-KE-AsiliaNeural` <sup>New</sup>  | General |
| English (Kenya) | `en-KE` | Male | `en-KE-ChilembaNeural` <sup>New</sup>  | General |
| English (New Zealand) | `en-NZ` | Female | `en-NZ-MollyNeural` | General |
| English (New Zealand) | `en-NZ` | Male | `en-NZ-MitchellNeural` | General |
| English (Nigeria) | `en-NG` | Female | `en-NG-EzinneNeural` <sup>New</sup>  | General |
| English (Nigeria) | `en-NG` | Male | `en-NG-AbeoNeural` <sup>New</sup>  | General |
| English (Philippines) | `en-PH` | Female | `en-PH-RosaNeural` | General | 
| English (Philippines) | `en-PH` | Male | `en-PH-JamesNeural` | General | 
| English (Singapore) | `en-SG` | Female | `en-SG-LunaNeural` | General |
| English (Singapore) | `en-SG` | Male | `en-SG-WayneNeural` | General |
| English (South Africa) | `en-ZA` | Female | `en-ZA-LeahNeural` | General |
| English (South Africa) | `en-ZA` | Male | `en-ZA-LukeNeural` | General |
| English (Tanzania) | `en-TZ` | Female | `en-TZ-ImaniNeural` <sup>New</sup>  | General |
| English (Tanzania) | `en-TZ` | Male | `en-TZ-ElimuNeural` <sup>New</sup>  | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-LibbyNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-SoniaNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-MiaNeural` <sup>Retired on 30 October 2021, see below</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-RyanNeural` | General |
| English (United States) | `en-US` | Female | `en-US-AmberNeural` | General |
| English (United States) | `en-US` | Female | `en-US-AriaNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Female | `en-US-AshleyNeural` | General |
| English (United States) | `en-US` | Female | `en-US-CoraNeural` | General |
| English (United States) | `en-US` | Female | `en-US-ElizabethNeural` | General |
| English (United States) | `en-US` | Female | `en-US-JennyNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
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
| Filipino (Philippines) | `fil-PH` | Female | `fil-PH-BlessicaNeural` <sup>New</sup>  | General |
| Filipino (Philippines) | `fil-PH` | Male | `fil-PH-AngeloNeural` <sup>New</sup>  | General |
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-NooraNeural` | General |
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-SelmaNeural` | General |
| Finnish (Finland) | `fi-FI` | Male | `fi-FI-HarriNeural` | General |
| French (Belgium) | `fr-BE` | Female | `fr-BE-CharlineNeural` | General | 
| French (Belgium) | `fr-BE` | Male | `fr-BE-GerardNeural` | General | 
| French (Canada) | `fr-CA` | Female | `fr-CA-SylvieNeural` | General |
| French (Canada) | `fr-CA` | Male | `fr-CA-AntoineNeural` | General |
| French (Canada) | `fr-CA` | Male | `fr-CA-JeanNeural` | General |
| French (France) | `fr-FR` | Female | `fr-FR-DeniseNeural` | General |
| French (France) | `fr-FR` | Male | `fr-FR-HenriNeural` | General |
| French (Switzerland) | `fr-CH` | Female | `fr-CH-ArianeNeural` | General |
| French (Switzerland) | `fr-CH` | Male | `fr-CH-FabriceNeural` | General |
| Galician (Spain) | `gl-ES` | Female | `gl-ES-SabelaNeural` <sup>New</sup>  | General |
| Galician (Spain) | `gl-ES` | Male | `gl-ES-RoiNeural` <sup>New</sup>  | General |
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
| Indonesian (Indonesia) | `id-ID` | Female | `id-ID-GadisNeural` | General |
| Indonesian (Indonesia) | `id-ID` | Male | `id-ID-ArdiNeural` | General |
| Irish (Ireland) | `ga-IE` | Female | `ga-IE-OrlaNeural` | General |
| Irish (Ireland) | `ga-IE` | Male | `ga-IE-ColmNeural` | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-ElsaNeural` | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-IsabellaNeural` | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-DiegoNeural` | General |
| Japanese (Japan) | `ja-JP` | Female | `ja-JP-NanamiNeural` | General |
| Japanese (Japan) | `ja-JP` | Male | `ja-JP-KeitaNeural` | General |
| Javanese (Indonesia) | `jv-ID` | Female | `jv-ID-SitiNeural` <sup>New</sup>  | General |
| Javanese (Indonesia) | `jv-ID` | Male | `jv-ID-DimasNeural` <sup>New</sup>  | General |
| Khmer (Cambodia) | `km-KH` | Female | `km-KH-SreymomNeural` <sup>New</sup>  | General |
| Khmer (Cambodia) | `km-KH` | Male | `km-KH-PisethNeural` <sup>New</sup>  | General |
| Korean (Korea) | `ko-KR` | Female | `ko-KR-SunHiNeural` | General |
| Korean (Korea) | `ko-KR` | Male | `ko-KR-InJoonNeural` | General |
| Latvian (Latvia) | `lv-LV` | Female | `lv-LV-EveritaNeural` | General |
| Latvian (Latvia) | `lv-LV` | Male | `lv-LV-NilsNeural` | General |
| Lithuanian (Lithuania) | `lt-LT` | Female | `lt-LT-OnaNeural` | General |
| Lithuanian (Lithuania) | `lt-LT` | Male | `lt-LT-LeonasNeural` | General |
| Malay (Malaysia) | `ms-MY` | Female | `ms-MY-YasminNeural` | General |
| Malay (Malaysia) | `ms-MY` | Male | `ms-MY-OsmanNeural` | General |
| Maltese (Malta) | `mt-MT` | Female | `mt-MT-GraceNeural` | General |
| Maltese (Malta) | `mt-MT` | Male | `mt-MT-JosephNeural` | General |
| Marathi (India) | `mr-IN` | Female | `mr-IN-AarohiNeural` | General |
| Marathi (India) | `mr-IN` | Male | `mr-IN-ManoharNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-IselinNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-PernilleNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Male | `nb-NO-FinnNeural` | General |
| Persian (Iran) | `fa-IR` | Female | `fa-IR-DilaraNeural` <sup>New</sup>  | General |
| Persian (Iran) | `fa-IR` | Male | `fa-IR-FaridNeural` <sup>New</sup>  | General |
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
| Slovak (Slovakia) | `sk-SK` | Female | `sk-SK-ViktoriaNeural` | General |
| Slovak (Slovakia) | `sk-SK` | Male | `sk-SK-LukasNeural` | General |
| Slovenian (Slovenia) | `sl-SI` | Female | `sl-SI-PetraNeural` | General |
| Slovenian (Slovenia) | `sl-SI` | Male | `sl-SI-RokNeural` | General |
| Somali (Somalia) | `so-SO` | Female | `so-SO-UbaxNeural` <sup>New</sup>  | General |
| Somali (Somalia) | `so-SO`| Male | `so-SO-MuuseNeural` <sup>New</sup>  | General |
| Spanish (Argentina) | `es-AR` | Female | `es-AR-ElenaNeural` | General |
| Spanish (Argentina) | `es-AR` | Male | `es-AR-TomasNeural` | General |
| Spanish (Bolivia) | `es-BO` | Female | `es-BO-SofiaNeural` <sup>New</sup>  | General |
| Spanish (Bolivia) | `es-BO` | Male | `es-BO-MarceloNeural` <sup>New</sup>  | General |
| Spanish (Chile) | `es-CL` | Female | `es-CL-CatalinaNeural` <sup>New</sup>  | General |
| Spanish (Chile) | `es-CL` | Male | `es-CL-LorenzoNeural` <sup>New</sup>  | General |
| Spanish (Colombia) | `es-CO` | Female | `es-CO-SalomeNeural` | General |
| Spanish (Colombia) | `es-CO` | Male | `es-CO-GonzaloNeural` | General |
| Spanish (Costa Rica) | `es-CR` | Female | `es-CR-MariaNeural` <sup>New</sup>  | General |
| Spanish (Costa Rica) | `es-CR` | Male | `es-CR-JuanNeural` <sup>New</sup>  | General |
| Spanish (Cuba) | `es-CU` | Female | `es-CU-BelkysNeural` <sup>New</sup>  | General |
| Spanish (Cuba) | `es-CU` | Male | `es-CU-ManuelNeural` <sup>New</sup>  | General |
| Spanish (Dominican Republic) | `es-DO` | Female | `es-DO-RamonaNeural` <sup>New</sup>  | General |
| Spanish (Dominican Republic) | `es-DO` | Male | `es-DO-EmilioNeural` <sup>New</sup>  | General |
| Spanish (Ecuador) | `es-EC` | Female | `es-EC-AndreaNeural` <sup>New</sup>  | General |
| Spanish (Ecuador) | `es-EC` | Male | `es-EC-LuisNeural` <sup>New</sup>  | General |
| Spanish (El Salvador) | `es-SV` | Female | `es-SV-LorenaNeural` <sup>New</sup>  | General |
| Spanish (El Salvador) | `es-SV` | Male | `es-SV-RodrigoNeural` <sup>New</sup>  | General |
| Spanish (Equatorial Guinea) | `es-GQ` | Female | `es-GQ-TeresaNeural` <sup>New</sup>  | General |
| Spanish (Equatorial Guinea) | `es-GQ` | Male | `es-GQ-JavierNeural` <sup>New</sup>  | General |
| Spanish (Guatemala) | `es-GT` | Female | `es-GT-MartaNeural` <sup>New</sup>  | General |
| Spanish (Guatemala) | `es-GT` | Male | `es-GT-AndresNeural` <sup>New</sup>  | General |
| Spanish (Honduras) | `es-HN` | Female | `es-HN-KarlaNeural` <sup>New</sup>  | General |
| Spanish (Honduras) | `es-HN` | Male | `es-HN-CarlosNeural` <sup>New</sup>  | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-DaliaNeural` | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-JorgeNeural` | General |
| Spanish (Nicaragua) | `es-NI` | Female | `es-NI-YolandaNeural` <sup>New</sup>  | General |
| Spanish (Nicaragua) | `es-NI` | Male | `es-NI-FedericoNeural` <sup>New</sup>  | General |
| Spanish (Panama) | `es-PA` | Female | `es-PA-MargaritaNeural` <sup>New</sup>  | General |
| Spanish (Panama) | `es-PA` | Male | `es-PA-RobertoNeural` <sup>New</sup>  | General |
| Spanish (Paraguay) | `es-PY` | Female | `es-PY-TaniaNeural` <sup>New</sup>  | General |
| Spanish (Paraguay) | `es-PY` | Male | `es-PY-MarioNeural` <sup>New</sup>  | General |
| Spanish (Peru) | `es-PE` | Female | `es-PE-CamilaNeural` <sup>New</sup>  | General |
| Spanish (Peru) | `es-PE` | Male | `es-PE-AlexNeural` <sup>New</sup>  | General |
| Spanish (Puerto Rico) | `es-PR` | Female | `es-PR-KarinaNeural` <sup>New</sup>  | General |
| Spanish (Puerto Rico) | `es-PR` | Male | `es-PR-VictorNeural` <sup>New</sup>  | General |
| Spanish (Spain) | `es-ES` | Female | `es-ES-ElviraNeural` | General |
| Spanish (Spain) | `es-ES` | Male | `es-ES-AlvaroNeural` | General |
| Spanish (Uruguay) | `es-UY` | Female | `es-UY-ValentinaNeural` <sup>New</sup>  | General |
| Spanish (Uruguay) | `es-UY` | Male | `es-UY-MateoNeural` <sup>New</sup>  | General |
| Spanish (US) | `es-US` | Female | `es-US-PalomaNeural` | General |
| Spanish (US) | `es-US` | Male | `es-US-AlonsoNeural` | General |
| Spanish (Venezuela) | `es-VE` | Female | `es-VE-PaolaNeural` <sup>New</sup>  | General |
| Spanish (Venezuela) | `es-VE` | Male | `es-VE-SebastianNeural` <sup>New</sup>  | General |
| Sundanese (Indonesia) | `su-ID` | Female | `su-ID-TutiNeural` <sup>New</sup>  | General |
| Sundanese (Indonesia) | `su-ID` | Male | `su-ID-JajangNeural` <sup>New</sup>  | General |
| Swahili (Kenya) | `sw-KE` | Female | `sw-KE-ZuriNeural` | General |
| Swahili (Kenya) | `sw-KE` | Male | `sw-KE-RafikiNeural` | General |
| Swahili (Tanzania) | `sw-TZ` | Female | `sw-TZ-RehemaNeural` <sup>New</sup>  | General |
| Swahili (Tanzania) | `sw-TZ` | Male | `sw-TZ-DaudiNeural` <sup>New</sup>  | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-HilleviNeural` | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-SofieNeural` | General |
| Swedish (Sweden) | `sv-SE` | Male | `sv-SE-MattiasNeural` | General |
| Tamil (India) | `ta-IN` | Female | `ta-IN-PallaviNeural` | General |
| Tamil (India) | `ta-IN` | Male | `ta-IN-ValluvarNeural` | General |
| Tamil (Singapore) | `ta-SG` | Female | `ta-SG-VenbaNeural` <sup>New</sup>  | General |
| Tamil (Singapore) | `ta-SG` | Male | `ta-SG-AnbuNeural` <sup>New</sup>  | General |
| Tamil (Sri Lanka) | `ta-LK` | Female | `ta-LK-SaranyaNeural` <sup>New</sup>  | General |
| Tamil (Sri Lanka) | `ta-LK` | Male | `ta-LK-KumarNeural` <sup>New</sup>  | General |
| Telugu (India) | `te-IN` | Female | `te-IN-ShrutiNeural` | General |
| Telugu (India) | `te-IN` | Male | `te-IN-MohanNeural` | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-AcharaNeural` | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-PremwadeeNeural` | General |
| Thai (Thailand) | `th-TH` | Male | `th-TH-NiwatNeural` | General |
| Turkish (Turkey) | `tr-TR` | Female | `tr-TR-EmelNeural` | General |
| Turkish (Turkey) | `tr-TR` | Male | `tr-TR-AhmetNeural` | General |
| Ukrainian (Ukraine) | `uk-UA` | Female | `uk-UA-PolinaNeural` | General | 
| Ukrainian (Ukraine) | `uk-UA` | Male | `uk-UA-OstapNeural` | General | 
| Urdu (India) | `ur-IN` | Female | `ur-IN-GulNeural` <sup>New</sup>  | General |
| Urdu (India) | `ur-IN` | Male | `ur-IN-SalmanNeural` <sup>New</sup>  | General |
| Urdu (Pakistan) | `ur-PK` | Female | `ur-PK-UzmaNeural`  | General | 
| Urdu (Pakistan) | `ur-PK` | Male | `ur-PK-AsadNeural` | General | 
| Uzbek (Uzbekistan) | `uz-UZ` | Female | `uz-UZ-MadinaNeural` <sup>New</sup>  | General |
| Uzbek (Uzbekistan) | `uz-UZ` | Male | `uz-UZ-SardorNeural` <sup>New</sup>  | General |
| Vietnamese (Vietnam) | `vi-VN` | Female | `vi-VN-HoaiMyNeural` | General |
| Vietnamese (Vietnam) | `vi-VN` | Male | `vi-VN-NamMinhNeural` | General |
| Welsh (United Kingdom) | `cy-GB` | Female | `cy-GB-NiaNeural` | General | 
| Welsh (United Kingdom) | `cy-GB` | Male | `cy-GB-AledNeural` | General | 
| Zulu (South Africa) | `zu-ZA` | Female | `zu-ZA-ThandoNeural` <sup>New</sup>  | General |
| Zulu (South Africa) | `zu-ZA` | Male | `zu-ZA-ThembaNeural` <sup>New</sup>  | General |

> [!IMPORTANT]
> The English (United Kingdom) voice `en-GB-MiaNeural` retired on **30 October 2021**. All service requests to `en-GB-MiaNeural` now will be re-directed to `en-GB-SoniaNeural` automatically since **30 October 2021**.
> If you are using container Neural TTS, please [download](speech-container-howto.md#get-the-container-image-with-docker-pull) and deploy the latest version, starting from **30 October 2021**, all requests with previous versions will be rejected.

### Prebuilt neural voices in preview

Below neural voices are in public preview. 

| Language                         | Locale  | Gender | Voice name                             | Style support |
|----------------------------------|---------|--------|----------------------------------------|---------------|
| English (United States) | `en-US` | Female | `en-US-JennyMultilingualNeural` <sup>New</sup> | General，multi-lingual capabilities available [using SSML](speech-synthesis-markup.md#create-an-ssml-document) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaochenNeural` <sup>New</sup> | Optimized for spontaneous conversation |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoyanNeural` <sup>New</sup> | Optimized for customer service |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoshuangNeural` <sup>New</sup> | Child voice，optimized for child story and chat; multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles)|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoqiuNeural` <sup>New</sup> | Optimized for narrating |

> [!IMPORTANT]
> Voices in public preview are only available in 3 service regions: East US, West Europe and Southeast Asia.

> [!TIP]
> `en-US-JennyNeuralMultilingual` supports multiple languages. Check the [voices list API](rest-text-to-speech.md#get-a-list-of-voices) for supported languages list.

For more information about regional availability, see [regions](regions.md#prebuilt-neural-voices).

To learn how you can configure and adjust neural voices, such as Speaking Styles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!IMPORTANT]
> The `en-US-JessaNeural` voice has changed to `en-US-AriaNeural`. If you were using "Jessa" before, convert over to "Aria".

> [!TIP]
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)" in your speech synthesis requests.

### Voice styles and roles

In some cases you can adjust the speaking style to express different emotions like cheerfulness, empathy, and calm, or optimize the voice for different scenarios like customer service, newscast, and voice assistant. With roles the same voice can act as a different age and gender. 

To learn how you can configure and adjust neural voice styles and roles see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

Use this table to determine supported styles and roles for each neural voice.

|Voice|Styles|Style degree|Roles|
|-----|-----|-----|-----|
|en-US-AriaNeural|`chat`, `cheerful`, `customerservice`, `empathetic`, `narration-professional`, `newscast-casual`, `newscast-formal`|||
|en-US-GuyNeural|`newscast`|||
|en-US-JennyNeural|`assistant`, `chat`,`customerservice`, `newscast`|||
|en-US-SaraNeural|`angry`, `cheerful`, `sad`|||
|ja-JP-NanamiNeural|`chat`, `cheerful`, `customerservice`|||
|pt-BR-FranciscaNeural|`calm`|||
|zh-CN-XiaohanNeural|`affectionate`, `angry`, `cheerful`, `customerservice`, `disgruntled`, `embarrassed`, `fearful`, `gentle`, `sad`, `serious`|Supported|Supported|
|zh-CN-XiaomoNeural|`angry`, `calm`, `cheerful`, `depressed`, `disgruntled`, `fearful`, `gentle`, `serious`|Supported|Supported|
|zh-CN-XiaoruiNeural|`angry`, `fearful`, `sad`|Supported||
|zh-CN-XiaoshuangNeural|`chat`|Supported||
|zh-CN-XiaoxiaoNeural|`affectionate`, `angry`, `assistant`, `calm`, `chat`, `cheerful`, `customerservice`, `fearful`, `gentle`, `lyrical`, `newscast`, `sad`, `serious`|Supported||
|zh-CN-XiaoxuanNeural|`angry`, `calm`, `cheerful`, `customerservice`, `depressed`, `disgruntled`, `fearful`, `gentle`, `serious`|Supported||
|zh-CN-YunxiNeural|`angry`, `assistant`, `cheerful`, `customerservice`, `depressed`, `disgruntled`, `embarrassed`, `fearful`, `sad`, `serious`|Supported|Supported|
|zh-CN-YunyangNeural|`customerservice`|Supported||
|zh-CN-YunyeNeural|`angry`, `calm`, `cheerful`, `disgruntled`, `fearful`, `sad`, `serious`|Supported|Supported|

### Custom neural voice

Custom neural voice lets you create synthetic voices that are rich in speaking styles. You can create a unique brand voice in multiple languages and styles by using a small set of recording data.  

Select the right locale that matches the training data you have to train a custom neural voice model. For example, if the recording data you have is spoken in English with a British accent, select `en-GB`.

With the cross-lingual feature (preview), you can transfer you custom neural voice model to speak a second language. For example, with the `zh-CN` data, you can create a voice that speaks `en-AU` or any of the languages marked 'yes' in the 'cross-lingual' column below.  

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

With language identification, you set and get one of the supported locales below. But we only compare at the language level such as English and German. If you include multiple locales of the same language (for example, `en-IN` and `en-US`), we'll only compare English (`en`) with the other candidate languages.

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

The [Pronunciation assessment](how-to-pronunciation-assessment.md) feature currently supports the `en-US` locale, which is available with all speech-to-text regions. Support for `en-GB` and `zh-CN` languages is in preview.

## Speech translation

The **Speech Translation** API supports different languages for speech-to-speech and speech-to-text translation. The source language must always be from the Speech-to-text language table. The available target languages depend on whether the translation target is speech or text. You may translate incoming speech into any of the  [supported languages](https://www.microsoft.com/translator/business/languages/). A subset of languages is available for [speech synthesis](language-support.md#text-languages).

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

## Speaker Recognition

Speaker recognition is mostly language agnostic. We built a universal model for text-independent speaker recognition by combining various data sources from multiple languages. We have tuned and evaluated the model on the languages and locales that appear in the following table. See the [overview](speaker-recognition-overview.md) for additional information on Speaker Recognition.

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

## Custom Keyword and Keyword Verification

The following table outlines supported languages for Custom Keyword and Keyword Verification.

| Language | Locale (BCP-47) | Custom Keyword | Keyword Verification |
| -------- | --------------- | -------------- | -------------------- |
| Chinese (Mandarin, Simplified) | zh-CN | Yes | Yes |
| English (United States) | en-US | Yes | Yes |
| Japanese (Japan) | ja-JP | No | Yes |
| Portuguese (Brazil) | pt-BR | No | Yes |

## Next steps

* [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
* [See how to recognize speech in C#](./get-started-speech-to-text.md?pivots=programming-language-chsarp)
