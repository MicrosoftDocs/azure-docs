---
title: Form Recognizer models
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt models
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/07/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer models

 Azure Form Recognizer prebuilt models enable you to add intelligent form processing to your apps and flows without having to train and build your own models. Prebuilt models use optical character recognition (OCR) combined with deep learning models to identify and extract predefined text and data fields common to specific form and document types. Form Recognizer extracts analyzes form and document data then  returns an organized, structured JSON response. Form Recognizer v2.1 supports invoice, receipt, ID document, and business card models.

## Model overview

| **Model**   | **Description**   |
| --- | --- |
| 🆕[General document (preview)](#general-document-preview) | Extract text, tables, structure, key-value pairs, and named entities.  |
| [Layout](#layout)  | Extracts text and layout information from documents.  |
| [Invoice](#invoice)  | Extract key information from English invoices.  |
| [Receipt](#receipt)  | Extract key information from English receipts.  |
| [ID document](#id-document)  | Extract key information from US driver licenses and international passports.  |
| [Business card](#business-card)  | Extract key information from English business cards.  |
| [Custom](#custom) |  Extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases. |

### General document (preview)

* The general document API supports most form types and will analyze your documents and associate values to keys and entries to tables that it discovers. It is ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to [training a custom model without labels](compose-custom-models.md#train-without-labels).

* The general document is a pre-trained model and can be directly invoked via the REST API.

* The general document model supports named entity recognition (NER) for several entity categories. NER is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product, and organization. Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted from the entire content.

##### Sample document processed in the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=document):

:::image type="content" source="media/general-document-analyze.png" alt-text="Screenshot: general document analysis in the Form Recognizer Studio.":::

> [!div class="nextstepaction"]
> [Learn more: general document model](concept-general-document.md)

### Layout

The Layout API analyzes and extracts text, tables and headers, selection marks, and structure information from documents and returns a structured JSON data representation.

##### Sample form processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/)  layout feature:

:::image type="content" source="media/overview-layout.png" alt-text="{alt-text}":::

> [!div class="nextstepaction"]
> [Learn more: layout model](concept-layout.md)

### Invoice

The invoice model analyzes and extracts key information from sales invoices. The API analyzes invoices in various formats; extracts key information such as customer name, billing address, due date, and amount due; and returns a structured JSON data representation.

##### Sample invoice processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-invoices.jpg" alt-text="sample invoice" lightbox="./media/overview-invoices.jpg":::

> [!div class="nextstepaction"]
> [Learn more: invoice model](concept-invoice.md)

### Receipt

The receipt model analyzes and extracts key information from sales receipts. The API analyzes printed and handwritten receipts; extracts key information such as merchant name, merchant phone number, transaction date, tax, and transaction total; and returns a structured JSON data representation.

##### Sample receipt processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-receipt.jpg" alt-text="sample receipt" lightbox="./media/overview-receipt.jpg":::

> [!div class="nextstepaction"]
> [Learn more: receipt model](concept-receipt.md)

### ID document

The ID document model analyzes and extracts key information from U.S. Driver's Licenses (all 50 states and District of Columbia) and international passport biographical pages (excluding visa and other travel documents). The API analyzes identity documents; extracts key information such as first name, last name, address, and date of birth; and returns a structured JSON data representation.

##### Sample U.S. Driver's License processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/id-example-drivers-license.jpg" alt-text="sample identification card" lightbox="./media/overview-id.jpg":::

> [!div class="nextstepaction"]
> [Learn more: identity document model](concept-id-document.md)

### Business card

The business card model analyzes and extracts key information from business card images. The API analyzes printed business cards; extracts key information such as first name, last name, company name, email address, and phone number;  and returns a structured JSON data representation.

##### Sample business card processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="./media/overview-business-card.jpg" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

> [!div class="nextstepaction"]
> [Learn more: business card model](concept-business-card.md)

### Custom

The custom model analyzes and extracts data from forms and documents specific to your business. The API is a machine learning program trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

##### Sample custom form processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):

:::image type="content" source="media/analyze.png" alt-text="Screenshot: Form Recognizer tool analyze-a-custom-form window.":::

> [!div class="nextstepaction"]
> [Learn more: custom model](concept-custom.md)

## Data extraction

 | **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |**Entities** |
  | --- | :---: |:---:| :---: | :---: |:---: |
  |🆕General document  | ✓  |  ✓ | ✓  | ✓  | ✓  |
  | Layout  | ✓  |   | ✓  | ✓  |   |
  | Invoice  | ✓ | ✓  | ✓  | ✓ ||
  |Receipt  | ✓  |   ✓ |   |  ||
  | ID document | ✓  |   ✓  |   |   ||
  | Business card    | ✓  |   ✓ |   |   ||
  | Custom             |✓  |  ✓ | ✓  | ✓  | ✓  |

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.
* For unsupervised learning (without labeled data):
  * data must contain keys and values.
  * keys must appear above or to the left of the values; they can't appear below or to the right.

> [!NOTE]
> The [sample labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Form Recognizer preview v3.0

  Form Recognizer v3.0 (preview) introduces several new features and capabilities:

* [**General document (preview)**](concept-general-document.md) model is a new API that uses a pre-trained model to extract text, tables, structure, key-value pairs, and named entities from forms and documents.
* [**Receipt (preview)**](concept-receipt.md) model supports single-page hotel receipt processing.
* [**ID document (preview)**](concept-id-document.md) model supports endorsements, restrictions, and vehicle classification extraction from US driver's licenses.
* [**Custom model API (preview)**](concept-custom.md) supports signature detection for custom forms.

### Version migration

Learn how to use Form Recognizer v3.0 in your applications by following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md)

## Next steps

* [Learn how to process your own forms and documents](try-sample-label-tool.md) with our [Form Recognizer sample tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md) and get started creating a form processing app in the development language of your choice.
