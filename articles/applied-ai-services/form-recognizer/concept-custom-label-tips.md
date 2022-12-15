---
title: Labeling tips and tricks for custom models in the Form Recognizer Studio
titleSuffix: Azure Applied AI Services
description: Label tips and tricks for Form Recognizer Studio
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 12/01/2022
ms.author: vikurpad
ms.custom: references_regions
recommendations: false
---

# Tips and tricks for labeling custom model datasets

Labeling documents can be time consuming when you have a large number of labels, long documents or documents with varying structure. These tips and tricks should help you label documents more efficiently.

## Search

The Studio now includes a search box for instances when you know you need to find specific words to label, but just don't know where in the document the values are. Simply search for the word or phrase and navigate to the specific section in the document to label the occurrence.

## Auto label tables

Tables can be tedious to label, when they have many rows or dense text. If the layout table extracts the result you need, you should just use that result and skip labeling the table. In instances where the layout table isn't exactly what you need, you can start with generating the table field from the values layout extracts. Start by selecting the table icon on the page and select on the auto label button. You can then edit the values as needed. Auto label currently only supports single page tables and a future update will include support for multi page tables.

## Shift select

When labeling a large span of text, rather than paint each word in the span, hold down the shift key as you're selecting the words to speed up labeling and ensure you don't miss any words in the span of text

## Region labeling

A second option to labeling larger spans of text is to use region labeling to select a region. When region labeling is used, the OCR results are populated in the value at training time. The different between the shift select and region labeling is only in the visual feedback the shift labeling approach provides.

## Field subtypes

When creating a field, select the right subtype to minimize post processing, for instance select the ```dmy``` option for dates to extract the values in a ```dd-mm-yyyy``` format.

## Batch layout

When creating a project, select the batch layout option to prepare all documents in your dataset for labeling. This feature ensures that you no longer have to select on each document and wait for the layout results before you can start labeling.
