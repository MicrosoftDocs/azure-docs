---
title: Form Recognizer models
titleSuffix: Azure Applied AI Services
description: Concepts related to data extraction and analysis using prebuilt models.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 08/22/2022
ms.author: lajanuar
recommendations: false
ms.custom: ignite-fall-2021
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer models

 Azure Form Recognizer supports a wide variety of models that enable you to add intelligent document processing to your apps and flows. You can use a prebuilt document analysis or domain specific model or train a custom model tailored to your specific business needs and use cases. Form Recognizer can be used with the REST API or Python, C#, Java, and JavaScript SDKs.

## Model overview

| **Model**   | **Description**   |
| --- | --- |
|**Document analysis**||
| [Read](#read) | Extract typeface and handwritten text lines, words, locations, and detected languages.|
| [General document](#general-document) | Extract text, tables, structure, key-value pairs, and named entities.|
| [Layout](#layout)  | Extract text and layout information from documents.|
|**Prebuilt**||
| [W-2](#w-2) | Extract employee, employer, wage information, etc. from US W-2 forms.  |
| [Invoice](#invoice)  | Extract key information from English and Spanish invoices.  |
| [Receipt](#receipt)  | Extract key information from English receipts.  |
| [ID document](#id-document)  | Extract key information from US driver licenses and international passports.  |
| [Business card](#business-card)  | Extract key information from English business cards.  |
|**Custom**||
| [Custom](#custom) |  Extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases. |
| [Composed](#composed-custom-model) | Compose a collection of custom models and assign them to a single model built from your form types.

### Read

[:::image type="icon" source="media/studio/read-card.png" :::](https://formrecognizer.appliedai.azure.com/studio/read)

The Read API analyzes and extracts ext lines, words, their locations, detected languages, and handwritten style if detected.

***Sample document processed using the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/read)***:

:::image type="content" source="media/studio/form-recognizer-studio-read-v3p2.png" alt-text="Screenshot: Screenshot of sample document processed using Form Recognizer studio Read":::

> [!div class="nextstepaction"]
> [Learn more: read model](concept-read.md)

### W-2 

[:::image type="icon" source="media/studio/w2.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)

The W-2 model analyzes and extracts key information reported in each box on a W-2 form. The model supports standard and customized forms from 2018 to the present, including single and multiple forms on one page.

***Sample W-2 document processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)***:

:::image type="content" source="./media/studio/w-2.png" alt-text="Screenshot of a sample W-2.":::

> [!div class="nextstepaction"]
> [Learn more: W-2 model](concept-w2.md)

### General document 

[:::image type="icon" source="media/studio/general-document.png":::](https://formrecognizer.appliedai.azure.com/studio/document)

* The general document API supports most form types and will analyze your documents and associate values to keys and entries to tables that it discovers. It's ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to training a custom model without labels.

* The general document is a pre-trained model and can be directly invoked via the REST API.

* The general document model supports named entity recognition (NER) for several entity categories. NER is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product, and organization. Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted from the entire content.

***Sample document processed using the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/document)***:

:::image type="content" source="media/studio/general-document-analyze.png" alt-text="Screenshot: general document analysis in the Form Recognizer Studio.":::

> [!div class="nextstepaction"]
> [Learn more: general document model](concept-general-document.md)

### Layout

[:::image type="icon" source="media/studio/layout.png":::](https://formrecognizer.appliedai.azure.com/studio/layout)

The Layout API analyzes and extracts text, tables and headers, selection marks, and structure information from documents.

***Sample document processed using the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***:

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot: Screenshot of sample newspaper page processed using Form Recognizer studio":::

> [!div class="nextstepaction"]
>
> [Learn more: layout model](concept-layout.md)

### Invoice

[:::image type="icon" source="media/studio/invoice.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

The invoice model analyzes and extracts key information from sales invoices. The API analyzes invoices in various formats and extracts key information such as customer name, billing address, due date, and amount due. Currently, the model supports English, Spanish, German, French, Italian, Portuguese, and Dutch invoices.

***Sample invoice processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)***:

:::image type="content" source="./media/studio/analyze-invoice.png" alt-text="Screenshot of a sample invoice." lightbox="./media/overview-invoices.jpg":::

> [!div class="nextstepaction"]
> [Learn more: invoice model](concept-invoice.md)

### Receipt

[:::image type="icon" source="media/studio/receipt.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)

* The receipt model analyzes and extracts key information from printed and handwritten sales receipts.

* Version v3.0 also supports single-page hotel receipt processing.

***Sample receipt processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)***:

:::image type="content" source="./media/studio/analyze-receipt.png" alt-text="Screenshot of a sample receipt." lightbox="./media/overview-receipt.jpg":::

> [!div class="nextstepaction"]
> [Learn more: receipt model](concept-receipt.md)

### ID document

[:::image type="icon" source="media/studio/id-document.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)

 The ID document model analyzes and extracts key information from the following documents:

* U.S. Driver's Licenses (all 50 states and District of Columbia)

* Biographical pages from international passports (excluding visa and other travel documents). The API analyzes identity documents and extracts

***Sample U.S. Driver's License processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)***:

:::image type="content" source="./media/studio/analyze-drivers-license.png" alt-text="Screenshot of a sample identification card." lightbox="./media/overview-id.jpg":::

> [!div class="nextstepaction"]
> [Learn more: identity document model](concept-id-document.md)

### Business card

[:::image type="icon" source="media/studio/business-card.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)

The business card model analyzes and extracts key information from business card images.

***Sample business card processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)***:

:::image type="content" source="./media/studio/analyze-business-card.png" alt-text="Screenshot of a sample business card." lightbox="./media/overview-business-card.jpg":::

> [!div class="nextstepaction"]
> [Learn more: business card model](concept-business-card.md)

### Custom

 [:::image type="icon" source="media/studio/custom.png":::](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)

* Custom models analyze and extract data from forms and documents specific to your business. The API is a machine-learning program trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

* Version v3.0 custom model supports signature detection in custom forms (template model) and cross-page tables in both template and neural models.

***Sample custom template processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)***:

:::image type="content" source="media/studio/train-model.png" alt-text="Screenshot: Form Recognizer tool analyze-a-custom-form window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

#### Composed custom model

A composed model is created by taking a collection of custom models and assigning them to a single model built from your form types. You can assign multiple custom models to a composed model called with a single model ID. you can assign up to 100 trained custom models to a single composed model.

***Composed model dialog window in [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)***:

:::image type="content" source="media/studio/composed-model.png" alt-text="Screenshot of Form Recognizer Studio compose custom model dialog window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

## Model data extraction

| **Model ID** | **Text extraction** | **Language detection** | **Selection Marks** | **Tables** | **Paragraphs** | **Paragraph roles** | **Key-Value pairs** | **Fields** |
|:-----|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| [prebuilt-read](concept-read.md#data-extraction) | ✓ | ✓ |  |  | ✓ |   |  |   |  
| [prebuilt-tax.us.w2](concept-w2.md#field-extraction) | ✓  |   |  ✓  |  | ✓ |    |  | ✓ |
| [prebuilt-document](concept-general-document.md#data-extraction)| ✓  |   |  ✓ | ✓ | ✓  |    | ✓  |  |
| [prebuilt-layout](concept-layout.md#data-extraction)  | ✓  |   | ✓ | ✓ | ✓  | ✓  |  |  | 
| [prebuilt-invoice](concept-invoice.md#field-extraction)  | ✓ |   | ✓  | ✓ | ✓ |   | ✓ | ✓ |  
| [prebuilt-receipt](concept-receipt.md#field-extraction)  | ✓  |   |  |  | ✓ |   |  | ✓ | 
| [prebuilt-idDocument](concept-id-document.md#field-extractions) | ✓ |   |   |  | ✓ |   |  | ✓ | 
| [prebuilt-businessCard](concept-business-card.md#field-extractions)  | ✓  |   |   |  | ✓ |   |  | ✓ | 
| [Custom](concept-custom.md#compare-model-features)             | ✓  |    |  ✓ | ✓ | ✓  |   | | ✓ | 

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

### Version migration

Learn how to use Form Recognizer v3.0 in your applications by following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md)

## Next steps

* [Learn how to process your own forms and documents](quickstarts/try-sample-label-tool.md) with our [Form Recognizer sample tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md) and get started creating a document processing app in the development language of your choice.
