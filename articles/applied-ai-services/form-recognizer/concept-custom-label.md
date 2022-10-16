---
title: Best practices for lableing documents in the Form Recognizer Studio
titleSuffix: Azure Applied AI Services
description: Label documents in in the Studio to create a training dataset. Labeling guidelines aimed at training a model with high accuracy
author: vkurpad
manager: netahw
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/06/2022
ms.author: vikurpad
ms.custom: references_regions
recommendations: false
---

# Best practices on generating a Form Recognizer labeled dataset

Custom models, template and neural require a labeled dataset of at least 5 documents to train a model. The quality of the labeled dataset determines the accuracy of the trained model. This guide is intended to help you learn more about generating a high quality labeled dataset. The Form Recognzizer Studio enables you to start from a set of documents or images and build out the conplete labeled dataset. To learn more about getting started with the Form Recognizer Studio, see the [getting started guide](quickstarts/try-v3-form-recognizer-studio.md).

## Understanding the components of the labeled dataset

A labeled dataset contains tree types of files:
* A set of sample documents (typically PDFs or images), you need a minimum of 5 documents to train a model.
* The labeling process will generate the following files:
    - A `fields.json` file is created when the first field is added. There is one fields.json file for the entire training dataset, the filed list contins the field name and associated sub fields and types.
    - The Studio runs each of the documents throught the [Layout API](concept-layout.md). The layout response for each of the sample files in the dataset is added as `{file}.ocr.json`. The layout response is used to generat the field labels when a specific span of text is labeled.
    - A `{file}.labels.json` file associated with each of the sample documents when a field is labled in a document. The label file contains the span of text and associated polygons from the layout output for each span of text the user adds as a value for a specific field.

## Creating a balanced dataset

Before you start labeling, its a good idea to look at a few different samples of the document to identify which samples you want to use in your labeled dataset. A balanced dataset represents all the typical variations you would expect to see for the document. Creating a balanced dataset will result in a model with the highest possible accuracy. A few examples to consider are:
* Document formats - If your model will expect to see both digital and scanned documents, add a few examples of each type to the training dataset
* Variations (template model) -  consider splitting the dataset into folders and train a model for each of the variation. Variations that include either structure or layout variations should be split into different models. 
* Variations (Neural models) - Add samples of each of the different variations to the training dataset and train a single model. 
* Tables - For documents containing tables with a variable number of rows, ensure that the training datset also represents documents with different number of rows.
* Multi page tables - Wehn tables span multiple pages, label the tables as a single table and add documents to the training dataset with the expected variations represented, for exampple a document with th table on a single page only, documents with tables spanning 2 or more pages.
* Optional fields - If your documents contain documents with options fields, validate that the training dataset has a few documents with the optioality represented.


## Start by identifying the fields

Take the time to identify each of the fields you plan to label in the dataset, identify if the fields are going to be present in each of the documents/forms or if they are optional. Define the fields with the type that best matches the supported types. 

Use the following guidelines to defining the fields:
* For custom neural models use semantically relevent names for fields. As an example, if the value being extracted is `Effective Date`, name it `effective_date` or `EffectiveDate` not date1
* Ideally, name your field Pascal case, camel case or with spaces.
* If a value is part of a visually repeating structure and you only need a single value, label it as a table and extract the required value in post processing
* For tabular fields spanning multiple pages define a single table


|Documents | Examples |
|---|--|
|structured| surveys, questionnaires|
|semi-structured | invoices, purchase orders |
|unstructured | contracts, letters|

Custom neural models share the same labeling format and strategy as custom template models. Currently custom neural models only support a subset of the field types supported by custom template models. 

## Model capabilities

Custom neural models currently only support key-value pairs and selection marks, future releases will include support for structured fields (tables) and signature.

| Model type | Form fields | Selection marks | Tabular fields | Signature | Region |
|--|--|--|--|--|--|
| Custom neural | Supported| Supported | Supported | Unsupported | Unsupported |
| Custom template | Supported| Supported | Supported | Supported | Supported |

## Tabular fields 

Tabular fields (tables) are supported with custom neural models starting with API verison ```2022-06-30-preview```. Models trained with API version 2022-06-30-preview or later will accept tabular field labels and documents analyzed with the model with API version 2022-06-30-preview or later will produce tabular fields in the output within the  ```documents``` section of the result in the ```analyzeResult``` object. 

Tabular filds support **cross page tables** by default. To label a table that spans multiple pages, label each row of the table across the different pages in the single table. As a best practice ensure that your dataset contains a few samples of the expected variations, for example include samples where the entire table is on a single page, samples of tables spanning two or more pages.

Tabular field is also useful when extracting repeating infomrmation within a document that is not recognized as a table. For example a repeating section of work experiences in a resume can be labeled and extracted as a tabular field.

## Labeling guidelines

* Label only the vale required, do not include any of the surrounding text. For example when labeling a checkbox, name the field to indicate the check box selection for example ```seclection_yes``` and ```selection_no``` rather than labeling the yes or no text in the document.
* Non interleaving values - Value words/region of one field must be either
    - Consecutive sequence in natural reading order without interleaving with other fields or
    - In a region which does not cover any other fields
* Consistent labeling - If a value appears in multiple contexts withing the document, consistently pick the same context across documents to label the value.
* Tables support visually repeating grous of information not just explicit tables. Explicit tables will be identified in tables section of the analyzed documents as part of the layout output and do not need to be labeled as tables. Only label a table field if the information is visually repeating and not identified as a table as part of the the layout response. An example would be the repeating work experince section.
* Region labeling (custom template) allows you to define a value when none exists. If the value is optional, ensure that you leave a few sample documents with the region not labeled.
* When labeling regions, do not include any of the surrounding text with the label. 
* 



## Next steps

* Train a custom model:

  > [!div class="nextstepaction"]
  > [How to train a model](how-to-guides/build-custom-model-v3.md)

* Learn more about custom template models:

  > [!div class="nextstepaction"]
  > [Custom template models](concept-custom-template.md )

* View the REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)