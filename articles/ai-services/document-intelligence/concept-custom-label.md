---
title: Best practices for labeling documents in the Document Intelligence (formerly Form Recognizer) Studio
titleSuffix: Azure AI services
description: Label documents in the Studio to create a training dataset. Labeling guidelines aimed at training a model with high accuracy
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: vikurpad
ms.custom:
  - references_regions
  - ignite-2023
monikerRange: '>=doc-intel-3.0.0'
---


# Best practices: generating labeled datasets

[!INCLUDE [applies to v4.0 v3.1 v3.0](includes/applies-to-v40-v31-v30.md)]

Custom models (template and neural) require a labeled dataset of at least five documents to train a model. The quality of the labeled dataset affects the accuracy of the trained model. This guide helps you learn more about generating a model with high accuracy by assembling a diverse dataset and provides best practices for labeling your documents.

## Understand the components of a labeled dataset

A labeled dataset consists of several files:

* You provide a set of sample documents (typically PDFs or images). A minimum of five documents is needed to train a model.

* Additionally, the labeling process generates the following files:

  * A `fields.json` file is created when the first field is added. There's one `fields.json` file for the entire training dataset, the field list contains the field name and associated sub fields and types.

  * The Studio runs each of the documents through the [Layout API](concept-layout.md). The layout response for each of the sample files in the dataset is added as `{file}.ocr.json`. The layout response is used to generate the field labels when a specific span of text is labeled.

  * A `{file}.labels.json` file is created or updated when a field is labeled in a document. The label file contains the spans of text and associated polygons from the layout output for each span of text the user adds as a value for a specific field.

## Video: Custom label tips and pointers

* The following video is the first of two presentations intended to help you build custom models with higher accuracy (The second presentation examines [Best practices for labeling documents](concept-custom-label-tips.md#video-custom-labels-best-practices)).

* Here, we explore how to create a balanced data set and select the right documents to label. This process sets you on the path to higher quality models.</br></br>

  [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWWHru]

## Create a balanced dataset

Before you start labeling, it's a good idea to look at a few different samples of the document to identify which samples you want to use in your labeled dataset. A balanced dataset represents all the typical variations you would expect to see for the document. Creating a balanced dataset results in a model with the highest possible accuracy. A few examples to consider are:

* **Document formats**: If you expect to analyze both digital and scanned documents, add a few examples of each type to the training dataset

* **Variations (template model)**:  Consider splitting the dataset into folders and train a model for each of variation. Any variations that include either structure or layout should be split into different models. You can then compose the individual models into a single [composed model](concept-composed-models.md).

* **Variations (Neural models)**: When your dataset has a manageable set of variations, about 15 or fewer, create a single dataset with a few samples of each of the different variations to train a single model. If the number of template variations is larger than 15, you train multiple models and [compose](concept-composed-models.md) them together.

* **Tables**: For documents containing tables with a variable number of rows, ensure that the training dataset also represents documents with different numbers of rows.

* **Multi page tables**: When tables span multiple pages, label a single table. Add documents to the training dataset with the expected variations represented—documents with the table on a single page only and documents with the table spanning two or more pages with all the rows labeled.

* **Optional fields**: If your dataset contains documents with optional fields, validate that the training dataset has a few documents with the options represented.

## Start by identifying the fields

Take the time to identify each of the fields you plan to label in the dataset. Pay attention to optional fields. Define the fields with the labels that best match the supported types.

Use the following guidelines to define the fields:

* For custom neural models, use semantically relevant names for fields. For example, if the value being extracted is `Effective Date`, name it `effective_date` or `EffectiveDate` not a generic name like **date1**.

* Ideally, name your fields with Pascal or camel case.

* If a value is part of a visually repeating structure and you only need a single value, label it as a table and extract the required value during post-processing.

* For tabular fields spanning multiple pages, define and label the fields as a single table.

> [!NOTE]
> Custom neural models share the same labeling format and strategy as custom template models. Currently custom neural models only support a subset of the field types supported by custom template models.

## Model capabilities

Custom neural models currently only support key-value pairs, structured fields (tables), and selection marks.

| Model type | Form fields | Selection marks | Tabular fields | Signature | Region |
|--|--|--|--|--|--|
| Custom neural | ✔️Supported | ✔️Supported | ✔️Supported | Unsupported | ✔️Supported<sup>1</sup> |
| Custom template | ✔️Supported| ✔️Supported | ✔️Supported | ✔️Supported | ✔️Supported |

<sup>1</sup> Region labeling implementation differs between template and neural models. For template models, the training process injects synthetic data at training time if no text is found in the region labeled. With neural models, no synthetic text is injected and the recognized text is used as is.

## Tabular fields

Tabular fields (tables) are supported with custom neural models starting with API version ```2022-06-30-preview```. Models trained with API version 2022-06-30-preview or later will accept tabular field labels and documents analyzed with the model with API version 2022-06-30-preview or later will produce tabular fields in the output within the  ```documents``` section of the result in the ```analyzeResult``` object.

Tabular fields support **cross page tables** by default. To label a table that spans multiple pages, label each row of the table across the different pages in the single table. As a best practice, ensure that your dataset contains a few samples of the expected variations. For example, include both samples where an entire table is on a single page and samples of a table spanning two or more pages.

Tabular fields are also useful when extracting repeating information within a document that isn't recognized as a table. For example, a repeating section of work experiences in a resume can be labeled and extracted as a tabular field.

## Labeling guidelines

* **Labeling values is required.** Don't include the surrounding text. For example when labeling a checkbox, name the field to indicate the check box selection for example ```selectionYes``` and ```selectionNo``` rather than labeling the yes or no text in the document.

* **Don't provide interleaving field values** The value of words and/or regions of one field must be either a consecutive sequence in natural reading order without interleaving with other fields or in a region that doesn't cover any other fields

* **Consistent labeling**. If a value appears in multiple contexts withing the document, consistently pick the same context across documents to label the value.

* **Visually repeating data**. Tables support visually repeating groups of information not just explicit tables. Explicit tables are identified in tables section of the analyzed documents as part of the layout output and don't need to be labeled as tables. Only label a table field if the information is visually repeating and not identified as a table as part of the layout response. An example would be the repeating work experience section of a resume.

* **Region labeling (custom template)**. Labeling specific regions allows you to define a value when none exists. If the value is optional, ensure that you leave a few sample documents with the region not labeled. When labeling regions, don't include the surrounding text with the label.

## Next steps

* Train a custom model:

  > [!div class="nextstepaction"]
  > [How to train a model](how-to-guides/build-a-custom-model.md?view=doc-intel-3.0.0&preserve-view=true)

* Learn more about custom template models:

  > [!div class="nextstepaction"]
  > [Custom template models](concept-custom-template.md)

* Learn more about custom neural models:

  > [!div class="nextstepaction"]
  > [Custom neural models](concept-custom-neural.md)

* View the REST APIs:

    > [!div class="nextstepaction"]
    > [Document Intelligence API v4.0:2023-10-31-preview](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)

    > [!div class="nextstepaction"]
    > [Document Intelligence API v3.1:2023-07-31 (GA)](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)
