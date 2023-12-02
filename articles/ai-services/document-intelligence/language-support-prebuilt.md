---
title: Language and locale support for prebuilt models - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Document Intelligence prebuilt / pretrained model language extraction and detection support
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
---

# Language support: prebuilt models

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

Azure AI Document Intelligence models provide multilingual document processing support. Our language support capabilities enable your users to communicate with your applications in natural ways and empower global outreach. Prebuilt models enable you to add intelligent domain-specific document processing to your apps and flows without having to train and build your own models. The following tables list the available language and locale support by model and feature:

## Business card

:::moniker range="doc-intel-4.0.0"
 > [!IMPORTANT]
> Starting with Document Intelligence **v4.0 (preview)**, and going forward, the business card model (prebuilt-businessCard) is deprecated. To extract data from business card formats, use the following:

| Feature   | version| Model ID |
|----------  |---------|--------|
| Business card model|&bullet; v3.1:2023-07-31 (GA)</br>&bullet; v3.0:2022-08-31 (GA)</br>&bullet; v2.1 (GA)|**`prebuilt-businessCard`**|
:::moniker-end

:::moniker range="doc-intel-3.1.0 || doc-intel-3.0.0 "

***Model ID: prebuilt-businessCard***

| Language—Locale code | Default |
|:----------------------|:---------|
| &bullet; English (United States)—en-US</br>&bullet;  English (Australia)—en-AU</br>&bullet; English (Canada)—en-CA</br>&bullet; English (United Kingdom)—en-GB</br>&bullet; English (India)—en-IN</br>&bullet; English (Japan)—en-JP</br>&bullet; Japanese (Japan)—ja-JP  | Autodetected (en-US or ja-JP)

:::moniker-end

:::moniker range="doc-intel-2.1.0"

| Language—Locale code | Default |
|:----------------------|:---------|
|&bullet; English (United States)—en-US</br>&bullet;  English (Australia)—en-AU</br>&bullet; English (Canada)—en-CA</br>&bullet; English (United Kingdom)—en-GB</br>&bullet; English (India)—en-IN</li> | Autodetected |

:::moniker-end

## Contract

:::moniker range="doc-intel-4.0.0 ||doc-intel-3.1.0"

***Model ID: prebuilt-contract***

| Language—Locale code | Default |
|:----------------------|:---------|
| English (United States)—en-US| English (United States)—en-US|

:::moniker-end

## General document

:::moniker range="doc-intel-4.0.0"
> [!IMPORTANT]
> Starting with D:ocument Intelligence **2023-10-31-preview** and going forward, the general document model (prebuilt-document) is deprecated. To extract key-value pairs, selection marks, text, tables, and structure from documents, use the following models:

| Feature   | version| Model ID |
|----------  |---------|--------|
|`Layout` model with the optional query string parameter **`features=keyValuePairs`** enabled.|&bullet; v4:2023-10-31-preview</br>&bullet; v3.1:2023-07-31 (GA) |**`prebuilt-layout`**|
|General document model|&bullet; v3.1:2023-07-31 (GA)</br>&bullet; v3.0:2022-08-31 (GA)</br>&bullet; v2.1 (GA)|**`prebuilt-document`**|
:::moniker-end

:::moniker range="doc-intel-4.0.0 ||doc-intel-3.1.0"

***Model ID: prebuilt-document***

| Language—Locale code | Default |
|:----------------------|:---------|
| English (United States)|English (United States)—en-US|
:::moniker-end

## Health insurance card

:::moniker range=">=doc-intel-3.0.0"

***Model ID: prebuilt-healthInsuranceCard.us***

| Language—Locale code | Default |
|:----------------------|:---------|
| English (United States)|English (United States)—en-US|

:::moniker-end

## ID document

:::moniker range=">=doc-intel-3.0.0"

***Model ID: prebuilt-idDocument***

#### Supported document types

| Region | Document types |
|--------|----------------|
|Worldwide|Passport Book, Passport Card|
|United States|Driver License, Identification Card, Residency Permit (Green card), Social Security Card, Military ID|
|Europe|Driver License, Identification Card, Residency Permit|
|India|Driver License, PAN Card, Aadhaar Card|
|Canada|Driver License, Identification Card, Residency Permit (Maple Card)|
|Australia|Driver License, Photo Card, Key-pass ID (including digital version)|

::: moniker-end

:::moniker range=">=doc-intel-2.1.0"

| Region | Document types |
|--------|----------------|
|Worldwide|Passport Book, Passport Card|
|United States|Driver License, Identification Card

:::moniker-end

## Invoice

***Model ID: prebuilt-invoice***

:::moniker range=">=doc-intel-3.1.0"

### [Supported langauges](#tab/languages)
| Languages | Details |
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

### [Supported Currency Codes](#tab/currency)
|Currency Codes | Details |
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
---
:::moniker-end

:::moniker range="doc-intel-3.0.0"

### [Supported langauges](#tab/languages)
| Supported languages | Details |
|:----------------------|:---------|
| &bullet; English (`en`) | United States (`us`), Australia (`au`), Canada (`ca`), United Kingdom (-uk), India (-in)|
| &bullet; Spanish (`es`) |Spain (`es`)|
| &bullet; German (`de`) | Germany (`de`)|
| &bullet; French (`fr`) | France (`fr`) |
| &bullet; Italian (`it`) | Italy (`it`)|
| &bullet; Portuguese (`pt`) | Portugal (`pt`), Brazil (`br`)|
| &bullet; Dutch (`nl`) | Netherlands (`nl`)|

### [Supported Currency Codes](#tab/currency)
| Supported Currency Codes | Details |
|:----------------------|:---------|
| &bullet; BRL | Brazilian Real (`br`) |
| &bullet; GBP | British Pound Sterling (`gb`) |
| &bullet; CAD | Canada (`ca`) |
| &bullet; EUR | Euro (`eu`) |
| &bullet; GGP | Guernsey Pound (`gg`) |
| &bullet; INR | Indian Rupee (`in`) |
| &bullet; USD | United States (`us`) |
---
:::moniker-end

:::moniker range="doc-intel-2.1.0"
  | Supported languages | Details |
  |:----------------------|:---------|
  |English (`en`) | United States (`us`)
:::moniker-end

## Receipt

:::moniker range=">=doc-intel-3.0.0"

***Model ID: prebuilt-receipt***

### [Thermal receipts](#tab/thermal)
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


### [Hotel receipts](#tab/hotel)
| Supported Languages | Details |
|:--------------------|:-------:|
|English|United States (`en-US`)|
|French|France (`fr-FR`)|
|German|Germany (`de-DE`)|
|Italian|Italy (`it-IT`)|
|Japanese|Japan (`ja-JP`)|
|Portuguese|Portugal (`pt-PT`)|
|Spanish|Spain (`es-ES`)|

---
::: moniker-end

::: moniker range="doc-intel-2.1.0"

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Receipt| &bullet; English (United States)—en-US</br> &bullet; English (Australia)—en-AU</br> &bullet; English (Canada)—en-CA</br> &bullet; English (United Kingdom)—en-GB</br> &bullet; English (India)—en-IN  | Autodetected |

::: moniker-end

## Tax documents

:::moniker range="doc-intel-4.0.0"
  | Model ID | Language—Locale code | Default |
  |--------|:----------------------|:---------|
  |**prebuilt-tax.us.w2**|English (United States)|English (United States)—en-US|
  |**prebuilt-tax.us.1098**|English (United States)|English (United States)—en-US|
  |**prebuilt-tax.us.1098E**|English (United States)|English (United States)—en-US|
  |**prebuilt-tax.us.1098T**|English (United States)|English (United States)—en-US|
  |**prebuilt-tax.us.1099**|English (United States)|English (United States)—en-US|
:::moniker-end

:::moniker range="doc-intel-3.1.0"
  | Model ID | Language—Locale code | Default |
  |--------|:----------------------|:---------|
  |**prebuilt-tax.us.w2**|English (United States)|English (United States)—en-US|
  |**prebuilt-tax.us.1098**|English (United States)|English (United States)—en-US|
  |**prebuilt-tax.us.1098E**|English (United States)|English (United States)—en-US|
  |**prebuilt-tax.us.1098T**|English (United States)|English (United States)—en-US|
:::moniker-end

:::moniker range="doc-intel-3.0.0"
  | Model ID | Language—Locale code | Default |
  |--------|:----------------------|:---------|
  |**prebuilt-tax.us.w2**|English (United States)|English (United States)—en-US|
:::moniker-end
