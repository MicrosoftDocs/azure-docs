---
title: Document processing models - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Document processing models for OCR, document layout, invoices, identity, custom  models, and more to extract text, structure, and key-value pairs.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: lajanuar
---


<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD011 -->

# Document processing models

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

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

::: moniker range=">=doc-intel-2.1.0"
 Azure AI Document Intelligence supports a wide variety of models that enable you to add intelligent document processing to your apps and flows. You can use a prebuilt domain-specific model or train a custom model tailored to your specific business need and use cases. Document Intelligence can be used with the REST API or Python, C#, Java, and JavaScript SDKs.
::: moniker-end

## Model overview

The following table shows the available models for each current preview and stable API:

|Model|[2023-10-31-preview](https://westus.dev.cognitive.microsoft.com/docs/services/document-intelligence-api-2023-10-31-preview/operations/AnalyzeDocument)|[2023-07-31 (GA)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)|[2022-08-31 (GA)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)|[v2.1 (GA)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)|
|----------------|-----------|---|--|---|
|[Add-on capabilities](concept-add-on-capabilities.md)    | ✔️| ✔️| n/a| n/a|
|[Business Card](concept-business-card.md)                | deprecated|✔️|✔️|✔️ |
|[Contract](concept-contract.md)                          | ✔️| ✔️| n/a| n/a|
|[Custom classifier](concept-custom-classifier.md)        | ✔️| ✔️| n/a| n/a|
|[Custom composed](concept-composed-models.md)            | ✔️| ✔️| ✔️| ✔️|
|[Custom neural](concept-custom-neural.md)                | ✔️| ✔️| ✔️| n/a|
|[Custom template](concept-custom-template.md)            | ✔️| ✔️| ✔️| ✔️|
|[General Document](concept-general-document.md)          | deprecated| ✔️| ✔️| n/a|
|[Health Insurance Card](concept-health-insurance-card.md)| ✔️| ✔️| ✔️| n/a|
|[ID Document](concept-id-document.md)                    | ✔️| ✔️| ✔️| ✔️|
|[Invoice](concept-invoice.md)                            | ✔️| ✔️| ✔️| ✔️|
|[Layout](concept-layout.md)                              | ✔️| ✔️| ✔️| ✔️|
|[Read](concept-read.md)                                  | ✔️| ✔️| ✔️| n/a|
|[Receipt](concept-receipt.md)                            | ✔️| ✔️| ✔️| ✔️|
|[US 1098 Tax](concept-tax-document.md)                   | ✔️| ✔️| n/a| n/a|
|[US 1098-E Tax](concept-tax-document.md)                 | ✔️| ✔️| n/a| n/a|
|[US 1098-T Tax](concept-tax-document.md)                 | ✔️| ✔️| n/a| n/a|
|[US 1099 Tax](concept-tax-document.md)                 | ✔️| n/a| n/a| n/a|
|[US W2 Tax](concept-tax-document.md)                     | ✔️| ✔️| ✔️| n/a|

::: moniker range=">=doc-intel-3.0.0"

| **Model**   | **Description**   |
| --- | --- |
|**Document analysis models**||
| [Read OCR](#read-ocr) | Extract print and handwritten text including words, locations, and detected languages.|
| [Layout analysis](#layout-analysis)  | Extract text and document layout elements like tables, selection marks, titles, section headings, and more.|
| [General document](#general-document) | Extract key-value pairs in addition to text and document structure information.|
|**Prebuilt models**||
| [Health insurance card](#health-insurance-card) | Automate healthcare processes by extracting insurer, member, prescription, group number and other key information from US health insurance cards.|
| [US Tax document models](#us-tax-documents) | Process US tax forms to extract employee, employer, wage, and other information.  |
| [Contract](#contract) | Extract agreement and party details.|
| [Invoice](#invoice)  | Automate invoices. |
| [Receipt](#receipt)  | Extract receipt data from receipts.|
| [Identity document (ID)](#identity-document-id)  | Extract identity (ID) fields from US driver licenses and international passports. |
| [Business card](#business-card)  | Scan business cards to extract key fields and data into your applications. |
|**Custom models**||
| [Custom model (overview)](#custom-models) |  Extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases. |
| [Custom extraction models](#custom-extraction)| &#9679; **Custom template models** use layout cues to extract values from documents and are suitable to extract fields from highly structured documents with defined visual templates.</br>&#9679; **Custom neural models** are  trained on various document types to extract fields from structured, semi-structured and unstructured documents.|
| [Custom classification model](#custom-classifier)| The **Custom classification model** can classify each page in an input file to identify the document(s) within and can also identify multiple documents or multiple instances of a single document within an input file.
| [Composed models](#composed-models) | Combine several custom models into a single model to automate processing of diverse document types with a single composed model.

For all models, except Business card model, Document Intelligence now supports add-on capabilities to allow for more sophisticated analysis. These optional capabilities can be enabled and disabled depending on the scenario of the document extraction. There are four add-on capabilities available for the `2023-07-31` (GA) API version:

* [`ocr.highResolution`](concept-add-on-capabilities.md#high-resolution-extraction)
* [`ocr.formula`](concept-add-on-capabilities.md#formula-extraction)
* [`ocr.font`](concept-add-on-capabilities.md#font-property-extraction)
* [`ocr.barcode`](concept-add-on-capabilities.md#barcode-extraction)

## Analysis features

|Model ID|Content Extraction|Paragraphs|Paragraph Roles|Selection Marks|Tables|Key-Value Pairs|Languages|Barcodes|Document Analysis|Formulas*|Style Font*|High Resolution*|
|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|
|prebuilt-read|✓|✓| | | | |O|O| |O|O|O|
|prebuilt-layout|✓|✓|✓|✓|✓| |O|O| |O|O|O|
|prebuilt-document|✓|✓|✓|✓|✓|✓|O|O| |O|O|O|
|prebuilt-businessCard|✓| | | | | | | |✓| | | |
|prebuilt-idDocument|✓| | | | | |O|O|✓|O|O|O|
|prebuilt-invoice|✓| | |✓|✓|O|O|O|✓|O|O|O|
|prebuilt-receipt|✓| | | | | |O|O|✓|O|O|O|
|prebuilt-healthInsuranceCard.us|✓| | | | | |O|O|✓|O|O|O|
|prebuilt-tax.us.w2|✓| | |✓| | |O|O|✓|O|O|O|
|prebuilt-tax.us.1098|✓| | |✓| | |O|O|✓|O|O|O|
|prebuilt-tax.us.1098E|✓| | |✓| | |O|O|✓|O|O|O|
|prebuilt-tax.us.1098T|✓| | |✓| | |O|O|✓|O|O|O|
|prebuilt-contract|✓|✓|✓|✓| | |O|O|✓|O|O|O|
|{ customModelName }|✓|✓|✓|✓|✓| |O|O|✓|O|O|O|

✓ - Enabled</br>
O - Optional</br>
\* - Premium features incur additional costs

### Read OCR

:::image type="icon" source="media/studio/read-card.png" :::

The Read API analyzes and extracts lines, words, their locations, detected languages, and handwritten style if detected.

***Sample document processed using the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/read)***:

:::image type="content" source="media/studio/form-recognizer-studio-read-v3p2.png" alt-text="Screenshot of Screenshot of sample document processed using Document Intelligence Studio Read":::

> [!div class="nextstepaction"]
> [Learn more: read model](concept-read.md)

### Layout analysis

:::image type="icon" source="media/studio/layout.png":::

The Layout analysis model analyzes and extracts text, tables, selection marks, and other structure elements like titles, section headings, page headers, page footers, and more.

***Sample document processed using the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***:

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot of sample newspaper page processed using Document Intelligence Studio.":::

> [!div class="nextstepaction"]
>
> [Learn more: layout model](concept-layout.md)

### General document

:::image type="icon" source="media/studio/general-document.png":::

The general document model is ideal for extracting common key-value pairs from forms and documents. It's a pretrained model and can be directly invoked via the REST API and the SDKs. You can use the general document model as an alternative to training a custom model.

***Sample document processed using the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/document)***:

:::image type="content" source="media/studio/general-document-analyze.png" alt-text="Screenshot of general document analysis in the Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Learn more: general document model](concept-general-document.md)

### Health insurance card

:::image type="icon" source="media/studio/health-insurance-logo.png":::

The health insurance card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from US health insurance cards.

***Sample US health insurance card processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=healthInsuranceCard.us)***:

:::image type="content" source="./media/studio/analyze-health-card.png" alt-text="Screenshot of a sample US health insurance card analysis in Document Intelligence Studio." lightbox="./media/studio/analyze-health-card.png":::

> [!div class="nextstepaction"]
> [Learn more: Health insurance card model](concept-health-insurance-card.md)

### US tax documents

:::image type="icon" source="media/studio/tax-documents.png":::

The US tax document models analyze and extract key fields and line items from a select group of tax documents. The API supports the analysis of English-language US tax documents of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The following models are currently supported:

  |Model|Description|ModelID|
  |---|---|---|
  |US Tax W-2|Extract taxable compensation details.|**prebuilt-tax.us.W-2**|
  |US Tax 1098|Extract mortgage interest details.|**prebuilt-tax.us.1098**|
  |US Tax 1098-E|Extract student loan interest details.|**prebuilt-tax.us.1098E**|
  |US Tax 1098-T|Extract qualified tuition details.|**prebuilt-tax.us.1098T**|

***Sample W-2 document processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)***:

:::image type="content" source="./media/studio/w-2.png" alt-text="Screenshot of a sample W-2.":::

> [!div class="nextstepaction"]
> [Learn more: Tax document models](concept-tax-document.md)

### Contract

:::image type="icon" source="media/overview/icon-contract.png":::

 The contract model analyzes and extracts key fields and line items from contractual agreements including parties, jurisdictions, contract ID, and title. The model currently supports English-language contract documents.

***Sample contract processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=contract)***:

:::image type="content" source="media/studio/analyze-contract.png" alt-text="Screenshot of contract model extraction using Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Learn more: contract model](concept-contract.md)

### Invoice

:::image type="icon" source="media/studio/invoice.png":::

The invoice model automates processing of invoices to extracts customer name, billing address, due date, and amount due, line items and other key data. Currently, the model supports English, Spanish, German, French, Italian, Portuguese, and Dutch invoices.

***Sample invoice processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)***:

:::image type="content" source="./media/studio/analyze-invoice.png" alt-text="Screenshot of a sample invoice." lightbox="./media/overview-invoices.jpg":::

> [!div class="nextstepaction"]
> [Learn more: invoice model](concept-invoice.md)

### Receipt

:::image type="icon" source="media/studio/receipt.png":::

Use the receipt model to scan sales receipts for merchant name, dates, line items, quantities, and totals from printed and handwritten receipts. The version v3.0 also supports single-page hotel receipt processing.

***Sample receipt processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)***:

:::image type="content" source="./media/studio/analyze-receipt.png" alt-text="Screenshot of a sample receipt." lightbox="./media/overview-receipt.jpg":::

> [!div class="nextstepaction"]
> [Learn more: receipt model](concept-receipt.md)

### Identity document (ID)

:::image type="icon" source="media/studio/id-document.png":::

Use the Identity document (ID) model to process U.S. Driver's Licenses (all 50 states and District of Columbia) and biographical pages from international passports (excluding visa and other travel documents) to extract key fields.

***Sample U.S. Driver's License processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)***:

:::image type="content" source="./media/studio/analyze-drivers-license.png" alt-text="Screenshot of a sample identification card." lightbox="./media/overview-id.jpg":::

> [!div class="nextstepaction"]
> [Learn more: identity document model](concept-id-document.md)

### Business card

:::image type="icon" source="media/studio/business-card.png":::

Use the business card model to scan and extract key information from business card images.

***Sample business card processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)***:

:::image type="content" source="./media/studio/analyze-business-card.png" alt-text="Screenshot of a sample business card." lightbox="./media/overview-business-card.jpg":::

> [!div class="nextstepaction"]
> [Learn more: business card model](concept-business-card.md)

### Custom models

:::image type="icon" source="media/studio/custom.png":::

Custom document models analyze and extract data from forms and documents specific to your business. They're trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started.

Version v3.0 custom model supports signature detection in custom forms (template model) and cross-page tables in both template and neural models.

***Sample custom template processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)***:

:::image type="content" source="media/studio/train-model.png" alt-text="Screenshot of Document Intelligence tool analyze-a-custom-form window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

#### Custom extraction

:::image type="icon" source="media/studio/custom-extraction.png":::

Custom extraction model can be one of two types, **custom template** or **custom neural**. To create a custom extraction model, label a dataset of documents with the values you want extracted and train the model on the labeled dataset. You only need five examples of the same form or document type to get started.

***Sample custom extraction processed using [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)***:

:::image type="content" source="media/studio/custom-extraction-models.png" alt-text="Screenshot of custom extraction model analysis in Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Learn more: custom template model](concept-custom-template.md)

> [!div class="nextstepaction"]
> [Learn more: custom neural model](./concept-custom-neural.md)

#### Custom classifier

:::image type="icon" source="media/studio/custom-classifier.png":::

The custom classification model enables you to identify the document type prior to invoking the extraction model.  The classification model is available starting with the `2023-07-31 (GA)` API. Training a custom classification model requires at least two distinct classes and a minimum of five samples per class.

> [!div class="nextstepaction"]
> [Learn more: custom classification model](concept-custom-classifier.md)

#### Composed models

A composed model is created by taking a collection of custom models and assigning them to a single model built from your form types. You can assign multiple custom models to a composed model called with a single model ID. You can assign up to 200 trained custom models to a single composed model.

***Composed model dialog window in [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)***:

:::image type="content" source="media/studio/composed-model.png" alt-text="Screenshot of Document Intelligence Studio compose custom model dialog window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

## Model data extraction

| **Model ID** | **Text extraction** | **Language detection** | **Selection Marks** | **Tables** | **Paragraphs** | **Structure** | **Key-Value pairs** | **Fields** |
|:-----|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| [prebuilt-read](concept-read.md#data-detection-and-extraction) | ✓ | ✓ |  |  | ✓ |   |  |   |
| [prebuilt-healthInsuranceCard.us](concept-health-insurance-card.md#field-extraction) | ✓  |   |  ✓  |  | ✓ ||  | ✓ |
| [prebuilt-tax.us.w2](concept-tax-document.md#field-extraction-w-2) | ✓  |   |  ✓  |  | ✓ ||  | ✓ |
| [prebuilt-tax.us.1098](concept-tax-document.md#field-extraction-1098) | ✓  |   |  ✓  |  | ✓ ||  | ✓ |
| [prebuilt-tax.us.1098E](concept-tax-document.md#field-extraction-1098-e) | ✓  |   |  ✓  |  | ✓ ||  | ✓ |
| [prebuilt-tax.us.1098T](concept-tax-document.md#field-extraction-1098-t) | ✓  |   |  ✓  |  | ✓ ||  | ✓ |
| [prebuilt-document](concept-general-document.md#data-extraction)| ✓  |   |  ✓ | ✓ | ✓  || ✓  |  |
| [prebuilt-layout](concept-layout.md#data-extraction)  | ✓  |   | ✓ | ✓ | ✓  | ✓  |  |  |
| [prebuilt-invoice](concept-invoice.md#field-extraction)  | ✓ |   | ✓  | ✓ | ✓ |   | ✓ | ✓ |
| [prebuilt-receipt](concept-receipt.md#field-extraction)  | ✓  |   |  |  | ✓ |   |  | ✓ |
| [prebuilt-idDocument](concept-id-document.md#field-extractions) | ✓ |   |   |  | ✓ |   |  | ✓ |
| [prebuilt-businessCard](concept-business-card.md#field-extractions)  | ✓  |   |   |  | ✓ |   |  | ✓ |
| [Custom](concept-custom.md#compare-model-features) | ✓  ||  ✓ | ✓ | ✓  |   | | ✓ |

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Document Intelligence Service.

### Version migration

Learn how to use Document Intelligence v3.0 in your applications by following our [**Document Intelligence v3.1 migration guide**](v3-1-migration-guide.md)

::: moniker-end

::: moniker range="doc-intel-2.1.0"

| **Model**   | **Description**   |
| --- | --- |
|**Document analysis**||
| [Layout](#layout)  | Extract text and layout information from documents.|
|**Prebuilt**||
| [Invoice](#invoice)  | Extract key information from English and Spanish invoices.  |
| [Receipt](#receipt)  | Extract key information from English receipts.  |
| [ID document](#id-document)  | Extract key information from US driver licenses and international passports.  |
| [Business card](#business-card)  | Extract key information from English business cards.  |
|**Custom**||
| [Custom](#custom) |  Extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases. |
| [Composed](#composed-custom-model) | Compose a collection of custom models and assign them to a single model built from your form types.

### Layout

The Layout API analyzes and extracts text, tables and headers, selection marks, and structure information from documents.

***Sample document processed using the [Sample Labeling tool](https://fott-2-1.azurewebsites.net/layout-analyze)***:

:::image type="content" source="media/overview-layout.png" alt-text="Screenshot of layout analysis using the Sample Labeling tool.":::

> [!div class="nextstepaction"]
>
> [Learn more: layout model](concept-layout.md)

### Invoice

The invoice model analyzes and extracts key information from sales invoices. The API analyzes invoices in various formats and extracts key information such as customer name, billing address, due date, and amount due.

***Sample invoice processed using the [Sample Labeling tool](https://fott-2-1.azurewebsites.net/prebuilts-analyze)***:

:::image type="content" source="./media/overview-invoices.jpg" alt-text="Screenshot of a sample invoice analysis using the Sample Labeling tool.":::

> [!div class="nextstepaction"]
> [Learn more: invoice model](concept-invoice.md)

### Receipt

* The receipt model analyzes and extracts key information from printed and handwritten sales receipts.

***Sample receipt processed using [Sample Labeling tool](https://fott-2-1.azurewebsites.net/prebuilts-analyze)***:

:::image type="content" source="./media/receipts-example.jpg" alt-text="Screenshot of a sample receipt." lightbox="./media/overview-receipt.jpg":::

> [!div class="nextstepaction"]
> [Learn more: receipt model](concept-receipt.md)

### ID document

 The ID document model analyzes and extracts key information from the following documents:

* U.S. Driver's Licenses (all 50 states and District of Columbia)

* Biographical pages from international passports (excluding visa and other travel documents). The API analyzes identity documents and extracts

***Sample U.S. Driver's License processed using the [Sample Labeling tool](https://fott-2-1.azurewebsites.net/prebuilts-analyze)***:

:::image type="content" source="./media/id-example-drivers-license.jpg" alt-text="Screenshot of a sample identification card.":::

> [!div class="nextstepaction"]
> [Learn more: identity document model](concept-id-document.md)

### Business card

The business card model analyzes and extracts key information from business card images.

***Sample business card processed using the [Sample Labeling tool](https://fott-2-1.azurewebsites.net/prebuilts-analyze)***:

:::image type="content" source="./media/business-card-example.jpg" alt-text="Screenshot of a sample business card.":::

> [!div class="nextstepaction"]
> [Learn more: business card model](concept-business-card.md)

### Custom

* Custom models analyze and extract data from forms and documents specific to your business. The API is a machine-learning program trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

***Sample custom model processing using the [Sample Labeling tool](https://fott-2-1.azurewebsites.net/)***:

:::image type="content" source="media/overview-custom.jpg" alt-text="Screenshot of Document Intelligence tool analyze-a-custom-form window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

#### Composed custom model

A composed model is created by taking a collection of custom models and assigning them to a single model built from your form types. You can assign multiple custom models to a composed model called with a single model ID. you can assign up to 100 trained custom models to a single composed model.

***Composed model dialog window using the [Sample Labeling tool](https://formrecognizer.appliedai.azure.com/studio/customform/projects)***:

:::image type="content" source="media/custom-model-compose.png" alt-text="Screenshot of Document Intelligence Studio compose custom model dialog window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

## Model data extraction

| **Model** | **Text extraction** | **Language detection** | **Selection Marks** | **Tables** | **Paragraphs** | **Paragraph roles** | **Key-Value pairs** | **Fields** |
|:-----|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| [Layout](concept-layout.md#data-extraction)  | ✓  |   | ✓ | ✓ | ✓  | ✓  |  |  |
| [Invoice](concept-invoice.md#field-extraction)  | ✓ |   | ✓  | ✓ | ✓ |   | ✓ | ✓ |
| [Receipt](concept-receipt.md#field-extraction)  | ✓  |   |  |  | ✓ |   |  | ✓ |
| [ID Document](concept-id-document.md#field-extractions) | ✓ |   |   |  | ✓ |   |  | ✓ |
| [Business Card](concept-business-card.md#field-extractions)  | ✓  |   |   |  | ✓ |   |  | ✓ |
| [Custom Form](concept-custom.md#compare-model-features) | ✓  ||  ✓ | ✓ | ✓  |   | | ✓ |

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Document Intelligence Service.

### Version migration

 You can learn how to use Document Intelligence v3.0 in your applications by following our [**Document Intelligence v3.1 migration guide**](v3-1-migration-guide.md)

::: moniker-end

## Next steps

::: moniker range=">=doc-intel-3.0.0"

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="doc-intel-2.1.0"

* Try processing your own forms and documents with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
