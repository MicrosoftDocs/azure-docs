---
title: How to test model - Custom Translator
titleSuffix: Azure Cognitive Services
description: How to create and manage a project in the Azure Cognitive Services Custom Translator portal.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 08/17/2020
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand the test results, so that I can publish the custom model or use standard.
---
# Test (human evaluate) model BLEU score and model translation

In order to make informed decision whether to use our standard model or your custom model, you should evaluate the delta between your custom model `BLEU score` and our standard model `Baseline BLEU`. Usually, an average of 3-to-5 BLEU points - or more - indecates the custom model has higher translation quality.

## Test model translation

1. Select **Test model** blade.
2. Select model **Name**, e.g., "en-de with sample data".
3. Human evaluate translation from **New model** (custom model), and **Baseline model** (our pre-trained baseline used for customization) against **Reference** (target translation from the test set)

![Model test results](../media/quickstart/model-test-details.png)

## Next steps

- Learn [how to publish model](publish-model.md).
- Learn [how to translate docuements with custom models](translate-with-custom-model.md).
