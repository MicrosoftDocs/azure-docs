---
title: How to improve your model
titleSuffix: Azure Cognitive Services
description: Use this article to learn how to improve your Custom Language Understanding model
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

# How to improve your model

After you've trained your model and reviewed its evaluation details, you can begin improving its performance. In Custom Language Understanding, you can review inconsistencies between predicted and intended intents and entities from the model. Then examine the data distribution within your model. 

## Review predictions

After clicking on review predictions and selecting your model from the model drop-down, you will see all utterances with their labels along with their predictions.

For easier analysis, you can toggle **Show incorrect predictions** to view mistakes only.

:::image type="content" source="../media/review-predictions.png" alt-text="A screenshot showing the prediction review screen in Language Studio." lightbox="../media/review-predictions.png":::

The **labeled intent** column indicates the intent you assigned to this utterance when you were tagging your data. The **predicted intent** column includes what the model predicted for that utterance. The **intent score** column is the score of the predicted intent. A difference between the labeled and predicted intent means an incorrect prediction occurred.

The solid lines under the utterance indicate the entity labels you tagged the utterance with. The boxes around the entity indicate the entity predictions from the model. A mismatch between the lines and boxes means an incorrect prediction occurred.

If you identify a mistake in the intent or entity labels, click **View Tags** to navigate back to the **Tag Utterances** page filtered for that utterance, and make a correction.

* If you observe two intents that are being confused with each other consistently, they may be too similar. Consider merging those intents into one and using an entity to extract the distinction.
    * You might also consider making the entity into smaller ones that capture aspects of the entity you are trying to extract.
* If an entity is not being predicted correctly, consider adding more labeled examples.
* If an entity is incorrectly predicted while it wasn't tagged in your utterances, consider fixing your labels if they aren't complete, or adding more examples where similar terms are not labeled as entities. Providing the model with more data points may improve prediction.


## Examine data distribution

By clicking on **Examine data distribution**, you can observe the amount of data associated to each intent or entity. A large disparity may cause your model to be biased to a more heavily populated intent or entity. Consider adding more labels to other intents and entities. You want to ensure that there isn't under-representation or over-representation in your model.

:::image type="content" source="../media/examine-data-distribution.png" alt-text="A screenshot showing the data distribution screen in Language Studio." lightbox="../media/examine-data-distribution.png":::

## Next Steps

* [Deploy Model](deploy-query-model.md)
