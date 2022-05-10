---
title: How to train and evaluate models in orchestration workflow projects
titleSuffix: Azure Cognitive Services
description: Use this article to train an orchestration model and view its evaluation details to make improvements.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/21/2022
ms.author: aahi
ms.custom: language-service-orchestration
---

# Train and evaluate orchestration workflow models

After you have completed [tagging your utterances](./tag-utterances.md), you can train your model. Training is the act of converting the current state of your project's training data to build a model that can be used for predictions. Every time you train, you have to name your training instance. 

You can create and train multiple models within the same project. However, if you re-train a specific model it overwrites the last state.

The training times can be anywhere from a few seconds, up to a couple of hours when you reach high numbers of utterances.

## Train model

Select **Train model** on the left of the screen. Select **Start a training job** from the top menu.

Enter a new model name or select an existing model from the **Model Name** dropdown. 

:::image type="content" source="../media/train-orchestration.png" alt-text="A screenshot showing the Train model page for Orchestration workflow projects." lightbox="../media/train-orchestration.png":::

Click the **Train** button and wait for training to complete. You will see the training status of your model in the view model details page. Only successfully completed jobs will generate models.

## Evaluate model

After model training is completed, you can view your model details and see how well it performs against the test set in the training step. Observing how well your model performed is called evaluation. The test set is composed of 20% of your utterances, and this split is done at random before training. The test set consists of data that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 utterances in your training set.

In the **view model details** page, you'll be able to see all your models, with their score. Scores are only available if you have enabled evaluation before hand.

* Click on the model name for more details. A model name is only clickable if you've enabled evaluation before hand. 
* In the **Overview** section you can find the macro precision, recall and F1 score for the collective intents. 
* Under the **Intents** tab you can find the micro precision, recall and F1 score for each intent separately.

> [!NOTE]
> If you don't see any of the intents you have in your model displayed here, it is because they weren't in any of the utterances that were used for the test set.

You can view the [confusion matrix](../concepts/evaluation-metrics.md) for intents by clicking on the **Test set confusion matrix** tab at the top fo the screen. 

## Next steps
* [Model evaluation metrics](../concepts/evaluation-metrics.md)
* [Deploy and query the model](./deploy-query-model.md)
