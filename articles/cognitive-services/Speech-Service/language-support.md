---
title: Language support - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech service supports numerous languages for speech-to-text and text-to-speech conversion, along with speech translation. This article provides a comprehensive list of language support by service feature.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/07/2021
ms.author: nitinme
ms.custom: references_regions
---

# Language and voice support for the Speech service

Language support varies by Speech service functionality. The following tables summarize language support for [Speech-to-text](#speech-to-text), [Text-to-speech](#text-to-speech), and [Speech translation](#speech-translation) service offerings.

## Speech-to-text

Both the Microsoft Speech SDK and the REST API support the following languages (locales). 

To improve accuracy, customization is offered for a subset of the languages through uploading **Audio + Human-labeled Transcripts** or **Related Text: Sentences**. Support for customization of the acoustic model with **Audio + Human-labeled Transcripts** is limited to the specific base models listed below. Other base models and languages will only use the text of the transcripts to train custom models just like with **Related Text: Sentences**. To learn more about customization, see [Get started with Custom Speech](./custom-speech-overview.md).

<!--
To get the AM and ML bits:
https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForModels

To get pronunciation bits:
https://cris.ai -> Click on Adaptation Data -> scroll down to section "Pronunciation Datasets" -> Click on Import -> Locale: the list of locales there correspond to the supported locales
-->

| Language                 | Locale (BCP-47) | Customizations  | [Language identification](how-to-automatic-language-detection.md) | [Pronunciation assessment](how-to-pronunciation-assessment.md) |
|------------------------------------|--------|---------------------------------------------------|-------------------------------|--------------------------|
| Arabic (Algeria)                   | `ar-DZ` | Text                                   |                           |                          |
| Arabic (Bahrain), modern standard  | `ar-BH` | Text                                   |                           |                          |
| Arabic (Egypt)                     | `ar-EG` | Text                                   | Yes                          |                          |
| Arabic (Iraq)                      | `ar-IQ` | Text                                   |                           |                          |
| Arabic (Israel)                    | `ar-IL` | Text                                   |                           |                          |
| Arabic (Jordan)                    | `ar-JO` | Text                                   |                           |                          |
| Arabic (Kuwait)                    | `ar-KW` | Text                                   |                           |                          |
| Arabic (Lebanon)                   | `ar-LB` | Text                                   |                           |                          |
| Arabic (Libya)                     | `ar-LY` | Text                                   |                           |                          |
| Arabic (Morocco)                   | `ar-MA` | Text                                   |                           |                          |
| Arabic (Oman)                      | `ar-OM` | Text                                   |                           |                          |
| Arabic (Qatar)                     | `ar-QA` | Text                                   |                           |                          |
| Arabic (Saudi Arabia)              | `ar-SA` | Text                                   |                           |                          |
| Arabic (Palestinian Authority)     | `ar-PS` | Text                                   |                           |                          |
| Arabic (Syria)                     | `ar-SY` | Text                                   |                           |                          |
| Arabic (Tunisia)                   | `ar-TN` | Text                                   |                           |                          |
| Arabic (United Arab Emirates)      | `ar-AE` | Text                                   |                           |                          |
| Arabic (Yemen)                     | `ar-YE` | Text                                   |                           |                          |
| Bulgarian (Bulgaria)               | `bg-BG` | Text                                   |                           |                          |
| Catalan (Spain)                    | `ca-ES` | Text                                   | Yes                          |                          |
| Chinese (Cantonese, Traditional)   | `zh-HK` | Audio (20201015)<br>Text                 |        Yes                   |                          |
| Chinese (Mandarin, Simplified)     | `zh-CN` | Audio (20200910)<br>Text                 |     Yes                      | Yes                         |
| Chinese (Taiwanese Mandarin)       | `zh-TW` | Audio (20190701, 20201015)<br>Text                 |           Yes                |                          |
| Croatian (Croatia)                 | `hr-HR` | Text                                   |                           |                          |
| Czech (Czech Republic)             | `cs-CZ` | Text                                   |                           |                          |
| Danish (Denmark)                   | `da-DK` | Text                                   | Yes                          |                          |
| Dutch (Netherlands)                | `nl-NL` | Audio (20201015)<br>Text<br>Pronunciation|    Yes                       |                          |
| English (Australia)                | `en-AU` | Audio (20201019)<br>Text                 | Yes                          |                          |
| English (Canada)                   | `en-CA` | Audio (20201019)<br>Text                 | Yes                          |                          |
| English (Ghana)                    | `en-GH` | Text                                   |                           |                          |
| English (Hong Kong)                | `en-HK` | Text                                   |                           |                          |
| English (India)                    | `en-IN` | Audio (20200923)<br>Text                 |                          |                          |
| English (Ireland)                  | `en-IE` | Text                                   |                           |                          |
| English (Kenya)                    | `en-KE` | Text                                   |                           |                          |
| English (New Zealand)              | `en-NZ` | Audio (20201019)<br>Text                 |                          |                          |
| English (Nigeria)                  | `en-NG` | Text                                   |                           |                          |
| English (Philippines)              | `en-PH` | Text                                   |                           |                          |
| English (Singapore)                | `en-SG` | Text                                   |                           |                          |
| English (South Africa)             | `en-ZA` | Text                                   |                           |                          |
| English (Tanzania)                 | `en-TZ` | Text                                   |                           |                          |
| English (United Kingdom)           | `en-GB` | Audio (20201019)<br>Text<br>Pronunciation| Yes                          | Yes                         |
| English (United States)            | `en-US` | Audio (20201019, 20210223)<br>Text<br>Pronunciation| Yes                          | Yes                         |
| Estonian(Estonia)                  | `et-EE` | Text                                   |                           |                          |
| Filipino (Philippines)             | `fil-PH`| Text                                   |                           |                          |
| Finnish (Finland)                  | `fi-FI` | Text                                   |     Yes                      |                          |
| French (Canada)                    | `fr-CA` | Audio (20201015)<br>Text<br>Pronunciation|     Yes                      |                          |
| French (France)                    | `fr-FR` | Audio (20201015)<br>Text<br>Pronunciation|      Yes                     |                          |
| French (Switzerland)               | `fr-CH` | Text<br>Pronunciation                  |                           |                          |
| German (Austria)                   | `de-AT` | Text<br>Pronunciation                  |                           |                          |
| German (Germany)                   | `de-DE` | Audio (20190701, 20200619, 20201127)<br>Text<br>Pronunciation|  Yes                         |                          |
| Greek (Greece)                     | `el-GR` | Text                                   |  Yes                         |                          |
| Gujarati (Indian)                  | `gu-IN` | Text                                   |                           |                          |
| Hebrew (Israel)                    | `he-IL` | Text                                   |                           |                          |
| Hindi (India)                      | `hi-IN` | Audio (20200701)<br>Text                 |     Yes                      |                          |
| Hungarian (Hungary)                | `hu-HU` | Text                                   |                           |                          |
| Indonesian (Indonesia)             | `id-ID` | Text                                   |                           |                          |
| Irish(Ireland)                     | `ga-IE` | Text                                   |                           |                          |
| Italian (Italy)                    | `it-IT` | Audio (20201016)<br>Text<br>Pronunciation|      Yes                     |                          |
| Japanese (Japan)                   | `ja-JP` | Text                                   |      Yes                     |                          |
| Korean (Korea)                     | `ko-KR` | Audio (20201015)<br>Text                 |      Yes                     |                          |
| Latvian (Latvia)                   | `lv-LV` | Text                                   |                           |                          |
| Lithuanian (Lithuania)             | `lt-LT` | Text                                   |                           |                          |
| Malay (Malaysia)                   | `ms-MY` | Text                                   |                           |                          |
| Maltese (Malta)                    | `mt-MT` | Text                                   |                           |                          |
| Marathi (India)                    | `mr-IN` | Text                                   |                           |                          |
| Norwegian (Bokmål, Norway)         | `nb-NO` | Text                                   |     Yes                      |                          |
| Polish (Poland)                    | `pl-PL` | Text                                   |       Yes                    |                          |
| Portuguese (Brazil)                | `pt-BR` | Audio (20190620, 20201015)<br>Text<br>Pronunciation|          Yes                 |                          |
| Portuguese (Portugal)              | `pt-PT` | Text<br>Pronunciation                  |             Yes              |                          |
| Romanian (Romania)                 | `ro-RO` | Text                                   |  Yes                         |                          |
| Russian (Russia)                   | `ru-RU` | Audio (20200907)<br>Text                 |                Yes           |                          |
| Slovak (Slovakia)                  | `sk-SK` | Text                                   |                           |                          |
| Slovenian (Slovenia)               | `sl-SI` | Text                                   |                           |                          |
| Spanish (Argentina)                | `es-AR` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Bolivia)                  | `es-BO` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Chile)                    | `es-CL` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Colombia)                 | `es-CO` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Costa Rica)               | `es-CR` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Cuba)                     | `es-CU` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Dominican Republic)       | `es-DO` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Ecuador)                  | `es-EC` | Text<br>Pronunciation                  |                           |                          |
| Spanish (El Salvador)              | `es-SV` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Equatorial Guinea)        | `es-GQ` | Text                                   |                           |                          |
| Spanish (Guatemala)                | `es-GT` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Honduras)                 | `es-HN` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Mexico)                   | `es-MX` | Audio (20200907)<br>Text<br>Pronunciation|    Yes                       |                          |
| Spanish (Nicaragua)                | `es-NI` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Panama)                   | `es-PA` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Paraguay)                 | `es-PY` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Peru)                     | `es-PE` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Puerto Rico)              | `es-PR` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Spain)                    | `es-ES` | Audio (20201015)<br>Text<br>Pronunciation|  Yes                         |                          |
| Spanish (Uruguay)                  | `es-UY` | Text<br>Pronunciation                  |                           |                          |
| Spanish (USA)                      | `es-US` | Text<br>Pronunciation                  |                           |                          |
| Spanish (Venezuela)                | `es-VE` | Text<br>Pronunciation                  |                           |                          |
| Swedish (Sweden)                   | `sv-SE` | Text                                   |   Yes                        |                          |
| Tamil (India)                      | `ta-IN` | Text                                   |                           |                          |
| Telugu (India)                     | `te-IN` | Text                                   |                           |                          |
| Thai (Thailand)                    | `th-TH` | Text                                   |      Yes                     |                          |
| Turkish (Turkey)                   | `tr-TR` | Text                                   |                           |                          |
| Vietnamese (Vietnam)               | `vi-VN` | Text                                   |                           |                          |

## Text-to-speech

Both the Microsoft Speech SDK and REST APIs support these voices, each of which supports a specific language and dialect, identified by locale. You can also get a full list of languages and voices supported for each specific region/endpoint through the [voices list API](rest-text-to-speech.md#get-a-list-of-voices). 

> [!IMPORTANT]
> Pricing varies for standard, custom and neural voices. Please visit the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page for additional information.

### Neural voices

Neural text-to-speech is a new type of speech synthesis powered by deep neural networks. When using a neural voice, synthesized speech is nearly indistinguishable from the human recordings.

Neural voices can be used to make interactions with chatbots and voice assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when users interact with AI systems.

> [!NOTE]
> Neural voices are created from samples that use a 24 khz sample rate.
> All voices can upsample or downsample to other sample rates when synthesizing.


| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| Arabic (Egypt) | `ar-EG` | Female | `ar-EG-SalmaNeural` | General |
| Arabic (Egypt) | `ar-EG` | Male | `ar-EG-ShakirNeural` | General |
| Arabic (Saudi Arabia) | `ar-SA` | Female | `ar-SA-ZariyahNeural` | General |
| Arabic (Saudi Arabia) | `ar-SA` | Male | `ar-SA-HamedNeural` | General |
| Bulgarian (Bulgaria) | `bg-BG` | Female | `bg-BG-KalinaNeural` | General |
| Bulgarian (Bulgaria) | `bg-BG` | Male | `bg-BG-BorislavNeural` | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-AlbaNeural` | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-JoanaNeural` | General |
| Catalan (Spain) | `ca-ES` | Male | `ca-ES-EnricNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuGaaiNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuMaanNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Male | `zh-HK-WanLungNeural` | General |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxiaoNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoyouNeural` | Child voice, optimized for story narrating |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaomoNeural` | General, multiple role-play and styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxuanNeural` | General, multiple role-play and styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaohanNeural` | General, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoruiNeural` | Senior voice, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunyangNeural` | Optimized for news reading,<br /> multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunyeNeural` | Optimized for story narrating |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male   | `zh-CN-YunxiNeural` | General, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
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
| English (Hongkong) | `en-HK` | Female | `en-HK-YanNeural` <sup>New</sup> | General |
| English (Hongkong) | `en-HK` | Male | `en-HK-SamNeural` <sup>New</sup> | General |
| English (India) | `en-IN` | Female | `en-IN-NeerjaNeural` | General |
| English (India) | `en-IN` | Male | `en-IN-PrabhatNeural` | General |
| English (Ireland) | `en-IE` | Female | `en-IE-EmilyNeural` | General |
| English (Ireland) | `en-IE` | Male | `en-IE-ConnorNeural` | General |
| English (New Zealand) | `en-NZ` | Female | `en-NZ-MollyNeural` <sup>New</sup> | General |
| English (New Zealand) | `en-NZ` | Male | `en-NZ-MitchellNeural` <sup>New</sup> | General |
| English (Philippines) | `en-PH` | Female | `en-PH-RosaNeural` | General | 
| English (Philippines) | `en-PH` | Male | `en-PH-JamesNeural` | General | 
| English (Singapore) | `en-SG` | Female | `en-SG-LunaNeural` <sup>New</sup> | General |
| English (Singapore) | `en-SG` | Male | `en-SG-WayneNeural` <sup>New</sup> | General |
| English (South Africa) | `en-ZA` | Female | `en-ZA-LeahNeural` <sup>New</sup> | General |
| English (South Africa) | `en-ZA` | Male | `en-ZA-LukeNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-LibbyNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-MiaNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-RyanNeural` | General |
| English (United States) | `en-US` | Female | `en-US-AriaNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Female | `en-US-JennyNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Male | `en-US-GuyNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| English (United States) | `en-US` | Female | `en-US-AmberNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Female | `en-US-AshleyNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Female | `en-US-CoraNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Female | `en-US-ElizabethNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Female | `en-US-MichelleNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Female | `en-US-MonicaNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Kid | `en-US-AnaNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Male | `en-US-BrandonNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Male | `en-US-ChristopherNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Male | `en-US-JacobNeural` <sup>New</sup> | General |
| English (United States) | `en-US` | Male | `en-US-EricNeural` <sup>New</sup> | General |
| Estonian (Estonia) | `et-EE` | Female | `et-EE-AnuNeural` | General |
| Estonian (Estonia) | `et-EE` | Male | `et-EE-KertNeural` | General |
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
| German (Austria) | `de-AT` | Female | `de-AT-IngridNeural` | General |
| German (Austria) | `de-AT` | Male | `de-AT-JonasNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-KatjaNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-ConradNeural` | General |
| German (Switzerland) | `de-CH` | Female | `de-CH-LeniNeural` | General |
| German (Switzerland) | `de-CH` | Male | `de-CH-JanNeural` | General |
| Greek (Greece) | `el-GR` | Female | `el-GR-AthinaNeural` | General |
| Greek (Greece) | `el-GR` | Male | `el-GR-NestorasNeural` | General |
| Gujarati (India) | `gu-IN` | Female | `gu-IN-DhwaniNeural` <sup>New</sup> | General |
| Gujarati (India) | `gu-IN` | Male | `gu-IN-NiranjanNeural` <sup>New</sup> | General |
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
| Marathi (India) | `mr-IN` | Female | `mr-IN-AarohiNeural` <sup>New</sup> | General |
| Marathi (India) | `mr-IN` | Male | `mr-IN-ManoharNeural` <sup>New</sup> | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-IselinNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-PernilleNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Male | `nb-NO-FinnNeural` | General |
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
| Spanish (Argentina) | `es-AR` | Female | `es-AR-ElenaNeural` <sup>New</sup> | General |
| Spanish (Argentina) | `es-AR` | Male | `es-AR-TomasNeural` <sup>New</sup> | General |
| Spanish (Colombia) | `es-CO` | Female | `es-CO-SalomeNeural` <sup>New</sup> | General |
| Spanish (Colombia) | `es-CO` | Male | `es-CO-GonzaloNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-DaliaNeural` | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-JorgeNeural` | General |
| Spanish (Spain) | `es-ES` | Female | `es-ES-ElviraNeural` | General |
| Spanish (Spain) | `es-ES` | Male | `es-ES-AlvaroNeural` | General |
| Spanish (US) | `es-US` | Female | `es-US-PalomaNeural` <sup>New</sup> | General |
| Spanish (US) | `es-US` | Male | `es-US-AlonsoNeural` <sup>New</sup> | General |
| Swahili (Kenya) | `sw-KE` | Female | `sw-KE-ZuriNeural` <sup>New</sup> | General |
| Swahili (Kenya) | `sw-KE` | Male | `sw-KE-RafikiNeural` <sup>New</sup> | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-HilleviNeural` | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-SofieNeural` | General |
| Swedish (Sweden) | `sv-SE` | Male | `sv-SE-MattiasNeural` | General |
| Tamil (India) | `ta-IN` | Female | `ta-IN-PallaviNeural` | General |
| Tamil (India) | `ta-IN` | Male | `ta-IN-ValluvarNeural` | General |
| Telugu (India) | `te-IN` | Female | `te-IN-ShrutiNeural` | General |
| Telugu (India) | `te-IN` | Male | `te-IN-MohanNeural` | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-AcharaNeural` | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-PremwadeeNeural` | General |
| Thai (Thailand) | `th-TH` | Male | `th-TH-NiwatNeural` | General |
| Turkish (Turkey) | `tr-TR` | Female | `tr-TR-EmelNeural` | General |
| Turkish (Turkey) | `tr-TR` | Male | `tr-TR-AhmetNeural` | General |
| Ukrainian (Ukraine) | `uk-UA` | Female | `uk-UA-PolinaNeural` | General | 
| Ukrainian (Ukraine) | `uk-UA` | Male | `uk-UA-OstapNeural` | General | 
| Urdu (Pakistan) | `ur-PK` | Female | `ur-PK-UzmaNeural`  | General | 
| Urdu (Pakistan) | `ur-PK` | Male | `ur-PK-AsadNeural` | General | 
| Vietnamese (Vietnam) | `vi-VN` | Female | `vi-VN-HoaiMyNeural` | General |
| Vietnamese (Vietnam) | `vi-VN` | Male | `vi-VN-NamMinhNeural` | General |
| Welsh (United Kingdom) | `cy-GB` | Female | `cy-GB-NiaNeural` | General | 
| Welsh (United Kingdom) | `cy-GB` | Male | `cy-GB-AledNeural` | General | 

#### Neural voices in preview

Below neural voices are in public preview. 

| Language                         | Locale  | Gender | Voice name                             | Style support |
|----------------------------------|---------|--------|----------------------------------------|---------------|
| English (United States) | `en-US` | Female | `en-US-JennyMultilingualNeural` <sup>New</sup> | General，multi-lingual capabilities available [using SSML](speech-synthesis-markup.md#create-an-ssml-document) |

> [!IMPORTANT]
> Voices in public preview are only available in 3 service regions: East US, West Europe and Southeast Asia.

> [!TIP]
> `en-US-JennyNeuralMultilingual` supports multiple languages. Check the [voices list API](rest-text-to-speech.md#get-a-list-of-voices) for supported languages list.

For more information about regional availability, see [regions](regions.md#neural-and-standard-voices).

To learn how you can configure and adjust neural voices, such as Speaking Styles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!IMPORTANT]
> The `en-US-JessaNeural` voice has changed to `en-US-AriaNeural`. If you were using "Jessa" before, convert over to "Aria".

> [!TIP]
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)" in your speech synthesis requests.

### Standard voices

More than 75 standard voices are available in over 45 languages and locales, which allow you to convert text into synthesized speech. For more information about regional availability, see [regions](regions.md#neural-and-standard-voices).

> [!NOTE]
> With two exceptions, standard voices are created from samples that use a 16 khz sample rate.
> **The en-US-AriaRUS** and **en-US-GuyRUS** voices are also created from samples that use a 24 khz sample rate.
> All voices can upsample or downsample to other sample rates when synthesizing.

| Language | Locale (BCP-47) | Gender | Voice name |
|--|--|--|--|
| Arabic (Arabic ) | `ar-EG` | Female | `ar-EG-Hoda`|
| Arabic (Saudi Arabia) | `ar-SA` | Male | `ar-SA-Naayf`|
| Bulgarian (Bulgaria) | `bg-BG` | Male | `bg-BG-Ivan`|
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-HerenaRUS`|
| Chinese (Cantonese, Traditional) | `zh-HK` | Male | `zh-HK-Danny`|
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-TracyRUS`|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-HuihuiRUS`|
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-Kangkang`|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-Yaoyao`|
| Chinese (Taiwanese Mandarin) |  `zh-TW` | Female | `zh-TW-HanHanRUS`|
| Chinese (Taiwanese Mandarin) |  `zh-TW` | Female | `zh-TW-Yating`|
| Chinese (Taiwanese Mandarin) |  `zh-TW` | Male | `zh-TW-Zhiwei`|
| Croatian (Croatia) | `hr-HR` | Male | `hr-HR-Matej`|
| Czech (Czech Republic) | `cs-CZ` | Male | `cs-CZ-Jakub`|
| Danish (Denmark) | `da-DK` | Female | `da-DK-HelleRUS`|
| Dutch (Netherlands) | `nl-NL` | Female | `nl-NL-HannaRUS`|
| English (Australia) | `en-AU` | Female | `en-AU-Catherine`|
| English (Australia) | `en-AU` | Female | `en-AU-HayleyRUS`|
| English (Canada) | `en-CA` | Female | `en-CA-HeatherRUS`|
| English (Canada) | `en-CA` | Female | `en-CA-Linda`|
| English (India) | `en-IN` | Female | `en-IN-Heera`|
| English (India) | `en-IN` | Female | `en-IN-PriyaRUS`|
| English (India) | `en-IN` | Male | `en-IN-Ravi`|
| English (Ireland) | `en-IE` | Male | `en-IE-Sean`|
| English (United Kingdom) | `en-GB` | Male | `en-GB-George`|
| English (United Kingdom) | `en-GB` | Female | `en-GB-HazelRUS`|
| English (United Kingdom) | `en-GB` | Female | `en-GB-Susan`|
| English (United States) | `en-US` | Male | `en-US-BenjaminRUS`|
| English (United States) | `en-US` | Male | `en-US-GuyRUS`|
| English (United States) | `en-US` | Female | `en-US-AriaRUS`|
| English (United States) | `en-US` | Female | `en-US-ZiraRUS`|
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-HeidiRUS`|
| French (Canada) | `fr-CA` | Female | `fr-CA-Caroline`|
| French (Canada) | `fr-CA` | Female | `fr-CA-HarmonieRUS`|
| French (France) | `fr-FR` | Female | `fr-FR-HortenseRUS`|
| French (France) | `fr-FR` | Female | `fr-FR-Julie`|
| French (France) | `fr-FR` | Male | `fr-FR-Paul`|
| French (Switzerland) | `fr-CH` | Male | `fr-CH-Guillaume`|
| German (Austria) | `de-AT` | Male | `de-AT-Michael`|
| German (Germany) | `de-DE` | Female | `de-DE-HeddaRUS`|
| German (Germany) | `de-DE` | Male | `de-DE-Stefan`|
| German (Switzerland) | `de-CH` | Male | `de-CH-Karsten`|
| Greek (Greece) | `el-GR` | Male | `el-GR-Stefanos`|
| Hebrew (Israel) | `he-IL` | Male | `he-IL-Asaf`|
| Hindi (India) | `hi-IN` | Male | `hi-IN-Hemant`|
| Hindi (India) | `hi-IN` | Female | `hi-IN-Kalpana`|
| Hungarian (Hungary) | `hu-HU` | Male | `hu-HU-Szabolcs`|
| Indonesian (Indonesia) | `id-ID` | Male | `id-ID-Andika`|
| Italian (Italy) | `it-IT` | Male | `it-IT-Cosimo`|
| Italian (Italy) | `it-IT` | Female | `it-IT-LuciaRUS`|
| Japanese (Japan) | `ja-JP` | Female | `ja-JP-Ayumi`|
| Japanese (Japan) | `ja-JP` | Female | `ja-JP-HarukaRUS`|
| Japanese (Japan) | `ja-JP` | Male | `ja-JP-Ichiro`|
| Korean (Korea) | `ko-KR` | Female | `ko-KR-HeamiRUS`|
| Malay (Malaysia) | `ms-MY` | Male | `ms-MY-Rizwan`|
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-HuldaRUS`|
| Polish (Poland) | `pl-PL` | Female | `pl-PL-PaulinaRUS`|
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-Daniel`|
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-HeloisaRUS`|
| Portuguese (Portugal) | `pt-PT` | Female | `pt-PT-HeliaRUS`|
| Romanian (Romania) | `ro-RO` | Male | `ro-RO-Andrei`|
| Russian (Russia) | `ru-RU` | Female | `ru-RU-EkaterinaRUS`|
| Russian (Russia) | `ru-RU` | Female | `ru-RU-Irina`|
| Russian (Russia) | `ru-RU` | Male | `ru-RU-Pavel`|
| Slovak (Slovakia) | `sk-SK` | Male | `sk-SK-Filip`|
| Slovenian (Slovenia) | `sl-SI` | Male | `sl-SI-Lado`|
| Spanish (Mexico) | `es-MX` | Female | `es-MX-HildaRUS`|
| Spanish (Mexico) | `es-MX` | Male | `es-MX-Raul`|
| Spanish (Spain) | `es-ES` | Female | `es-ES-HelenaRUS`|
| Spanish (Spain) | `es-ES` | Female | `es-ES-Laura`|
| Spanish (Spain) | `es-ES` | Male | `es-ES-Pablo`|
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-HedvigRUS`|
| Tamil (India) | `ta-IN` | Male | `ta-IN-Valluvar`|
| Telugu (India) | `te-IN` | Female | `te-IN-Chitra`|
| Thai (Thailand) | `th-TH` | Male | `th-TH-Pattara`|
| Turkish (Turkey) | `tr-TR` | Female | `tr-TR-SedaRUS`|
| Vietnamese (Vietnam) | `vi-VN` | Male | `vi-VN-An` |

> [!IMPORTANT]
> The `en-US-Jessa` voice has changed to `en-US-Aria`. If you were using "Jessa" before, convert over to "Aria".

> [!TIP]
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaRUS)" in your speech synthesis requests.

### Customization

Custom Voice is available in the neural tier (a.k.a, Custom Neural Voice). Based on the Neural TTS technology and the multi-lingual multi-speaker universal model, Custom Neural Voice lets you create synthetic voices that are rich in speaking styles, or adaptable cross languages. Check below for the languages supported.  

> [!IMPORTANT]
> The standard tier including the statistical parametric and the concatenative training methods of custom voice is being deprecated and will be retired on 2/29/2024. If you are using non-neural/standard Custom Voice, migrate to Custom Neural Voice immediately to enjoy the better quality and deploy the voices responsibly. 

| Language | Locale | Neural | Cross-lingual |
|--|--|--|--|
| Bulgarian (Bulgaria)| `bg-BG` | Yes | No |
| Chinese (Mandarin, Simplified) | `zh-CN` | Yes | Yes |
| Chinese (Mandarin, Simplified), English bilingual | `zh-CN` bilingual | Yes | Yes |
| Dutch (Netherlands)	| `nl-NL` | Yes | No |
| English (Australia) | `en-AU` | Yes | Yes |
| English (India) | `en-IN` | Yes | No |
| English (United Kingdom) | `en-GB` | Yes | Yes |
| English (United States) | `en-US` | Yes | Yes |
| French (Canada) | `fr-CA` | Yes | Yes |
| French (France) | `fr-FR` | Yes | Yes |
| German (Germany) | `de-DE` | Yes | Yes |
| Italian (Italy) | `it-IT` | Yes | Yes |
| Japanese (Japan) | `ja-JP` | Yes | Yes |
| Korean (Korea) | `ko-KR` | Yes | Yes |
| Norwegian (Bokmål, Norway) | `nb-NO` | Yes | No |
| Portuguese (Brazil) | `pt-BR` | Yes | Yes |
| Russian (Russia) | `ru-RU` | Yes | Yes |
| Spanish (Mexico) | `es-MX` | Yes | Yes |
| Spanish (Spain) | `es-ES` | Yes | Yes |

Select the right locale that matches the training data you have to train a custom voice model. For example, if the recording data you have is spoken in English with a British accent, select `en-GB`.

> [!NOTE]
> We do not support bi-lingual model training in Custom Voice, except for the Chinese-English bi-lingual. Select "Chinese-English bilingual" if you want to train a Chinese voice that can speak English as well. Chinese-English bilingual model training using the standard method is available in North Europe and North Central US only. Custom Neural Voice training is available in UK South and East US.

## Speech translation

The **Speech Translation** API supports different languages for speech-to-speech and speech-to-text translation. The source language must always be from the Speech-to-text language table. The available target languages depend on whether the translation target is speech or text. You may translate incoming speech into more than [60 languages](https://www.microsoft.com/translator/business/languages/). A subset of languages are available for [speech synthesis](language-support.md#text-languages).

### Text languages

| Text language           | Language code |
|:------------------------|:-------------:|
| Afrikaans               | `af`          |
| Arabic                  | `ar`          |
| Bangla                  | `bn`          |
| Bosnian (Latin)         | `bs`          |
| Bulgarian               | `bg`          |
| Cantonese (Traditional) | `yue`         |
| Catalan                 | `ca`          |
| Chinese Simplified      | `zh-Hans`     |
| Chinese Traditional     | `zh-Hant`     |
| Croatian                | `hr`          |
| Czech                   | `cs`          |
| Danish                  | `da`          |
| Dutch                   | `nl`          |
| English                 | `en`          |
| Estonian                | `et`          |
| Fijian                  | `fj`          |
| Filipino                | `fil`         |
| Finnish                 | `fi`          |
| French                  | `fr`          |
| German                  | `de`          |
| Greek                   | `el`          |
| Gujarati                | `gu`          |
| Haitian Creole          | `ht`          |
| Hebrew                  | `he`          |
| Hindi                   | `hi`          |
| Hmong Daw               | `mww`         |
| Hungarian               | `hu`          |
| Indonesian              | `id`          |
| Irish                   | `ga`          |
| Italian                 | `it`          |
| Japanese                | `ja`          |
| Kannada                 | `kn`          |
| Kiswahili               | `sw`          |
| Klingon                 | `tlh-Latn`    |
| Klingon (plqaD)         | `tlh-Piqd`    |
| Korean                  | `ko`          |
| Latvian                 | `lv`          |
| Lithuanian              | `lt`          |
| Malagasy                | `mg`          |
| Malay                   | `ms`          |
| Malayalam               | `ml`          |
| Maltese                 | `mt`          |
| Maori                   | `mi`          |
| Marathi                 | `mr`          |
| Norwegian               | `nb`          |
| Persian                 | `fa`          |
| Polish                  | `pl`          |
| Portuguese (Brazil)     | `pt-br`       |
| Portuguese (Portugal)   | `pt-pt`       |
| Punjabi                 | `pa`          |
| Queretaro Otomi         | `otq`         |
| Romanian                | `ro`          |
| Russian                 | `ru`          |
| Samoan                  | `sm`          |
| Serbian (Cyrillic)      | `sr-Cyrl`     |
| Serbian (Latin)         | `sr-Latn`     |
| Slovak                  | `sk`          |
| Slovenian               | `sl`          |
| Spanish                 | `es`          |
| Swedish                 | `sv`          |
| Tahitian                | `ty`          |
| Tamil                   | `ta`          |
| Telugu                  | `te`          |
| Thai                    | `th`          |
| Tongan                  | `to`          |
| Turkish                 | `tr`          |
| Ukrainian               | `uk`          |
| Urdu                    | `ur`          |
| Vietnamese              | `vi`          |
| Welsh                   | `cy`          |
| Yucatec Maya            | `yua`         |

## Speaker Recognition

See the following table for supported languages for the various Speaker Recognition APIs. See the [overview](speaker-recognition-overview.md) for additional information on Speaker Recognition.

| Language | Locale (BCP-47) | Text-dependent verification | Text-independent verification | Text-independent identification |
|----|----|----|----|----|
|English (US)  |  en-US  |  yes  |  yes  |  yes |
|Chinese (Mandarin, simplified) | zh-CN     |     n/a |     yes |     yes|
|English (Australia)     | en-AU     | n/a     | yes     | yes|
|English (Canada)     | en-CA     | n/a |     yes |     yes|
|English (UK)     | en-GB     | n/a     | yes     | yes|
|French (Canada)     | fr-CA     | n/a     | yes |     yes|
|French (France)     | fr-FR     | n/a     | yes     | yes|
|German (Germany)     | de-DE     | n/a     | yes     | yes|
|Italian | it-IT     |     n/a     | yes |     yes|
|Japanese     | ja-JP | n/a     | yes     | yes|
|Portuguese (Brazil) | pt-BR |     n/a |     yes |     yes|
|Spanish (Mexico)     | es-MX     | n/a |     yes |     yes|
|Spanish (Spain)     | es-ES | n/a     | yes |     yes|

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
