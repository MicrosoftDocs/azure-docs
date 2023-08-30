---
title: Migrate from prebuilt standard voice to prebuilt neural voice - Speech service
titleSuffix: Azure AI services
description: This document helps users migrate from prebuilt standard voice to prebuilt neural voice.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/12/2021
ms.author: v-baolianzou
---

# Migrate from prebuilt standard voice to prebuilt neural voice

> [!IMPORTANT]
> We are retiring the standard voices from September 1, 2021 through August 31, 2024. If you used a standard voice with your Speech resource that was created prior to September 1, 2021 then you can continue to do so until August 31, 2024. All other Speech resources can only use prebuilt neural voices. You can choose from the supported [neural voice names](language-support.md?tabs=tts). After August 31, 2024 the standard voices won't be supported with any Speech resource.
> 
> The pricing for prebuilt standard voice is different from prebuilt neural voice. Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details in the collapsable "Deprecated" section. Prebuilt standard voice (retired) is referred as **Standard**. 

The prebuilt neural voice provides more natural sounding speech output, and thus, a better end-user experience. 

|Prebuilt standard voice  | Prebuilt neural voice | 
|--|--|
| Noticeably robotic  | Natural sounding, closer to human-parity|
| Limited capabilities in voice tuning<sup>1</sup> |Advanced capabilities in voice tuning   |
| No new investment in future voice fonts  |On-going investment in future voice fonts |

<sup>1</sup> For voice tuning, volume and pitch changes can be applied to standard voices at the word or sentence-level, whereas they can only be applied to neural voices at the sentence level. Duration supports standard voices only. To learn more about details on prosody elements, see [Improve synthesis with SSML](speech-synthesis-markup.md).

## Action required

> [!TIP]
> Even without an Azure account, you can listen to voice samples at the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery) and determine the right voice for your business needs.

1. Review the [price](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) structure.
2. To make the change, [follow the sample code](speech-synthesis-markup-voice.md#voice-element) to update the voice name in your speech synthesis request to the supported neural voice names in chosen languages. Use neural voices for your speech synthesis request, on cloud or on prem. For on-premises container, use the [neural voice containers](../cognitive-services-container-support.md) and follow the [instructions](speech-container-howto.md).

## Standard voice details (deprecated)

Read the following sections for details on standard voice.

### Language support

More than 75 prebuilt standard voices are available in over 45 languages and locales, which allow you to convert text into synthesized speech.

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
| Turkish (Türkiye) | `tr-TR` | Female | `tr-TR-SedaRUS`|
| Vietnamese (Vietnam) | `vi-VN` | Male | `vi-VN-An` |

> [!IMPORTANT]
> The `en-US-Jessa` voice has changed to `en-US-Aria`. If you were using "Jessa" before, convert over to "Aria".
> 
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaRUS)" in your speech synthesis requests.

### Regional support 

Use this table to determine **availability of standard voices** by region/endpoint:

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.tts.speech.microsoft.com/cognitiveservices/v1` |
| Brazil South | `https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1` |
| Canada Central | `https://canadacentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| Central US | `https://centralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| East Asia | `https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1` |
| East US | `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1` |
| East US 2 | `https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1` |
| France Central | `https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| India Central | `https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1` |
| Japan East | `https://japaneast.tts.speech.microsoft.com/cognitiveservices/v1` |
| Japan West | `https://japanwest.tts.speech.microsoft.com/cognitiveservices/v1` |
| Korea Central | `https://koreacentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| North Central US | `https://northcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| North Europe | `https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1` |
| South Central US | `https://southcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| Southeast Asia | `https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1` |
| UK South | `https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1` |
| West Central US | `https://westcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| West Europe | `https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1` |
| West US | `https://westus.tts.speech.microsoft.com/cognitiveservices/v1` |
| West US 2 | `https://westus2.tts.speech.microsoft.com/cognitiveservices/v1` |


## Next steps

> [!div class="nextstepaction"]
> [Try out prebuilt neural voice](text-to-speech.md)
