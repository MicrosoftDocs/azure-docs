---
title: What's new in Form Recognizer?
titleSuffix: Azure Cognitive Services
description: Understand the latest changes to the Form Recognizer API.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 12/12/2019
ms.author: pafarley

---

# What's new in Form Recognizer?

This article highlights the major changes that come with new versions of the Form Recognizer API.

> [!NOTE]
> The quickstarts and guides in this doc set always use the latest version of the API, unless they specify otherwise.

## Form Recognizer 2.0 (preview)

> [!IMPORTANT]
> Form Recognizer 2.0 is currently available for subscriptions in the `West US 2` and `West Europe` regions. If your subscription is not in this region, use the 1.0 API. The quickstarts for training and using a custom model are available for both v1.0 and v2.0.

### New features

* **Supervised learning** You can now train a custom model with manually labeled data. This results in better-performing models and can produce models that work with complex forms or forms containing values without keys.
* **Text layout extraction** You can now use the Layout API to extract text data and table data from your forms.
* **Extraction accuracy improvements** The built-in table extraction model and receipt extraction model have been improved.
* **Receipt item extraction** The prebuilt receipt model can now extract individual line items and tip amount.
* **Receipt extraction confidence** The prebuilt receipt model now reports confidence levels for each of its extractions.
* **Large data support** Your training data set for custom models can now be up to 50 MB in size.
* **TIFF file support** You can now train with and extract data from TIFF documents.


### Custom model API changes

All of the APIs for training and using custom models have been renamed, and some synchronous methods are now asynchronous. The following are major changes:

* The process of training a model is now asynchronous. You initiate training through the **/custom/models** API call. This call returns an operation ID, which you can pass into **custom/models/{modelID}** to return the training results.
* Key/value extraction is now initiated by the **/custom/models/{modelID}/analyze** API call. This call returns an operation ID, which you can pass into **custom/models/{modelID}/analyzeResults/{resultID}** to return the extraction results.
* Operation IDs for the Train operation are now found in the **Location** header of HTTP responses, not the **Operation-Location** header.

### Receipt API changes

The APIs for reading sales receipts have been renamed.

* Receipt data extraction is now initiated by the **/prebuilt/receipt/analyze** API call. This call returns an operation ID, which you can pass into **/prebuilt/receipt/analyzeResults/{resultID}** to return the extraction results.

### Output format changes

The JSON responses for all API calls have new formats. Some keys and values have been added, removed, or renamed. See the quickstarts for examples of the current JSON formats.

## Next steps

Complete a [quickstart](quickstarts/curl-train-extract.md) to get started with the [Form Recognizer APIs](https://westus2.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-preview/operations/AnalyzeWithCustomForm).