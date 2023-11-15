---
title: Vector database
titleSuffix: Azure Cosmos DB
description: Vector database functionalities and retrieval augmented generation (RAG) implementation.
author: jacodel
ms.author: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/02/2023
---

# Vector database

[!INCLUDE[NoSQL, MongoDB vCore, PostgreSQL](includes/appliesto-nosql-mongodbvcore-postgresql.md)]

You likely considered augmenting your applications with Large Language Models (LLMs) that can access your own data store through Retrieval Augmented Generation (RAG). This approach allows you to

- Generate contextually relevant and accurate responses to user prompts from AI models
- Overcome ChatGPT, GPT-3.5, or GPT-4’s token limits
- Reduce the costs from frequent fine-tuning on updated data

Some RAG implementation tutorials demonstrate integrating vector databases. Instead of adding a separate vector database to your existing tech stack, you can achieve the same outcome using Azure Cosmos DB with Azure OpenAI Service and optionally Azure Cognitive Search when working with multi-modal data.

Here are some solutions:

| | Description |
| --- | --- |
| **[Azure Cosmos DB for Mongo DB vCore](#implement-vector-database-functionalities-using-our-api-for-mongodb-vcore)** | Store your application data and vector embeddings together in a single MongoDB-compatible service featuring native support for vector search. |
| **[Azure Cosmos DB for PostgreSQL](#implement-vector-database-functionalities-using-our-api-for-postgresql)** | Store your data and vectors together in a scalable PostgreSQL offering with native support for vector search. |
| **[Azure Cosmos DB for NoSQL with Azure Cognitive Search](#implement-vector-database-functionalities-using-our-nosql-api-and-cognitive-search)** | Augment your Azure Cosmos DB data with semantic and vector search capabilities of Azure Cognitive Search. |

## What does a vector database do?

The vector search feature in a vector database enables retrieval augmented generation to harness LLMs and custom data or domain-specific information. This process involves extracting pertinent information from a custom data source and integrating it into the model request through prompt engineering.

A robust mechanism is necessary to identify the most relevant data from the custom source that can be passed to the LLM. Our vector search features convert the data in your database into embeddings and store them as vectors for future use, thus capturing the semantic meaning of the text and going beyond mere keywords to comprehend the context. Moreover, this mechanism allows you to optimize for the LLM’s limit on the number of tokens per request.

Prior to sending a request to the LLM, the user input/query/request is also transformed into an embedding, and vector search techniques are employed to locate the most similar embeddings within the database. This technique enables the identification of the most relevant data records in the database. These retrieved records are then supplied as input to the LLM request using prompt engineering.

Here are multiple ways to implement RAG on your data by using your the vector database functionalities in Azure Cosmos DB.

## Implement vector database functionalities using our API for MongoDB vCore

Use the native vector search feature in Azure Cosmos DB for MongoDB vCore, which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

### Vector database implementation code samples

- [.NET RAG Pattern retail reference solution](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore)
- [Python notebook tutorial - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore)

## Implement vector database functionalities using our API for PostgreSQL

Use the native vector search feature in Azure Cosmos DB for PostgreSQL, offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

### Vector database implementation code samples

- Python: [Python notebook tutorial - food review chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-PostgreSQL_CognitiveSearch)

## Implement vector database functionalities using our NoSQL API and Cognitive Search

Implement RAG patterns with Azure Cosmos DB for NoSQL and Azure Cognitive Search. This approach enables powerful integration of your data residing in the NoSQL API into your AI-oriented applications. Azure Cognitive Search empowers you to efficiently index and query high-dimensional vector data, thereby meeting your vector database needs for your data in Cosmos DB for NoSQL.

### Vector database implementation code samples

- [.NET RAG Pattern retail reference solution for NoSQL](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-NoSQL_CognitiveSearch)
- [.NET tutorial - recipe chatbot w/ Semantic Kernel](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-NoSQL_CognitiveSearch_SemanticKernel)
- [Python notebook tutorial - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-NoSQL_CognitiveSearch)

## Related content

- [Vector search with Azure Cognitive Search](../search/vector-search-overview.md)
- [Vector search with Azure Cosmos DB for MongoDB vCore](mongodb/vcore/vector-search.md)
- [Vector search with Azure Cosmos DB PostgreSQL](postgresql/howto-use-pgvector.md)
- Learn more about [Azure OpenAI embeddings](../ai-services/openai/concepts/understand-embeddings.md)
- Learn how to [generate embeddings using Azure OpenAI](../ai-services/openai/tutorials/embeddings.md)
