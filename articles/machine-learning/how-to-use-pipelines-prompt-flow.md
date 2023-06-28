---
title:  Use Azure ML pipelines with no code to construct RAG pipelines (preview)
titleSuffix: Azure Machine Learning
description: Set up Azure machine Learning pipelines to run Prompt Flow models (preview)
services: machine-learning
ms.author: balapv
author: balapv
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 06/30/2023
ms.topic: how-to
ms.custom: prompt
---


# Use Azure ML pipelines with no code to construct RAG pipelines (preview)

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

This tutorial walks you through how to create an RAG pipeline. For advanced scenarios, you can build your own custom AzureML pipelines from code (typically notebooks) that allows you granular control of the RAG workflow. AzureML provides several in-built pipeline components for data chunking, embeddings generation, test data creation, automatic prompt generation, prompt evaluation. These components can be used as per your needs using notebooks. You can even use the Vector Index created in AzureML in LangChain.  


## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

* Access to Azure Open AI. [Follow this link to register](https://learn.microsoft.com/legal/cognitive-services/openai/limited-access#registration-process)

* Enable prompt flow in your Azure Machine Learning workspace

In your Azure Machine Learning workspace, you can enable prompt flow by turn-on **Build AI solutions with Prompt flow** in the **Manage preview features** panel.

![preview feature](./media/how-to-train-promptflow/preview-panel.png) 

* Complete the tutorial [Train and Deploy Large Language Models (LLMs) with Azure Machine Learning prompt flow (preview)](how-to-train-promptflow.md)

## pipelines


## Next steps

[How to create vector index in Azure Machine Learning prompt flow (preview)](how-to-create-vector-index.md)
