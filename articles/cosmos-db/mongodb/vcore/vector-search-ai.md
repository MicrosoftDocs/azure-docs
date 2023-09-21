---
title: Build AI apps with vector search
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Enhance AI-powered applications with Retrieval Augmented Generation (RAG) by using Azure Cosmos DB for MongoDB vCore vector search.
author: gahl-levy
ms.author: gahllevy
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 08/28/2023
---

# Build AI apps with Azure Cosmos DB for MongoDB vCore vector search

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Language models available in Azure OpenAI Service can elevate the capabilities of your AI-driven applications. To fully unleash the potential of language models, you must give them access to timely and relevant data from your application's data store. You can accomplish this process, known as Retrieval Augmented Generation (RAG), by using Azure Cosmos DB.

This article delves into the core concepts of RAG. It provides links to tutorials and sample code that exemplify RAG strategies by using vector search in Azure Cosmos DB for MongoDB vCore.

RAG elevates AI-powered applications by incorporating external knowledge and data into model inputs. With vector search in Azure Cosmos DB for MongoDB vCore, this process becomes seamless. You can use it to integrate the most pertinent information into your AI models with minimal effort.

By using [embeddings](../../../ai-services/openai/tutorials/embeddings.md) and vector search, you can provide your AI applications with the context that they need to excel. Through the provided tutorials and code samples, you can become proficient in using RAG to create smarter and more context-aware AI solutions.

## What is Retrieval Augmented Generation?

RAG uses external knowledge and models to efficiently manage custom data or domain-specific expertise. This process involves extracting information from an external data source and integrating it into the model's input through prompt engineering. A robust approach is essential to identify the most pertinent data from the external source within the [token limitations of a request](../../../ai-services/openai/quotas-limits.md).

RAG addresses these limitations by using embeddings, which convert data into vectors. Embeddings capture the semantic essence of the text and enable context comprehension beyond simple keywords.

## What is vector search?

[Vector search](./vector-search.md) is an approach that enables the discovery of analogous items based on shared data characteristics. It deviates from the necessity for precise matches within a property field.

This method is invaluable in applications like text similarity searches, image association, recommendation systems, and anomaly detection. Its functionality revolves around the use of vector representations (sequences of numerical values) that are generated from your data via machine learning models or embeddings APIs. Examples of such APIs encompass [Azure OpenAI embeddings](/azure/ai-services/openai/how-to/embeddings) or [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure/).

The technique gauges the disparity between your query vector and the data vectors. The data vectors that show the closest proximity to your query vector are identified as semantically akin.

## How does vector search work in Azure Cosmos DB for MongoDB vCore?

You can truly harness the power of RAG through the native vector search capability in Azure Cosmos DB for MongoDB vCore. This feature combines AI-focused applications with stored data in Azure Cosmos DB.

Vector search optimally stores, indexes, and searches high-dimensional vector data directly within Azure Cosmos DB for MongoDB vCore, alongside other application data. This capability eliminates the need to migrate data to costlier alternatives for vector search functionality.

## Code samples and tutorials

- [.NET retail chatbot demo](https://github.com/AzureCosmosDB/VectorSearchAiAssistant/tree/mongovcorev2): Learn how to use .NET to build a chatbot that demonstrates the potential of RAG in a retail context.
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore): Walk through creating a recipe chatbot by using .NET, to showcase the application of RAG in a culinary scenario.
- [Python notebook tutorial - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore): Learn how to construct an Azure product chatbot that highlights the benefits of RAG.

## Next steps

- Learn more about [Azure OpenAI embeddings](../../../ai-services/openai/concepts/understand-embeddings.md)
- Learn how to [generate embeddings using Azure OpenAI](../../../ai-services/openai/tutorials/embeddings.md)
