---
title: Read model OCR data extraction - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Extract print and handwritten text from scanned and digital documents with Document Intelligence's Read OCR model.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---


# Document Intelligence read model

[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0.md)]

> [!NOTE]
>
> For extracting text from external images like labels, street signs, and posters, use the [Azure AI Vision v4.0 preview Read](../../ai-services/Computer-vision/concept-ocr.md) feature optimized for general, non-document images with a performance-enhanced synchronous API that makes it easier to embed OCR in your user experience scenarios.
>

Document Intelligence Read Optical Character Recognition (OCR) model runs at a higher resolution than Azure AI Vision Read and extracts print and handwritten text from PDF documents and scanned images. It also includes support for extracting text from Microsoft Word, Excel, PowerPoint, and HTML documents. It detects paragraphs, text lines, words, locations, and languages. The Read model is the underlying OCR engine for other Document Intelligence prebuilt models like Layout, General Document, Invoice, Receipt, Identity (ID) document, Health insurance card, W2 in addition to custom models.

## What is OCR for documents?

Optical Character Recognition (OCR) for documents is optimized for large text-heavy documents in multiple file formats and global languages. It includes features like higher-resolution scanning of document images for better handling of smaller and dense text; paragraph detection; and fillable form management. OCR capabilities also include advanced scenarios like single character boxes and accurate extraction of key fields commonly found in invoices, receipts, and other prebuilt scenarios.

## Development options

Document Intelligence v3.0 supports the following resources:

| Model | Resources | Model ID |
|----------|------------|------------|
|**Read model**| <ul><li>[**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</li><li>[**C# SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true?pivots=programming-language-csharp)</li><li>[**Python SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true?pivots=programming-language-python)</li><li>[**Java SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true?pivots=programming-language-java)</li><li>[**JavaScript**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true?pivots=programming-language-javascript)</li></ul>|**prebuilt-read**|

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Read model data extraction

Try extracting text from forms and documents using the Document Intelligence Studio. You need the following assets:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* An [Form Recognizer instance (Document Intelligence forthcoming)](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

> [!NOTE]
> Currently, Document Intelligence Studio doesn't support Microsoft Word, Excel, PowerPoint, and HTML file formats.

***Sample document processed with [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/read)***

:::image type="content" source="media/studio/form-recognizer-studio-read-v3p2-updated.png" alt-text="Screenshot of Read processing in Document Intelligence Studio.":::

1. On the Document Intelligence Studio home page, select **Read**

1. You can analyze the sample document or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

   > [!div class="nextstepaction"]
   > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/layout)

## Supported document types

> [!NOTE]
>
> * Only API Version 2022-06-30-preview supports Microsoft Word, Excel, PowerPoint, and HTML file formats in addition to all other document types supported by the GA versions.
> * For the preview of Office and HTML file formats, Read API ignores the pages parameter and extracts all pages by default. Each embedded image counts as 1 page unit and each worksheet, slide, and page (up to 3000 characters) count as 1 page.

| **Model**   | **Images**   | **PDF**  | **TIFF** | **Word**   | **Excel**  | **PowerPoint** | **HTML** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **prebuilt-read**  | GA</br> (2023-07-31 and 2022-08-31)| GA</br> (2023-07-31 and 2022-08-31)  | GA</br> (2023-07-31 and 2022-08-31)  | Preview</br>(2022-06-30-preview)  | Preview</br>(2022-06-30-preview)  | Preview</br>(2022-06-30-preview) | Preview</br>(2022-06-30-preview) |

## Supported extracted languages and locales

The following lists include the currently GA languages in the most recent v3.0 version for Read, Layout, and Custom template (form) models.

> [!NOTE]
> **Language code optional**
>
> Document Intelligence's deep learning based universal models extract all multi-lingual text in your documents, including text lines with mixed languages, and do not require specifying a language code. Do not provide the language code as the parameter unless you are sure about the language and want to force the service to apply only the relevant model. Otherwise, the service may return incomplete and incorrect text.

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

## Detected languages: Read API

The [Read API](concept-read.md) supports detecting the following languages in your documents. This list may include languages not currently supported for text extraction.

> [!NOTE]
> **Language detection**
>
> * Document Intelligence read model can _detect_ possible presence of languages and returns language codes for detected languages.
> * To determine if text can also be
> extracted for a given language, see previous sections.
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

## Data detection and extraction

 | **Model**   | **Text**   | *[**Language extraction**](#supported-extracted-languages-and-locales) </br>* [**Language detection**](#language-detection) |
| --- | --- | --- |
**prebuilt-read**  | ✓  |✓  |

### Microsoft Office and HTML text extraction

Use the parameter `api-version=2023-07-31` when using the REST API or the corresponding SDKs of that API version to extract text from Microsoft Word, Excel, PowerPoint, and HTML files. The following illustration shows extraction of the digital text and text in the Word document by running OCR on the images. Text from embedded images isn't included in the extraction.

> [!NOTE]
>
> * [Add-on capabilities](concept-add-on-capabilities.md) are not supported for Microsoft Word, Excel, PowerPoint, and HTML file formats.

:::image type="content" source="media/office-to-ocr.png" alt-text="Screenshot of a Microsoft Word document extracted by Document Intelligence Read OCR.":::

The page units in the model output are computed as shown:

 **File format**   | **Computed page unit**   | **Total pages**  |
| --- | --- | --- |
|Word  | Up to 3,000 characters = 1 page unit, embedded or linked images not supported | Total pages of up to 3,000 characters each |
|Excel  | Each worksheet = 1 page unit, embedded or linked images not supported | Total worksheets
|PowerPoint |  Each slide = 1 page unit, embedded or linked images not supported | Total slides
|HTML | Up to 3,000 characters = 1 page unit, embedded or linked images not supported | Total pages of up to 3,000 characters each |

### Barcode extraction

The Read OCR model extracts all identified barcodes in the `barcodes` collection as a top level object under `content`. Inside the `content`, detected barcodes are represented as `:barcode:`. Each entry in this collection represents a barcode and includes the barcode type as `kind` and the embedded barcode content as `value` along with its `polygon` coordinates. Initially, barcodes appear at the end of each page. Here, the `confidence` is hard-coded for the public preview (`2023-02-28`) release.

#### Supported barcode types

| **Barcode Type**   | **Example**   |
| --- | --- |
| QR Code |:::image type="content" source="media/barcodes/qr-code.png" alt-text="Screenshot of the QR Code.":::|
| Code 39 |:::image type="content" source="media/barcodes/code-39.png" alt-text="Screenshot of the Code 39.":::|
| Code 128 |:::image type="content" source="media/barcodes/code-128.png" alt-text="Screenshot of the Code 128.":::|
| UPC (UPC-A & UPC-E) |:::image type="content" source="media/barcodes/upc.png" alt-text="Screenshot of the UPC.":::|
| PDF417 |:::image type="content" source="media/barcodes/pdf-417.png" alt-text="Screenshot of the PDF417.":::|

```json
"content": ":barcode:",
  "pages": [
    {
      "pageNumber": 1,
      "barcodes": [
        {
          "kind": "QRCode",
          "value": "http://test.com/",
          "span": { ... },
          "polygon": [...],
          "confidence": 1
        }
      ]
    }
  ]
```

### Paragraphs extraction

The Read OCR model in Document Intelligence extracts all identified blocks of text in the `paragraphs` collection as a top level object under `analyzeResults`. Each entry in this collection represents a text block and includes the extracted text as`content`and the bounding `polygon` coordinates. The `span` information points to the text fragment within the top-level `content` property that contains the full text from the document.

```json
"paragraphs": [
    {
        "spans": [],
        "boundingRegions": [],
        "content": "While healthcare is still in the early stages of its Al journey, we are seeing pharmaceutical and other life sciences organizations making major investments in Al and related technologies.\" TOM LAWRY | National Director for Al, Health and Life Sciences | Microsoft"
    }
]
```

### Language detection

The Read OCR model in Document Intelligence adds [language detection](#language-detection) as a new feature for text lines. Read predicts the detected primary language for each text line along with the `confidence` in the `languages` collection under `analyzeResult`.

```json
"languages": [
    {
        "spans": [
            {
                "offset": 0,
                "length": 131
            }
        ],
        "locale": "en",
        "confidence": 0.7
    },
]
```

### Extract pages from documents

The page units in the model output are computed as shown:

 **File format**   | **Computed page unit**   | **Total pages**  |
| --- | --- | --- |
|Images | Each image = 1 page unit | Total images  |
|PDF | Each page in the PDF = 1 page unit | Total pages in the PDF |
|TIFF | Each image in the TIFF = 1 page unit | Total images in the PDF |

```json
"pages": [
    {
        "pageNumber": 1,
        "angle": 0,
        "width": 915,
        "height": 1190,
        "unit": "pixel",
        "words": [],
        "lines": [],
        "spans": [],
        "kind": "document"
    }
]
```

### Extract text lines and words

The Read OCR model extracts print and handwritten style text as `lines` and `words`. The model outputs bounding `polygon` coordinates and `confidence` for the extracted words. The `styles` collection includes any handwritten style for lines if detected along with the spans pointing to the associated text. This feature applies to [supported handwritten languages](language-support.md).

For the preview of Microsoft Word, Excel, PowerPoint, and HTML file support, Read extracts all embedded text as is. For any embedded images, it runs OCR on the images to extract text and append the text from each image as an added entry to the `pages` collection. These added entries include the extracted text lines and words, their bounding polygons, confidences, and the spans pointing to the associated text.

```json
"words": [
    {
        "content": "While",
        "polygon": [],
        "confidence": 0.997,
        "span": {}
    },
],
"lines": [
    {
        "content": "While healthcare is still in the early stages of its Al journey, we",
        "polygon": [],
        "spans": [],
    }
]
```

### Select page(s) for text extraction

For large multi-page PDF documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction.

> [!NOTE]
> For the Microsoft Word, Excel, PowerPoint, and HTML file support, the Read API ignores the pages parameter and extracts all pages by default.

### Handwritten style for text lines

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. For more information, *see* [handwritten language support](#handwritten-text). The following example shows an example JSON snippet.

```json
"styles": [
{
    "confidence": 0.95,
    "spans": [
    {
        "offset": 509,
        "length": 24
    }
    "isHandwritten": true
    ]
}
```

## Next steps

Complete a Document Intelligence quickstart:

> [!div class="checklist"]
>
> * [**REST API**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)
> * [**C# SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-csharp)
> * [**Python SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-python)
> * [**Java SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-java)
> * [**JavaScript**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.1.0&preserve-view=true?pivots=programming-language-javascript)</li></ul>

Explore our REST API:

> [!div class="nextstepaction"]
> [Document Intelligence API v3.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)
