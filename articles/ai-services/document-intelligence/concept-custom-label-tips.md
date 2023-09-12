---
title: Labeling tips for custom models in the Document Intelligence (formerly Form Recognizer) Studio
titleSuffix: Azure AI services
description: Label tips and tricks for Document Intelligence Studio
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: vikurpad
ms.custom: references_regions
monikerRange: '<=doc-intel-3.1.0'
---


# Tips for building labeled datasets

[!INCLUDE [applies to v3.1, v3.0, and v2.1](includes/applies-to-v3-1-v3-0-v2-1.md)]

This article highlights the best methods for labeling custom model datasets in the Document Intelligence Studio. Labeling documents can be time consuming when you have a large number of labels, long documents, or documents with varying structure. These tips should help you label documents more efficiently.

## Video: Custom labels best practices

* The following video is the second of two presentations intended to help you build custom models with higher accuracy (the first presentation explores [How to create a balanced data set](concept-custom-label.md#video-custom-label-tips-and-pointers)).

* Here, we examine best practices for labeling your selected documents. With semantically relevant and consistent labeling, you should see an improvement in model performance.</br></br>

  > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5fZKB ]

## Search

The Studio now includes a search box for instances when you know you need to find specific words to label, but just don't know where they're located in the document. Simply search for the word or phrase and navigate to the specific section in the document to label the occurrence.

## Auto label tables

Tables can be challenging to label, when they have many rows or dense text. If the layout table extracts the result you need, you should just use that result and skip the labeling process. In instances where the layout table isn't exactly what you need, you can start with generating the table field from the values layout extracts. Start by selecting the table icon on the page and select on the auto label button. You can then edit the values as needed. Auto label currently only supports single page tables.

## Shift select

When labeling a large span of text, rather than mark each word in the span, hold down the shift key as you're selecting the words to speed up labeling and ensure you don't miss any words in the span of text.

## Region labeling

A second option for labeling larger spans of text is to use region labeling. When region labeling is used, the OCR results are populated in the value at training time. The difference between the shift select and region labeling is only in the visual feedback the shift labeling approach provides.

## Field subtypes

When creating a field, select the right subtype to minimize post processing, for instance select the ```dmy``` option for dates to extract the values in a ```dd-mm-yyyy``` format.

## Batch layout

When creating a project, select the batch layout option to prepare all documents in your dataset for labeling. This feature ensures that you no longer have to select on each document and wait for the layout results before you can start labeling.

## Next steps

* Learn more about custom labeling:

  > [!div class="nextstepaction"]
  > [Custom labels](concept-custom-label.md)

* Learn more about custom template models:

  > [!div class="nextstepaction"]
  > [Custom template models](concept-custom-template.md)

* Learn more about custom neural models:

  > [!div class="nextstepaction"]
  > [Custom neural models](concept-custom-neural.md)
