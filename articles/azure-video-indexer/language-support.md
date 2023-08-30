---
title: Language support in Azure AI Video Indexer
description: This article provides a comprehensive list of language support by service features in Azure AI Video Indexer.
author: Juliako
manager: femila
ms.topic: conceptual
ms.custom: ignite-2022
ms.author: juliako
ms.date: 03/10/2023
---

# Language support in Azure AI Video Indexer

This article explains Video Indexer's language options and provides a list of language support for each one. It includes the languages support for Video Indexer features, translation, language identification, customization, and the language settings of the Video Indexer website.

## Supported languages per scenario

This section explains the Video Indexer language options and has a table of the supported languages for each one.

> [!IMPORTANT]
> All of the languages listed support translation when indexing through the API.

### Column explanations

- **Supported source language** – The language spoken in the media file supported for transcription, translation, and search.
- **Language identification** - Whether the language can be automatically detected by Video Indexer when language identification is used for indexing. To learn more, see [Use Azure AI Video Indexer to auto identify spoken languages](language-identification-model.md) and the **Language Identification** section.
- **Customization (language model)** - Whether the language can be used when customizing language models in Video Indexer. To learn more, see [Customize a language model in Azure AI Video Indexer](customize-language-model-overview.md).
- **Pronunciation (language model)** - Whether the language can be used to create a pronunciation dataset as part of a custom speech model. To learn more, see [Customize a speech model with Azure AI Video Indexer](customize-speech-model-overview.md).
- **Website Translation** – Whether the language is supported for translation when using the [Azure AI Video Indexer website](https://aka.ms/vi-portal-link). Select the translated language in the language drop-down menu.

    :::image type="content" source="media/language-support/website-translation.png" alt-text="Screenshot showing a menu with download, English and views as menu items. A tooltip is shown as mouseover on the English item and says Translation is set to English." lightbox="media/language-support/website-translation.png":::

    The following insights are translated:

    - Transcript
    - Keywords
    - Topics
    - Labels
    - Frame patterns (Only to Hebrew as of now)

    All other insights appear in English when using translation.
- **Website Language** - Whether the language can be selected for use on the [Azure AI Video Indexer website](https://aka.ms/vi-portal-link). Select the **Settings icon** then select the language in the **Language settings** dropdown.

    :::image type="content" source="media/language-support/website-language.jpg" alt-text="Screenshot showing a menu with user settings show them all toggled to on." lightbox="media/language-support/website-language.jpg":::

| **Language** | **Code** | **Supported<br/>source language** | **Language<br/>identification** | **Customization<br/>(language model)** | **Pronunciation<br>(language model)** | **Website<br/>Translation** | **Website<br/>Language** |
|---|---|---|---|---|---|---|---|
| Afrikaans | af-ZA |  |  |  |  | ✔ |  |
| Arabic (Israel) | ar-IL | ✔ |  | ✔ |  |  |  |
| Arabic (Iraq) | ar-IQ | ✔ | ✔ |  |  |  |  |
| Arabic (Jordan) | ar-JO | ✔ | ✔ | ✔ |  |  |  |
| Arabic (Kuwait) | ar-KW | ✔ | ✔ | ✔ |  |  |  |
| Arabic (Lebanon) | ar-LB | ✔ |  | ✔ |  |  |  |
| Arabic (Oman) | ar-OM | ✔ | ✔ | ✔ |  |  |  |
| Arabic (Palestinian Authority) | ar-PS | ✔ |  | ✔ |  |  |  |
| Arabic (Qatar) | ar-QA | ✔ | ✔ | ✔ |  |  |  |
| Arabic (Saudi Arabia) | ar-SA | ✔ | ✔ | ✔ |  |  |  |
| Arabic (United Arab Emirates) | ar-AE | ✔ | ✔ | ✔ |  |  |  |
| Arabic Egypt | ar-EG | ✔ | ✔ | ✔ |  | ✔ |  |
| Arabic Modern Standard (Bahrain) | ar-BH | ✔ | ✔ | ✔ |  |  |  |
| Arabic Syrian Arab Republic | ar-SY | ✔ | ✔ | ✔ |  |  |  |
| Armenian | hy-AM | ✔ |  |  |  |  |  |
| Bangla | bn-BD |  |  |  |  | ✔ |  |
| Bosnian | bs-Latn |  |  |  |  | ✔ |  |
| Bulgarian | bg-BG | ✔ | ✔ |  |  | ✔ |  |
| Catalan | ca-ES | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Chinese (Cantonese Traditional) | zh-HK | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Chinese (Simplified) | zh-Hans | ✔ | ✔ |  |  | ✔ | ✔ |
| Chinese (Simplified) | zh-CK | ✔ | ✔ |  |  | ✔ | ✔ |
| Chinese (Traditional) | zh-Hant |  |  |  |  | ✔ |  |
| Croatian | hr-HR | ✔ | ✔ |  | ✔ | ✔ |  |
| Czech | cs-CZ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Danish | da-DK | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Dutch | nl-NL | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| English Australia | en-AU | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| English United Kingdom | en-GB | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| English United States | en-US | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Estonian | et-EE | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Fijian | en-FJ |  |  |  |  | ✔ |  |
| Filipino | fil-PH |  |  |  |  | ✔ |  |
| Finnish | fi-FI | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| French | fr-FR | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| French (Canada) | fr-CA | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| German | de-DE | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Greek | el-GR | ✔ | ✔ |  |  | ✔ |  |
| Gujarati | gu-IN | ✔ | ✔ |  |  | ✔ |  |
| Haitian | fr-HT |  |  |  |  | ✔ |  |
| Hebrew | he-IL | ✔ | ✔ | ✔ |  | ✔ |  |
| Hindi | hi-IN | ✔ | ✔ | ✔ |  | ✔ | ✔ |
| Hungarian | hu-HU |  | ✔ | ✔ | ✔ | ✔ | ✔ |
| Icelandic | is-IS | ✔ |  |  |  |  |  |
| Indonesian | id-ID |  |  | ✔ | ✔ | ✔ |  |
| Irish | ga-IE | ✔ | ✔ | ✔ | ✔ |  |  |
| Italian | it-IT | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Japanese | ja-JP | ✔ | ✔ | ✔ |  | ✔ | ✔ |
| Kannada | kn-IN | ✔ | ✔ |  |  |  |  |
| Kiswahili | sw-KE |  |  |  |  | ✔ |  |
| Korean | ko-KR | ✔ | ✔ | ✔ |  | ✔ | ✔ |
| Latvian | lv-LV | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Lithuanian | lt-LT |  |  | ✔ | ✔ | ✔ |  |
| Malagasy | mg-MG |  |  |  |  | ✔ |  |
| Malay | ms-MY | ✔ |  |  |  | ✔ |  |
| Malayalam | ml-IN | ✔ | ✔ |  |  |  |  |
| Maltese | mt-MT |  |  |  |  | ✔ |  |
| Norwegian | nb-NO | ✔ | ✔ | ✔ |  | ✔ |  |
| Persian | fa-IR | ✔ |  | ✔ |  | ✔ |  |
| Polish | pl-PL | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Portuguese | pt-BR | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Portuguese (Portugal) | pt-PT | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Romanian | ro-RO | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Russian | ru-RU | ✔ | ✔ | ✔ |  | ✔ | ✔ |
| Samoan | en-WS |  |  |  |  |  |  |
| Serbian (Cyrillic) | sr-Cyrl-RS |  |  |  |  | ✔ |  |
| Serbian (Latin) | sr-Latn-RS |  |  |  |  | ✔ |  |
| Slovak | sk-SK | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Slovenian | sl-SI | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Spanish | es-ES | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Spanish (Mexico) | es-MX | ✔ | ✔ | ✔ | ✔ | ✔ |  |
| Swedish | sv-SE | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Tamil | ta-IN | ✔ | ✔ |  |  | ✔ |  |
| Telugu | te-IN | ✔ | ✔ |  |  |  |  |
| Thai | th-TH | ✔ | ✔ | ✔ |  | ✔ |  |
| Tongan | to-TO |  |  |  |  | ✔ |  |
| Turkish | tr-TR | ✔ | ✔ | ✔ |  | ✔ | ✔ |
| Ukrainian | uk-UA | ✔ | ✔ |  |  | ✔ |  |
| Urdu | ur-PK |  |  |  |  | ✔ |  |
| Vietnamese | vi-VN | ✔ | ✔ |  |  | ✔ |

## Get supported languages through the API

Use the Get Supported Languages API call to pull a full list of supported languages per area. For more information, see [Get Supported Languages](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Supported-Languages).

The API returns a list of supported languages with the following values:

```json
{
    "name": "Language",
    "languageCode": "Code",
    "isRightToLeft": true/false,
    "isSourceLanguage": true/false,
    "isAutoDetect": true/false
}
```

- Supported source language:

    If `isSourceLanguage` is false, the language is supported for translation only.
    If `isSourceLanguage` is true, the language is supported as source for transcription, translation, and search.

- Language identification (auto detection):

    If `isAutoDetect` is true, the language is supported for language identification (LID) and multi-language identification (MLID).

## Language Identification

When uploading a media file to Video Indexer, you can specify the media file's source language. If indexing a file through the Video Indexer website, this can be done by selecting a language during the file upload. If you're submitting the indexing job through the API, it's done by using the language parameter. The selected language is then used to generate the transcription of the file.

If you aren't sure of the source language of the media file or it may contain multiple languages, Video Indexer can detect the spoken languages. If you select either Auto-detect single language (LID) or multi-language (MLID) for the media file’s source language, the detected language or languages will be used to transcribe the media file. To learn more about LID and MLID, see Use Azure AI Video Indexer to auto identify spoken languages, see [Automatically identify the spoken language with language identification model](language-identification-model.md) and [Automatically identify and transcribe multi-language content](multi-language-identification-transcription.md)

There's a limit of 10 languages allowed for identification during the indexing of a media file for both LID and MLID. The following are the 9 *default* languages of Language identification (LID) and Multi-language identification (MILD):

- German (de-DE)
- English United States (en-US)
- Spanish (es-ES)
- French (fr-FR)
- Italian (it-IT)
- Japanese (ja-JP)
- Portuguese (pt-BR)
- Russian (ru-RU)
- Chinese (Simplified) (zh-Hans)

## How to change the list of default languages

If you need to use languages for identification that aren't used by default, you can customize the list to any 10 languages that support customization through either the website or the API:

### Use the website to change the list

1. Select the **Language ID** tab under Model customization. The list of languages is specific to the Video Indexer account you're using and for the signed-in user. The default list of languages is saved per user on their local device, per device, and browser. As a result, each user can configure their own default identified language list.
1. Use **Add language** to search and add more languages. If 10 languages are already selected, you first must remove one of the existing detected languages before adding a new one.

    :::image type="content" source="media/language-support/default-language.png" alt-text="Screenshot showing a table showing all of the selected languages." lightbox="media/language-support/default-language.png":::

### Use the API to change the list

When you upload a file, the Video Indexer language model cross references 9 languages by default. If there's a match, the model generates the transcription for the file with the detected language.

Use the language parameter to specify `multi` (MLID) or `auto` (LID) parameters. Use the `customLanguages` parameter to specify up to 10 languages. (The parameter is used only when the language parameter is set to `multi` or `auto`.) To learn more about using the API, see [Use the Azure AI Video Indexer API](video-indexer-use-apis.md).

## Next steps

- [Overview](video-indexer-overview.md)
- [Release notes](release-notes.md)
