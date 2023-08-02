---
title:  Use Azure Machine Learning pipelines with no code to construct RAG pipelines (preview)
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning pipelines to run Prompt Flow models (preview)
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


# Use Azure Machine Learning pipelines to construct RAG pipelines (preview)

This tutorial walks you through how to create an RAG pipeline. The pipeline pulls a Git Repo, creates a Vector Index, automatically generates a test dataset, finds the best prompt for dataset, generates a Prompt flow and uses the test dataset to perform bulk evaluation. For advanced scenarios, you can build your own custom Azure Machine Learning pipelines from code (typically notebooks) that allows you granular control of the RAG workflow. Azure Machine Learning provides several in-built pipeline components for data chunking, embeddings generation, test data creation, automatic prompt generation, prompt evaluation. These components can be used as per your needs using notebooks. You can even use the Vector Index created in Azure Machine Learning in LangChain. 

The next step is to use a Vector Index with a Large Language Model, retrieving relevant documents to augment what the model generates, while also testing multiple prompts to find the best and evaluating the performance using Prompt flow and a generated test dataset.


[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]


## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).

* Access to Azure Open AI. 

* Enable prompt flow in your Azure Machine Learning workspace

In your Azure Machine Learning workspace, you can enable prompt flow by turn-on **Build AI solutions with Prompt flow** in the **Manage preview features** panel.

## Productionize Vector Index with Test Data Generation, Auto Prompt, Evaluations and Prompt Flow

1. install dependencies.

   ```python
   %pip install azure-ai-ml
   %pip install -U 'azureml-rag[faiss]>=0.1.14'
   ```

## Prompt Flow pipeline notebook sample repository

Azure Machine Learning offers notebook tutorials for several use cases with prompt flow pipelines. 

**QA Data Generation** 

[QA Data Generation](https://github.com/Azure/azureml-insiders/blob/main/previews/retrieval-augmented-generation/examples/notebooks/qa_data_generation.ipynb) can be used to get the best prompt for RAG and to evaluation metrics for RAG. This notebook shows you how to create a QA dataset from your data (Git repo). 


**Test Data Generation and Auto Prompt**
 
[Use vector indexes to build a retrieval augmented generation model](https://github.com/Azure/azureml-insiders/blob/main/previews/retrieval-augmented-generation/examples/notebooks/mlindex_with_testgen_autoprompt.ipynb) and to evaluate prompt flow on a test dataset.

**Create a FAISS based Vector Index**

[Set up an Azure Machine Learning Pipeline](https://github.com/Azure/azureml-insiders/blob/main/previews/retrieval-augmented-generation/examples/notebooks/faiss/faiss_mlindex_with_langchain.ipynb) to pull a Git Repo, process the data into chunks, embed the chunks and create a langchain compatible FAISS Vector Index. 

## Next steps

[How to create vector index in Azure Machine Learning prompt flow (preview)](how-to-create-vector-index.md)

[Use Vector Stores](concept-vector-stores.md) with Azure Machine Learning (preview)
