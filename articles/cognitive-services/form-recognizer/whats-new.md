---
title: What's new in Form Recognizer?
titleSuffix: Azure Cognitive Services
description: Understand the latest changes to the Form Recognizer API.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 10/16/2019
ms.author: pafarley

---

# What's New in Form Recognizer?

This article highlights the major changes that come with new versions of the Form Recognizer API.

> [!NOTE]
> The quickstarts and guides in this document set always use the latest API version, unless they specify otherwise.

## Form Recognizer 2.0 (preview)

### Custom model API changes

All of the APIs for training and using custom models have been renamed, some method signatures are different, and some synchronous methods are asynchronous. The following are major changes:

* Training is now asynchronous. You initiate training through the **/custom/models** API call. This returns an operation ID, which can be passed into **custom/models/{modelID}** to return the training results.
* Key/value extraction is now initiated by the **/custom/models/{modelID}/analyze** API call. This returns an operation ID, which can be passed into **custom/models/{modelID}/analyzeResults/{resultID}** to return the extraction results.

### Receipt API changes

The APIs for reading sales receipts have been renamed, and some method signatures are different.

* Receipt data extraction is now initiated by the **/prebuilt/receipt/analyze** API call. This returns an operation ID, which can be passed into **/prebuilt/receipt/analyzeResults/{resultID}** to return the extraction results.

### Output format changes

The JSON responses for all API calls have new formats. Some keys and values are added, removed, or renamed. See the quickstarts or how-to guides for examples of the current JSON formats.

### Large data support

Your training data set can now be up to 50 MB in size.

## Next steps

Complete a [quickstart](quickstarts/curl-train-extract.md) to get started with the [Form Recognizer APIs](https://aka.ms/form-recognizer/api).