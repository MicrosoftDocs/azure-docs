---
title: Form Recognizer general document model | Preview
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt general document preview model
author: vkurpad
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/05/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer general document model | Preview

The General document preview model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key-value pairs and entities from documents. General document is only available with the preview (v3.0) API.  For more information on using the preview (v3.0)) API, see our [migration guide](v3-migration-guide.md).

* The general document API supports most form types and will analyze your documents and associate values to keys and entries to tables that it discovers. It is ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to [training a custom model without labels](concept-custom.md#train-without-labels).

* The general document is a pre-trained model and can be directly invoked via the REST API. 

* The general document model supports named entity recognition (NER) for several entity categories. NER is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product, and organization. Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted from the entire content and not just the extracted values.

## General document model data extraction

| **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |**Entities** |
| --- | :---: |:---:| :---: | :---: |:---: |
|General document  | ✓  |  ✓ | ✓  | ✓  | ✓  |

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

### Named entity recognition (NER) categories

| Category | Type | Description |
|-----------|-------|--------------------|
| Person | string | A person's partial or full name. |
|PersonType | string | A person's job type or role.  |
| Location | string | Natural and human-made landmarks, structures, geographical features, and geopolitical entities |
| Organization | string | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. |
| Event | string | Historical, social, and naturally occurring events. |
| Product | string |Physical objects of various categories. |
| Skill | string | A capability, skill, or expertise. |
| Address | string | Full mailing addresses. |
| Phone number | string| Phone numbers. | 
Email | string | Email address. |
| URL | string| Website URLs and links|
| IPAddress | string| Network IP addresses. |
| DateTime | string| Dates and times of day. |
| Quantity | string | Numerical measurements and units. |

## Considerations

* Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted on the entire contents of the documents and not just the extracted values.

* Keys are spans of text extracted from the document, for semi structured documents, keys may need to be mapped to an existing dictionary of keys.

* Expect to see key value pairs with a key, but no value. For example if a user chose to not provide an email address on the form.

## Next steps

* Following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

* Try a [**Form Recognizer (preview) quickstart**](quickstarts/try-v3-client-libraries-sdk.md) and get started creating a form processing app in the development language of your choice.
