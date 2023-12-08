---
title: Foundation Models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about machine learning foundation models and how to use them at scale in Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.topic: conceptual
ms.author: swatig
author: swatig007
ms.reviewer: ssalgado
ms.date: 12/04/2023
#Customer intent: As a data scientist, I want to learn about machine learning foundation models and how to integrate popular models into azure machine learning.
---

# Foundation Models in Azure Machine Learning

This article describes Foundation Models and their benefits within Azure Machine Learning. You learn what Foundation Models are used for and how you can access and use then in Azure Machine Learning. 

## What is Foundation Models in Azure Machine Learning?

In recent years, advancements in AI have led to the rise of large Foundation Models that are pre-trained on a vast quantity of data. These Foundation Models serve as a starting point for developing specialized models and can be easily adapted to a wide variety of applications across various industries. This emerging trend gives rise to a unique opportunity for enterprises to build and use these Foundation Models in their deep learning workloads.

**Foundation Models in Azure Machine Learning** provides Azure Machine Learning native capabilities that enable customers to build and operationalize open-source Foundation Models at scale. Azure Machine Learning provides the capability to easily integrate these pretrained models into your applications. It includes the following capabilities:

* **Discover:** Explore the Foundation Models available for use via the 'Model catalog' in Azure Machine Learning studio. Review model descriptions, try sample inference and browse code samples to evaluate, finetune or deploy the model.
* **Evaluate:** Evaluate if the model is suited for your specific workload by providing your own test data. Evaluation metrics make it easy to visualize how well the selected model performed in your scenario.
* **Fine tune:** Customize these models using your own training data. Built-in optimizations that speed up finetuning and reduce the memory and compute needed for fine tuning. Apply the experimentation and tracking capabilities of Azure Machine Learning to organize your training jobs and find the model best suited for your needs.
* **Deploy:** Deploy pre-trained Foundation Models or fine-tuned models to online endpoints for real time inference or batch endpoints for processing large inference datasets in job mode. Apply industry-leading machine learning operationalization capabilities in Azure Machine Learning.
* **Import:** Open source models released frequently. You can always use the latest models in Azure Machine Learning by importing models similar to ones in the catalog. For example, you can import models for supported tasks that use the same libraries.


## Model Catalog and Collections

The Model Catalog is a hub for discovering Foundation Models in Azure Machine Learning. It is your starting point to explore collections of Foundation Models. You start by picking one of the model collections and explore models by searching for models you know about or filtering based on tasks that models are trained for. Model catalog currently has two model collections with more planned in future:

**Open source models curated by Azure Machine Learning**:
 The most popular open source third-party models curated by Azure Machine Learning. These models are packaged for out of the box usage and are optimized for use in Azure Machine Learning, offering state of the art performance and throughput on Azure hardware. They offer native support for distributed training and can be easily ported across Azure hardware. Currently, it includes the top open source language models, with support for other tasks coming soon. 

**Transformers models from the HuggingFace hub**: 

Thousands of models from HuggingFace hub for real time inference with online endpoints. 

> [!IMPORTANT]
> Models in model catalog are covered by third party licenses. Understand the license of the models you plan to use and verify that license allows your use case.
> Some models in the model catalog are currently in preview.
> For more information on preview, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Compare capabilities of models by collection

Feature|Open source models curated by Azure Machine Learning | Transformers models from the HuggingFace hub
--|--|--
Inference| Online and batch inference | Online inference
Evaluation and fine-tuning | Evaluate and fine tune with UI wizards, SDK or CLI | not available
Import models| Limited support for importing models using SDK or CLI | not available 

### Compare attributes of collections

Attribute|Open source models curated by Azure Machine Learning | Transformers models from the HuggingFace hub
--|--|--
Model format| Curated in MLFlow format for seamless interoperability with MLFlow clients and no-code deployment with online and batch endpoints| Transformers
Model hosting|Model weights hosted on Azure in `azureml` system registry|  Model weights are pulled on demand during deployment from HuggingFace hub.
Use in private workspace|Capability to allow outbound to `azureml` system registry coming soon|Allow outbound to HuggingFace hub
Support|Supported by Microsoft and covered by [Azure Machine Learning SLA](https://www.azure.cn/en-us/support/sla/machine-learning/)|Hugging face creates and maintains models listed in `HuggingFace` community registry. Use [HuggingFace forum](https://discuss.huggingface.co/) or [HuggingFace support](https://huggingface.co/support) for help.

## Learn more

Learn [how to use Foundation Models in Azure Machine Learning](./how-to-use-foundation-models.md) for fine-tuning, evaluation and deployment using Azure Machine Learning studio UI or code based methods.
* Explore the [model catalog in Azure Machine Learning studio](https://ml.azure.com/model/catalog). You need an [Azure Machine Learning workspace](./quickstart-create-resources.md) to explore the catalog.
* [Evaluate, fine-tune and deploy models](./how-to-use-foundation-models.md) curated by Azure Machine Learning.

