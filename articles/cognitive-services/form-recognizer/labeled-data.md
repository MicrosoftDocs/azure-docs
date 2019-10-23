---
title: "What is the labeled data feature? - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn about the labeled data feature, which enables supervised learning for training custom models.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: pafarley

---

# What is the labelled data feature?

The Form Recognizer service normally does unsupervised learning to train a custom model for your forms, but you can also manually label some or all of your training data. This lets the service do supervised learning and results in better-performing models. It can also produce models that work on complex forms or forms containing values without keys.

You can use labeled data through the Form Recognizer REST API.

> [!CAUTION]
> As this feature is still in development, API, inputs, and outputs are not final and might change. Preview features are available for testing and experimentation with the goal of gathering feedback. We strongly advise against using preview APIs in production applications.

## How it works

The Form Recognizer labelled data feature uses the new document Layout OCR to detect and extract printed and handwritten text from the forms.

You use the following APIs to train and extract structured data from forms.

|Name |Description |
|---|---|
| <training> | Train a new model to analyze your forms by using 10 manually labeled forms of the same type. |
| <analyze> |Analyze a single document passed in as a stream to extract key/value pairs and tables from the form with your custom model. |

## Next steps

* Follow a [how-to guide](./python-labeled-data.md) to use labeled data with the REST API and Python.
* See the [API reference documentation](https://aka.ms/form-recognizer/api) to explore the Form Recognizer API in more depth.
