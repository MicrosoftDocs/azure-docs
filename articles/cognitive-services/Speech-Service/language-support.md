---
title: Language support - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech service supports numerous languages for speech-to-text and text-to-speech conversion, along with speech translation. This article provides a comprehensive list of language support by service feature.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/26/2020
ms.author: trbye
ms.custom: references_regions
---

# Language and voice support for the Speech service

Language support varies by Speech service functionality. The following tables summarize language support for [Speech-to-text](#speech-to-text), [Text-to-speech](#text-to-speech), and [Speech translation](#speech-translation) service offerings.

## Speech-to-text

Both the Microsoft Speech SDK and the REST API support the following languages (locales). 

To improve accuracy, customization is offered for a subset of the languages through uploading **Audio + Human-labeled Transcripts** or **Related Text: Sentences**. To learn more about customization, see [Get started with Custom Speech](./custom-speech-overview.md).

<!--
To get the AM and ML bits:
https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForModels

To get pronunciation bits:
https://cris.ai -> Click on Adaptation Data -> scroll down to section "Pronunciation Datasets" -> Click on Import -> Locale: the list of locales there correspond to the supported locales
-->

| Language                          | Locale (BCP-47) | Customizations                                   |
|-----------------------------------|--------|--------------------------------------------------|
|Arabic (Bahrain), modern standard  |`ar-BH` | Language model                                   |
|Arabic (Egypt)                     |`ar-EG` | Language model                                   |
|Arabic (Iraq)                      |`ar-IQ` | Language model                                   |
|Arabic (Israel)					          |`ar-IL` | Language model									                  |
|Arabic (Jordan)                    |`ar-JO` | Language model                                   |
|Arabic (Kuwait)                    |`ar-KW` | Language model                                   |
|Arabic (Lebanon)                   |`ar-LB` | Language model                                   |
|Arabic (Oman)                      |`ar-OM` | Language model                                   |
|Arabic (Qatar)                     |`ar-QA` | Language model                                   |
|Arabic (Saudi Arabia)              |`ar-SA` | Language model                                   |
|Arabic (State of Palestine)		    |`ar-PS` | Language model                                   |
|Arabic (Syria)                     |`ar-SY` | Language model                                   |
|Arabic (United Arab Emirates)      |`ar-AE` | Language model                                   |
|Bulgarian (Bulgaria)               |`bg-BG` | Language model                                   |
|Catalan (Spain)                    |`ca-ES` | Language model                                   |
|Chinese (Cantonese, Traditional)   |`zh-HK` | Language model                                   |
|Chinese (Mandarin, Simplified)     |`zh-CN` | Acoustic model<br>Language model                 |
|Chinese (Taiwanese Mandarin)       |`zh-TW` | Language model                                   |
|Croatian (Croatia)                 |`hr-HR` | Language model                                   |
|Czech (Czech Republic)             |`cs-CZ` | Language Model                                   |
|Danish (Denmark)                   |`da-DK` | Language model                                   |
|Dutch (Netherlands)                |`nl-NL` | Language model                                   |
|English (Australia)                |`en-AU` | Acoustic model<br>Language model                 |
|English (Canada)                   |`en-CA` | Acoustic model<br>Language model                 |
|English (Hong Kong)                |`en-HK` | Language Model                                   |
|English (India)                    |`en-IN` | Acoustic model<br>Language model                 |
|English (Ireland)                  |`en-IE` | Language Model                                   |
|English (New Zealand)              |`en-NZ` | Acoustic model<br>Language model                 |
|English (Nigeria)					        |`en-NG` | Language Model									                  |
|English (Philippines)              |`en-PH` | Language Model                                   |
|English (Singapore)                |`en-SG` | Language Model                                   |
|English (South Africa)             |`en-ZA` | Language Model                                   |
|English (United Kingdom)           |`en-GB` | Acoustic model<br>Language model<br>Pronunciation|
|English (United States)            |`en-US` | Acoustic model<br>Language model<br>Pronunciation|
|Estonian(Estonia)                  |`et-EE` | Language Model                                   |
|Finnish (Finland)                  |`fi-FI` | Language model                                   |
|French (Canada)                    |`fr-CA` | Acoustic model<br>Language model                 |
|French (France)                    |`fr-FR` | Acoustic model<br>Language model<br>Pronunciation|
|German (Germany)                   |`de-DE` | Acoustic model<br>Language model<br>Pronunciation|
|Greek (Greece)                     |`el-GR` | Language model                                   |
|Gujarati (Indian)                  |`gu-IN` | Language model                                   |
|Hindi (India)                      |`hi-IN` | Acoustic model<br>Language model                 |
|Hungarian (Hungary)                |`hu-HU` | Language Model                                   |
|Irish(Ireland)                     |`ga-IE` | Language model                                   |
|Italian (Italy)                    |`it-IT` | Acoustic model<br>Language model<br>Pronunciation|
|Japanese (Japan)                   |`ja-JP` | Language model                                   |
|Korean (Korea)                     |`ko-KR` | Language model                                   |
|Latvian (Latvia)                   |`lv-LV` | Language model                                   |
|Lithuanian (Lithuania)             |`lt-LT` | Language model                                   |
|Maltese(Malta)                     |`mt-MT` | Language model                                   |
|Marathi (India)                    |`mr-IN` | Language model                                   |
|Norwegian (Bokmål, Norway)         |`nb-NO` | Language model                                   |
|Polish (Poland)                    |`pl-PL` | Language model                                   |
|Portuguese (Brazil)                |`pt-BR` | Acoustic model<br>Language model<br>Pronunciation|
|Portuguese (Portugal)              |`pt-PT` | Language model                                   |
|Romanian (Romania)                 |`ro-RO` | Language model                                   |
|Russian (Russia)                   |`ru-RU` | Acoustic model<br>Language model                 |
|Slovak (Slovakia)                  |`sk-SK` | Language model                                   |
|Slovenian (Slovenia)               |`sl-SI` | Language model                                   |
|Spanish (Argentina)                |`es-AR` | Language Model                                   |
|Spanish (Bolivia)                  |`es-BO` | Language Model                                   |
|Spanish (Chile)                    |`es-CL` | Language Model                                   |
|Spanish (Colombia)                 |`es-CO` | Language Model                                   |
|Spanish (Costa Rica)               |`es-CR` | Language Model                                   |
|Spanish (Cuba)                     |`es-CU` | Language Model                                   |
|Spanish (Dominican Republic)       |`es-DO` | Language Model                                   |
|Spanish (Ecuador)                  |`es-EC` | Language Model                                   |
|Spanish (El Salvador)              |`es-SV` | Language Model                                   |
|Spanish (Equatorial Guinea)		    |`es-GQ` | Language Model                                   |
|Spanish (Guatemala)                |`es-GT` | Language Model                                   |
|Spanish (Honduras)                 |`es-HN` | Language Model                                   |
|Spanish (Mexico)                   |`es-MX` | Acoustic model<br>Language model                 |
|Spanish (Nicaragua)                |`es-NI` | Language Model                                   |
|Spanish (Panama)                   |`es-PA` | Language Model                                   |
|Spanish (Paraguay)                 |`es-PY` | Language Model                                   |
|Spanish (Peru)                     |`es-PE` | Language Model                                   |
|Spanish (Puerto Rico)              |`es-PR` | Language Model                                   |
|Spanish (Spain)                    |`es-ES` | Acoustic model<br>Language model                 |
|Spanish (Uruguay)                  |`es-UY` | Language Model                                   |
|Spanish (USA)                      |`es-US` | Language Model                                   |
|Spanish (Venezuela)                |`es-VE` | Language Model                                   |
|Swedish (Sweden)                   |`sv-SE` | Language model                                   |
|Tamil (India)                      |`ta-IN` | Language model                                   |
|Telugu (India)                     |`te-IN` | Language model                                   |
|Thai (Thailand)                    |`th-TH` | Language model                                   |
|Turkish (Turkey)                   |`tr-TR` | Language model                                   |

## Text-to-speech

Both the Microsoft Speech SDK and REST APIs support these voices, each of which supports a specific language and dialect, identified by locale. You can also get a full list of languages and voices supported for each specific region/endpoint through the [voices/list API](rest-text-to-speech.md#get-a-list-of-voices). 

> [!IMPORTANT]
> Pricing varies for standard, custom and neural voices. Please visit the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page for additional information.

### Neural voices

Neural text-to-speech is a new type of speech synthesis powered by deep neural networks. When using a neural voice, synthesized speech is nearly indistinguishable from the human recordings.

Neural voices can be used to make interactions with chatbots and voice assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, neural voices significantly reduce listening fatigue when users interact with AI systems.

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| Arabic (Egypt) | `ar-EG` | Female | `ar-EG-SalmaNeural` | General |
| Arabic (Egypt) | `ar-EG` | Male | `ar-EG-ShakirNeural` <sup>New</sup> | General |
| Arabic (Saudi Arabia) | `ar-SA` | Male | `ar-SA-HamedNeural` <sup>New</sup> | General |
| Arabic (Saudi Arabia) | `ar-SA` | Female | `ar-SA-ZariyahNeural` | General |
| Bulgarian (Bulgary) | `bg-BG` | Male | `bg-BG-BorislavNeural` <sup>New</sup> | General |
| Bulgarian (Bulgary) | `bg-BG` | Female | `bg-BG-KalinaNeural` | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-AlbaNeural` | General |
| Catalan (Spain) | `ca-ES` | Male | `ca-ES-EnricNeural` <sup>New</sup> | General |
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-JoanaNeural` <sup>New</sup> | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuGaaiNeural` | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-HiuMaanNeural` <sup>New</sup> | General |
| Chinese (Cantonese, Traditional) | `zh-HK` | Male | `zh-HK-WanLungNeural` <sup>New</sup> | General |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunyeNeural` | Optimized for story narrating  |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunyangNeural` | Optimized for news reading,<br /> multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoyouNeural` | Kid voice, optimized for story narrating |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxiaoNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles)  |
| Chinese (Taiwanese Mandarin) | `zh-TW` | Female | `zh-TW-HsiaoChenNeural` <sup>New</sup> | General |
| Chinese (Taiwanese Mandarin) | `zh-TW` | Female | `zh-TW-HsiaoYuNeural` | General |
| Chinese (Taiwanese Mandarin) | `zh-TW` | Male | `zh-TW-YunJheNeural` <sup>New</sup> | General |
| Croatian (Croatia) | `hr-HR` | Female | `hr-HR-GabrijelaNeural` | General |
| Croatian (Croatia) | `hr-HR` | Male | `hr-HR-SreckoNeural` <sup>New</sup> | General |
| Czech (Czech) | `cs-CZ` | Male | `cs-CZ-AntoninNeural` <sup>New</sup> | General |
| Czech (Czech) | `cs-CZ` | Female | `cs-CZ-VlastaNeural` | General |
| Danish (Denmark) | `da-DK` | Female | `da-DK-ChristelNeural` | General |
| Danish (Denmark) | `da-DK` | Male | `da-DK-JeppeNeural` <sup>New</sup> | General |
| Dutch (Netherlands) | `nl-NL` | Female | `nl-NL-ColetteNeural` | General |
| Dutch (Netherlands) | `nl-NL` | Female | `nl-NL-FennaNeural` <sup>New</sup> | General |
| Dutch (Netherlands) | `nl-NL` | Male | `nl-NL-MaartenNeural` <sup>New</sup> | General |
| English (Australia) | `en-AU` | Female | `en-AU-NatashaNeural` | General |
| English (Australia) | `en-AU` | Male | `en-AU-WilliamNeural` | General |
| English (Canada) | `en-CA` | Female | `en-CA-ClaraNeural` | General |
| English (Canada) | `en-CA` | Male | `en-CA-LiamNeural` <sup>New</sup> | General |
| English (India) | `en-IN` | Female | `en-IN-NeerjaNeural` | General |
| English (India) | `en-IN` | Male | `en-IN-PrabhatNeural` <sup>New</sup> | General |
| English (Ireland) | `en-IE` | Male | `en-IE-ConnorNeural` <sup>New</sup> | General |
| English (Ireland) | `en-IE` | Female | `en-IE-EmilyNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-LibbyNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-MiaNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-RyanNeural` | General |
| English (United States) | `en-US` | Male | `en-US-GuyNeural` | General |
| English (United States) | `en-US` | Female | `en-US-JennyNeural` | General |
| English (United States) | `en-US` | Female | `en-US-AriaNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles)  |
| Finnish (Finland) | `fi-FI` | Male | `fi-FI-HarriNeural` <sup>New</sup> | General |
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-NooraNeural` | General |
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-SelmaNeural` <sup>New</sup> | General |
| French (Canada) | `fr-CA` | Male | `fr-CA-JeanNeural` | General |
| French (Canada) | `fr-CA` | Female | `fr-CA-SylvieNeural` | General |
| French (France) | `fr-FR` | Female | `fr-FR-DeniseNeural` | General |
| French (France) | `fr-FR` | Male | `fr-FR-HenriNeural` | General |
| French (Switzerland) | `fr-CH` | Female | `fr-CH-ArianeNeural` | General |
| French (Switzerland) | `fr-CH` | Male | `fr-CH-FabriceNeural` <sup>New</sup> | General |
| German (Austria) | `de-AT` | Female | `de-AT-IngridNeural` | General |
| German (Austria) | `de-AT` | Male | `de-AT-JonasNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-ConradNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-KatjaNeural` | General |
| German (Switzerland) | `de-CH` | Male | `de-CH-JanNeural` <sup>New</sup> | General |
| German (Switzerland) | `de-CH` | Female | `de-CH-LeniNeural` | General |
| Greek (Greece) | `el-GR` | Female | `el-GR-AthinaNeural` | General |
| Greek (Greece) | `el-GR` | Male | `el-GR-NestorasNeural` <sup>New</sup> | General |
| Hebrew (Israel) | `he-IL` | Male | `he-IL-AvriNeural` <sup>New</sup> | General |
| Hebrew (Israel) | `he-IL` | Female | `he-IL-HilaNeural` | General |
| Hindi (India) | `hi-IN` | Female | `hi-IN-SwaraNeural` | General |
| Hindi (India) | `hi-IN` | Male | `hi-IN-MadhurNeural` <sup>New</sup> | General |
| Hungarian (Hungary) | `hu-HU` | Female | `hu-HU-NoemiNeural` | General |
| Hungarian (Hungary) | `hu-HU` | Male | `hu-HU-TamasNeural` <sup>New</sup> | General |
| Indonesian (Indonesia) | `id-ID` | Male | `id-ID-ArdiNeural` | General |
| Indonesian (Indonesia) | `id-ID` | Female | `id-ID-GadisNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-DiegoNeural` | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-ElsaNeural` | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-IsabellaNeural` | General |
| Japanese (Japan) | `ja-JP` | Male | `ja-JP-KeitaNeural` | General |
| Japanese (Japan) | `ja-JP` | Female | `ja-JP-NanamiNeural` | General |
| Korean (Korea) | `ko-KR` | Male | `ko-KR-InJoonNeural` | General |
| Korean (Korea) | `ko-KR` | Female | `ko-KR-SunHiNeural` | General |
| Malay (Malaysia) | `ms-MY` | Male | `ms-MY-OsmanNeural` <sup>New</sup> | General |
| Malay (Malaysia) | `ms-MY` | Female | `ms-MY-YasminNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Male | `nb-NO-FinnNeural` <sup>New</sup> | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-IselinNeural` | General |
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-PernilleNeural` <sup>New</sup> | General |
| Polish (Poland) | `pl-PL` | Female | `pl-PL-AgnieszkaNeural` <sup>New</sup> | General |
| Polish (Poland) | `pl-PL` | Male | `pl-PL-MarekNeural` <sup>New</sup> | General |
| Polish (Poland) | `pl-PL` | Female | `pl-PL-ZofiaNeural` | General |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-AntonioNeural` | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-FranciscaNeural` | General, multiple voice styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles)  |
| Portuguese (Portugal) | `pt-PT` | Male | `pt-PT-DuarteNeural` <sup>New</sup> | General |
| Portuguese (Portugal) | `pt-PT` | Female | `pt-PT-FernandaNeural` | General |
| Portuguese (Portugal) | `pt-PT` | Female | `pt-PT-RaquelNeural` <sup>New</sup> | General |
| Romanian (Romania) | `ro-RO` | Female | `ro-RO-AlinaNeural` | General |
| Romanian (Romania) | `ro-RO` | Male | `ro-RO-EmilNeural` <sup>New</sup> | General |
| Russian (Russia) | `ru-RU` | Female | `ru-RU-DariyaNeural` | General |
| Russian (Russia) | `ru-RU` | Male | `ru-RU-DmitryNeural` <sup>New</sup> | General |
| Russian (Russia) | `ru-RU` | Female | `ru-RU-SvetlanaNeural` <sup>New</sup> | General |
| Slovak (Slovakia) | `sk-SK` | Male | `sk-SK-LukasNeural` <sup>New</sup> | General |
| Slovak (Slovakia) | `sk-SK` | Female | `sk-SK-ViktoriaNeural` | General |
| Slovenian (Slovenia) | `sl-SI` | Female | `sl-SI-PetraNeural` | General |
| Slovenian (Slovenia) | `sl-SI` | Male | `sl-SI-RokNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-DaliaNeural` | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-JorgeNeural` | General |
| Spanish (Spain) | `es-ES` | Male | `es-ES-AlvaroNeural` | General |
| Spanish (Spain) | `es-ES` | Female | `es-ES-ElviraNeural` | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-HilleviNeural` | General |
| Swedish (Sweden) | `sv-SE` | Male | `sv-SE-MattiasNeural` <sup>New</sup> | General |
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-SofieNeural` <sup>New</sup> | General |
| Tamil (India) | `ta-IN` | Female | `ta-IN-PallaviNeural` | General |
| Tamil (India) | `ta-IN` | Male | `ta-IN-ValluvarNeural` <sup>New</sup> | General |
| Telugu (India) | `te-IN` | Female | `te-IN-ShrutiNeural` | General |
| Telugu (India) | `te-IN` | Male | `te-IN-MohanNeural` <sup>New</sup> | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-AcharaNeural` | General |
| Thai (Thailand) | `th-TH` | Male | `th-TH-NiwatNeural` <sup>New</sup> | General |
| Thai (Thailand) | `th-TH` | Female | `th-TH-PremwadeeNeural` | General |
| Turkish (Turkey) | `tr-TR` | Male | `tr-TR-AhmetNeural` <sup>New</sup> | General |
| Turkish (Turkey) | `tr-TR` | Female | `tr-TR-EmelNeural` | General |
| Vietnamese (Vietnam) | `vi-VN` | Female | `vi-VN-HoaiMyNeural` | General |
| Vietnamese (Vietnam) | `vi-VN` | Male | `vi-VN-NamMinhNeural` <sup>New</sup> | General |

#### Neural voices in preview

Below neural voices are in public preview. 

| Language                         | Locale  | Gender | Voice name                             | Style support |
|----------------------------------|---------|--------|----------------------------------------|---------------|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaohanNeural` <sup>New</sup> | General, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaomoNeural` <sup>New</sup> | General, multiple role-play and [styles available using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoruiNeural` <sup>New</sup> | Senior voice, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoxuanNeural` <sup>New</sup> | General, multiple role-play and [styles available using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male   | `zh-CN-YunxiNeural` <sup>New</sup> | General, multiple styles available [using SSML](speech-synthesis-markup.md#adjust-speaking-styles) |
| Estonian (Estonia) | et-EE | Female | `et-EE-AnuNeural` | General |
| Estonian (Estonia) | et-EE | Male | `et-EE-KertNeural` <sup>New</sup> | General |
| Irish (Ireland) | ga-IE | Female | `ga-IE-OrlaNeural` | General |
| Irish (Ireland) | ga-IE | Male | `ga-IE-ColmNeural` <sup>New</sup> | General |
| Latvian (Latvia) | lv-LV | Female | `lv-LV-EveritaNeural` | General |
| Latvian (Latvia) | lv-LV | Male | `lv-LV-NilsNeural` <sup>New</sup> | General |
| Lithuanian (Lithuania) | lt-LT | Female | `lt-LT-OnaNeural` | General |
| Lithuanian (Lithuania) | lt-LT | Male | `lt-LT-LeonasNeural` <sup>New</sup> | General |
| Maltese (Malta) | mt-MT | Female | `mt-MT-GraceNeural` | General |
| Maltese (Malta) | mt-MT | Male | `mt-MT-JosephNeural` <sup>New</sup> | General |

> [!IMPORTANT]
> Voices in public preview are only available in 3 service regions: East US, West Europe and Southeast Asia.

For more information about regional availability, see [regions](regions.md#standard-and-neural-voices).

To learn how you can configure and adjust neural voices, such as Speaking Styles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!IMPORTANT]
> The `en-US-JessaNeural` voice has changed to `en-US-AriaNeural`. If you were using "Jessa" before, convert over to "Aria".

> [!TIP]
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)" in your speech synthesis requests.

### Standard voices

More than 75 standard voices are available in over 45 languages and locales, which allow you to convert text into synthesized speech. For more information about regional availability, see [regions](regions.md#standard-and-neural-voices).

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
| English (United States) | `en-US` | Female | `en-US-JessaRUS`|
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

Voice customization is available for `de-DE`, `en-GB`, `en-IN`, `en-US`, `es-MX`, `fr-FR`, `it-IT`, `pt-BR`, and `zh-CN`. Select the right locale that matches the training data you have to train a custom voice model. For example, if the recording data you have is spoken in English with a British accent, select `en-GB`.

> [!NOTE]
> We do not support bi-lingual model training in Custom Voice, except for the Chinese-English bi-lingual. Select "Chinese-English bilingual" if you want to train a Chinese voice that can speak English as well. Voice training in all locales starts with a data set of 2,000+ utterances, except for the `en-US` and `zh-CN` where you can start with any size of training data.

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

## Next steps

* [Create a free Azure account](https://azure.microsoft.com/free/cognitive-services/)
* [See how to recognize speech in C#](./get-started-speech-to-text.md?pivots=programming-language-chsarp)
