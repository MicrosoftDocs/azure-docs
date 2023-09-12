---
title: Custom document models - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Label and train customized models for your documents and compose multiple models into a single model identifier.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-3.1.0'
---

# Document Intelligence custom models

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

Document Intelligence uses advanced machine learning technology to identify documents, detect and extract information from forms and documents, and return the extracted data in a structured JSON output. With Document Intelligence, you can use document analysis models, pre-built/pre-trained, or your trained standalone custom models.

Custom models now include [custom classification models](./concept-custom-classifier.md) for scenarios where you need to identify the document type prior to invoking the extraction model. Classifier models are available starting with the ```2023-02-28-preview``` API. A classification model can be paired with a custom extraction model to analyze and extract fields from forms and documents specific to your business to create a document processing solution. Standalone custom extraction models can be combined to create [composed models](concept-composed-models.md).

::: moniker range=">=doc-intel-3.0.0"

## Custom document model types

Custom document models can be one of two types, [**custom template**](concept-custom-template.md) or custom form and [**custom neural**](concept-custom-neural.md)  or custom document models. The labeling and training process for both models is identical, but the models differ as follows:

### Custom extraction models

To create a custom extraction model, label a dataset of documents with the values you want extracted and train the model on the labeled dataset. You only need five examples of the same form or document type to get started.

### Custom neural model

> [!IMPORTANT]
>
> Starting with version 3.1 (2023-07-31 API version), custom neural models only require one sample labeled document to train a model.
>

The custom neural (custom document) model uses deep learning models and  base model trained on a large collection of documents. This model is then fine-tuned or adapted to your data when you train the model with a labeled dataset. Custom neural models support structured, semi-structured, and unstructured documents to extract fields. Custom neural models currently support English-language documents. When you're choosing between the two model types, start with a neural model to determine if it meets your functional needs. See [neural models](concept-custom-neural.md) to learn more about custom document models.

### Custom template model

The custom template or custom form model relies on a consistent visual template to extract the labeled data. Variances in the visual structure of your documents affect the accuracy of your model. Structured  forms such as questionnaires or applications are examples of consistent visual templates.

Your training set consists of structured documents where the formatting and layout are static and constant from one document instance to the next. Custom template models support key-value pairs, selection marks, tables, signature fields, and regions. Template models and can be trained on documents in any of the [supported languages](language-support.md). For more information, *see* [custom template models](concept-custom-template.md).

If the language of your documents and extraction scenarios supports custom neural models, it's recommended that you use custom neural models over template models for higher accuracy.

> [!TIP]
>
>To confirm that your training documents present a consistent visual template, remove all the user-entered data from each form in the set. If the blank forms are identical in appearance, they represent a consistent visual template.
>
> For more information, *see* [Interpret and improve accuracy and confidence for custom models](concept-accuracy-confidence.md).

### Build mode

The build custom model operation has added support for the *template* and *neural* custom models. Previous versions of the REST API and SDKs only supported a single build mode that is now known as the *template* mode.

* Template models only accept documents that have the same basic page structure—a uniform visual appearance—or the same relative positioning of elements within the document.

* Neural models support documents that have the same information, but different page structures. Examples of these documents include United States W2 forms, which share the same information, but may vary in appearance across companies. Neural models currently only support English text.

This table provides links to the build mode programming language SDK references and code samples on GitHub:

|Programming language | SDK reference | Code sample |
|---|---|---|
| C#/.NET | [DocumentBuildMode Struct](/dotnet/api/azure.ai.formrecognizer.documentanalysis.documentbuildmode?view=azure-dotnet&preserve-view=true#properties) | [Sample_BuildCustomModelAsync.cs](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/formrecognizer/Azure.AI.FormRecognizer/tests/samples/Sample_BuildCustomModelAsync.cs)
|Java| DocumentBuildMode Class | [BuildModel.java](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/java/com/azure/ai/formrecognizer/administration/BuildDocumentModel.java)|
|JavaScript | [DocumentBuildMode type](/javascript/api/@azure/ai-form-recognizer/documentbuildmode?view=azure-node-latest&preserve-view=true)| [buildModel.js](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/formrecognizer/ai-form-recognizer/samples/v4-beta/javascript/buildModel.js)|
|Python | DocumentBuildMode Enum| [sample_build_model.py](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-formrecognizer_3.2.0b3/sdk/formrecognizer/azure-ai-formrecognizer/samples/v3.2-beta/sample_build_model.py)|

## Compare model features

The following table compares custom template and custom neural features:

|Feature|Custom template (form) | Custom neural (document) |
|---|---|---|
|Document structure|Template, form, and structured | Structured, semi-structured, and unstructured|
|Training time | 1 to 5 minutes | 20 minutes to 1 hour |
|Data extraction | Key-value pairs, tables, selection marks, coordinates, and signatures | Key-value pairs, selection marks and tables|
|Document variations | Requires a model per each variation | Uses a single model for all variations |
|Language support | Multiple [language support](concept-custom-template.md#supported-languages-and-locales)  | English, with preview support for Spanish, French, German, Italian and Dutch [language support](concept-custom-neural.md#supported-languages-and-locales) |

### Custom classification model

 Document classification is a new scenario supported by Document Intelligence with the ```2023-07-31``` (v3.1 GA) API. the document classifier API supports classification and splitting scenarios. Train a classification model to identify the different types of documents your application supports. The input file for the classification model can contain multiple documents and classifies each document within an associated page range. See [custom classification](concept-custom-classifier.md) models to learn more.

## Custom model tools

Document Intelligence v3.0 supports the following tools:

| Feature | Resources | Model ID|
|---|---|:---|
|Custom model| <ul><li>[Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)</li><li>[REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)</li><li>[C# SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</li><li>[Python SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</li></ul>|***custom-model-id***|

:::moniker-end

::: moniker range="doc-intel-2.1.0"

Document Intelligence v2.1 supports the following tools:

> [!NOTE]
> Custom model types [custom neural](concept-custom-neural.md) and [custom template](concept-custom-template.md) are available with Document Intelligence version v3.1 and v3.0 APIs.

| Feature | Resources |
|---|---|
|Custom model| <ul><li>[Document Intelligence labeling tool](https://fott-2-1.azurewebsites.net)</li><li>[REST API](how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&tabs=windows&pivots=programming-language-rest-api&preserve-view=true)</li><li>[Client library SDK](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</li><li>[Document Intelligence Docker container](containers/install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|

:::moniker-end

## Build a custom model

Extract data from your specific or unique documents using custom models. You need the following resources:

* An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* An [Form Recognizer instance (Document Intelligence forthcoming)](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

  :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot that shows the keys and endpoint location in the Azure portal.":::

::: moniker range="doc-intel-2.1.0"

## Sample Labeling tool

>[!TIP]
>
> * For an enhanced experience and advanced model quality, try the [Document Intelligence v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
> * The v3.0 Studio supports any model trained with v2.1 labeled data.
> * You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.
> * *See* our [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) or [**C#**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [Python](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK quickstarts to get started with the v3.0 version.

* The Document Intelligence Sample Labeling tool is an open source tool that enables you to test the latest features of Document Intelligence and Optical Character Recognition (OCR) features.

* Try the [**Sample Labeling tool quickstart**](quickstarts/try-sample-label-tool.md#train-a-custom-model) to get started building and using a custom model.

:::moniker-end

::: moniker range=">=doc-intel-3.0.0"

## Document Intelligence Studio

> [!NOTE]
> Document Intelligence Studio is available with v3.1 and v3.0 APIs.

1. On the **Document Intelligence Studio** home page, select **Custom extraction models**.

1. Under **My Projects**, select **Create a project**.

1. Complete the project details fields.

1. Configure the service resource by adding your **Storage account** and **Blob container** to **Connect your training data source**.

1. Review and create your project.

1. Add your sample documents to label, build and test your custom model.

    > [!div class="nextstepaction"]
    > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)

For a detailed walkthrough to create your first custom extraction model, see [how to create a custom extraction model](how-to-guides/build-a-custom-model.md)

## Custom model extraction summary

This table compares the supported data extraction areas:

|Model| Form fields | Selection marks | Structured fields (Tables) | Signature | Region labeling |
|--|:--:|:--:|:--:|:--:|:--:|
|Custom template| ✔ | ✔ | ✔ | ✔ | ✔ |
|Custom neural| ✔| ✔ | ✔ | **n/a** | * |

**Table symbols**:
✔—supported;
**n/a—currently unavailable;
*-behaves differently. With template models, synthetic data is generated at training time. With neural models, exiting text recognized in the region is selected.

> [!TIP]
> When choosing between the two model types, start with a custom neural model if it meets your functional needs. See [custom neural](concept-custom-neural.md) to learn more about custom neural models.

:::moniker-end

## Custom model development options

The following table describes the features available with the associated tools and SDKs. As a best practice, ensure that you use the compatible tools listed here.

| Document type | REST API | SDK | Label and Test Models|
|--|--|--|--|
| Custom form v2.1 | [Document Intelligence 2.1 GA API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) | [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true?pivots=programming-language-python)| [Sample labeling tool](https://fott-2-1.azurewebsites.net/)|
| Custom template v3.1 v3.0 | [Document Intelligence 3.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)| [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)| [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)|
| Custom neural v3.1 v3.0 | [Document Intelligence 3.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)| [Document Intelligence SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)| [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

> [!NOTE]
> Custom template models trained with the 3.0 API will have a few improvements over the 2.1 API stemming from improvements to the OCR engine. Datasets used to train a custom template model using the 2.1 API can still be used to train a new model using the 3.0 API.

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats are JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF files, up to 2,000 pages can be processed. With a free tier subscription, only the first two pages are processed.
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.

  > [!TIP]
  > Training data:
  >
  >* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
  > * Please supply only a single instance of the form per document.
  > * For filled-in forms, use examples that have all their fields filled in.
  > * Use forms with different values in each field.
  >* If your form images are of lower quality, use a larger dataset. For example, use 10 to 15 images.

## Supported languages and locales

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Document Intelligence deep-learning technology will auto-detect the language of the text in your image.

::: moniker range=">=doc-intel-3.0.0"

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

:::moniker-end

::: moniker range="doc-intel-2.1.0"
:::row:::
:::column:::

|Language| Language code |
|:-----|:----:|
|Afrikaans|`af`|
|Albanian |`sq`|
|Estuarian |`ast`|
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

:::moniker-end

::: moniker range=">=doc-intel-3.0.0"

### Try signature detection

* **Custom model v 3.1 and v3.0 APIs** supports signature detection for custom forms. When you train custom models, you can specify certain fields as signatures. When a document is analyzed with your custom model, it indicates whether a signature was detected or not.
* [Document Intelligence v3.1 migration guide](v3-1-migration-guide.md): This guide shows you how to use the v3.0 version in your applications and workflows.
* [REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument): This API shows you more about the v3.0 version and new capabilities.

1. Build your training dataset.

1. Go to [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio). Under **Custom models**, select **Custom form**.

    :::image type="content" source="media/label-tool/select-custom-form.png" alt-text="Screenshot that shows selecting the Document Intelligence Studio Custom form page.":::

1. Follow the workflow to create a new project:

   1. Follow the **Custom model** input requirements.

   1. Label your documents. For signature fields, use **Region** labeling for better accuracy.

      :::image type="content" source="media/label-tool/signature-label-region-too.png" alt-text="Screenshot that shows the Label signature field.":::

After your training set is labeled, you can train your custom model and use it to analyze documents. The signature fields specify whether a signature was detected or not.

:::moniker-end

## Next steps

::: moniker range="doc-intel-2.1.0"

* Try processing your own forms and documents with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
:::moniker-end

::: moniker range=">=doc-intel-3.0.0"

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

:::moniker-end
