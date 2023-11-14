---
title:  "AutoML Text Multi-label Classification"
titleSuffix: Azure Machine Learning
description: Learn how to use the AutoML Text Multi-label Classification component in Azure Machine Learning to create a classifier using ML Table data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: rasavage
author: rsavage2
ms.reviewer: ssalgadodev
ms.date: 12/1/2022
---

# AutoML Text Multi-label Classification

This article describes a component in Azure Machine Learning designer.

Use this component to create a machine learning model that is based on the AutoML Text Multi-label Classification.

Multi-label text classification is for use cases where each example may be assigned more than one label, as opposed to single-label multiclass text classification where every example is labeled with the single most probable class.

## How to configure 

This component trains an NLP classification model on text data. Text classification is a supervised learning task and requires a *labeled dataset* that includes a label column with a value for all rows.

This model requires a training and a validation dataset. The datasets must be in ML Table format.


1.  Add the **AutoML Text Multi-label Classification** component to your pipeline.

1.  Specify the **Target Column** you want the model to output 

1.  Specify the **Primary Metric** you want AutoML to use to measure your model's success.

1. (Optional) Select the language your dataset consists of. Visit this link for a [full list of supported languages.](../how-to-auto-train-nlp-models.md#language-settings)

1. (Optional) You are able to configure Hyperparameters. Visit this link for a [full list of configurable Hyperparameters](../how-to-auto-train-nlp-models.md#supported-hyperparameters)

1. (Optional) Job Sweep settings are configurable. Visit this link to learn more about [each configurable parameter.](../how-to-auto-train-nlp-models.md#sampling-methods-for-the-sweep)

1. (Optional) Job Limit settings are configurable. Visit this link to learn more about [these settings.](../how-to-auto-train-nlp-models.md#resources-for-the-sweep)




## Next steps

See the [set of components available](../component-reference/component-reference.md) to Azure Machine Learning. 
