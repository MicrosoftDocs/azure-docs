---
title: What is a Vector database?
titleSuffix: Azure Cosmos DB
description: Vector database functionalities, implementation, and comparison.
author: wmwxwa
ms.author: TheovanKraay
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/26/2024
---

# Vector databases

[!INCLUDE[NoSQL, MongoDB vCore, PostgreSQL](includes/appliesto-nosql-mongodbvcore-postgresql.md)]

Vector databases are used in numerous domains and situations across analytical and generative AI, including natural language processing, video and image recognition, recommendation system, and search, among others.

In 2023, a notable trend in software was the integration of AI enhancements, often achieved by incorporating specialized standalone vector databases into existing tech stacks. This article explains what vector databases are and presents an alternative architecture that you might want to consider: using an integrated vector database in the NoSQL or relational database you already use, especially when working with multi-modal data. This approach not only allows you to reduce cost but also achieve greater data consistency, scalability, and performance.

> [!TIP]
> Data consistency, scalability, and performance are critical for data-intensive applications, which is why OpenAI chose to build the ChatGPT service on top of Azure Cosmos DB. You, too, can take advantage of its integrated vector database, as well as its single-digit millisecond response times, automatic and instant scalability, and guaranteed speed at any scale. See [implementation samples](#how-to-implement-integrated-vector-database-functionalities) and [try](#next-step) it for free.

## What is a vector database?

A vector database is a database designed to store and manage [vector embeddings](#embeddings), which are mathematical representations of data in a high-dimensional space. In this space, each dimension corresponds to a feature of the data, and tens of thousands of dimensions might be used to represent sophisticated data. A vector's position in this space represents its characteristics. Words, phrases, or entire documents, and images, audio, and other types of data can all be vectorized. These vector embeddings are used in similarity search, multi-modal search, recommendations engines, large languages models (LLMs), etc.

In a vector database, embeddings are indexed and queried through [vector search](#vector-search) algorithms based on their vector distance or similarity. A robust mechanism is necessary to identify the most relevant data. Some well-known vector search algorithms include Hierarchical Navigable Small World (HNSW), Inverted File (IVF), DiskANN, etc.

### Integrated vector database vs pure vector database

There are two common types of vector database implementations - pure vector database and integrated vector database in a NoSQL or relational database.

A pure vector database is designed to efficiently store and manage vector embeddings, along with a small amount of metadata; it is separate from the data source from which the embeddings are derived.

A vector database that is integrated in a highly performant NoSQL or relational database provides additional capabilities. The integrated vector database in a NoSQL or relational database can store, index, and query embeddings alongside the corresponding original data. This approach eliminates the extra cost of replicating data in a separate pure vector database. Moreover, keeping the vector embeddings and original data together better facilitates multi-modal data operations, and enables greater data consistency, scale, and performance.

### Vector database use cases

Vector databases are used in numerous domains and situations across analytical and generative AI, including natural language processing, video and image recognition, recommendation system, search, etc. For example, you can use a vector database to:

- identify similar images, documents, and songs based on their contents, themes, sentiments, and styles
- identify similar products based on their characteristics, features, and user groups
- recommend contents, products, or services based on individuals' preferences
- recommend contents, products, or services based on user groups' similarities
- identify the best-fit potential options from a large pool of choices to meet complex requirements
- identify data anomalies or fraudulent activities that are dissimilar from predominant or normal patterns
- implement persistent memory for AI agents

> [!TIP]
> Besides these typical use cases for vector databases, our integrated vector database is also an ideal solution for production-level LLM caching thanks to its low latency, high scalability, and high availability.

It's especially popular to use vector databases to enable [retrieval-augmented generation (RAG)](#retrieval-augmented-generation) that harnesses LLMs and custom data or domain-specific information. This approach allows you to:

- Generate contextually relevant and accurate responses to user prompts from AI models
- Overcome LLMs' [tokens](#tokens) limits
- Reduce the costs from frequent fine-tuning on updated data

This process involves extracting pertinent information from a custom data source and integrating it into the model request through prompt engineering. Before sending a request to the LLM, the user input/query/request is also transformed into an embedding, and vector search techniques are employed to locate the most similar embeddings within the database. This technique enables the identification of the most relevant data records in the database. These retrieved records are then supplied as input to the LLM request using [prompt engineering](#prompts-and-prompt-engineering).



### Next step 

[30-day Free Trial without Azure subscription](https://azure.microsoft.com/try/cosmosdb/)

[90-day Free Trial and up to $6,000 in throughput credits with Azure AI Advantage](ai-advantage.md)

> [!div class="nextstepaction"]
> [Use the Azure Cosmos DB lifetime free tier](free-tier.md)

## More vector database solutions
- [Azure PostgreSQL Server pgvector Extension](../postgresql/flexible-server/how-to-use-pgvector.md)

:::image type="content" source="media/vector-search/azure-databases-and-ai-search.png" lightbox="media/vector-search/azure-databases-and-ai-search.png" alt-text="Diagram of Vector indexing services.":::
