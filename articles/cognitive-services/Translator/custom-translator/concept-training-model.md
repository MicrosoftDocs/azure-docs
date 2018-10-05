---
title: Model and training in Custom Translator
titlesuffix: Azure Cognitive Services
description: What is model in Custom Translator.
services: cognitive-services
author: rajdeep-in
manager: Chris Wendt

ms.service: cognitive-services
ms.component: custom-translator
ms.topic: conceptual
ms.date: 10/1/2018
ms.author: v-rada
---

# Training and Model

A model is the system, which provides translation for a specific language pair.
The outcome of a successful training is a model. When training a model, three
mutually exclusive data sets are required: training data, tuning data, and
testing data. Dictionary data can also be provided. 

If only training data is
provided when queuing a training, Custom Translator will automatically assemble tuning and testing datasets. It will exclude 5,000 sentences from your training data and use 2,500 each to assemble a tuning and testing sets.



## Next steps

- Read about [training dataset](ct-concepts-training-dataset.md).
- Read about [tuning dataset](ct-concepts-tuning-dataset.md).
- Read about [testing dataset](ct-concepts-testing-dataset.md).