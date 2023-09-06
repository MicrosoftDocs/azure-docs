---
title: How to train and evaluate models in Conversational Language Understanding
titleSuffix: Azure AI services
description: Use this article to train a model and view its evaluation details to make improvements.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 05/12/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Train your conversational language understanding model

After you have completed [labeling your utterances](tag-utterances.md), you can start training a model. Training is the process where the model learns from your [labeled utterances](tag-utterances.md). <!--After training is completed, you will be able to [view model performance](view-model-evaluation.md).-->

To train a model, start a training job. Only successfully completed jobs create a model. Training jobs expire after seven days, after this time you will no longer be able to retrieve the job details. If your training job completed successfully and a model was created, it won't be affected by the job expiring. You can only have one training job running at a time, and you can't start other jobs in the same project. 

The training times can be anywhere from a few seconds when dealing with simple projects, up to a couple of hours when you reach the [maximum limit](../service-limits.md) of utterances.

Model evaluation is triggered automatically after training is completed successfully. The evaluation process starts by using the trained model to run predictions on the utterances in the testing set, and compares the predicted results with the provided labels (which establishes a baseline of truth). <!--The results are returned so you can review the [model’s performance](view-model-evaluation.md).-->

## Prerequisites

* A successfully [created project](create-project.md) with a configured Azure blob storage account
* [Labeled utterances](tag-utterances.md)

<!--See the [project development lifecycle](../overview.md#project-development-lifecycle) for more information.-->

## Data splitting

Before you start the training process, labeled utterances in your project are divided into a training set and a testing set. Each one of them serves a different function.
The **training set** is used in training the model, this is the set from which the model learns the labeled utterances. 
The **testing set** is a blind set that isn't introduced to the model during training but only during evaluation. 

After the model is trained successfully, the model can be used to make predictions from the utterances in the testing set. These predictions are used to calculate [evaluation metrics](../concepts/evaluation-metrics.md). 
It is recommended to make sure that all your intents and entities are adequately represented in both the training and testing set.

Conversational language understanding supports two methods for data splitting:

* **Automatically splitting the testing set from training data**: The system will split your tagged data between the training and testing sets, according to the percentages you choose. The recommended percentage split is 80% for training and 20% for testing. 

 > [!NOTE]
 > If you choose the **Automatically splitting the testing set from training data** option, only the data assigned to training set will be split according to the percentages provided.

* **Use a manual split of training and testing data**: This method enables users to define which utterances should belong to which set. This step is only enabled if you have added utterances to your testing set during [labeling](tag-utterances.md).

## Training modes

CLU supports two modes for training your models

* **Standard training** uses fast machine learning algorithms to train your models relatively quickly. This is currently only available for **English** and is disabled for any project that doesn't use English (US), or English (UK) as its primary language. This training option is free of charge. Standard training allows you to add utterances and test them quickly at no cost. The evaluation scores shown should guide you on where to make changes in your project and add more utterances. Once you’ve iterated a few times and made incremental improvements, you can consider using advanced training to train another version of your model.

* **Advanced training** uses the latest in machine learning technology to customize models with your data. This is expected to show better performance scores for your models and will enable you to use the [multilingual capabilities](../language-support.md#multi-lingual-option) of CLU as well. Advanced training is priced differently. See the [pricing information](https://azure.microsoft.com/pricing/details/cognitive-services/language-service) for details.

Use the evaluation scores to guide your decisions. There might be times where a specific example is predicted incorrectly in advanced training as opposed to when you used standard training mode. However, if the overall evaluation results are better using advanced, then it is recommended to use your final model. If that isn’t the case and you are not looking to use any multilingual capabilities, you can continue to use model trained with standard mode.

> [!Note]
> You should expect to see a difference in behaviors in intent confidence scores between the training modes as each algorithm calibrates their scores differently. 

## Train model 

# [Language Studio](#tab/language-studio)

[!INCLUDE [Train model](../includes/language-studio/train-model.md)]

# [REST APIs](#tab/rest-api)

### Start training job

[!INCLUDE [train model](../includes/rest-api/train-model.md)]

### Get training job status

Training could take sometime depending on the size of your training data and complexity of your schema. You can use the following request to keep polling the status of the training job until it is successfully completed.

[!INCLUDE [get training model status](../includes/rest-api/get-training-status.md)]

---

### Cancel training job

# [Language Studio](#tab/language-studio)

[!INCLUDE [Cancel training](../includes/language-studio/cancel-training.md)]

# [REST APIs](#tab/rest-api)

[!INCLUDE [Cancel training](../includes/rest-api/cancel-training.md)]

---


## Next steps

* [Model evaluation metrics](../concepts/evaluation-metrics.md)
<!--* [Deploy and query the model](./deploy-model.md)-->
