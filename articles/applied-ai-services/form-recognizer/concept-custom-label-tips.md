---
title: Labeling tips for custom models in the Form Recognizer Studio
titleSuffix: Azure Applied AI Services
description: Label tips and tricks for Form Recognizer Studio
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 12/15/2022
ms.author: vikurpad
ms.custom: references_regions
recommendations: false
---

# Tips for labeling custom model datasets

This article highlights the best methods for labeling custom model datasets in the Form Recognizer Studio. Labeling documents can be time consuming when you have a large number of labels, long documents, or documents with varying structure. These tips should help you label documents more efficiently.

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
  > [Custom template models](concept-custom-template.md )

* Learn more about custom neural models:

  > [!div class="nextstepaction"]
  > [Custom neural models](concept-custom-neural.md )
