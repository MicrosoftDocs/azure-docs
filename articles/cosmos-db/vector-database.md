---
title: Vector database
titleSuffix: Azure Cosmos DB
description: Vector database functionalities in Azure Cosmos DB for retrieval augmented generation (RAG) and vector search.
author: jacodel
ms.author: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/02/2023
---

# Vector database functionality implementation using Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB vCore, PostgreSQL](includes/appliesto-nosql-mongodbvcore-postgresql.md)]

You likely considered augmenting your applications with Large Language Models (LLMs) that can access your own data store through Retrieval Augmented Generation (RAG). This approach allows you to

- Generate contextually relevant and accurate responses to user prompts from AI models
- Overcome ChatGPT, GPT-3.5, or GPT-4’s token limits
- Reduce the costs from frequent fine-tuning on updated data

Some RAG implementation tutorials demonstrate integrating vector databases. Instead of adding a separate vector database to your existing tech stack, you can achieve the same outcome using Azure Cosmos DB with Azure OpenAI Service and optionally Azure Cognitive Search when working with multi-modal data.

Here are some solutions:

| | Description |
| --- | --- |
| **[Azure Cosmos DB for NoSQL with Azure Cognitive Search](#implement-vector-database-functionalities-using-azure-cosmos-db-for-nosql-and-azure-cognitive-search)**. | Augment your Azure Cosmos DB data with semantic and vector search capabilities of Azure Cognitive Search. |
| **[Azure Cosmos DB for Mongo DB vCore](#implement-vector-database-functionalities-using-azure-cosmos-db-for-mongodb-vcore)**. | Featuring native support for vector search, store your application data and vector embeddings together in a single MongoDB-compatible service. |
| **[Azure Cosmos DB for PostgreSQL](#implement-vector-database-functionalities-using-azure-cosmos-db-for-postgresql)**. | Offering native support vector search, you can store your data and vectors together in a scalable PostgreSQL offering. |

## Vector database related concepts

You might first want to ensure that you understand the following concepts:

- Grounding LLMs
- Retrieval Augmented Generation (RAG)
- Embeddings
- Vector search
- Prompt engineering

RAG harnesses LLMs and external knowledge to effectively handle custom data or domain-specific knowledge. It involves extracting pertinent information from a custom data source and integrating it into the model request through prompt engineering.

A robust mechanism is necessary to identify the most relevant data from the custom source that can be passed to the LLM. This mechanism allows you to optimize for the LLM’s limit on the number of tokens per request. This limitation is where embeddings play a crucial role. By converting the data in your database into embeddings and storing them as vectors for future use, we apply the advantage of capturing the semantic meaning of the text, going beyond mere keywords to comprehend the context.

Prior to sending a request to the LLM, the user input/query/request is also transformed into an embedding, and vector search techniques are employed to locate the most similar embeddings within the database. This technique enables the identification of the most relevant data records in the database. These retrieved records are then supplied as input to the LLM request using prompt engineering.

Here are multiple ways to implement RAG on your data stored in Azure Cosmos DB, thus achieving the same outcome as using a vector database.

## Implement vector database functionalities using Azure Cosmos DB for NoSQL and Azure Cognitive Search

Implement RAG patterns with Azure Cosmos DB for NoSQL and Azure Cognitive Search. This approach enables powerful integration of your data residing in Azure Cosmos DB for NoSQL into your AI-oriented applications. Azure Cognitive Search empowers you to efficiently index, and query high-dimensional vector data, allowing you to use Azure Cosmos DB for NoSQL for the same purpose as a vector database.

### Azure Cosmos DB-based vector database functionality code samples

- [.NET RAG Pattern retail reference solution for NoSQL](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-NoSQL_CognitiveSearch)
- [.NET tutorial - recipe chatbot w/ Semantic Kernel](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-NoSQL_CognitiveSearch_SemanticKernel)
- [Python notebook tutorial - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-NoSQL_CognitiveSearch)

## Implement vector database functionalities using Azure Cosmos DB for MongoDB vCore

Use the native vector search feature in Azure Cosmos DB for MongoDB vCore, which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

### Azure Cosmos DB-based vector database functionality code samples

- [.NET RAG Pattern retail reference solution](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore)
- [Python notebook tutorial - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore)

## Implement vector database functionalities using Azure Cosmos DB for PostgreSQL

Use the native vector search feature in Azure Cosmos DB for PostgreSQL, offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

### Azure Cosmos DB-based vector database functionality code samples

- Python: [Python notebook tutorial - food review chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-PostgreSQL_CognitiveSearch)

## Related content

- [Vector search with Azure Cognitive Search](../search/vector-search-overview.md)
- [Vector search with Azure Cosmos DB for MongoDB vCore](mongodb/vcore/vector-search.md)
- [Vector search with Azure Cosmos DB PostgreSQL](postgresql/howto-use-pgvector.md)
- Learn more about [Azure OpenAI embeddings](../ai-services/openai/concepts/understand-embeddings.md)
- Learn how to [generate embeddings using Azure OpenAI](../ai-services/openai/tutorials/embeddings.md)
