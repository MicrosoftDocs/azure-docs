---
title: Retrieval Augmented Generation using Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Explaining retrieval augmented generation and using Prompt Flow models for business use cases
services: machine-learning
ms.author: balapv
author: balapv
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 06/30/2023
ms.topic: conceptual
ms.custom: prompt-flow
---

# Retrieval Augmented Generation using Azure Machine Learning prompt flow

Retrieval Augmented Generation (RAG) is a feature that enables an LLM to utilize your own data for generating responses.  

Traditionally, a base model is trained with point-in-time data to ensure its effectiveness in performing specific tasks and adapting to the desired domain. However, when dealing with newer or more current data, two approaches can supplement the base model: fine-tuning or RAG. Fine-tuning is suitable for continuous domain adaptation, enabling significant improvements in model quality but often incurring higher costs. Conversely, RAG offers an alternative approach, allowing the use of the same model as a reasoning engine over new data. This technique enables in-context learning without the need for expensive fine-tuning, empowering businesses to use LLMs more efficiently. 

RAG allows businesses to achieve customized solutions while maintaining data relevance and optimizing costs. By adopting RAG, companies can use the reasoning capabilities of LLMs, utilizing their existing models to process and generate responses based on new data. RAG facilitates periodic data updates without the need for fine-tuning, thereby streamlining the integration of LLMs into businesses. 

Benefits of adopting RAG in your LLMs:
Adds a fact checking component on your existing models
Train your model on up to date data without needed fine-tuning
Train on your business specific data

Drawbacks without RAG:
Models may return more incorrect knowledge
Data is trained on a broader range of data. More intensive training resources are required to fine-tune your model 

## Technical overview of using RAG on Large Language Models (LLMs)

RAG is a feature that enables you to harness the power of LLMs with your own data. Enabling an LLM to access custom data involves the following steps. Firstly, the large data should be chunked into manageable pieces. Secondly, the chunks need to be converted into a searchable format. Thirdly, the converted data should be stored in a location that allows efficient access. Additionally, it's important to store relevant metadata for citations or references when the LLM provides responses. 

:::image type="content" source="./media/concept-retrieval-augmented-generation-promptflow/retrieval-augmented-generation-walkthrough.png" alt-text="Screenshot of a diagram of the technical overview of an LLM walking through rag steps." lightbox="./media/concept-retrieval-augmented-generation-promptflow/retrieval-augmented-generation-walkthrough.png":::

Let us look at the diagram in more detail. 

* Source data: this is where your data exists. It could be a file/folder on your machine, a file in cloud storage, an Azure Machine Learning data asset, a Git repository, or an SQL database. 

* Data chunking: The data in your source needs to be converted to plain text. For example, word documents or PDFs need to be cracked open and converted to text. The text is then chunked into smaller pieces. 

* Converting the text to vectors: called embeddings2. Vectors are numerical representations of concepts converted to number sequences, which make it easy for computers to understand the relationships between those concepts. 

* Links between source data and embeddings: this information is stored as metadata on the chunks created which are then used to assist the LLMs to generate citations while generating responses. 

## RAG with Azure Machine Learning 

RAG in Azure Machine Learning is enabled by integration with Azure OpenAI Service, with support for Azure Cognitive Search, and OSS offerings tools and frameworks such as LangChain. 

To implement RAG, a few key requirements must be met. Firstly, data should be formatted in a manner that allows efficient searchability before sending it to the LLM, which ultimately reduces token consumption. To ensure the effectiveness of RAG, it's also important to regularly update your data on a periodic basis. Furthermore, having the capability to evaluate the output from the LLM using your data enables you to measure the efficacy of your techniques. Azure Machine Learning not only allows you to get started easily on these aspects, but also enables you to improve and productionize RAG. Azure Machine Learning offers: 

* Samples for starting RAG-based Q&A scenarios. 
* Wizard-based UI experience to create and manage data and incorporate it into prompt flows. 
* Ability to measure and enhance RAG workflows, including test data generation, automatic prompt creation, and visualized prompt evaluation metrics. 
* Advanced scenarios with more control using the new built-in RAG components for creating custom pipelines in notebooks. 
* Code experience, which allows utilization of data created with OSS offerings like LangChain. 
* Seamless integration of RAG workflows into MLOps workflows using pipelines and jobs. 


## Conclusion

Azure Machine Learning allows you to incorporate RAG in your AI using the Azure studio or using code with Azure Machine Learning pipelines. It offers several value additions like the ability to measure and enhance RAG workflows, test data generation, automatic prompt creation, and visualize prompt evaluation metrics. It enables the integration of RAG workflows into MLOps workflows using pipelines. You can also use your data with OSS offerings like LangChain. 

## Next steps

[Use Vector Stores](concept-vector-stores.md) with Azure Machine Learning (preview)

[How to create vector index](how-to-create-vector-index.md) in Azure Machine Learning prompt flow (preview)
