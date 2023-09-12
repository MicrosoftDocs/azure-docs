---
title: Custom template document model - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Use the custom template document model to train a model to extract data from structured or templated forms.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-3.1.0'
---


# Document Intelligence custom template model

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

Custom template (formerly custom form) is an easy-to-train document model that accurately extracts labeled key-value pairs, selection marks, tables, regions, and signatures from documents. Template models use layout cues to extract values from documents and are suitable to extract fields from highly structured documents with defined visual templates.

::: moniker range=">=doc-intel-3.0.0"

Custom template models share the same labeling format and strategy as custom neural models, with support for more field types and languages.

::: moniker-end

## Model capabilities

Custom template models support key-value pairs, selection marks, tables, signature fields, and selected regions.

| Form fields | Selection marks | Tabular fields (Tables) | Signature | Selected regions |
|:--:|:--:|:--:|:--:|:--:|
| Supported| Supported | Supported | Supported| Supported |

::: moniker range=">=doc-intel-3.0.0"

## Tabular fields

With the release of API versions **2022-06-30-preview** and  later, custom template models will add support for **cross page** tabular fields (tables):  

* To label a table that spans multiple pages, label each row of the table across the different pages in a single table.
* As a best practice, ensure that your dataset contains a few samples of the expected variations. For example, include samples where the entire table is on a single page and where tables span two or more pages if you expect to see those variations in documents.

Tabular fields are also useful when extracting repeating information within a document that isn't recognized as a table. For example, a repeating section of work experiences in a resume can be labeled and extracted as a tabular field.

::: moniker-end

## Dealing with variations

Template models rely on a defined visual template, changes to the template results in lower accuracy. In those instances, split your training dataset to include at least five samples of each template and train a model for each of the variations. You can then [compose](concept-composed-models.md) the models into a single endpoint. For subtle variations, like digital PDF documents and images, it's best to include at least five examples of each type in the same training dataset.

## Training a model

::: moniker range=">=doc-intel-3.0.0"

Custom template models are generally available with the [v3.0 API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/BuildDocumentModel). If you're starting with a new project or have an existing labeled dataset, use the v3.1 or v3.0 API with Document Intelligence Studio to train a custom template model.

| Model | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom template  | [Document Intelligence 3.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)| [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)| [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)|

With the v3.0 and later APIs, the build operation to train model supports a new ```buildMode``` property, to train a custom template model, set the ```buildMode``` to ```template```.

```REST
https://{endpoint}/formrecognizer/documentModels:build?api-version=2023-07-31

{
  "modelId": "string",
  "description": "string",
  "buildMode": "template",
  "azureBlobSource":
  {
    "containerUrl": "string",
    "prefix": "string"
  }
}
```

## Supported languages and locales

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
  |Abaza|`abq`|
  |Abkhazian|`ab`|
  |Achinese|`ace`|
  |Acoli|`ach`|
  |Adangme|`ada`|
  |Adyghe|`ady`|
  |Afar|`aa`|
  |Afrikaans|`af`|
  |Akan|`ak`|
  |Albanian|`sq`|
  |Algonquin|`alq`|
  |Angika (Devanagari)|`anp`|
  |Arabic|`ar`|
  |Asturian|`ast`|
  |Asu (Tanzania)|`asa`|
  |Avaric|`av`|
  |Awadhi-Hindi (Devanagari)|`awa`|
  |Aymara|`ay`|
  |Azerbaijani (Latin)|`az`|
  |Bafia|`ksf`|
  |Bagheli|`bfy`|
  |Bambara|`bm`|
  |Bashkir|`ba`|
  |Basque|`eu`|
  |Belarusian (Cyrillic)|be, be-cyrl|
  |Belarusian (Latin)|be, be-latn|
  |Bemba (Zambia)|`bem`|
  |Bena (Tanzania)|`bez`|
  |Bhojpuri-Hindi (Devanagari)|`bho`|
  |Bikol|`bik`|
  |Bini|`bin`|
  |Bislama|`bi`|
  |Bodo (Devanagari)|`brx`|
  |Bosnian (Latin)|`bs`|
  |Brajbha|`bra`|
  |Breton|`br`|
  |Bulgarian|`bg`|
  |Bundeli|`bns`|
  |Buryat (Cyrillic)|`bua`|
  |Catalan|`ca`|
  |Cebuano|`ceb`|
  |Chamling|`rab`|
  |Chamorro|`ch`|
  |Chechen|`ce`|
  |Chhattisgarhi (Devanagari)|`hne`|
  |Chiga|`cgg`|
  |Chinese Simplified|`zh-Hans`|
  |Chinese Traditional|`zh-Hant`|
  |Choctaw|`cho`|
  |Chukot|`ckt`|
  |Chuvash|`cv`|
  |Cornish|`kw`|
  |Corsican|`co`|
  |Cree|`cr`|
  |Creek|`mus`|
  |Crimean Tatar (Latin)|`crh`|
  |Croatian|`hr`|
  |Crow|`cro`|
  |Czech|`cs`|
  |Danish|`da`|
  |Dargwa|`dar`|
  |Dari|`prs`|
  |Dhimal (Devanagari)|`dhi`|
  |Dogri (Devanagari)|`doi`|
  |Duala|`dua`|
  |Dungan|`dng`|
  |Dutch|`nl`|
  |Efik|`efi`|
  |English|`en`|
  |Erzya (Cyrillic)|`myv`|
  |Estonian|`et`|
  |Faroese|`fo`|
  |Fijian|`fj`|
  |Filipino|`fil`|
  |Finnish|`fi`|
   :::column-end:::
   :::column span="":::
  |Language| Code (optional) |
  |:-----|:----:|
  |`Fon`|`fon`|
  |French|`fr`|
  |Friulian|`fur`|
  |`Ga`|`gaa`|
  |Gagauz (Latin)|`gag`|
  |Galician|`gl`|
  |Ganda|`lg`|
  |Gayo|`gay`|
  |German|`de`|
  |Gilbertese|`gil`|
  |Gondi (Devanagari)|`gon`|
  |Greek|`el`|
  |Greenlandic|`kl`|
  |Guarani|`gn`|
  |Gurung (Devanagari)|`gvr`|
  |Gusii|`guz`|
  |Haitian Creole|`ht`|
  |Halbi (Devanagari)|`hlb`|
  |Hani|`hni`|
  |Haryanvi|`bgc`|
  |Hawaiian|`haw`|
  |Hebrew|`he`|
  |Herero|`hz`|
  |Hiligaynon|`hil`|
  |Hindi|`hi`|
  |Hmong Daw (Latin)|`mww`|
  |Ho(Devanagiri)|`hoc`|
  |Hungarian|`hu`|
  |Iban|`iba`|
  |Icelandic|`is`|
  |Igbo|`ig`|
  |Iloko|`ilo`|
  |Inari Sami|`smn`|
  |Indonesian|`id`|
  |Ingush|`inh`|
  |Interlingua|`ia`|
  |Inuktitut (Latin)|`iu`|
  |Irish|`ga`|
  |Italian|`it`|
  |Japanese|`ja`|
  |Jaunsari (Devanagari)|`Jns`|
  |Javanese|`jv`|
  |Jola-Fonyi|`dyo`|
  |Kabardian|`kbd`|
  |Kabuverdianu|`kea`|
  |Kachin (Latin)|`kac`|
  |Kalenjin|`kln`|
  |Kalmyk|`xal`|
  |Kangri (Devanagari)|`xnr`|
  |Kanuri|`kr`|
  |Karachay-Balkar|`krc`|
  |Kara-Kalpak (Cyrillic)|kaa-cyrl|
  |Kara-Kalpak (Latin)|`kaa`|
  |Kashubian|`csb`|
  |Kazakh (Cyrillic)|kk-cyrl|
  |Kazakh (Latin)|kk-latn|
  |Khakas|`kjh`|
  |Khaling|`klr`|
  |Khasi|`kha`|
  |K'iche'|`quc`|
  |Kikuyu|`ki`|
  |Kildin Sami|`sjd`|
  |Kinyarwanda|`rw`|
  |Komi|`kv`|
  |Kongo|`kg`|
  |Korean|`ko`|
  |Korku|`kfq`|
  |Koryak|`kpy`|
  |Kosraean|`kos`|
  |Kpelle|`kpe`|
  |Kuanyama|`kj`|
  |Kumyk (Cyrillic)|`kum`|
  |Kurdish (Arabic)|ku-arab|
  |Kurdish (Latin)|ku-latn|
   :::column-end:::
   :::column span="":::
  |Language| Code (optional) |
  |:-----|:----:|
  |Kurukh (Devanagari)|`kru`|
  |Kyrgyz (Cyrillic)|`ky`|
  |`Lak`|`lbe`|
  |Lakota|`lkt`|
  |Latin|`la`|
  |Latvian|`lv`|
  |Lezghian|`lex`|
  |Lingala|`ln`|
  |Lithuanian|`lt`|
  |Lower Sorbian|`dsb`|
  |Lozi|`loz`|
  |Lule Sami|`smj`|
  |Luo (Kenya and Tanzania)|`luo`|
  |Luxembourgish|`lb`|
  |Luyia|`luy`|
  |Macedonian|`mk`|
  |Machame|`jmc`|
  |Madurese|`mad`|
  |Mahasu Pahari (Devanagari)|`bfz`|
  |Makhuwa-Meetto|`mgh`|
  |Makonde|`kde`|
  |Malagasy|`mg`|
  |Malay (Latin)|`ms`|
  |Maltese|`mt`|
  |Malto (Devanagari)|`kmj`|
  |Mandinka|`mnk`|
  |Manx|`gv`|
  |Maori|`mi`|
  |Mapudungun|`arn`|
  |Marathi|`mr`|
  |Mari (Russia)|`chm`|
  |Masai|`mas`|
  |Mende (Sierra Leone)|`men`|
  |Meru|`mer`|
  |Meta'|`mgo`|
  |Minangkabau|`min`|
  |Mohawk|`moh`|
  |Mongolian (Cyrillic)|`mn`|
  |Mongondow|`mog`|
  |Montenegrin (Cyrillic)|cnr-cyrl|
  |Montenegrin (Latin)|cnr-latn|
  |Morisyen|`mfe`|
  |Mundang|`mua`|
  |Nahuatl|`nah`|
  |Navajo|`nv`|
  |Ndonga|`ng`|
  |Neapolitan|`nap`|
  |Nepali|`ne`|
  |Ngomba|`jgo`|
  |Niuean|`niu`|
  |Nogay|`nog`|
  |North Ndebele|`nd`|
  |Northern Sami (Latin)|`sme`|
  |Norwegian|`no`|
  |Nyanja|`ny`|
  |Nyankole|`nyn`|
  |Nzima|`nzi`|
  |Occitan|`oc`|
  |Ojibwa|`oj`|
  |Oromo|`om`|
  |Ossetic|`os`|
  |Pampanga|`pam`|
  |Pangasinan|`pag`|
  |Papiamento|`pap`|
  |Pashto|`ps`|
  |Pedi|`nso`|
  |Persian|`fa`|
  |Polish|`pl`|
  |Portuguese|`pt`|
  |Punjabi (Arabic)|`pa`|
  |Quechua|`qu`|
  |Ripuarian|`ksh`|
  |Romanian|`ro`|
  |Romansh|`rm`|
  |Rundi|`rn`|
  |Russian|`ru`|
   :::column-end:::
   :::column span="":::
  |Language| Code (optional) |
  |:-----|:----:|
  |`Rwa`|`rwk`|
  |Sadri (Devanagari)|`sck`|
  |Sakha|`sah`|
  |Samburu|`saq`|
  |Samoan (Latin)|`sm`|
  |Sango|`sg`|
  |Sangu (Gabon)|`snq`|
  |Sanskrit (Devanagari)|`sa`|
  |Santali(Devanagiri)|`sat`|
  |Scots|`sco`|
  |Scottish Gaelic|`gd`|
  |Sena|`seh`|
  |Serbian (Cyrillic)|sr-cyrl|
  |Serbian (Latin)|sr, sr-latn|
  |Shambala|`ksb`|
  |Sherpa (Devanagari)|`xsr`|
  |Shona|`sn`|
  |Siksika|`bla`|
  |Sirmauri (Devanagari)|`srx`|
  |Skolt Sami|`sms`|
  |Slovak|`sk`|
  |Slovenian|`sl`|
  |Soga|`xog`|
  |Somali (Arabic)|`so`|
  |Somali (Latin)|`so-latn`|
  |Songhai|`son`|
  |South Ndebele|`nr`|
  |Southern Altai|`alt`|
  |Southern Sami|`sma`|
  |Southern Sotho|`st`|
  |Spanish|`es`|
  |Sundanese|`su`|
  |Swahili (Latin)|`sw`|
  |Swati|`ss`|
  |Swedish|`sv`|
  |Tabassaran|`tab`|
  |Tachelhit|`shi`|
  |Tahitian|`ty`|
  |Taita|`dav`|
  |Tajik (Cyrillic)|`tg`|
  |Tamil|`ta`|
  |Tatar (Cyrillic)|tt-cyrl|
  |Tatar (Latin)|`tt`|
  |Teso|`teo`|
  |Tetum|`tet`|
  |Thai|`th`|
  |Thangmi|`thf`|
  |Tok Pisin|`tpi`|
  |Tongan|`to`|
  |Tsonga|`ts`|
  |Tswana|`tn`|
  |Turkish|`tr`|
  |Turkmen (Latin)|`tk`|
  |Tuvan|`tyv`|
  |Udmurt|`udm`|
  |Uighur (Cyrillic)|ug-cyrl|
  |Ukrainian|`uk`|
  |Upper Sorbian|`hsb`|
  |Urdu|`ur`|
  |Uyghur (Arabic)|`ug`|
  |Uzbek (Arabic)|uz-arab|
  |Uzbek (Cyrillic)|uz-cyrl|
  |Uzbek (Latin)|`uz`|
  |Vietnamese|`vi`|
  |Volapük|`vo`|
  |Vunjo|`vun`|
  |Walser|`wae`|
  |Welsh|`cy`|
  |Western Frisian|`fy`|
  |Wolof|`wo`|
  |Xhosa|`xh`|
  |Yucatec Maya|`yua`|
  |Zapotec|`zap`|
  |Zarma|`dje`|
  |Zhuang|`za`|
  |Zulu|`zu`|
   :::column-end:::
:::row-end:::

::: moniker-end

::: moniker range="doc-intel-2.1.0"

Custom (template) models  are generally available with the [v2.1 API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm).

| Model | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom model (template) | [Document Intelligence 2.1 ](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)| [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true?pivots=programming-language-python)| [Document Intelligence Sample labeling tool](https://fott-2-1.azurewebsites.net/)|

::: moniker-end

## Next steps

Learn to create and compose custom models:

::: moniker range=">=doc-intel-3.0.0"

> [!div class="nextstepaction"]
> [**Build a custom model**](how-to-guides/build-a-custom-model.md)
> [**Compose custom models**](how-to-guides/compose-custom-models.md)

::: moniker-end

::: moniker range="doc-intel-2.1.0"

> [!div class="nextstepaction"]
> [**Build a custom model**](concept-custom.md#build-a-custom-model)
> [**Compose custom models**](concept-composed-models.md#development-options)

::: moniker-end
