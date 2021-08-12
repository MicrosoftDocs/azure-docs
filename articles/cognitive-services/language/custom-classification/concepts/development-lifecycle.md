---
title: Development lifecycle for custom classification 
titleSuffix: Azure Cognitive Services
description: Learn about the steps for developing models for custom classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 07/15/2021
ms.author: aahi
---

# Development lifecycle for custom classification models

There are several steps for creating and using models for custom classification. 

## Azure resources

> [!NOTE]
> To use custom classification, you'll need a Language Services resource in **West US 2** or **West Europe** with the Standard (S) pricing tier.

To use custom classification, you will need a Language Services resource. We recommend the steps in the [quickstart](../quickstart/using-language-studio.md) for creating one in the Azure portal. Creating a resource in the Azure portal lets you create an Azure blob storage account at the same time, with all of the required permissions pre-configured. 

You can also create a resource in Language Studio by clicking the settings icon in the top right corner, selecting **Resources**, then clicking **Create a new resource**. If you use this process, or have a preexisting storage account you'd like to use, you will have to [create an Azure Blob storage account](/azure/storage/common/storage-account-create). Afterwards you'll need to:
1. Enable identity management on your Azure resource.
2. Set contributor roles on the storage account

### Identity management for your Language Services resource

Your Language Services resource must have identity management, which can be enabled either using the Azure portal or from Language Studio. To enable it using [Language Studio](https://language.azure.com/):
1. Click the settings icon in the top right corner of the screen
2. Select **Resources**
3. Select **Managed Identity** for your Azure resource.

### Contributor roles for your storage account

Your Azure blob storage account must have the below contributor roles:

* Your resource has the **owner** or **contributor** role on the storage account.
* Your resource has the **Storage blob data owner** or **Storage blob data contributor** role on the storage account.
* Your resource has the **Reader** role on the storage account.

To set proper roles on your storage account:

1. Go to your storage account page in the [Azure portal](https://ms.portal.azure.com/).
2. Select **Access Control (IAM)** in the left navigation menu.
3. Select **Add** to **Add Role Assignments**, and choose the **Owner** or **Contributor** role. You can search for user names in the **Select** field.

[!INCLUDE [Storage connection note](../includes/storage-account-note.md)]

## Project creation

When you create a custom text classification project, you will connect it to a blob storage container where your data is uploaded. Within your project you can view your files, tag data, train, evaluate, improve, and deploy your model.

You can have up to 500 projects per resource, and up to 10 models per project. However, you can only have one deployed model per project. See the [data limits](data-limits.md) article for more information.

Custom text classification supports two types of projects. You will choose one when you create a project:

* Single class classification: You can only assign a single classification for each file of your dataset.
* Multiple class classification: You can assign multiple classifications for each file of your dataset.

See the [quickstart](../quickstart/using-language-studio.md) article for details on creating a new project. 

## Tag your data

Before creating a custom text classification model, you need to have tagged data first. If your data is not tagged already, you can tag it in the language studio. Tagged data informs the model how to interpret text, and is used for training and evaluation.

See [How to tag data](../how-to/tag-data.md) for more information. 

## Train a model

Training is the process where the model learns from the data you have tagged. Training uses deep learning technology built on top of [Microsoft Turing](https://msturing.org/about). At the end of the training process, your model will be trained to perform custom text classification, and you can view an evaluation, and Improve your model.

The time to train a model varies on the dataset, and may take up to several hours. You can only train one model at a time, and you cannot create or train other models if one is already training in the same project.

Before starting the training process, files in your dataset are divided into three groups at random:

* The training set contains 80% of the files in your dataset. It is the main set that is used to train the model.

* The validation set contains 10% and is introduced to the model during training. Later you can view the incorrect predictions made by the model on this set so you examine your data and tags and make necessary adjustments.

* The Test set contains 10% of the files available in your dataset. This set is used to provide an unbiased evaluation of the model. This set is not introduced to the model during training. The details of correct and incorrect predictions for this set are not shown so that you don't readjust your training data and alter the results.

## View the model evaluation

After the model training is completed, you can view the model details and see how well does it perform against the test set. This gives you an idea of how the model will perform on new data. 

See [How to view the model evaluation](../how-to/view-model-evaluation.md) for information on viewing the evaluation, and the [evaluation metrics](evaluation.md) article to learn more about the metrics and scoring that is used. 

## Improve the model

After you've trained your model you reviewed its evaluation details, you can start to improve model performance. In this article, you will review inconsistencies between the predicted classes and classes tagged by the model, and examine data distribution.

See [How to improve a model](../how-to/improve-model.md) for more information. 

## Deploy the model

Deploying a model comes after your model has been trained successfully, you've finished making improvements, and are satisfied with the model's evaluation. Deploying the model makes it available for use for text classification.

> [!NOTE]
> * You can only have one deployed model per project so deploying another model will remove the one that was already deployed.
> * Deployment may take few minutes to complete.

## Send custom classification requests

After your model is deployed, you can start using it for text classification tasks.

See [How to run text classification jobs](../how-to/run-inference.md)