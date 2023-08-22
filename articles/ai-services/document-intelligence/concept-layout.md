---
title: Document layout analysis - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Extract text, tables, selections, titles, section headings, page headers, page footers, and more with layout analysis model from Document Intelligence.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-3.1.0'
---

<!-- markdownlint-disable DOCSMD006 -->

# Document Intelligence layout model

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

Document Intelligence layout model is an advanced machine-learning based document analysis API available in the Document Intelligence cloud. It enables you to take documents in various formats and return structured data representations of the documents. It combines an enhanced version of our powerful [Optical Character Recognition (OCR)](../../ai-services/computer-vision/overview-ocr.md) capabilities with deep learning models to extract text, tables, selection marks, and document structure.

## Document layout analysis

Document structure layout analysis is the process of analyzing a document to extract regions of interest and their inter-relationships. The goal is to extract text and structural elements from the page to build better semantic understanding models. There are two types of roles that text plays in a document layout:

* **Geometric roles**: Text, tables, and selection marks are examples of geometric roles.
* **Logical roles**: Titles, headings, and footers are examples of logical roles.

The following illustration shows the typical components in an image of a sample page.

  :::image type="content" source="media/document-layout-example.png" alt-text="Illustration of document layout example.":::

::: moniker range=">=doc-intel-3.0.0"

  ***Sample document processed with [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

  :::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot of sample newspaper page processed using Document Intelligence Studio.":::

::: moniker-end

## Development options

::: moniker range=">=doc-intel-3.0.0"

Document Intelligence v3.1 and later versions support the following tools:

| Feature | Resources | Model ID |
|----------|------------|------------|
|**Layout model**| <ul><li>[**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</li></ul>|**prebuilt-layout**|

::: moniker-end

::: moniker range="doc-intel-2.1.0"

**Sample document processed with [Document Intelligence Sample Labeling tool layout model](https://fott-2-1.azurewebsites.net/layout-analyze)**:

:::image type="content" source="media/layout-tool-example.jpg" alt-text="Screenshot of a document processed with the layout model.":::

::: moniker-end

## Input requirements

::: moniker range=">=doc-intel-3.0.0"

[!INCLUDE [input requirements](./includes/input-requirements.md)]

::: moniker-end

::: moniker range=">=doc-intel-2.1.0"

* Supported file formats: JPEG, PNG, PDF, and TIFF
* For PDF and TIFF, up to 2000 pages are processed. For free tier subscribers, only the first two pages are processed.
* The file size must be less than 50 MB and dimensions at least 50 x 50 pixels and at most 10,000 x 10,000 pixels.

::: moniker-end

### Layout model data extraction

See how data, including text, tables, table headers, selection marks, and structure information is extracted from documents using  Document Intelligence. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* An [Form Recognizer instance (Document Intelligence forthcoming)](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

::: moniker range=">=doc-intel-3.0.0"

## Document Intelligence Studio

> [!NOTE]
> Document Intelligence Studio is available with v3.1 and v3.0 APIs and later versions.

***Sample document processed with [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot of Layout processing a newspaper page in Document Intelligence Studio.":::

1. On the Document Intelligence Studio home page, select **Layout**

1. You can analyze the sample document or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/layout-analyze.png" alt-text="Screenshot of analyze layout menu.":::

   > [!div class="nextstepaction"]
   > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/layout)

::: moniker-end

::: moniker range="doc-intel-2.1.0"

## Document Intelligence Sample Labeling tool

1. Navigate to the [Document Intelligence sample tool](https://fott-2-1.azurewebsites.net/).

1. On the sample tool home page, select **Use Layout to get text, tables and selection marks**.

     :::image type="content" source="media/label-tool/layout-1.jpg" alt-text="Screenshot of connection settings for the Document Intelligence layout process.":::

1. In the **Document Intelligence service endpoint** field, paste the endpoint that you obtained with your Document Intelligence subscription.

1. In the **key** field, paste  the key you obtained from your Document Intelligence resource.

1. In the **Source** field, select **URL** from the dropdown menu You can use our sample document:

    * [**Sample document**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/layout-page-001.jpg)

    * Select the **Fetch** button.

1. Select **Run Layout**. The Document Intelligence Sample Labeling tool calls the Analyze Layout API and analyze the document.

    :::image type="content" source="media/fott-layout.png" alt-text="Screenshot of Layout dropdown window.":::

1. View the results - see the highlighted text extracted, selection marks detected and tables detected.

    :::image type="content" source="media/label-tool/layout-3.jpg" alt-text="Screenshot of connection settings for the Document Intelligence Sample Labeling tool.":::

::: moniker-end

## Supported languages and locales

::: moniker range=">=doc-intel-3.0.0"

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
   :::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Kurukh (Devanagari)|kru|
  |Kyrgyz (Cyrillic)|ky|
  |Lak|lbe|
  |Lakota|lkt|
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
   :::column-end:::
   :::column span="":::
      |Language| Code (optional) |
  |:-----|:----:|
  |Rwa|rwk|
  |Sadri (Devanagari)|sck|
  |Samburu|saq|
  |Samoan (Latin)|sm|
  |Sango|sg|
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
  |Yakut|sah|
  |Yucatec Maya|yua|
  |Zapotec|zap|
  |Zarma|dje|
  |Zhuang|za|
  |Zulu|zu|
   :::column-end:::
:::row-end:::

::: moniker-end

::: moniker range="doc-intel-2.1.0"

:::row:::
:::column:::

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
:::column-end:::
:::column:::
|Language| Language code |
|:-----|:----:|
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
:::column-end:::
:::row-end:::

::: moniker-end

::: moniker range="doc-intel-2.1.0"

Document Intelligence v2.1 supports the following tools:

| Feature | Resources |
|----------|-------------------------|
|**Layout API**| <ul><li>[**Document Intelligence labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](how-to-guides/use-sdk-rest-api.md?pivots=programming-language-rest-api&tabs=windows&view=doc-intel-2.1.0&preserve-view=true)</li><li>[**Client-library SDK**](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</li><li>[**Document Intelligence Docker container**](containers/install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|

::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

## Data extraction

The layout model extracts text, selection marks, tables, paragraphs, and paragraph types (`roles`) from your documents.

### Paragraphs

The Layout model extracts all identified blocks of text in the `paragraphs` collection as a top level object under `analyzeResults`. Each entry in this collection represents a text block and includes the extracted text as`content`and the bounding `polygon` coordinates. The `span` information points to the text fragment within the top level `content` property that contains the full text from the document.

```json
"paragraphs": [
    {
        "spans": [],
        "boundingRegions": [],
        "content": "While healthcare is still in the early stages of its Al journey, we are seeing pharmaceutical and other life sciences organizations making major investments in Al and related technologies.\" TOM LAWRY | National Director for Al, Health and Life Sciences | Microsoft"
    }
]
```

### Paragraph roles

The new machine-learning based page object detection extracts logical roles like titles, section headings, page headers, page footers, and more. The Document Intelligence Layout model assigns certain text blocks in the `paragraphs` collection with their specialized role or type predicted by the model. They're best used with unstructured documents to help understand the layout of the extracted content for a richer semantic analysis. The following paragraph roles are supported:

| **Predicted role**   | **Description**   |
| --- | --- |
| `title`  | The main heading(s) in the page |
| `sectionHeading`  | One or more subheading(s) on the page  |
| `footnote`  | Text near the bottom of the page  |
| `pageHeader`  | Text near the top edge of the page  |
| `pageFooter`  | Text near the bottom edge of the page  |
| `pageNumber`  | Page number  |

```json
{
    "paragraphs": [
                {
                    "spans": [],
                    "boundingRegions": [],
                    "role": "title",
                    "content": "NEWS TODAY"
                },
                {
                    "spans": [],
                    "boundingRegions": [],
                    "role": "sectionHeading",
                    "content": "Mirjam Nilsson"
                }
    ]
}

```

### Pages

The pages collection is the first object you see in the service response.

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

### Text lines and words

The document layout model in Document Intelligence extracts print and handwritten style text as `lines` and `words`. The model outputs bounding `polygon` coordinates and `confidence` for the extracted words. The `styles` collection includes any handwritten style for lines if detected along with the spans pointing to the associated text. This feature applies to [supported handwritten languages](language-support.md).

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

### Selection marks

The Layout model also extracts selection marks from documents. Extracted selection marks appear within the `pages` collection for each page. They include the bounding `polygon`, `confidence`, and selection `state` (`selected/unselected`). Any associated text if extracted is also included as the starting index (`offset`) and `length` that references the top level `content` property that contains the full text from the document.

```json
{
    "selectionMarks": [
        {
            "state": "unselected",
            "polygon": [],
            "confidence": 0.995,
            "span": {
                "offset": 1421,
                "length": 12
            }
        }
    ]
}
```

### Tables

Extracting tables is a key requirement for processing documents containing large volumes of data typically formatted as tables. The Layout model extracts tables in the `pageResults` section of the JSON output. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding polygon is output along with information whether it's recognized as a `columnHeader` or not. The model supports extracting tables that are rotated. Each table cell contains the row and column index and bounding polygon coordinates. For the cell text, the model outputs the `span` information containing the starting index (`offset`). The model also outputs the `length` within the top-level content that contains the full text from the document.

```json
{
    "tables": [
        {
            "rowCount": 9,
            "columnCount": 4,
            "cells": [
                {
                    "kind": "columnHeader",
                    "rowIndex": 0,
                    "columnIndex": 0,
                    "columnSpan": 4,
                    "content": "(In millions, except earnings per share)",
                    "boundingRegions": [],
                    "spans": []
                    },
            ]
        }
    ]
}

```

### Handwritten style for text lines

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. For more information. *see*, [Handwritten language support](#handwritten-text). The following example shows an example JSON snippet.

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

### Annotations (available only in ``2023-07-31`` (v3.1 GA) API.)

The Layout model extracts annotations in documents, such as checks and crosses. The response includes the kind of annotation, along with a confidence score and bounding polygon.

```json
    {
  "pages": [
    {
      "annotations": [
        {
          "kind": "cross",
          "polygon": [...],
          "confidence": 1
        }
      ]
    }
  ]
}
```

### Extract selected page(s) from documents

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction.

::: moniker-end

::: moniker range="doc-intel-2.1.0"

### Natural reading order output (Latin only)

You can specify the order in which the text lines are output with the `readingOrder` query parameter. Use `natural` for a more human-friendly reading order output as shown in the following example. This feature is only supported for Latin languages.

:::image type="content" source="media/layout-reading-order-example.png" alt-text="Screenshot of layout model reading order processing." lightbox="../../ai-services/Computer-vision/Images/ocr-reading-order-example.png":::

### Select page numbers or ranges for text extraction

For large multi-page documents, use the `pages` query parameter to indicate specific page numbers or page ranges for text extraction. The following example shows a document with 10 pages, with text extracted for both cases - all pages (1-10) and selected pages (3-6).

:::image type="content" source="./media/layout-select-pages.png" alt-text="Screen shot of the layout model selected pages output.":::

## The Get Analyze Layout Result operation

The second step is to call the [Get Analyze Layout Result](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetAnalyzeLayoutResult) operation. This operation takes as input the Result ID the Analyze Layout operation created. It returns a JSON response that contains a **status** field with the following possible values.

|Field| Type | Possible values |
|:-----|:----:|:----|
|status | string | `notStarted`: The analysis operation hasn't started.<br /><br />`running`: The analysis operation is in progress.<br /><br />`failed`: The analysis operation has failed.<br /><br />`succeeded`: The analysis operation has succeeded.|

Call this operation iteratively until it returns the `succeeded` value. Use an interval of 3 to 5 seconds to avoid exceeding the requests per second (RPS) rate.

When the **status** field has the `succeeded` value, the JSON response includes the extracted layout, text, tables, and selection marks. The extracted data includes extracted text lines and words, bounding boxes, text appearance with handwritten indication, tables, and selection marks with selected/unselected indicated.

### Handwritten classification for text lines (Latin only)

The response includes classifying whether each text line is of handwriting style or not, along with a confidence score. This feature is only supported for Latin languages. The following example shows the handwritten classification for the text in the image.

:::image type="content" source="./media/layout-handwriting-classification.png" alt-text="Screenshot of layout model handwriting classification process.":::

### Sample JSON output

The response to the *Get Analyze Layout Result* operation is a structured representation of the document with all the information extracted.
See here for a [sample document file](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/curl/form-recognizer/sample-layout.pdf) and its structured output [sample layout output](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/curl/form-recognizer/sample-layout-output.json).

The JSON output has two parts:

* `readResults` node contains all of the recognized text and selection mark. The text presentation hierarchy is page, then line, then individual words.
* `pageResults` node contains the tables and cells extracted with their bounding boxes, confidence, and a reference to the lines and words in "readResults" field.

## Example Output

### Text

Layout API extracts text from documents and images with multiple text angles and colors. It accepts photos of documents, faxes, printed and/or handwritten (English only) text, and mixed modes. Text is extracted with information provided on lines, words, bounding boxes, confidence scores, and style (handwritten or other). All the text information is included in the `readResults` section of the JSON output.

### Tables with headers

Layout API extracts tables in the `pageResults` section of the JSON output. Documents can be scanned, photographed, or digitized. Tables can be complex with merged cells or columns, with or without borders, and with odd angles. Extracted table information includes the number of columns and rows, row span, and column span. Each cell with its bounding box is output along with information whether it's recognized as part of a header or not. The model predicted header cells can span multiple rows and aren't necessarily the first rows in a table. They also work with rotated tables. Each table cell also includes the full text with references to the individual words in the `readResults` section.

![Tables example](./media/layout-table-header-demo.gif)

### Selection marks

Layout API also extracts selection marks from documents. Extracted selection marks include the bounding box, confidence, and state (selected/unselected). Selection mark information is extracted in the `readResults` section of the JSON output.

### Migration guide

* Follow our [**Document Intelligence v3.1 migration guide**](v3-1-migration-guide.md) to learn how to use the v3.1 version in your applications and workflows.
::: moniker-end

## Next steps

::: moniker range=">=doc-intel-3.0.0"

* [Learn how to process your own forms and documents](quickstarts/try-document-intelligence-studio.md) with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="doc-intel-2.1.0"

* [Learn how to process your own forms and documents](quickstarts/try-sample-label-tool.md) with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
