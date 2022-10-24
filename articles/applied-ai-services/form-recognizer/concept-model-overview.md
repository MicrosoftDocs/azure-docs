---
title: Document processing models - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Document processing models for OCR, document layout, invoices, identity, custom  models, and more to extract text, structure, and key-value pairs.
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

# Document processing models

Azure Form Recognizer includes several machine-learning based document processing models to help you automate intelligent document extraction in your applications and workflows. Use OCR and layout analysis models to extract text and structure. Use general document, invoice processing, and other scenario-specific models to extract key-value pairs from invoices and other documents. You can also build custom models tailored to your specific business needs. Use your favorite development option from REST API or Python, C#, Java, and JavaScript SDKs to get started.

## Model overview

| **Model**   | **Description**   |
| --- | --- |
|**Document analysis models**||
| [Read OCR](#read) | Extract print and handwritten text including words, locations, and detected languages.|
| [Layout analysis](#layout)  | Extract text and results from document layout analysis.|
| [General document](#general-document) | Extract key-value pairs in addition to text and document structure information.|
|**Prebuilt models**||
| [W-2](#w-2) | Process W2 forms to extract employee, employer, wage, and other information.  |
| [Invoice](#invoice)  | Automate invoice processing for English and Spanish invoices. |
| [Receipt](#receipt)  | Extract receipt data from English receipts.|
| [ID document](#id-document)  | Extract identity (ID) fields from US driver licenses and international passports. |
| [Business card](#business-card)  | Scan business cards to extract key fields and data into your applications. |
|**Custom models**||
| [Custom](#custom) |  Extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases. |
| [Composed](#composed-custom-model) | Combine several custom models into a single model to automate processing of diverse document types with a single composed model.

### Read OCR

[:::image type="icon" source="media/studio/read-card.png" :::](https://formrecognizer.appliedai.azure.com/studio/read)

The Read API analyzes and extracts ext lines, words, their locations, detected languages, and handwritten style if detected.

***Sample document processed using the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/read)***:

:::image type="content" source="media/studio/form-recognizer-studio-read-v3p2.png" alt-text="Screenshot: Screenshot of sample document processed using Form Recognizer studio Read":::

> [!div class="nextstepaction"]
> [Learn more: read model](concept-read.md)

### Layout analysis

[:::image type="icon" source="media/studio/layout.png":::](https://formrecognizer.appliedai.azure.com/studio/layout)

The Layout analysis model analyzes and extracts text, tables, selection marks, and structure information from documents.

***Sample document processed using the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/layout)***:

:::image type="content" source="media/studio/form-recognizer-studio-layout-newspaper.png" alt-text="Screenshot: Screenshot of sample newspaper page processed using Form Recognizer studio":::

> [!div class="nextstepaction"]
>
> [Learn more: layout model](concept-layout.md)

### General document 

[:::image type="icon" source="media/studio/general-document.png":::](https://formrecognizer.appliedai.azure.com/studio/document)

The general document model is ideal for extracting common key-value pairs from forms and documents. It’s a pre-trained model and can be directly invoked via the REST API and the SDKs. You can use the general document model as an alternative to training a custom model.

***Sample document processed using the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/document)***:

:::image type="content" source="media/studio/general-document-analyze.png" alt-text="Screenshot: general document analysis in the Form Recognizer Studio.":::

> [!div class="nextstepaction"]
> [Learn more: general document model](concept-general-document.md)


### W-2 

[:::image type="icon" source="media/studio/w2.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)

The W-2 form model extracts key information reported in each box on a W-2 form. The model supports standard and customized forms from 2018 to the present, including single and multiple forms on one page.

***Sample W-2 document processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)***:

:::image type="content" source="./media/studio/w-2.png" alt-text="Screenshot of a sample W-2.":::

> [!div class="nextstepaction"]
> [Learn more: W-2 model](concept-w2.md)

### Invoice

[:::image type="icon" source="media/studio/invoice.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

The invoice model automates processing of invoices to extracts customer name, billing address, due date, and amount due, line items and other key data. Currently, the model supports English, Spanish, German, French, Italian, Portuguese, and Dutch invoices.

***Sample invoice processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)***:

:::image type="content" source="./media/studio/analyze-invoice.png" alt-text="Screenshot of a sample invoice." lightbox="./media/overview-invoices.jpg":::

> [!div class="nextstepaction"]
> [Learn more: invoice model](concept-invoice.md)

### Receipt

[:::image type="icon" source="media/studio/receipt.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)

Use the receipt model to scan sales receipts for merchant name, dates, line items, quantities, and totals from printed and handwritten receipts. The version v3.0 also supports single-page hotel receipt processing.

***Sample receipt processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)***:

:::image type="content" source="./media/studio/analyze-receipt.png" alt-text="Screenshot of a sample receipt." lightbox="./media/overview-receipt.jpg":::

> [!div class="nextstepaction"]
> [Learn more: receipt model](concept-receipt.md)

### Identity (ID) document

[:::image type="icon" source="media/studio/id-document.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)

Use the Identity document (ID) model to process U.S. Driver's Licenses (all 50 states and District of Columbia) and biographical pages from international passports (excluding visa and other travel documents) to extract key fields.

***Sample U.S. Driver's License processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)***:

:::image type="content" source="./media/studio/analyze-drivers-license.png" alt-text="Screenshot of a sample identification card." lightbox="./media/overview-id.jpg":::

> [!div class="nextstepaction"]
> [Learn more: identity document model](concept-id-document.md)

### Business card

[:::image type="icon" source="media/studio/business-card.png":::](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)

Use the business card model to scan and extract key information from business card images.

***Sample business card processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)***:

:::image type="content" source="./media/studio/analyze-business-card.png" alt-text="Screenshot of a sample business card." lightbox="./media/overview-business-card.jpg":::

> [!div class="nextstepaction"]
> [Learn more: business card model](concept-business-card.md)

### Custom models

 [:::image type="icon" source="media/studio/custom.png":::](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)

Custom document models analyze and extract data from forms and documents specific to your business. They are trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started.

Version v3.0 custom model supports signature detection in custom forms (template model) and cross-page tables in both template and neural models.

***Sample custom template processed using [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)***:

:::image type="content" source="media/studio/train-model.png" alt-text="Screenshot: Form Recognizer tool analyze-a-custom-form window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

#### Composed custom model

A composed model is created by taking a collection of custom models and assigning them to a single model built from your form types. You can assign multiple custom models to a composed model called with a single model ID. You can assign up to 100 trained custom models to a single composed model.

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
