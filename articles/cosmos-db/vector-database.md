---
title: Vector database
titleSuffix: Azure Cosmos DB
description: Vector database extension and retrieval augmented generation (RAG) implementation.
author: wmwxwa
ms.author: wangwilliam
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/11/2023
---

# Vector database

[!INCLUDE[NoSQL, MongoDB vCore, PostgreSQL](includes/appliesto-nosql-mongodbvcore-postgresql.md)]

Vector databases are used in numerous domains and situations across analytical and generative AI, including natural language processing, video and image recognition, recommendation system, search, etc.

An increasingly popular use case is augmenting your applications with large language models (LLMs) and vector databases that can access your own data through retrieval-augmented generation (RAG). This approach allows you to:

- Generate contextually relevant and accurate responses to user prompts from AI models
- Overcome ChatGPT, GPT-3.5, or GPT-4’s token limits
- Reduce the costs from frequent fine-tuning on updated data

Some RAG implementation tutorials demonstrate integrating vector databases that are distinct from traditional databases. Instead of adding a separate vector database, you can use our vector database extensions when working with multi-modal data. By doing so, you avoid the extra cost of moving data to a separate database. Moreover, this keeps your vector embeddings and original data together, and you can better achieve data consistency, scale, and performance. The latter reason is why OpenAI built its ChatGPT service on top of Azure Cosmos DB.

Here's how to implement our vector database extensions:

| | Description |
| --- | --- |
| **[Azure Cosmos DB for Mongo DB vCore](#implement-vector-database-functionalities-using-our-api-for-mongodb-vcore)** | Store your application data and vector embeddings together in a single MongoDB-compatible service featuring native support for vector search. |
| **[Azure Cosmos DB for PostgreSQL](#implement-vector-database-functionalities-using-our-api-for-postgresql)** | Store your data and vectors together in a scalable PostgreSQL offering with native support for vector search. |
| **[Azure Cosmos DB for NoSQL with Azure AI Search](#implement-vector-database-functionalities-using-our-nosql-api-and-ai-search)** | Augment your Azure Cosmos DB data with semantic and vector search capabilities of Azure AI Search. |

## What is a vector database?

A vector database is a database designed to store and manage vector embeddings, which are mathematical representations of data in a high-dimensional space. In this space, each dimension corresponds to a feature of the data, and tens of thousands of dimensions might be used to represent sophisticated data. A vector's position in this space represents its characteristics. Words, phrases, or entire documents, and images, audio, and other types of data can all be vectorized. These vector embeddings are used in similarity search, multi-modal search, recommendations engines, large languages models (LLMs), etc.

It's increasingly popular to use the vector search feature in a vector database to enable retrieval-augmented generation that harnesses LLMs and custom data or domain-specific information. This process involves extracting pertinent information from a custom data source and integrating it into the model request through prompt engineering.

A robust mechanism is necessary to identify the most relevant data from the custom source that can be passed to the LLM. Our vector search features convert the data in your database into embeddings and store them as vectors for future use. The vector search feature captures the semantic meaning of the text and going beyond mere keywords to comprehend the context. Moreover, this mechanism allows you to optimize for the LLM’s limit on the number of tokens per request.

Prior to sending a request to the LLM, the user input/query/request is also transformed into an embedding, and vector search techniques are employed to locate the most similar embeddings within the database. This technique enables the identification of the most relevant data records in the database. These retrieved records are then supplied as input to the LLM request using prompt engineering.

Here are multiple ways to implement RAG on your data by using our vector database functionalities.

## Implement vector database functionalities using our API for MongoDB vCore

Use the native vector search feature in [Azure Cosmos DB for MongoDB vCore](mongodb/vcore/vector-search.md), which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

### Vector database implementation code samples

- [.NET RAG Pattern retail reference solution](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore)
- [Python notebook tutorial - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore)

## Implement vector database functionalities using our API for PostgreSQL

Use the native vector search feature in [Azure Cosmos DB for PostgreSQL](postgresql/howto-use-pgvector.md), which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

### Vector database implementation code samples

- Python: [Python notebook tutorial - food review chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-PostgreSQL_CognitiveSearch)

## Implement vector database functionalities using our NoSQL API and AI Search

The native vector search feature in our NoSQL API is under development. In the meantime, you may implement RAG patterns with Azure Cosmos DB for NoSQL and [Azure AI Search](../search/vector-search-overview.md). This approach enables powerful integration of your data residing in the NoSQL API into your AI-oriented applications.

### Vector database implementation code samples

- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-NoSQL_CognitiveSearch)
- [.NET tutorial - recipe chatbot w/ Semantic Kernel](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-NoSQL_CognitiveSearch_SemanticKernel)
- [Python notebook tutorial - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-NoSQL_CognitiveSearch)
  
## Next step

[30-day Free Trial without Azure subscription](https://azure.microsoft.com/try/cosmosdb/)

[90-day Free Trial with Azure AI Advantage](ai-advantage.md)

> [!div class="nextstepaction"]
> [Use the Azure Cosmos DB lifetime free tier](free-tier.md)
