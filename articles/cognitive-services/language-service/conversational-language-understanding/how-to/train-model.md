---
title: How to train and evaluate models in Conversational Language Understanding
titleSuffix: Azure Cognitive Services
description: Use this article to train a model and view its evaluation details to make improvements.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 04/05/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Train and evaluate models

After you have completed [tagging your utterances](tag-utterances.md), you can train your model. Training is the process of converting the current state of your project's training data to build a model that can be used for predictions. Every time you train, you must name your training instance.

You can create and train multiple models within the same project. However, if you re-train a specific model it overwrites the last state.

To train a model, you need to start a training job. The output of a successful training job is your trained model. Training jobs will be automatically deleted after seven days from creation, but the output trained model will not be deleted.

The training times can be anywhere from a few seconds when dealing with orchestration workflow projects, up to a couple of hours when you reach the [maximum limit](../service-limits.md) of utterances. Before training, you will have the option to enable evaluation, which lets you view how your model performs.

## Train model 

1.	Go to your project page in Language Studio.
2.	Select **Train** from the left side menu.
3.	Select **Start a training job** from the top menu.
4.	To train a new model, select **Train a new model** and type in the model name in the text box below. You can **overwrite an existing model** by selecting this option and select the model you want from the dropdown below.

Choose if you want to evaluate and measure your model's performance. The **Run evaluation with training toggle** is enabled by default, meaning you want to measure your model's performance and you will have the option to choose how you want to split your training and testing utterances. You are provided with the two options below:

* **Automatically split the testing set from training data**: A selected stratified sample from all training utterances according to the percentages that you configure in the text box. The default value is set to 80% for training and 20% for testing. Any utterances already assigned to the testing set will be ignored completely if you choose this option.

* **Use a manual split of training and testing data**: The training and testing utterances that you’ve provided and assigned during tagging to create your custom model and measure its performance. Note that this option will only be enabled if you add utterances to the testing set in the tag data page. Otherwise, it will be disabled.


:::image type="content" source="../media/train-model.png" alt-text="A screenshot showing the Train model page for Conversational Language Understanding projects." lightbox="../media/train-model.png":::

Click the **Train** button and wait for training to complete. You will see the training status of your training job. Only successfully completed jobs will generate models.

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
