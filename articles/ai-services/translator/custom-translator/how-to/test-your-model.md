---
title: View custom model details and test translation
titleSuffix: Azure AI services
description: How to test your custom model BLEU score and evaluate translations
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: how-to
---
# Test your model

Once your model has successfully trained, you can use translations to evaluate the quality of your model. In order to make an informed decision about whether to use our standard model or your custom model, you should evaluate the delta between your custom model [**BLEU score**](#bleu-score) and our standard model **Baseline BLEU**. If your models have been trained on a narrow domain, and your training data is consistent with the test data, you can expect a high BLEU score.

## BLEU score

BLEU (Bilingual Evaluation Understudy) is an algorithm for evaluating the precision or accuracy of text that has been machine translated from one language to another. Custom Translator uses the BLEU metric as one way of conveying translation accuracy.

A BLEU score is a number between zero and 100. A score of zero indicates a low-quality translation where nothing in the translation matched the reference. A score of 100 indicates a perfect translation that is identical to the reference. It's not necessary to attain a score of 100—a BLEU score between 40 and 60 indicates a high-quality translation.

[Read more](../concepts/bleu-score.md?WT.mc_id=aiml-43548-heboelma)

## Model details

1. Select the **Model details** blade.

1. Select the model name. Review the training date/time, total training time, number of sentences used for training, tuning, testing, and dictionary. Check whether the system generated the test and tuning sets. You'll use the `Category ID` to make translation requests.

1. Evaluate the model [BLEU](../beginners-guide.md#what-is-a-bleu-score) score. Review the test set: the **BLEU score** is the custom model score and the **Baseline BLEU** is the pre-trained baseline model used for customization. A higher **BLEU score** means there's high translation quality using the custom model.

   :::image type="content" source="../media/quickstart/model-details.png" alt-text="Screenshot illustrating the model detail.":::

## Test quality of your model's translation

1. Select **Test model** blade.

1. Select model **Name**.

1. Human evaluate translation from your **Custom model** and the **Baseline model** (our pre-trained baseline used for customization) against **Reference** (target translation from the test set).

1. If you're satisfied with the training results, place a deployment request for the trained model.

## Next steps

- Learn [how to publish/deploy a custom model](publish-model.md).
- Learn [how to translate documents with a custom model](translate-with-custom-model.md).
