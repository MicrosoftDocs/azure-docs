---
title: Language and locale support for custom models - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Document Intelligence custom model language extraction and detection support
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
---

# Language support: custom models

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [applies to v4.0](includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v21.md)]
::: moniker-end

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD006 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD036 -->

Azure AI Document Intelligence models provide multilingual document processing support. Our language support capabilities enable your users to communicate with your applications in natural ways and empower global outreach. Custom models are trained using your labeled datasets to extract distinct data from structured, semi-structured, and unstructured documents specific to your use cases. Standalone custom models can be combined to create composed models. The following tables list the available language and locale support by model and feature:

## Custom classifier

:::moniker range="doc-intel-3.1.0"

| Language—Locale code | Default |
|:----------------------|:---------|
| English (United States)—en-US| English (United States)—en-US|
:::moniker-end

:::moniker range="doc-intel-4.0.0"

|Language| Code (optional) |
|:-----|:----:|
|Afrikaans| `af`|
|Albanian| `sq`|
|Arabic|`ar`|
|Bulgarian|`bg`|
|Chinese (Han (Simplified variant))| `zh-Hans`|
|Chinese (Han (Traditional variant))|`zh-Hant`|
|Croatian|`hr`|
|Czech|`cs`|
|Danish|`da`|
|Dutch|`nl`|
|Estonian|`et`|
|Finnish|`fi`|
|French|`fr`|
|German|`de`|
|Hebrew|`he`|
|Hindi|`hi`|
|Hungarian|`hu`|
|Indonesian|`id`|
|Italian|`it`|
|Japanese|`ja`|
|Korean|`ko`|
|Latvian|`lv`|
|Lithuanian|`lt`|
|Macedonian|`mk`|
|Marathi|`mr`|
|Modern Greek (1453-)|`el`|
|Nepali (macrolanguage)|`ne`|
|Norwegian|`no`|
|Panjabi|`pa`|
|Persian|`fa`|
|Polish|`pl`|
|Portuguese|`pt`|
|Romanian|`rm`|
|Russian|`ru`|
|Slovak|`sk`|
|Slovenian|`sl`|
|Somali (Arabic)|`so`|
|Somali (Latin)|`so-latn`|
|Spanish|`es`|
|Swahili (macrolanguage)|`sw`|
|Swedish|`sv`|
|Tamil|`ta`|
|Thai|`th`|
|Turkish|`tr`|
|Ukrainian|`uk`|
|Urdu|`ur`|
|Vietnamese|`vi`|

:::moniker-end

## Custom neural

:::moniker range=">=doc-intel-3.1.0"

## [**Printed text**](#tab/printed)

The following table lists the supported languages for printed text.

|Language| Code (optional) |
|:-----|:----:|
|Afrikaans| `af`|
|Albanian| `sq`|
|Arabic|`ar`|
|Bulgarian|`bg`|
|Chinese Simplified| `zh-Hans`|
|Chinese Traditional|`zh-Hant`|
|Croatian|`hr`|
|Czech|`cs`|
|Danish|`da`|
|Dutch|`nl`|
|Estonian|`et`|
|Finnish|`fi`|
|French|`fr`|
|German|`de`|
|Hebrew|`he`|
|Hindi|`hi`|
|Hungarian|`hu`|
|Indonesian|`id`|
|Italian|`it`|
|Japanese|`ja`|
|Korean|`ko`|
|Latvian|`lv`|
|Lithuanian|`lt`|
|Macedonian|`mk`|
|Marathi|`mr`|
|Modern Greek (1453-)|`el`|
|Nepali (macrolanguage)|`ne`|
|Norwegian|`no`|
|Panjabi|`pa`|
|Persian|`fa`|
|Polish|`pl`|
|Portuguese|`pt`|
|Romanian|`rm`|
|Russian|`ru`|
|Slovak|`sk`|
|Slovenian|`sl`|
|Somali (Arabic)|`so`|
|Somali (Latin)|`so-latn`|
|Spanish|`es`|
|Swahili (macrolanguage)|`sw`|
|Swedish|`sv`|
|Tamil|`ta`|
|Thai|`th`|
|Turkish|`tr`|
|Ukrainian|`uk`|
|Urdu|`ur`|
|Vietnamese|`vi`|

## [**Handwritten text**](#tab/handwritten)

The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`|

---
:::moniker-end

:::moniker range=">=doc-intel-3.1.0"

Neural models support added languages for the `v3.1` and later APIs.

| Languages | API version |
|:--:|:--:|
| English |`v4.0:2023-10-31-preview`, `v3.1:2023-07-31 (GA)`, `v3.0:2022-08-31 (GA)`|
| German |`v4.0:2023-10-31-preview`, `v3.1:2023-07-31 (GA)`|
| Italian |`v4.0:2023-10-31-preview`, `v3.1:2023-07-31 (GA)`|
| French |`v4.0:2023-10-31-preview`, `v3.1:2023-07-31 (GA)`|
| Spanish |`v4.0:2023-10-31-preview`, `v3.1:2023-07-31 (GA)`|
| Dutch |`v4.0:2023-10-31-preview`, `v3.1:2023-07-31 (GA)`|

:::moniker-end

## Custom template

::: moniker range=">=doc-intel-3.0.0"

## [**Printed**](#tab/printed)

The following table lists the supported languages for printed text.

:::row:::
   :::column span="":::
  |Language| Code (optional) |
  |:-----|:----:|
  |Abaza|abq|
  |Abkhazian|ab|
  |Achinese|ace|
  |Acoli|ach|
  |Adangme|ada|
  |Adyghe|ady|
  |Afar|aa|
  |Afrikaans|af|
  |Akan|ak|
  |Albanian|sq|
  |Algonquin|alq|
  |Angika (Devanagari)|anp|
  |Arabic|ar|
  |Asturian|ast|
  |Asu (Tanzania)|asa|
  |Avaric|av|
  |Awadhi-Hindi (Devanagari)|awa|
  |Aymara|ay|
  |Azerbaijani (Latin)|az|
  |Bafia|ksf|
  |Bagheli|bfy|
  |Bambara|bm|
  |Bashkir|ba|
  |Basque|eu|
  |Belarusian (Cyrillic)|be, be-cyrl|
  |Belarusian (Latin)|be, be-latn|
  |Bemba (Zambia)|bem|
  |Bena (Tanzania)|bez|
  |Bhojpuri-Hindi (Devanagari)|bho|
  |Bikol|bik|
  |Bini|bin|
  |Bislama|bi|
  |Bodo (Devanagari)|brx|
  |Bosnian (Latin)|bs|
  |Brajbha|bra|
  |Breton|br|
  |Bulgarian|bg|
  |Bundeli|bns|
  |Buryat (Cyrillic)|bua|
  |Catalan|ca|
  |Cebuano|ceb|
  |Chamling|rab|
  |Chamorro|ch|
  |Chechen|ce|
  |Chhattisgarhi (Devanagari)|hne|
  |Chiga|cgg|
  |Chinese Simplified|zh-Hans|
  |Chinese Traditional|zh-Hant|
  |Choctaw|cho|
  |Chukot|ckt|
  |Chuvash|cv|
  |Cornish|kw|
  |Corsican|co|
  |Cree|cr|
  |Creek|mus|
  |Crimean Tatar (Latin)|crh|
  |Croatian|hr|
  |Crow|cro|
  |Czech|cs|
  |Danish|da|
  |Dargwa|dar|
  |Dari|prs|
  |Dhimal (Devanagari)|dhi|
  |Dogri (Devanagari)|doi|
  |Duala|dua|
  |Dungan|dng|
  |Dutch|nl|
  |Efik|efi|
  |English|en|
  |Erzya (Cyrillic)|myv|
  |Estonian|et|
  |Faroese|fo|
  |Fijian|fj|
  |Filipino|fil|
  |Finnish|fi|
   :::column-end:::
   :::column span="":::
  |Language| Code (optional) |
  |:-----|:----:|
  |Fon|fon|
  |French|fr|
  |Friulian|fur|
  |Ga|gaa|
  |Gagauz (Latin)|gag|
  |Galician|gl|
  |Ganda|lg|
  |Gayo|gay|
  |German|de|
  |Gilbertese|gil|
  |Gondi (Devanagari)|gon|
  |Greek|el|
  |Greenlandic|kl|
  |Guarani|gn|
  |Gurung (Devanagari)|gvr|
  |Gusii|guz|
  |Haitian Creole|ht|
  |Halbi (Devanagari)|hlb|
  |Hani|hni|
  |Haryanvi|bgc|
  |Hawaiian|haw|
  |Hebrew|he|
  |Herero|hz|
  |Hiligaynon|hil|
  |Hindi|hi|
  |Hmong Daw (Latin)|mww|
  |Ho(Devanagiri)|hoc|
  |Hungarian|hu|
  |Iban|iba|
  |Icelandic|is|
  |Igbo|ig|
  |Iloko|ilo|
  |Inari Sami|smn|
  |Indonesian|id|
  |Ingush|inh|
  |Interlingua|ia|
  |Inuktitut (Latin)|iu|
  |Irish|ga|
  |Italian|it|
  |Japanese|ja|
  |Jaunsari (Devanagari)|Jns|
  |Javanese|jv|
  |Jola-Fonyi|dyo|
  |Kabardian|kbd|
  |Kabuverdianu|kea|
  |Kachin (Latin)|kac|
  |Kalenjin|kln|
  |Kalmyk|xal|
  |Kangri (Devanagari)|xnr|
  |Kanuri|kr|
  |Karachay-Balkar|krc|
  |Kara-Kalpak (Cyrillic)|kaa-cyrl|
  |Kara-Kalpak (Latin)|kaa|
  |Kashubian|csb|
  |Kazakh (Cyrillic)|kk-cyrl|
  |Kazakh (Latin)|kk-latn|
  |Khakas|kjh|
  |Khaling|klr|
  |Khasi|kha|
  |K'iche'|quc|
  |Kikuyu|ki|
  |Kildin Sami|sjd|
  |Kinyarwanda|rw|
  |Komi|kv|
  |Kongo|kg|
  |Korean|ko|
  |Korku|kfq|
  |Koryak|kpy|
  |Kosraean|kos|
  |Kpelle|kpe|
  |Kuanyama|kj|
  |Kumyk (Cyrillic)|kum|
  |Kurdish (Arabic)|ku-arab|
  |Kurdish (Latin)|ku-latn|
  |Kurukh (Devanagari)|kru|
  |Kyrgyz (Cyrillic)|ky|
  |Lak|lbe|
  |Lakota|lkt|
   :::column-end:::
   :::column span="":::
  |Language| Code (optional) |
  |:-----|:----:|
  |Latin|la|
  |Latvian|lv|
  |Lezghian|lex|
  |Lingala|ln|
  |Lithuanian|lt|
  |Lower Sorbian|dsb|
  |Lozi|loz|
  |Lule Sami|smj|
  |Luo (Kenya and Tanzania)|luo|
  |Luxembourgish|lb|
  |Luyia|luy|
  |Macedonian|mk|
  |Machame|jmc|
  |Madurese|mad|
  |Mahasu Pahari (Devanagari)|bfz|
  |Makhuwa-Meetto|mgh|
  |Makonde|kde|
  |Malagasy|mg|
  |Malay (Latin)|ms|
  |Maltese|mt|
  |Malto (Devanagari)|kmj|
  |Mandinka|mnk|
  |Manx|gv|
  |Maori|mi|
  |Mapudungun|arn|
  |Marathi|mr|
  |Mari (Russia)|chm|
  |Masai|mas|
  |Mende (Sierra Leone)|men|
  |Meru|mer|
  |Meta'|mgo|
  |Minangkabau|min|
  |Mohawk|moh|
  |Mongolian (Cyrillic)|mn|
  |Mongondow|mog|
  |Montenegrin (Cyrillic)|cnr-cyrl|
  |Montenegrin (Latin)|cnr-latn|
  |Morisyen|mfe|
  |Mundang|mua|
  |Nahuatl|nah|
  |Navajo|nv|
  |Ndonga|ng|
  |Neapolitan|nap|
  |Nepali|ne|
  |Ngomba|jgo|
  |Niuean|niu|
  |Nogay|nog|
  |North Ndebele|nd|
  |Northern Sami (Latin)|sme|
  |Norwegian|no|
  |Nyanja|ny|
  |Nyankole|nyn|
  |Nzima|nzi|
  |Occitan|oc|
  |Ojibwa|oj|
  |Oromo|om|
  |Ossetic|os|
  |Pampanga|pam|
  |Pangasinan|pag|
  |Papiamento|pap|
  |Pashto|ps|
  |Pedi|nso|
  |Persian|fa|
  |Polish|pl|
  |Portuguese|pt|
  |Punjabi (Arabic)|pa|
  |Quechua|qu|
  |Ripuarian|ksh|
  |Romanian|ro|
  |Romansh|rm|
  |Rundi|rn|
  |Russian|ru|
  |Rwa|rwk|
  |Sadri (Devanagari)|sck|
  |Sakha|sah|
  |Samburu|saq|
  |Samoan (Latin)|sm|
  |Sango|sg|
   :::column-end:::
   :::column span="":::
  |Language| Code (optional) |
  |:-----|:----:|
  |Sangu (Gabon)|snq|
  |Sanskrit (Devanagari)|sa|
  |Santali(Devanagiri)|sat|
  |Scots|sco|
  |Scottish Gaelic|gd|
  |Sena|seh|
  |Serbian (Cyrillic)|sr-cyrl|
  |Serbian (Latin)|sr, sr-latn|
  |Shambala|ksb|
  |Shona|sn|
  |Siksika|bla|
  |Sirmauri (Devanagari)|srx|
  |Skolt Sami|sms|
  |Slovak|sk|
  |Slovenian|sl|
  |Soga|xog|
  |Somali (Arabic)|so|
  |Somali (Latin)|so-latn|
  |Songhai|son|
  |South Ndebele|nr|
  |Southern Altai|alt|
  |Southern Sami|sma|
  |Southern Sotho|st|
  |Spanish|es|
  |Sundanese|su|
  |Swahili (Latin)|sw|
  |Swati|ss|
  |Swedish|sv|
  |Tabassaran|tab|
  |Tachelhit|shi|
  |Tahitian|ty|
  |Taita|dav|
  |Tajik (Cyrillic)|tg|
  |Tamil|ta|
  |Tatar (Cyrillic)|tt-cyrl|
  |Tatar (Latin)|tt|
  |Teso|teo|
  |Tetum|tet|
  |Thai|th|
  |Thangmi|thf|
  |Tok Pisin|tpi|
  |Tongan|to|
  |Tsonga|ts|
  |Tswana|tn|
  |Turkish|tr|
  |Turkmen (Latin)|tk|
  |Tuvan|tyv|
  |Udmurt|udm|
  |Uighur (Cyrillic)|ug-cyrl|
  |Ukrainian|uk|
  |Upper Sorbian|hsb|
  |Urdu|ur|
  |Uyghur (Arabic)|ug|
  |Uzbek (Arabic)|uz-arab|
  |Uzbek (Cyrillic)|uz-cyrl|
  |Uzbek (Latin)|uz|
  |Vietnamese|vi|
  |Volapük|vo|
  |Vunjo|vun|
  |Walser|wae|
  |Welsh|cy|
  |Western Frisian|fy|
  |Wolof|wo|
  |Xhosa|xh|
  |Yucatec Maya|yua|
  |Zapotec|zap|
  |Zarma|dje|
  |Zhuang|za|
  |Zulu|zu|
   :::column-end:::
:::row-end:::

## [**Handwritten**](#tab/handwritten)

The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`|
---
:::moniker-end
