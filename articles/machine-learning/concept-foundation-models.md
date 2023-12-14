---
title: Model Catalog and Collections
titleSuffix: Azure Machine Learning
description: Learn about machine learning foundation models in model catalog and how to use them at scale in Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.topic: conceptual
ms.author: swatig
author: swatig007
ms.reviewer: ssalgado
ms.date: 12/12/2023
#Customer intent: As a data scientist, I want to learn about machine learning foundation models and how to integrate popular models into azure machine learning.
---

# Model Catalog 

The Model Catalog is the hub for a wide-variety of third-party open source as well as Microsoft developed foundation models pre-trained for various language, speech and vision use-cases. You can evaluate, customize and deploy these models with the native capabilities to build and operationalize open-source foundation Models at scale to easily integrate these pretrained models into your applications with enterprise-grade security and data governance.  

* **Discover:** Review model descriptions, try sample inference and browse code samples to evaluate, finetune or deploy the model.
* **Evaluate:** Evaluate if the model is suited for your specific workload by providing your own test data. Evaluation metrics make it easy to visualize how well the selected model performed in your scenario.
* **Fine tune:** Customize these models using your own training data. Built-in optimizations that speed up finetuning and reduce the memory and compute needed for fine tuning. Apply the experimentation and tracking capabilities of Azure Machine Learning to organize your training jobs and find the model best suited for your needs.
* **Deploy:** Deploy pre-trained Foundation Models or fine-tuned models seamlessly to online endpoints for real time inference or batch endpoints for processing large inference datasets in job mode. Apply industry-leading machine learning operationalization capabilities in Azure Machine Learning.
* **Import:** Open source models are released frequently. You can always use the latest models in Azure Machine Learning by importing models similar to ones in the catalog. For example, you can import models for supported tasks that use the same libraries.

You start by exploring the model collections or by filtering based on tasks and license, to find the model for your use-case. `Task` calls out the inferencing task that the foundation model can be used for. `Finetuning-tasks` list the tasks that this model can be fine tuned for. `License` calls out the licensing info.

## Collections

There are three types of collections in the Model Catalog:

**Open source models curated by Azure AI**:
The most popular open source third-party models curated by Azure Machine Learning. These models are packaged for out-of-the-box usage and are optimized for use in Azure Machine Learning, offering state of the art performance and throughput on Azure hardware. They offer native support for distributed training and can be easily ported across Azure hardware. 

'Curated by Azure AI' and collections from partners such as Meta, NVIDIA, Mistral AI are all curated collections on the Catalog. 

**Azure OpenAI models, exclusively available on Azure**:
Fine-tune and deploy Azure OpenAI models via the 'Azure Open AI' collection in the Model Catalog.

**Transformers models from the HuggingFace hub**: 
Thousands of models from the HuggingFace hub are accessible via the 'Hugging Face' collection for real time inference with online endpoints. 

> [!IMPORTANT]
> Models in model catalog are covered by third party licenses. Understand the license of the models you plan to use and verify that license allows your use case.
> Some models in the model catalog are currently in preview. 
  > Models are in preview if one or more of the following statements apply to them:  
    > The model is not usable (can be deployed, fine-tuned, and evaluated) within a isolated network.   
    > Model packaging and inference schema is subject to change for newer versions of the model. 
> For more information on preview, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Compare capabilities of models by collection

Feature | Open source models curated by Azure Machine Learning | Transformers models from the HuggingFace hub
--|--|--
Inference | Online and batch inference | Online inference
Evaluation and fine-tuning | Evaluate and fine tune with UI wizards, SDK or CLI | not available
Import models | Limited support for importing models using SDK or CLI | not available 

## Compare attributes of collections

Attribute | Open source models curated by Azure Machine Learning | Transformers models from the HuggingFace hub
--|--|--
Model format | Curated in MLFlow or Triton model format for seamless no-code deployment with online and batch endpoints | Transformers
Model hosting | Model weights hosted on Azure |  Model weights are pulled on demand during deployment from HuggingFace hub.
Use in network isolated workspace | Out-of-the-box outbound capability to use models. Some models will require outbound to public domains for installing packages at runtime. | Allow outbound to HuggingFace hub, Docker hub and their CDNs 
Support | Supported by Microsoft and covered by [Azure Machine Learning SLA](https://www.azure.cn/en-us/support/sla/machine-learning/) | Hugging face creates and maintains models listed in `HuggingFace` community registry. Use [HuggingFace forum](https://discuss.huggingface.co/) or [HuggingFace support](https://huggingface.co/support) for help.

## Learn more

* Learn [how to use foundation Models in Azure Machine Learning](./how-to-use-foundation-models.md) for fine-tuning, evaluation and deployment using Azure Machine Learning studio UI or code based methods.
* Explore the [Model Catalog in Azure Machine Learning studio](https://ml.azure.com/model/catalog). You need an [Azure Machine Learning workspace](./quickstart-create-resources.md) to explore the catalog.
* [Evaluate, fine-tune and deploy models](./how-to-use-foundation-models.md) curated by Azure Machine Learning.

