---
title: How to train your Custom sentiment analysis model - Azure AI services
titleSuffix: Azure AI services
description: Learn about how to train your model for Custom sentiment analysis.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021, event-tier1-build-2022
---

# How to train a Custom sentiment analysis model

<!--Training is the process where the model learns from your [labeled data](label-data.md). After training is completed, you'll be able to [view the model's performance](view-model-evaluation.md) to determine if you need to improve your model.-->

To train a model, start a training job. Only successfully completed jobs create a usable model. Training jobs expire after seven days. After this period, you won't be able to retrieve the job details. If your training job completed successfully and a model was created, it won't be affected by the job expiration. You can only have one training job running at a time, and you can't start other jobs in the same project. 

The training times can be anywhere from a few minutes when dealing with few documents, up to several hours depending on the dataset size and the complexity of your schema.



## Prerequisites

Before you train your model, you need:

* [A successfully created project](create-project.md) with a configured Azure blob storage account.
<!--* Text data that has [been uploaded](design-schema.md#data-preparation) to your storage account.
* [Labeled data](label-data.md).

See the [project development lifecycle](../../overview.md#project-development-lifecycle) for more information.-->

## Data splitting

Before you start the training process, labeled documents in your project are divided into a training set and a testing set. Each one of them serves a different function.
The **training set** is used in training the model, this is the set from which the model learns the class/classes assigned to each document. 
The **testing set** is a blind set that is not introduced to the model during training but only during evaluation. 
After the model is trained successfully, it is used to make predictions from the documents in the testing set. Based on these predictions, the model's evaluation metrics will be calculated. 
It is recommended to make sure that all your classes are adequately represented in both the training and testing set.

Custom sentiment analysis supports two methods for data splitting:

* **Automatically splitting the testing set from training data**: The system will split your labeled data between the training and testing sets, according to the percentages you choose. The system attempts to have a representation of all classes in your training set. The recommended percentage split is 80% for training and 20% for testing. 

 > [!NOTE]
 > If you choose the **Automatically splitting the testing set from training data** option, only the data assigned to training set will be split according to the percentages provided.

* **Use a manual split of training and testing data**: This method enables users to define which labeled documents should belong to which set. <!--This step is only enabled if you have added documents to your testing set during [data labeling](tag-data.md).-->

## Train model

# [Language studio](#tab/Language-studio)

[!INCLUDE [Train model](../../../includes/custom/language-studio/train-your-model.md)]

# [REST APIs](#tab/REST-APIs)

### Start training job

[!INCLUDE [train model](../../includes/custom/rest-api/train-model.md)]

### Get training job status

Training could take sometime depending on the size of your training data and complexity of your schema. You can use the following request to keep polling the status of the training job until it is successfully completed.

 [!INCLUDE [get training model status](../../includes/custom/rest-api/get-training-status.md)]

---

### Cancel training job

# [Language Studio](#tab/language-studio)

[!INCLUDE [Cancel training](../../../includes/custom/language-studio/cancel-training.md)]

# [REST APIs](#tab/rest-api)

[!INCLUDE [Cancel training](../../includes/custom/rest-api/cancel-training.md)]

---

## Next steps

After training is completed, you will be able to view the model's performance to optionally improve your model if needed. Once you're satisfied with your model, you can deploy it, making it available to use for use.