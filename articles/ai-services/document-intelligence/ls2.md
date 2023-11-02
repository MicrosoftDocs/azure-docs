---
title: Language and locale support - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Learn which human languages Document Intelligence supports
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/15/2023
---

# Language detection and extraction support

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

Azure AI Document Intelligence models support many languages. Our language support capabilities enable your users to communicate with your applications in natural ways and empower global outreach. The following tables list the available language and locale by model and feature:

* [**Document analysis models**](#document-analysis-models)

* [**Prebuilt models**](#prebuilt-models)

* [**Custom models**](#custom-models)

> [!NOTE]
> **Language code optional**
>
> * Document Intelligence's deep learning based universal models extract all multi-lingual text in your documents, including text lines with mixed languages, and don't require specifying a language code.
> * Don't provide the language code as the parameter unless you are sure about the language and want to force the service to apply only the relevant model. Otherwise, the service may return incomplete and incorrect text.
>
> * aLSO, It's not necessary to specify a locale. This is an optional parameter. The Document Intelligence deep-learning technology will auto-detect the text language in your image.

## Document Analysis models

### [Read](#tab/read)

##### Language support: prebuilt read model

#### Handwritten text

:::moniker range="doc-intel-4.0.0"
The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`| Russian (preview) | `ru` |
|Thai (preview) | `th` | Arabic (preview) | `ar` |
:::moniker-end

::: moniker range="doc-intel-3.1.0"
The following table lists the supported languages for extracting handwritten texts.</br>

##### Model ID: **prebuilt-read**

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`|
:::moniker-end

::: moniker range="doc-intel-3.0.0"
The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`|

:::moniker-end

#### Print text

:::moniker range=">=doc-intel-3.1.0"

The following table lists the supported languages for print text by the most recent GA version.

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
  |Sherpa (Devanagari)|xsr|
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
:::moniker-end

::: moniker range="doc-intel-3.0.0"

The following table lists the supported languages for print text by the most recent GA version.

:::row:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Afrikaans|af|
  |Angika|anp|
  |Arabic|ar|
  |Asturian|ast|
  |Awadhi|awa|
  |Azerbaijani|az|
  |Belarusian (Cyrillic)|be, be-cyrl|
  |Belarusian (Latin)|be-latn|
  |Bagheli|bfy|
  |Mahasu Pahari|bfz|
  |Bulgarian|bg|
  |Haryanvi|bgc|
  |Bhojpuri|bho|
  |Bislama|bi|
  |Bundeli|bns|
  |Breton|br|
  |Braj|bra|
  |Bodo|brx|
  |Bosnian|bs|
  |Buriat|bua|
  |Catalan|ca|
  |Cebuano|ceb|
  |Chamorro|ch|
  |Montenegrin (Latin)|cnr, cnr-latn|
  |Montenegrin (Cyrillic)|cnr-cyrl|
  |Corsican|co|
  |Crimean Tatar|crh|
  |Czech|cs|
  |Kashubian|csb|
  |Welsh|cy|
  |Danish|da|
  |German|de|
  |Dhimal|dhi|
  |Dogri|doi|
  |Lower Sorbian|dsb|
  |English|en|
  |Spanish|es|
  |Estonian|et|
  |Basque|eu|
  |Persian|fa|
  |Finnish|fi|
:::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Filipino|fil|
  |Fijian|fj|
  |Faroese|fo|
  |French|fr|
  |Friulian|fur|
  |Western Frisian|fy|
  |Irish|ga|
  |Gagauz|gag|
  |Scottish Gaelic|gd|
  |Gilbertese|gil|
  |Galician|gl|
  |Gondi|gon|
  |Manx|gv|
  |Gurung|gvr|
  |Hawaiian|haw|
  |Hindi|hi|
  |Halbi|hlb|
  |Chhattisgarhi|hne|
  |Hani|hni|
  |Ho|hoc|
  |Croatian|hr|
  |Upper Sorbian|hsb|
  |Haitian|ht|
  |Hungarian|hu|
  |Interlingua|ia|
  |Indonesian|id|
  |Icelandic|is|
  |Italian|it|
  |Inuktitut|iu|
  |Japanese|
  |Jaunsari|jns|
  |Javanese|jv|
  |Kara-Kalpak (Latin)|kaa, kaa-latn|
  |Kara-Kalpak (Cyrillic)|kaa-cyrl|
  |Kachin|kac|
  |Kabuverdianu|kea|
  |Korku|kfq|
  |Khasi|kha|
  |Kazakh (Latin)|kk, kk-latn|
  |Kazakh (Cyrillic)|kk-cyrl|
  |Kalaallisut|kl|
  :::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Khaling|klr|
  |Malto|kmj|
  |Korean|
  |Kosraean|kos|
  |Koryak|kpy|
  |Karachay-Balkar|krc|
  |Kurukh|kru|
  |Kölsch|ksh|
  |Kurdish (Latin)|ku, ku-latn|
  |Kurdish (Arabic)|ku-arab|
  |Kumyk|kum|
  |Cornish|kw|
  |Kirghiz|ky|
  |Latin|la|
  |Luxembourgish|lb|
  |Lakota|lkt|
  |Lithuanian|lt|
  |Maori|mi|
  |Mongolian|mn|
  |Marathi|mr|
  |Malay|ms|
  |Maltese|mt|
  |Hmong Daw|mww|
  |Erzya|myv|
  |Neapolitan|nap|
  |Nepali|ne|
  |Niuean|niu|
  |Dutch|nl|
  |Norwegian|no|
  |Nogai|nog|
  |Occitan|oc|
  |Ossetian|os|
  |Panjabi|pa|
  |Polish|pl|
  |Dari|prs|
  |Pushto|ps|
  |Portuguese|pt|
  |K'iche'|quc|
  |Camling|rab|
  |Romansh|rm|
 :::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Romanian|ro|
  |Russian|ru|
  |Sanskrit|sa|
  |Santali|sat|
  |Sadri|sck|
  |Scots|sco|
  |Slovak|sk|
  |Slovenian|sl|
  |Samoan|sm|
  |Southern Sami|sma|
  |Northern Sami|sme|
  |Lule Sami|smj|
  |Inari Sami|smn|
  |Skolt Sami|sms|
  |Somali|so|
  |Albanian|sq|
  |Serbian (Latin)|sr, sr-latn|
  |Sirmauri|srx|
  |Swedish|sv|
  |Swahili|sw|
  |Tetum|tet|
  |Tajik|tg|
  |Thangmi|thf|
  |Turkmen|tk|
  |Tonga|to|
  |Turkish|tr|
  |Tatar|tt|
  |Tuvinian|tyv|
  |Uighur|ug|
  |Urdu|ur|
  |Uzbek (Latin)|uz, uz-latn|
  |Uzbek (Cyrillic)|uz-cyrl|
  |Uzbek (Arabic)|uz-arab|
  |Volapük|vo|
  |Walser|wae|
  |Kangri|xnr|
  |Sherpa|xsr|
  |Yucateco|yua|
  |Zhuang|za|
  |Chinese (Han (Simplified variant))|zh, zh-hans|
  |Chinese (Han (Traditional variant))|zh-hant|
  |Zulu|zu||Romanian|ro|
  |Russian|ru|
  |Sanskrit|sa|
  |Santali|sat|
  |Sadri|sck|
  |Scots|sco|
  |Slovak|sk|
  |Slovenian|sl|
  |Samoan|sm|
  |Southern Sami|sma|
  |Northern Sami|sme|
  |Lule Sami|smj|
  |Inari Sami|smn|
  |Skolt Sami|sms|
  |Somali|so|
  |Albanian|sq|
  |Serbian (Latin)|sr, sr-latn|
  |Sirmauri|srx|
  |Swedish|sv|
  |Swahili|sw|
  |Tetum|tet|
  |Tajik|tg|
  |Thangmi|thf|
  |Turkmen|tk|
  |Tonga|to|
  |Turkish|tr|
  |Tatar|tt|
  |Tuvinian|tyv|
  |Uighur|ug|
  |Urdu|ur|
  |Uzbek (Latin)|uz, uz-latn|
  |Uzbek (Cyrillic)|uz-cyrl|
  |Uzbek (Arabic)|uz-arab|
  |Volapük|vo|
  |Walser|wae|
  |Kangri|xnr|
  |Sherpa|xsr|
  |Yucateco|yua|
  |Zhuang|za|
  |Chinese (Han (Simplified variant))|zh, zh-hans|
  |Chinese (Han (Traditional variant))|zh-hant|
  |Zulu|zu|
   :::column-end:::
:::row-end:::

:::moniker-end


#### Detected languages: Read API

The [Read API](concept-read.md) supports detecting the following languages in your documents. This list can include languages not currently supported for text extraction.

> [!IMPORTANT]
> **Language detection**
>
> * Document Intelligence read model can _detect_ possible presence of languages and returns language codes for detected languages.
>
> **Detected languages vs extracted languages**
>
> * This section lists the languages we can detect from the documents using the Read model, if present.
> * Please note that this list differs from list of languages we support extracting text from, which is specified in the above sections for each model.

:::row:::
   :::column span="":::
| Language            | Code          |
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
   :::column-end:::
   :::column span="":::
| Language            | Code          |
|---------------------|---------------|
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
| Odia               | `or`          |
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
   :::column-end:::
:::row-end:::

### [Layout](#tab/layout)

##### Language support: prebuilt layout model

##### Model ID: **prebuilt-layout**

#### Handwritten text

:::moniker range="doc-intel-4.0.0"

The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`| Russian (preview) | `ru` |
|Thai (preview) | `th` | Arabic (preview) | `ar` |
:::moniker-end

:::moniker range="doc-intel-3.1.0"

The following table lists the language support for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`|

:::moniker-end

:::moniker range="doc-intel-3.0.0"

The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`| Russian (preview) | `ru` |
|Thai (preview) | `th` | Arabic (preview) | `ar` |
:::moniker-end

#### Print text

:::moniker range=">=doc-intel-3.1.0":::

The following table lists the supported languages for print text by the most recent GA version.

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
  |Sherpa (Devanagari)|xsr|
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
:::moniker-end

:::moniker range="doc-intel-3.0.0"
The following table lists the supported languages for print text by the most recent GA version.

:::row:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Afrikaans|af|
  |Angika|anp|
  |Arabic|ar|
  |Asturian|ast|
  |Awadhi|awa|
  |Azerbaijani|az|
  |Belarusian (Cyrillic)|be, be-cyrl|
  |Belarusian (Latin)|be-latn|
  |Bagheli|bfy|
  |Mahasu Pahari|bfz|
  |Bulgarian|bg|
  |Haryanvi|bgc|
  |Bhojpuri|bho|
  |Bislama|bi|
  |Bundeli|bns|
  |Breton|br|
  |Braj|bra|
  |Bodo|brx|
  |Bosnian|bs|
  |Buriat|bua|
  |Catalan|ca|
  |Cebuano|ceb|
  |Chamorro|ch|
  |Montenegrin (Latin)|cnr, cnr-latn|
  |Montenegrin (Cyrillic)|cnr-cyrl|
  |Corsican|co|
  |Crimean Tatar|crh|
  |Czech|cs|
  |Kashubian|csb|
  |Welsh|cy|
  |Danish|da|
  |German|de|
  |Dhimal|dhi|
  |Dogri|doi|
  |Lower Sorbian|dsb|
  |English|en|
  |Spanish|es|
  |Estonian|et|
  |Basque|eu|
  |Persian|fa|
  |Finnish|fi|
:::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Filipino|fil|
  |Fijian|fj|
  |Faroese|fo|
  |French|fr|
  |Friulian|fur|
  |Western Frisian|fy|
  |Irish|ga|
  |Gagauz|gag|
  |Scottish Gaelic|gd|
  |Gilbertese|gil|
  |Galician|gl|
  |Gondi|gon|
  |Manx|gv|
  |Gurung|gvr|
  |Hawaiian|haw|
  |Hindi|hi|
  |Halbi|hlb|
  |Chhattisgarhi|hne|
  |Hani|hni|
  |Ho|hoc|
  |Croatian|hr|
  |Upper Sorbian|hsb|
  |Haitian|ht|
  |Hungarian|hu|
  |Interlingua|ia|
  |Indonesian|id|
  |Icelandic|is|
  |Italian|it|
  |Inuktitut|iu|
  |Japanese|
  |Jaunsari|jns|
  |Javanese|jv|
  |Kara-Kalpak (Latin)|kaa, kaa-latn|
  |Kara-Kalpak (Cyrillic)|kaa-cyrl|
  |Kachin|kac|
  |Kabuverdianu|kea|
  |Korku|kfq|
  |Khasi|kha|
  |Kazakh (Latin)|kk, kk-latn|
  |Kazakh (Cyrillic)|kk-cyrl|
  |Kalaallisut|kl|
  :::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Khaling|klr|
  |Malto|kmj|
  |Korean|
  |Kosraean|kos|
  |Koryak|kpy|
  |Karachay-Balkar|krc|
  |Kurukh|kru|
  |Kölsch|ksh|
  |Kurdish (Latin)|ku, ku-latn|
  |Kurdish (Arabic)|ku-arab|
  |Kumyk|kum|
  |Cornish|kw|
  |Kirghiz|ky|
  |Latin|la|
  |Luxembourgish|lb|
  |Lakota|lkt|
  |Lithuanian|lt|
  |Maori|mi|
  |Mongolian|mn|
  |Marathi|mr|
  |Malay|ms|
  |Maltese|mt|
  |Hmong Daw|mww|
  |Erzya|myv|
  |Neapolitan|nap|
  |Nepali|ne|
  |Niuean|niu|
  |Dutch|nl|
  |Norwegian|no|
  |Nogai|nog|
  |Occitan|oc|
  |Ossetian|os|
  |Panjabi|pa|
  |Polish|pl|
  |Dari|prs|
  |Pushto|ps|
  |Portuguese|pt|
  |K'iche'|quc|
  |Camling|rab|
  |Romansh|rm|
 :::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Romanian|ro|
  |Russian|ru|
  |Sanskrit|sa|
  |Santali|sat|
  |Sadri|sck|
  |Scots|sco|
  |Slovak|sk|
  |Slovenian|sl|
  |Samoan|sm|
  |Southern Sami|sma|
  |Northern Sami|sme|
  |Lule Sami|smj|
  |Inari Sami|smn|
  |Skolt Sami|sms|
  |Somali|so|
  |Albanian|sq|
  |Serbian (Latin)|sr, sr-latn|
  |Sirmauri|srx|
  |Swedish|sv|
  |Swahili|sw|
  |Tetum|tet|
  |Tajik|tg|
  |Thangmi|thf|
  |Turkmen|tk|
  |Tonga|to|
  |Turkish|tr|
  |Tatar|tt|
  |Tuvinian|tyv|
  |Uighur|ug|
  |Urdu|ur|
  |Uzbek (Latin)|uz, uz-latn|
  |Uzbek (Cyrillic)|uz-cyrl|
  |Uzbek (Arabic)|uz-arab|
  |Volapük|vo|
  |Walser|wae|
  |Kangri|xnr|
  |Sherpa|xsr|
  |Yucateco|yua|
  |Zhuang|za|
  |Chinese (Han (Simplified variant))|zh, zh-hans|
  |Chinese (Han (Traditional variant))|zh-hant|
  |Zulu|zu||Romanian|ro|
  |Russian|ru|
  |Sanskrit|sa|
  |Santali|sat|
  |Sadri|sck|
  |Scots|sco|
  |Slovak|sk|
  |Slovenian|sl|
  |Samoan|sm|
  |Southern Sami|sma|
  |Northern Sami|sme|
  |Lule Sami|smj|
  |Inari Sami|smn|
  |Skolt Sami|sms|
  |Somali|so|
  |Albanian|sq|
  |Serbian (Latin)|sr, sr-latn|
  |Sirmauri|srx|
  |Swedish|sv|
  |Swahili|sw|
  |Tetum|tet|
  |Tajik|tg|
  |Thangmi|thf|
  |Turkmen|tk|
  |Tonga|to|
  |Turkish|tr|
  |Tatar|tt|
  |Tuvinian|tyv|
  |Uighur|ug|
  |Urdu|ur|
  |Uzbek (Latin)|uz, uz-latn|
  |Uzbek (Cyrillic)|uz-cyrl|
  |Uzbek (Arabic)|uz-arab|
  |Volapük|vo|
  |Walser|wae|
  |Kangri|xnr|
  |Sherpa|xsr|
  |Yucateco|yua|
  |Zhuang|za|
  |Chinese (Han (Simplified variant))|zh, zh-hans|
  |Chinese (Han (Traditional variant))|zh-hant|
  |Zulu|zu|
   :::column-end:::
:::row-end:::
:::moniker-end

### [General document](#tab/read)

##### Language support: prebuilt document model

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|**prebuilt-document**| English (United States)—en-US| English (United States)—en-US|

---

## Prebuilt models

### [Business card](#tab/business-card)

##### Language support: prebuilt business card model

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|**prebuilt-businessCard** (v3.0 API)| &bullet; English (United States)—en-US</br>&bullet;  English (Australia)—en-AU</br>&bullet; English (Canada)—en-CA</br>&bullet; English (United Kingdom)—en-GB</br>&bullet; English (India)—en-IN</br>&bullet; English (Japan)—en-JP</br>&bullet; Japanese (Japan)—ja-JP  | Autodetected (en-US or ja-JP) |
|Business card (v2.1 API)| &bullet; English (United States)—en-US</br>&bullet;  English (Australia)—en-AU</br>&bullet; English (Canada)—en-CA</br>&bullet; English (United Kingdom)—en-GB</br>&bullet; English (India)—en-IN</li> | Autodetected |

### [Contract](#tab/contract)

##### Language support: prebuilt contract model

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|**prebuilt-contract**| English (United States)—en-US| English (United States)—en-US|

### [Health insurance card](#tab/health-insurance-card)

##### Language support: prebuilt health insurance card model

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|**prebuilt-healthInsuranceCard.us**| English (United States)|English (United States)—en-US|

### [ID document](#tab/id-document)

##### Language support: prebuilt ID document model

Supported document types

|Model| Region | Document types |
|-----|--------|----------------|
|**prebuilt-idDocument**|||
||Worldwide|Passport Book, Passport Card|
||United States|Driver License, Identification Card, Residency Permit (Green card), Social Security Card, Military ID|
||Europe|Driver License, Identification Card, Residency Permit|
||India|Driver License, PAN Card, Aadhaar Card|
||Canada|Driver License, Identification Card, Residency Permit (Maple Card)|
||Australia|Driver License, Photo Card, Key-pass ID (including digital version)|

### [Invoice](#tab/invoice)

##### Language support: prebuilt invoice model

:::moniker range="doc-intel-3.1.0"

##### Model ID: **prebuilt-invoice**

| Supported languages | Details |
|:----------------------|:---------|
| &bullet; English (`en`) | United States (`us`), Australia (`au`), Canada (`ca`), United Kingdom (-uk), India (-in)|
| &bullet; Spanish (`es`) |Spain (`es`)|
| &bullet; German (`de`) | Germany (`de`)|
| &bullet; French (`fr`) | France (`fr`) |
| &bullet; Italian (`it`) | Italy (`it`)|
| &bullet; Portuguese (`pt`) | Portugal (`pt`), Brazil (`br`)|
| &bullet; Dutch (`nl`) | Netherlands (`nl`)|
| &bullet; Czech (`cs`) | Czech Republic (`cz`)|
| &bullet; Danish (`da`) | Denmark (`dk`)|
| &bullet; Estonian (`et`) | Estonia (`ee`)|
| &bullet; Finnish (`fi`) | Finland (`fl`)|
| &bullet; Croatian (`hr`) | Bosnia and Herzegovina (`ba`), Croatia (`hr`), Serbia (`rs`)|
| &bullet; Hungarian (`hu`) | Hungary (`hu`)|
| &bullet; Icelandic (`is`) | Iceland (`is`)|
| &bullet; Japanese (`ja`) | Japan (`ja`)|
| &bullet; Korean (`ko`) | Korea (`kr`)|
| &bullet; Lithuanian (`lt`) | Lithuania (`lt`)|
| &bullet; Latvian (`lv`) | Latvia (`lv`)|
| &bullet; Malay (`ms`) | Malaysia (`ms`)|
| &bullet; Norwegian (`nb`) | Norway (`no`)|
| &bullet; Polish (`pl`) | Poland (`pl`)|
| &bullet; Romanian (`ro`) | Romania (`ro`)|
| &bullet; Slovak (`sk`) | Slovakia (`sv`)|
| &bullet; Slovenian (`sl`) | Slovenia (`sl`)|
| &bullet; Serbian (sr-Latn) | Serbia (latn-rs)|
| &bullet; Albanian (`sq`) | Albania (`al`)|
| &bullet; Swedish (`sv`) | Sweden (`se`)|
| &bullet; Chinese (simplified (zh-hans)) | China (zh-hans-cn)|
| &bullet; Chinese (traditional (zh-hant)) | Hong Kong SAR (zh-hant-hk), Taiwan (zh-hant-tw)|

| Supported Currency Codes | Details |
|:----------------------|:---------|
| &bullet; ARS | Argentine Peso (`ar`) |
| &bullet; AUD | Australian Dollar (`au`) |
| &bullet; BRL | Brazilian Real (`br`) |
| &bullet; CAD | Canadian Dollar (`ca`) |
| &bullet; CLP | Chilean Peso (`cl`) |
| &bullet; CNY | Chinese Yuan (`cn`) |
| &bullet; COP | Colombian Peso (`co`) |
| &bullet; CRC | Costa Rican Coldón (`us`) |
| &bullet; CZK | Czech Koruna (`cz`) |
| &bullet; DKK | Danish Krone (`dk`) |
| &bullet; EUR | Euro (`eu`) |
| &bullet; GBP | British Pound Sterling (`gb`) |
| &bullet; GGP | Guernsey Pound (`gg`) |
| &bullet; HUF | Hungarian Forint (`hu`) |
| &bullet; IDR | Indonesian Rupiah (`id`) |
| &bullet; INR | Indian Rupee (`in`) |
| &bullet; ISK | Icelandic Króna (`us`) |
| &bullet; JPY | Japanese Yen (`jp`) |
| &bullet; KRW | South Korean Won (`kr`) |
| &bullet; NOK | Norwegian Krone (`no`) |
| &bullet; PAB | Panamanian Balboa (`pa`) |
| &bullet; PEN | Peruvian Sol (`pe`) |
| &bullet; PLN | Polish Zloty (`pl`) |
| &bullet; RON | Romanian Leu (`ro`) |
| &bullet; RSD | Serbian Dinar (`rs`) |
| &bullet; SEK | Swedish Krona (`se`) |
| &bullet; TWD | New Taiwan Dollar (`tw`) |
| &bullet; USD | United States Dollar (`us`) |

:::moniker-end

:::moniker range="doc-intel-3.0.0"

| Supported languages | Details |
|:----------------------|:---------|
| &bullet; English (`en`) | United States (`us`), Australia (`au`), Canada (`ca`), United Kingdom (-uk), India (-in)|
| &bullet; Spanish (`es`) |Spain (`es`)|
| &bullet; German (`de`) | Germany (`de`)|
| &bullet; French (`fr`) | France (`fr`) |
| &bullet; Italian (`it`) | Italy (`it`)|
| &bullet; Portuguese (`pt`) | Portugal (`pt`), Brazil (`br`)|
| &bullet; Dutch (`nl`) | Netherlands (`nl`)|

| Supported Currency Codes | Details |
|:----------------------|:---------|
| &bullet; BRL | Brazilian Real (`br`) |
| &bullet; GBP | British Pound Sterling (`gb`) |
| &bullet; CAD | Canada (`ca`) |
| &bullet; EUR | Euro (`eu`) |
| &bullet; GGP | Guernsey Pound (`gg`) |
| &bullet; INR | Indian Rupee (`in`) |
| &bullet; USD | United States (`us`) |
:::moniker-end

### [Receipt](#tab/receipt)

##### Language support: prebuilt receipt model

##### Model ID: **prebuilt-receipt**

#### Thermal receipts (retail, meal, parking, etc.)

| Language name | Language code | Language name | Language code |
|:--------------|:-------------:|:--------------|:-------------:|
|English|``en``|Lithuanian|`lt`|
|Afrikaans|``af``|Luxembourgish|`lb`|
|Akan|``ak``|Macedonian|`mk`|
|Albanian|``sq``|Malagasy|`mg`|
|Arabic|``ar``|Malay|`ms`|
|Azerbaijani|``az``|Maltese|`mt`|
|Bamanankan|``bm``|Maori|`mi`|
|Basque|``eu``|Marathi|`mr`|
|Belarusian|``be``|Maya, Yucatán|`yua`|
|Bhojpuri|``bho``|Mongolian|`mn`|
|Bosnian|``bs``|Nepali|`ne`|
|Bulgarian|``bg``|Norwegian|`no`|
|Catalan|``ca``|Nyanja|`ny`|
|Cebuano|``ceb``|Oromo|`om`|
|Corsican|``co``|Pashto|`ps`|
|Croatian|``hr``|Persian|`fa`|
|Czech|``cs``|Persian (Dari)|`prs`|
|Danish|``da``|Polish|`pl`|
|Dutch|``nl``|Portuguese|`pt`|
|Estonian|``et``|Punjabi|`pa`|
|Faroese|``fo``|Quechua|`qu`|
|Fijian|``fj``|Romanian|`ro`|
|Filipino|``fil``|Russian|`ru`|
|Finnish|``fi``|Samoan|`sm`|
|French|``fr``|Sanskrit|`sa`|
|Galician|``gl``|Scottish Gaelic|`gd`|
|Ganda|``lg``|Serbian (Cyrillic)|`sr-cyrl`|
|German|``de``|Serbian (Latin)|`sr-latn`|
|Greek|``el``|Sesotho|`st`|
|Guarani|``gn``|Sesotho sa Leboa|`nso`|
|Haitian Creole|``ht``|Shona|`sn`|
|Hawaiian|``haw``|Slovak|`sk`|
|Hebrew|``he``|Slovenian|`sl`|
|Hindi|``hi``|Somali (Latin)|`so-latn`|
|Hmong Daw|``mww``|Spanish|`es`|
|Hungarian|``hu``|Sundanese|`su`|
|Icelandic|``is``|Swedish|`sv`|
|Igbo|``ig``|Tahitian|`ty`|
|Iloko|``ilo``|Tajik|`tg`|
|Indonesian|``id``|Tamil|`ta`|
|Irish|``ga``|Tatar|`tt`|
|isiXhosa|``xh``|Tatar (Latin)|`tt-latn`|
|isiZulu|``zu``|Thai|`th`|
|Italian|``it``|Tongan|`to`|
|Japanese|``ja``|Turkish|`tr`|
|Javanese|``jv``|Turkmen|`tk`|
|Kazakh|``kk``|Ukrainian|`uk`|
|Kazakh (Latin)|``kk-latn``|Upper Sorbian|`hsb`|
|Kinyarwanda|``rw``|Uyghur|`ug`|
|Kiswahili|``sw``|Uyghur (Arabic)|`ug-arab`|
|Korean|``ko``|Uzbek|`uz`|
|Kurdish|``ku``|Uzbek (Latin)|`uz-latn`|
|Kurdish (Latin)|``ku-latn``|Vietnamese|`vi`|
|Kyrgyz|``ky``|Welsh|`cy`|
|Latin|``la``|Western Frisian|`fy`|
|Latvian|``lv``|Xitsonga|`ts`|
|Lingala|``ln``|||

#### Hotel receipts

| Supported Languages | Details |
|:--------------------|:-------:|
|English|United States (`en-US`)|
|French|France (`fr-FR`)|
|German|Germany (`de-DE`)|
|Italian|Italy (`it-IT`)|
|Japanese|Japan (`ja-JP`)|
|Portuguese|Portugal (`pt-PT`)|
|Spanish|Spain (`es-ES`)|

::: moniker-end

::: moniker range="doc-intel-2.1.0"

### Supported languages and locales v2.1

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Receipt| &bullet; English (United States)—en-US</br> &bullet; English (Australia)—en-AU</br> &bullet; English (Canada)—en-CA</br> &bullet; English (United Kingdom)—en-GB</br> &bullet; English (India)—en-IN  | Autodetected |

::: moniker-end

### [Tax Documents](#tab/tax)

##### Language support: prebuilt tax form models

 Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|**prebuilt-tax.us.w2**|English (United States)|English (United States)—en-US|
|**prebuilt-tax.us.1098**|English (United States)|English (United States)—en-US|
|**prebuilt-tax.us.1098E**|English (United States)|English (United States)—en-US|
|**prebuilt-tax.us.1098T**|English (United States)|English (United States)—en-US|

---

## Custom models

### [Custom classifier](#tab/custom-classifier)

##### Language support: custom classifier model

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|**custom-classification**| English (United States)—en-US| English (United States)—en-US|

### [Custom neural](#tab/custom-neural)

##### Language support: custom neural model

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

### [Custom template](#tab/custom-template)

#### Language support: custom template model

#### Handwritten text

The following table lists the supported languages for extracting handwritten texts.

|Language| Language code (optional) | Language| Language code (optional) |
|:-----|:----:|:-----|:----:|
|English|`en`|Japanese  |`ja`|
|Chinese Simplified   |`zh-Hans`|Korean |`ko`|
|French  |`fr`|Portuguese |`pt`|
|German  |`de`|Spanish  |`es`|
|Italian  |`it`|

#### Print text

The following table lists the supported languages for print text by the most recent GA version.

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
  |Sherpa (Devanagari)|xsr|
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

---
