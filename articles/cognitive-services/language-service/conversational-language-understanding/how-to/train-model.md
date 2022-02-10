---
title: How to train and evaluate models in Conversational Language Understanding
titleSuffix: Azure Cognitive Services
description: Use this article to train a model and view its evaluation details to make improvements.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Train and evaluate models

After you have completed [tagging your utterances](./tag-utterances.md), you can train your model. Training is the act of converting the current state of your project's training data to build a model that can be used for predictions. Every time you train, you have to name your training instance. 

You can create and train multiple models within the same project. However, if you re-train a specific model it overwrites the last state.

The training times can be anywhere from a few seconds when dealing with orchestration workflow projects, up to a couple of hours when you reach the [maximum limit](../service-limits.md) of utterances. Before training, you will have the option to enable evaluation, which lets you view how your model performs. 

## Train model

Select **Train model** on the left of the screen. Select **Start a training job** from the top menu.

Enter a new model name or select an existing model from the **Model Name** dropdown. 

Select whether you want to evaluate your model by changing the **Run evaluation with training** toggle. If enabled, your tagged utterances will be spilt into 2 parts; 80% for training, 20% for testing. Afterwards, you'll be able to see the model's evaluation results.

:::image type="content" source="../media/train-model.png" alt-text="A screenshot showing the Train model page for Conversational Language Understanding projects." lightbox="../media/train-model.png":::

Click the **Train** button and wait for training to complete. You will see the training status of your model in the view model details page. Only successfully completed tasks will generate models.

## Evaluate model

After model training is completed, you can view your model details and see how well it performs against the test set if you enabled evaluation in the training step. Observing how well your model performed is called evaluation. The test set is composed of 20% of your utterances, and this split is done at random before training. The test set consists of data that was not introduced to the model during the training process. For the evaluation process to complete there must be at least 10 utterances in your training set.

In the **view model details** page, you'll be able to see all your models, with their current training status, and the date they were last trained.

:::image type="content" source="../media/model-page-1.png" alt-text="A screenshot showing the model details page for Conversational Language Understanding projects." lightbox="../media/model-page-1.png":::

* Click on the model name for more details. A model name is only clickable if you've enabled evaluation before hand. 
* In the **Overview** section you can find the macro precision, recall and F1 score for the collective intents or entities, based on which option you select. 
* Under the **Intents** and **Entities** tabs you can find the micro precision, recall and F1 score for each intent or entity separately.

> [!NOTE]
> If you don't see any of the intents or entities you have in your model displayed here, it is because they weren't in any of the utterances that were used for the test set.

You can view the [confusion matrix](../concepts/evaluation-metrics.md#confusion-matrix) for intents and entities by clicking on the **Test set confusion matrix** tab at the top fo the screen. 

## Next steps
* [Model evaluation metrics](../concepts/evaluation-metrics.md)
* [Deploy and query the model](./deploy-query-model.md)
