---
title: Language support - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn more about the human languages that are available with Form Recognizer.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 10/20/2022
ms.author: lajanuar
---

# Language support for Form Recognizer

::: moniker range="form-recog-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v3-0.md)]
::: moniker-end

::: moniker range="form-recog-3.0.0"

This article covers the supported languages for text and field **extraction (by feature)** and **[detection (Read only)](#detected-languages-read-api)**. Both groups are mutually exclusive.

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->

## Read, layout, and custom form (template) model

The following lists include the currently GA languages in the most recent v3.0 version. These languages are supported by Read, Layout, and Custom form (template) model features.

> [!NOTE]
> **Language code optional**
>
> Form Recognizer's deep learning based universal models extract all multi-lingual text in your documents, including text lines with mixed languages, and do not require specifying a language code. Do not provide the language code as the parameter unless you are sure about the language and want to force the service to apply only the relevant model. Otherwise, the service may return incomplete and incorrect text.

To use the v3.0-supported languages, refer to the [v3.0 REST API migration guide](v3-migration-guide.md) to understand the differences from the v2.1 GA API and explore the [v3.0 SDK and REST API quickstarts](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true).

### Handwritten text

The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`|

### Print text

The following table lists the supported languages for print text by the most recent GA version.

|Language| Code (optional) |Language| Code (optional) |
|:-----|:----:|:-----|:----:|
|Afrikaans|`af`|Khasi  | `kha` |
|Albanian |`sq`|K'iche'  | `quc` |
|Angika (Devanagari) | `anp`| Korean | `ko` |
|Arabic | `ar` | Korku | `kfq`|
|Asturian |`ast`| Koryak | `kpy`|
|Awadhi-Hindi (Devanagari) | `awa`| Kosraean | `kos`|
|Azerbaijani (Latin) | `az`| Kumyk (Cyrillic) | `kum`|
|Bagheli | `bfy`| Kurdish (Arabic) | `ku-arab`|
|Basque  |`eu`| Kurdish (Latin) | `ku-latn`
|Belarusian (Cyrillic)  | `be`, `be-cyrl`|Kurukh (Devanagari) | `kru`|
|Belarusian (Latin) | `be`, `be-latn`| Kyrgyz (Cyrillic)  | `ky`
|Bhojpuri-Hindi (Devanagari) | `bho`| Lakota | `lkt` |
|Bislama   |`bi`| Latin | `la` |
|Bodo (Devanagari) | `brx`| Lithuanian | `lt` |
|Bosnian (Latin) | `bs`| Lower Sorbian | `dsb` |
|Brajbha | `bra`|Lule Sami | `smj`|
|Breton    |`br`|Luxembourgish  | `lb` |
|Bulgarian  | `bg`|Mahasu Pahari (Devanagari) | `bfz`|
|Bundeli | `bns`|Malay (Latin) | `ms` |
|Buryat (Cyrillic) | `bua`|Maltese | `mt`
|Catalan    |`ca`|Malto (Devanagari) | `kmj`
|Cebuano    |`ceb`|Manx  | `gv` |
|Chamling | `rab`|Maori | `mi`|
|Chamorro  |`ch`|Marathi | `mr`|
|Chhattisgarhi (Devanagari)| `hne`| Mongolian (Cyrillic)  | `mn`|
|Chinese Simplified | `zh-Hans`|Montenegrin (Cyrillic)  | `cnr-cyrl`|
|Chinese Traditional | `zh-Hant`|Montenegrin (Latin) | `cnr-latn`|
|Cornish     |`kw`|Neapolitan   | `nap` |
|Corsican      |`co`|Nepali | `ne`|
|Crimean Tatar (Latin)|`crh`|Niuean | `niu`|
|Croatian | `hr`|Nogay | `nog`
|Czech | `cs` |Northern Sami (Latin) | `sme`|
|Danish | `da` |Norwegian | `no` |
|Dari | `prs`|Occitan | `oc` |
|Dhimal (Devanagari) | `dhi`| Ossetic  | `os`|
|Dogri (Devanagari) | `doi`|Pashto | `ps`|
|Dutch | `nl` |Persian | `fa`|
|English | `en` |Polish | `pl` |
|Erzya (Cyrillic) | `myv`|Portuguese | `pt` |
|Estonian  |`et`|Punjabi (Arabic) | `pa`|
|Faroese | `fo`|Ripuarian | `ksh`|
|Fijian |`fj`|Romanian | `ro` |
|Filipino  |`fil`|Romansh  | `rm` |
|Finnish | `fi` | Russian | `ru` |
|French | `fr` |Sadri  (Devanagari) | `sck` |
|Friulian  | `fur` | Samoan (Latin) | `sm`
|Gagauz (Latin) | `gag`|Sanskrit (Devanagari) | `sa`|
|Galician   | `gl` |Santali(Devanagiri) | `sat` |
|German | `de` | Scots  | `sco` |
|Gilbertese    | `gil` | Scottish Gaelic  | `gd` |
|Gondi (Devanagari) | `gon`| Serbian (Latin) | `sr`, `sr-latn`|
|Greenlandic   | `kl` | Sherpa (Devanagari) | `xsr` |
|Gurung (Devanagari) | `gvr`| Sirmauri (Devanagari) | `srx`|
|Haitian Creole  | `ht` | Skolt Sami | `sms` |
|Halbi (Devanagari) | `hlb`| Slovak | `sk`|
|Hani  | `hni` | Slovenian  | `sl` |
|Haryanvi | `bgc`|Somali (Arabic) | `so`|
|Hawaiian | `haw`|Southern Sami | `sma`
|Hindi | `hi`|Spanish | `es` |
|Hmong Daw (Latin)| `mww` | Swahili (Latin)  | `sw` |
|Ho(Devanagiri) | `hoc`|Swedish | `sv` |
|Hungarian | `hu` |Tajik (Cyrillic)  | `tg` |
|Icelandic | `is`| Tatar (Latin)  | `tt` |
|Inari Sami | `smn`|Tetum    | `tet` |
|Indonesian   | `id` | Thangmi | `thf` |
|Interlingua  | `ia` |Tongan | `to`|
|Inuktitut (Latin) | `iu` | Turkish | `tr` |
|Irish    | `ga` |Turkmen (Latin) | `tk`|
|Italian | `it` |Tuvan | `tyv`|
|Japanese | `ja` |Upper Sorbian  | `hsb` |
|Jaunsari (Devanagari) | `Jns`|Urdu  | `ur`|
|Javanese | `jv` |Uyghur (Arabic) | `ug`|
|Kabuverdianu | `kea` |Uzbek (Arabic) | `uz-arab`|
|Kachin (Latin) | `kac` |Uzbek (Cyrillic)  | `uz-cyrl`|
|Kangri (Devanagari) | `xnr`|Uzbek (Latin)     | `uz` |
|Karachay-Balkar  | `krc`|Volapük   | `vo` |
|Kara-Kalpak (Cyrillic) | `kaa-cyrl`|Walser    | `wae` |
|Kara-Kalpak (Latin) | `kaa` |Welsh | `cy` |
|Kashubian | `csb` |Western Frisian | `fy` |
|Kazakh (Cyrillic)  | `kk-cyrl`|Yucatec Maya | `yua` |
|Kazakh (Latin) | `kk-latn`|Zhuang | `za` |
|Khaling | `klr`|Zulu  | `zu` |

### Print text in preview (API version 2022-06-30-preview)

Use the parameter `api-version=2022-06-30-preview` when using the REST API or the corresponding SDK to support these languages in your applications.

|Language| Code (optional) |Language| Code (optional) |
|:-----|:----:|:-----|:----:|
|Abaza|`abq`|Malagasy  | `mg` |
|Abkhazian |`ab`|Mandinka  | `mnk` |
|Achinese | `ace`| Mapudungun | `arn` |
|Acoli | `ach` | Mari (Russia) | `chm`|
|Adangme |`ada`| Masai | `mas`|
|Adyghe | `ady`| Mende (Sierra Leone) | `men`|
|Afar | `aa`| Meru | `mer`|
|Akan | `ak`| Meta' | `mgo`|
|Algonquin  |`alq`| Minangkabau | `min`
|Asu (Tanzania) | `asa`|Mohawk| `moh`|
|Avaric | `av`| Mongondow | `mog`
|Aymara | `ay`| Morisyen | `mfe` |
|Bafia   |`ksf`| Mundang | `mua` |
|Bambara | `bm`| Nahuatl | `nah` |
|Bashkir | `ba`| Navajo | `nv` |
|Bemba (Zambia) | `bem`| Ndonga | `ng` |
|Bena (Tanzania) | `bez`|Ngomba | `jgo`|
|Bikol    |`bik`|North Ndebele  | `nd` |
|Bini  | `bin`|Nyanja | `ny`|
|Chechen | `ce`|Nyankole | `nyn` |
|Chiga | `cgg`|Nzima | `nzi`
|Choctaw    |`cho`|Ojibwa | `oj`
|Chukot    |`ckt`|Oromo  | `om` |
|Chuvash | `cv`|Pampanga | `pam`|
|Cree  |`cr`|Pangasinan | `pag`|
|Creek| `mus`| Papiamento  | `pap`|
|Crow | `cro`|Pedi  | `nso`|
|Dargwa | `dar`|Quechua | `qu`|
|Duala     |`dua`|Rundi   | `rn` |
|Dungan      |`dng`|Rwa | `rwk`|
|Efik|`efi`|Samburu | `saq`|
|Fon | `fon`|Sango | `sg`
|Ga | `gaa` |Sangu (Gabon) | `snq`|
|Ganda | `lg` |Sena | `seh` |
|Gayo | `gay`|Serbian (Cyrillic) | `sr-cyrl` |
|Guarani| `gn`| Shambala  | `ksb`|
|Gusii | `guz`|Shona | `sn`|
|Greek | `el`|Siksika | `bla`|
|Herero | `hz` |Soga | `xog`|
|Hiligaynon | `hil` |Somali (Latin) | `so-latn` |
|Iban | `iba`|Songhai | `son` |
|Igbo  |`ig`|South Ndebele | `nr`|
|Iloko | `ilo`|Southern Altai | `alt`|
|Ingush |`inh`|Southern Sotho | `st` |
|Jola-Fonyi  |`dyo`|Sundanese  | `su` |
|Kabardian | `kbd` | Swati | `ss` |
|Kalenjin | `kln` |Tabassaran| `tab` |
|Kalmyk  | `xal` | Tachelhit| `shi` |
|Kanuri | `kr`|Tahitian | `ty`|
|Khakas   | `kjh` |Taita | `dav` |
|Kikuyu | `ki` | Tatar (Cyrillic)  | `tt-cyrl` |
|Kildin Sami    | `sjd` | Teso | `teo` |
|Kinyarwanda| `rw`| Thai | `th`|
|Komi   | `kv` | Tok Pisin | `tpi` |
|Kongo| `kg`| Tsonga | `ts`|
|Kpelle  | `kpe` | Tswana | `tn` |
|Kuanyama | `kj`| Udmurt | `udm`|
|Lak  | `lbe` | Uighur (Cyrillic)  | `ug-cyrl` |
|Latvian | `lv`|Ukrainian | `uk`|
|Lezghian | `lex`|Vietnamese | `vi`
|Lingala | `ln`|Vunjo | `vun` |
|Lozi| `loz` | Wolof  | `wo` |
|Luo (Kenya and Tanzania) | `luo`| Xhosa|`xh` |
|Luyia | `luy` |Yakut | `sah` |
|Macedonian | `mk`| Zapotec | `zap` |
|Machame| `jmc`| Zarma  | `dje` |
|Madurese   | `mad` |
|Makhuwa-Meetto  | `mgh` |
|Makonde | `kde` |

## Custom neural model

Language| Locale code |
|:-----|:----:|
|English (United States)|en-us|

## Receipt model

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

Receipt supports all English receipts with the following locales:

|Language| Locale code |
|:-----|:----:|
|English (Australia)|`en-au`|
|English (Canada)|`en-ca`|
|English (United Kingdom)|`en-gb`|
|English (India|`en-in`|
|English (United States)| `en-us`|
|French | 'fr' |
| Spanish | `es` |

## Business card model

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

Business Card supports all English business cards with the following locales:

|Language| Locale code |
|:-----|:----:|
|English (Australia)|`en-au`|
|English (Canada)|`en-ca`|
|English (United Kingdom)|`en-gb`|
|English (India|`en-in`|
|English (United States)| `en-us`|

The **2022-06-30** and later releases  include Japanese language support:

|Language| Locale code |
|:-----|:----:|
| Japanese | `ja` |

## Invoice model

Language| Locale code |
|:-----|:----:|
|English (United States) |en-US|
|Spanish| es|
|German (**2022-06-30** and later)| de|
|French (**2022-06-30** and later)| fr|
|Italian (**2022-06-30** and later)|it|
|Portuguese (**2022-06-30** and later)|pt|
|Dutch (**2022-06-30** and later)| nl|

## ID document model

This technology is currently available for US driver licenses and the biographical page from international passports (excluding visa and other travel documents).

## General Document

Language| Locale code |
|:-----|:----:|
|English (United States)|en-us|

## Detected languages: Read API

The [Read API](concept-read.md) supports detecting the following languages in your documents. This list may include languages not currently supported for text extraction.

> [!NOTE]
> **Language detection**
>
> Form Recognizer read model can _detect_ possible presence of languages and returns language codes for detected languages. To determine if text can also be
> extracted for a given language, see previous sections.

> [!NOTE]
> **Detected languages vs extracted languages**
>
> This section lists the languages we can detect from the documents using the Read model, if present. Please note that this list differs from list of languages we support extracting text from, which is specified in the above sections for each model.

| Language            | Code |
|---------------------|---------------|
| Afrikaans           | `af`          |
| Albanian            | `sq`          |
| Amharic             | `am`          |
| Arabic              | `ar`          |
| Armenian            | `hy`          |
| Assamese            | `as`          |
| Azerbaijani         | `az`          |
| Basque              | `eu`          |
| Belarusian          | `be`          |
| Bengali             | `bn`          |
| Bosnian             | `bs`          |
| Bulgarian           | `bg`          |
| Burmese             | `my`          |
| Catalan             | `ca`          |
| Central Khmer       | `km`          |
| Chinese             | `zh`          |
| Chinese Simplified  | `zh_chs`      |
| Chinese Traditional | `zh_cht`      |
| Corsican            | `co`          |
| Croatian            | `hr`          |
| Czech               | `cs`          |
| Danish              | `da`          |
| Dari                | `prs`         |
| Divehi              | `dv`          |
| Dutch               | `nl`          |
| English             | `en`          |
| Esperanto           | `eo`          |
| Estonian            | `et`          |
| Fijian              | `fj`          |
| Finnish             | `fi`          |
| French              | `fr`          |
| Galician            | `gl`          |
| Georgian            | `ka`          |
| German              | `de`          |
| Greek               | `el`          |
| Gujarati            | `gu`          |
| Haitian             | `ht`          |
| Hausa               | `ha`          |
| Hebrew              | `he`          |
| Hindi               | `hi`          |
| Hmong Daw           | `mww`         |
| Hungarian           | `hu`          |
| Icelandic           | `is`          |
| Igbo                | `ig`          |
| Indonesian          | `id`          |
| Inuktitut           | `iu`          |
| Irish               | `ga`          |
| Italian             | `it`          |
| Japanese            | `ja`          |
| Javanese            | `jv`          |
| Kannada             | `kn`          |
| Kazakh              | `kk`          |
| Kinyarwanda         | `rw`          |
| Kirghiz             | `ky`          |
| Korean              | `ko`          |
| Kurdish             | `ku`          |
| Lao                 | `lo`          |
| Latin               | `la`          |
| Latvian             | `lv`          |
| Lithuanian          | `lt`          |
| Luxembourgish       | `lb`          |
| Macedonian          | `mk`          |
| Malagasy            | `mg`          |
| Malay               | `ms`          |
| Malayalam           | `ml`          |
| Maltese             | `mt`          |
| Maori               | `mi`          |
| Marathi             | `mr`          |
| Mongolian           | `mn`          |
| Nepali              | `ne`          |
| Norwegian           | `no`          |
| Norwegian Nynorsk   | `nn`          |
| Oriya               | `or`          |
| Pasht               | `ps`          |
| Persian             | `fa`          |
| Polish              | `pl`          |
| Portuguese          | `pt`          |
| Punjabi             | `pa`          |
| Queretaro Otomi     | `otq`         |
| Romanian            | `ro`          |
| Russian             | `ru`          |
| Samoan              | `sm`          |
| Serbian             | `sr`          |
| Shona               | `sn`          |
| Sindhi              | `sd`          |
| Sinhala             | `si`          |
| Slovak              | `sk`          |
| Slovenian           | `sl`          |
| Somali              | `so`          |
| Spanish             | `es`          |
| Sundanese           | `su`          |
| Swahili             | `sw`          |
| Swedish             | `sv`          |
| Tagalog             | `tl`          |
| Tahitian            | `ty`          |
| Tajik               | `tg`          |
| Tamil               | `ta`          |
| Tatar               | `tt`          |
| Telugu              | `te`          |
| Thai                | `th`          |
| Tibetan             | `bo`          |
| Tigrinya            | `ti`          |
| Tongan              | `to`          |
| Turkish             | `tr`          |
| Turkmen             | `tk`          |
| Ukrainian           | `uk`          |
| Urdu                | `ur`          |
| Uzbek               | `uz`          |
| Vietnamese          | `vi`          |
| Welsh               | `cy`          |
| Xhosa               | `xh`          |
| Yiddish             | `yi`          |
| Yoruba              | `yo`          |
| Yucatec Maya        | `yua`         |
| Zulu                | `zu`          |

::: moniker-end

::: moniker range="form-recog-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

::: moniker range="form-recog-2.1.0"

This table lists the written languages supported by each Form Recognizer service.

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->

## Layout and custom model

|Language| Language code |
|:-----|:----:|
|Afrikaans|`af`|
|Albanian |`sq`|
|Asturian |`ast`|
|Basque  |`eu`|
|Bislama   |`bi`|
|Breton    |`br`|
|Catalan    |`ca`|
|Cebuano    |`ceb`|
|Chamorro  |`ch`|
|Chinese (Simplified) | `zh-Hans`|
|Chinese (Traditional) | `zh-Hant`|
|Cornish     |`kw`|
|Corsican      |`co`|
|Crimean Tatar (Latin)  |`crh`|
|Czech | `cs` |
|Danish | `da` |
|Dutch | `nl` |
|English (printed and handwritten) | `en` |
|Estonian  |`et`|
|Fijian |`fj`|
|Filipino  |`fil`|
|Finnish | `fi` |
|French | `fr` |
|Friulian  | `fur` |
|Galician   | `gl` |
|German | `de` |
|Gilbertese    | `gil` |
|Greenlandic   | `kl` |
|Haitian Creole  | `ht` |
|Hani  | `hni` |
|Hmong Daw (Latin) | `mww` |
|Hungarian | `hu` |
|Indonesian   | `id` |
|Interlingua  | `ia` |
|Inuktitut (Latin)  | `iu`  |
|Irish    | `ga` |
|Italian | `it` |
|Japanese | `ja` |
|Javanese | `jv` |
|K'iche'  | `quc` |
|Kabuverdianu | `kea` |
|Kachin (Latin) | `kac` |
|Kara-Kalpak | `kaa` |
|Kashubian | `csb` |
|Khasi  | `kha` |
|Korean | `ko` |
|Kurdish (latin) | `kur` |
|Luxembourgish  | `lb` |
|Malay (Latin)  | `ms` |
|Manx  | `gv` |
|Neapolitan   | `nap` |
|Norwegian | `no` |
|Occitan | `oc` |
|Polish | `pl` |
|Portuguese | `pt` |
|Romansh  | `rm` |
|Scots  | `sco` |
|Scottish Gaelic  | `gd` |
|Slovenian  | `slv` |
|Spanish | `es` |
|Swahili (Latin)  | `sw` |
|Swedish | `sv` |
|Tatar (Latin)  | `tat` |
|Tetum    | `tet` |
|Turkish | `tr` |
|Upper Sorbian  | `hsb` |
|Uzbek (Latin)     | `uz` |
|Volapük   | `vo` |
|Walser    | `wae` |
|Western Frisian | `fy` |
|Yucatec Maya | `yua` |
|Zhuang | `za` |
|Zulu  | `zu` |

## Prebuilt receipt and business card

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

Pre-Built Receipt and Business Cards support all English receipts and business cards with the following locales:

|Language| Locale code |
|:-----|:----:|
|English (Austrialia)|`en-au`|
|English (Canada)|`en-ca`|
|English (United Kingdom)|`en-gb`|
|English (India|`en-in`|
|English (United States)| `en-us`|

## Prebuilt invoice

Language| Locale code |
|:-----|:----:|
|English (United States)|en-us|

## Prebuilt identity documents

This technology is currently available for US driver licenses and the biographical page from international passports (excluding visa and other travel documents).

::: moniker-end

## Next steps

::: moniker range="form-recog-3.0.0"

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)
::: moniker-end

::: moniker range="form-recog-2.1.0"
> [!div class="nextstepaction"]
> [Try Form Recognizer sample labeling tool](https://aka.ms/fott-2.1-ga)
::: moniker-end
