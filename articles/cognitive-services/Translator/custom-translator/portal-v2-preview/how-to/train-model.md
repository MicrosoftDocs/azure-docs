---
title: How to train model - Custom Translator
titleSuffix: Azure Cognitive Services
description: This article explains how to create and manage a project in the Azure Cognitive Services Custom Translator.  
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 08/17/2020
ms.author: lajanuar
ms.topic: conceptual
#Customer intent: As a Custom Translator user, I want to understand how to create project, so that I can build and manage a project.
---
# What is a model?

A model is the system, which provides translation for a specific language pair. The outcome of a successful training is a model. When training a model, three mutually exclusive document types are required: training, tuning, and testing. If only training data is provided when queuing a training, Custom Translator will automatically assemble tuning and testing data. It will use a random subset of sentences from your training documents, and exclude these sentences from the training data itself. A 10,000 parallel sentences is the minimum requirement to train a model.

## Create model

1.  Click **Train model** blade
2.  Type **Model name**, e.g., "en-de with sample data"
3.  Keep the default **Full training** selected or select **Dictionary-only training**

>[!Note]
>Full training displays all uploaded document types. Dictionary-only displays dictionary documents only.

4.  Under **Select documents**, select the documents you want to use to train the model, e.g., `sample-English-German` and review the training cost associated with the selected number of sentences.
5.  Click **Train now**
6.  Click **Train** to confirm

>[!Note]
>**Notifications** displays model training in progress, e.g., **Submitting data** state. Training model takes few hours, subject to the number of selected sentences.

![Create a model](media/quickstart/how-to-train.png)

## Model details

1.  After successful model training, click **Model details** blade
2.  Click the model name "en-de with sample data" to review training date/time, total training time, number of sentences used for training, tuning, testing, dictionary, and whether the system generated the test and tuning sets. You will use the "Category ID" to make translation requests.
3.  Evaluate the model BLEU score. Using the test set, **BLEU score** is the custom model score and **Baseline BLEU** is the pre-trained baseline model used for customization. Higher **BLEU score** means higher translation quality using the custom model.

![Model details](media/quickstart/model-details.png)

## Next steps

- Learn [how to test and evaluate model quality](how-to-test-model-details.md).
- Learn [how to publish model](how-to-publish-model.md).
- Learn [how to translate with custom models](how-to-translate.md).
