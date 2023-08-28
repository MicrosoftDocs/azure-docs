---
title: Build AI Apps with Azure Cosmos DB for MongoDB vCore Vector Search
titleSuffix: Build AI Apps with Azure Cosmos DB for MongoDB vCore Vector Search
description: Enhance AI-powered Applications with Retrieval Augmented Generation (RAG) using Azure Cosmos DB for MongoDB vCore Vector Search.
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: tutorial
author: sandnair
ms.author: sandnair
ms.reviewer: sandnair
ms.date: 08/22/2023
---

# AI Apps with Azure Cosmos DB for MongoDB vCore Vector Search

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

## Introduction

Large Language Models (LLMs) available in Azure OpenAI are potent tools that can elevate the capabilities of your AI-driven applications. To fully unleash the potential of LLMs, giving them access to timely and relevant data from your application's data store is crucial. This process, known as Retrieval Augmented Generation (RAG), can be seamlessly accomplished using Azure Cosmos DB. In this tutorial, we delve into the core concepts of RAG and provide links to tutorials and sample code that exemplify powerful RAG strategies using Azure Cosmos DB for MongoDB vCore vector search.

Retrieval Augmented Generation (RAG) elevates AI-powered applications by incorporating external knowledge and data into model inputs. With Azure Cosmos DB for MongoDB vCore's vector search, this process becomes seamless, ensuring that the most pertinent information is effortlessly integrated into your AI models. By applying the power of [embeddings](../../../ai-services/openai/tutorials/embeddings.md) and vector search, you can provide your AI applications with the context they need to excel. Through the provided tutorials and code samples, you can become proficient in harnessing RAG to create smarter and more context-aware AI solutions.

## Understanding Retrieval Augmented Generation (RAG)

Retrieval Augmented Generation harnesses external knowledge and models to efficiently manage custom data or domain-specific expertise. This involves extracting pertinent information from an external data source and seamlessly integrating it into the model's input through prompt engineering. A robust approach is essential to identify the most pertinent data from the external source within the [token limitations of a request](../../../ai-services/openai/quotas-limits.md). This limitation is elegantly addressed by using embeddings, which convert data into vectors, capturing the semantic essence of the text and enabling context comprehension beyond simple keywords.

## What is vector search?

[Vector search](./vector-search.md) is an approach that enables the discovery of analogous items based on shared data characteristics, deviating from the necessity for precise matches within a property field. This method proves invaluable in various applications like text similarity searches, image association, recommendation systems, and anomaly detection. Its functionality revolves around the utilization of vector representations (sequences of numerical values) generated from your data via machine learning models or embeddings APIs. Examples of such APIs encompass [Azure OpenAI Embeddings](/azure/ai-services/openai/how-to/embeddings) or [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure/). The technique gauges the disparity between your query vector and the data vectors. The data vectors that exhibit the closest proximity to your query vector are identified as semantically akin.


## Utilizing Vector Search with Azure Cosmos DB for MongoDB vCore

RAG's power is truly harnessed through the native vector search capability within Azure Cosmos DB for MongoDB vCore. This enables a seamless fusion of AI-focused applications with stored data in Azure Cosmos DB. Vector search optimally stores, indexes, and searches high-dimensional vector data directly within Azure Cosmos DB for MongoDB vCore alongside other application data. This eliminates the need to migrate data to costlier alternatives for vector search functionality.

## Code samples and tutorials

- [**.NET Retail Chatbot Demo**](https://github.com/AzureCosmosDB/VectorSearchAiAssistant/tree/mongovcorev2): Learn how to build a chatbot using .NET that demonstrates RAG's potential in a retail context.
- [**.NET Tutorial - Recipe Chatbot**](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore): Walk through creating a recipe chatbot using .NET, showcasing RAG's application in a culinary scenario.
- [**Python Notebook Tutorial**](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore) - Azure Product Chatbot: Explore a Python notebook tutorial that guides you through constructing an Azure product chatbot, highlighting RAG's benefits.


## Next steps

> [!div class="nextstepaction"]
> [Introduction to Azure Cosmos DB for MongoDB vCore](introduction.md)

