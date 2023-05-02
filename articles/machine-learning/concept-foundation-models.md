---
title: Foundation Models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about machine learning foundation models and how use them at scale in Azure.
services: machine-learning
ms.service: machine-learning
ms.topic: conceptual
ms.author: swatig007
author: swatig007
ms.reviewer: ssalgado
ms.date: 04/25/2023
#Customer intent: As a data scientist, I want to learn about machine learning foundation models and how to integrate popular models into azure machine learning.
---

# Foundation Models (preview) in Azure Machine Learning

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes Foundation Models and their benefits within Azure Machine Learning. You will learn how Foundation models are created and what they are used for. You will also learn the benefits of these models over currently used practices. 

## What is 'Foundation Models in AzureML' (preview)?

In recent years, advancements in AI have led to the rise of large foundation models that are trained on a vast quantity of data and that can be easily adapted to a wide variety of applications across various industries. This emerging trend gives rise to a unique opportunity for enterprises to build and use these foundation models in their deep learning workloads.

**Foundation Models in AzureML** provides AzureML native capabilities that enable customers to build and operationalize open-source foundation models at scale. foundation models are trained machine learning model that is designed to perform a specific task. Foundation models will accelerate the model building process by serving as a starting point for developing custom machine learning models. Azure Machine Learning provides the capability to easily integrate these pre-trained models into your applications. It includes the following capabilities:

* A comprehensive repository of top 30+ language models from Hugging Face, made available in the model catalog via AzureML built-in registry
* Ability to import additional open source models from Hugging Face.
* Support for base model inferencing using pretrained models
* Ability to finetune the models using your own training data. Finetuning is supported for the following language tasks - Text Classification, Token Classification, Question Answering, Summarization and Translation
* Ability to evaluate the models using your own test data
* Support for deploying and operating finetuned models at scale
* State of the art performance and throughput in Azure hardware

## Key user advantages

The image below displays a summary of key user benefits, as compared to what is available prior:

:::image type="content" source="media/concept-foundation-models/foundation_models_overview.png" alt-text="Screenshot showing benefits of using foundation models in Azure Machine Learning.":::

## Learn more

Learn [how to use foundation models in AzureML](./how-to-use-foundation-models.md) for finetuning, evaluation and deployment using AzureML Studio UI or code based methods.
