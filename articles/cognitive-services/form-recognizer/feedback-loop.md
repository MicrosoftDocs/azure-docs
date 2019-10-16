---
title: "How to use the Feedback Loop feature - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn about the Feedback Loop feature, which enables supervised learning for training custom models.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: pafarley

---

# What is Form Recognizer Feedback Loop?

The Form Recognizer service normally does unsupervised learning to train a custom model for your forms, but the Feedback Loop feature lets you manually label some or all of your training data. This lets the service do supervised learning and results in better-performing models. It can also produce models that work on complex forms or forms containing values without keys.

You can use Feedback Loop through the Form Recognizer REST API to reduce complexity and easily integrate it into your workflow or application.

> [!CAUTION]
> As this feature is still in development, API, inputs, and outputs are not final and might change. Preview features are available for testing and experimentation with the goal of gathering feedback. We strongly advise against using preview APIs in production applications.

## How it works

Form Recognizer Feedback Loop uses the new document Layout OCR to detect and extract printed and handwritten text from the forms.

You use the following APIs to train and extract structured data from forms.

|Name |Description |
|---|---|
| <training> | Train a new model to analyze your forms by using the feedback loop and 10 forms of the same type. |
| <analyze> |Analyze a single document passed in as a stream to extract key/value pairs and tables from the form with your custom model. |

## Next steps

* Follow a [how-to guide](./python-feedback-loop.md) to use the Feedback Loop feature with the REST API and Python.
* See the [API reference documentation](https://aka.ms/form-recognizer/api) to explore the Form Recognizer API in more depth.
