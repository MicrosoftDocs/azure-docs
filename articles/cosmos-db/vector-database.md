---
title: Vector database
titleSuffix: Azure Cosmos DB
description: Vector database functionalities, implementation, and comparison.
author: wmwxwa
ms.author: wangwilliam
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.custom:
  - build-2024
ms.topic: conceptual
ms.date: 03/30/2024
---

# Vector database

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

## Vector database related concepts

### Embeddings

An embedding is a special format of data representation that machine learning models and algorithms can easily use. The embedding is an information dense representation of the semantic meaning of a piece of text. Each embedding is a vector of floating-point numbers, such that the distance between two embeddings in the vector space is correlated with semantic similarity between two inputs in the original format. For example, if two texts are similar, then their vector representations should also be similar. A vector database extension that allows you to store your embeddings with your original data ensures data consistency, scale, and performance. [[Go back](#what-is-a-vector-database)]

### Vector search

Vector search is a method that helps you find similar items based on their data characteristics rather than by exact matches on a property field. This technique is useful in applications such as searching for similar text, finding related images, making recommendations, or even detecting anomalies. It works by taking the vector representations (lists of numbers) of your data that you created by using a machine learning model by using an embeddings API, such as [Azure OpenAI Embeddings](../ai-services/openai/how-to/embeddings.md) or [Hugging Face on Azure](https://azure.microsoft.com/solutions/hugging-face-on-azure). It then measures the distance between the data vectors and your query vector. The data vectors that are closest to your query vector are the ones that are found to be most similar semantically. Using a native vector search feature offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications. [[Go back](#what-is-a-vector-database)]

### Prompts and prompt engineering

A prompt refers to a specific text or information that can serve as an instruction to an LLM, or as contextual data that the LLM can build upon. A prompt can take various forms, such as a question, a statement, or even a code snippet. Prompts can serve as:

- Instructions provide directives to the LLM
- Primary content: gives information to the LLM for processing
- Examples: help condition the model to a particular task or process
- Cues: direct the LLM's output in the right direction
- Supporting content: represents supplemental information the LLM can use to generate output

The process of creating good prompts for a scenario is called prompt engineering. For more information about prompts and best practices for prompt engineering, see Azure OpenAI Service [prompt engineering techniques](../ai-services/openai/concepts/advanced-prompt-engineering.md). [[Go back](#vector-database-use-cases)]

### Tokens

Tokens are small chunks of text generated by splitting the input text into smaller segments. These segments can either be words or groups of characters, varying in length from a single character to an entire word. For instance, the word hamburger would be divided into tokens such as ham, bur, and ger while a short and common word like pear would be considered a single token. LLMs like ChatGPT, GPT-3.5, or GPT-4 break words into tokens for processing. [[Go back](#vector-database-use-cases)]

### Retrieval-augmented generation

Retrieval-augmentated generation (RAG) is an architecture that augments the capabilities of LLMs like ChatGPT, GPT-3.5, or GPT-4 by adding an information retrieval system like vector search that provides grounding data, such as those stored in a vector database. This approach allows your LLM to generate contextually relevant and accurate responses based on your custom data sourced from vectorized documents, images, audio, video, etc.

A simple RAG pattern using Azure Cosmos DB for NoSQL could be:

1. Enroll in the [Azure Cosmos DB NoSQL Vector Index preview](nosql/vector-search.md)
2. Setup a database and container with a container vector policy and vector index.
3. Insert data into an Azure Cosmos DB for NoSQL database and container
4. Create embeddings from a data property using Azure OpenAI Embeddings
5. Link the Azure Cosmos DB for NoSQL.
6. Create a vector index over the embeddings properties
7. Create a function to perform vector similarity search based on a user prompt
8. Perform question answering over the data using an Azure OpenAI Completions model

The RAG pattern, with prompt engineering, serves the purpose of enhancing response quality by offering more contextual information to the model. RAG enables the model to apply a broader knowledge base by incorporating relevant external sources into the generation process, resulting in more comprehensive and informed responses. For more information on "grounding" LLMs, see [grounding LLMs](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/grounding-llms/ba-p/3843857). [[Go back](#vector-database-use-cases)]

Here are multiple ways to implement RAG on your data by using our integrated vector database functionalities:

## How to implement integrated vector database functionalities

You can implement integrated vector database functionalities for the following [Azure Cosmos DB APIs](choose-api.md):

### NoSQL API

Azure Cosmos DB for NoSQL is the world's first serverless NoSQL vector database.  Store your vectors and data together in [Azure Cosmos DB for NoSQL with integrated vector database capabilities](nosql/vector-search.md) where you can create a vector index based on [DiskANN](https://www.microsoft.com/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/), a suite of high performance vector indexing algorithms developed by Microsoft Research. 

DiskANN enables you to perform highly accurate, low latency queriers at any scale while leveraging all the benefits of Azure Cosmos DB for NoSQL such as 99.999% SLA (with HA-enabled), geo-replication, seamless transition from serverless to provisioned throughput (RU) all in one data store.

#### Links and samples

- [Vector indexing in Azure Cosmos DB for NoSQL](index-policy.md#vector-indexes)
- [VectorDistance system function NoSQL queries](nosql/query/vectordistance.md)
- [How to setup vector database capabilities in Azure Cosmos DB NoSQL](nosql/vector-search.md)
- [Python notebook tutorial](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples)
- [C# Solution accelerator for building AI apps](https://aka.ms/BuildModernAiAppsSolution)
- [C# Azure Cosmos DB Chatbot with Azure OpenAI](https://aka.ms/cosmos-chatgpt-sample)


### API for MongoDB

Use the natively [integrated vector database in Azure Cosmos DB for MongoDB](mongodb/vcore/vector-search.md) (vCore architecture), which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

#### Code samples

- [.NET RAG Pattern retail reference solution](https://github.com/Azure/Vector-Search-AI-Assistant-MongoDBvCore)
- [.NET tutorial - recipe chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore)
- [C# RAG pattern - Integrate OpenAI Services with Cosmos](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/C%23/CosmosDB-MongoDBvCore)
- [Python RAG pattern - Azure product chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-MongoDB-vCore)
- [Python notebook tutorial - Vector database integration through LangChain](https://python.langchain.com/docs/integrations/vectorstores/azure_cosmos_db)
- [Python notebook tutorial - LLM Caching integration through LangChain](https://python.langchain.com/docs/integrations/llms/llm_caching#azure-cosmos-db-semantic-cache)
- [Python - LlamaIndex integration](https://docs.llamaindex.ai/en/stable/examples/vector_stores/AzureCosmosDBMongoDBvCoreDemo.html)
- [Python - Semantic Kernel memory integration](https://github.com/microsoft/semantic-kernel/tree/main/python/semantic_kernel/connectors/memory/azure_cosmosdb)

> [!div class="nextstepaction"]
> [Use Azure Cosmos DB for MongoDB lifetime free tier](mongodb/vcore/free-tier.md)
  
### API for PostgreSQL

Use the natively integrated vector database in [Azure Cosmos DB for PostgreSQL](postgresql/howto-use-pgvector.md), which offers an efficient way to store, index, and search high-dimensional vector data directly alongside other application data. This approach removes the necessity of migrating your data to costlier alternative vector databases and provides a seamless integration of your AI-driven applications.

#### Code sample
- Python: [Python notebook tutorial - food review chatbot](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/tree/main/Python/CosmosDB-PostgreSQL_CognitiveSearch)

### NoSQL API

> [!NOTE]
> For our NoSQL API, the native integration of a state-of-the-art vector indexing algorithm will be announced during Build in May 2024. Please stay tuned.

The natively integrated vector databaseg in the NoSQL API is under development. In the meantime, you may implement RAG patterns with Azure Cosmos DB for NoSQL and [Azure AI Search](../search/vector-search-overview.md). This approach enables powerful integration of your data residing in the NoSQL API into your AI-oriented applications.

#### Links & Code samples

- [What is the database behind ChatGPT? - Microsoft Mechanics](https://www.youtube.com/watch?v=6IIUtEFKJec)
- [.NET tutorial - Build and Modernize AI Applications](https://github.com/Azure/Build-Modern-AI-Apps-Hackathon)
- [.NET tutorial - Bring Your Data to ChatGPT](https://github.com/Azure/Vector-Search-AI-Assistant/tree/cognitive-search-vector)
- [Azure Data + RAG samples with Azure OpenAI](https://github.com/microsoft/AzureDataRetrievalAugmentedGenerationSamples/)
### Next step 

[30-day Free Trial without Azure subscription](https://azure.microsoft.com/try/cosmosdb/)

[90-day Free Trial and up to $6,000 in throughput credits with Azure AI Advantage](ai-advantage.md)

> [!div class="nextstepaction"]
> [Use the Azure Cosmos DB lifetime free tier](free-tier.md)

## More vector database solutions
- [Azure PostgreSQL Server pgvector Extension](../postgresql/flexible-server/how-to-use-pgvector.md)

:::image type="content" source="media/vector-search/azure-databases-and-ai-search.png" lightbox="media/vector-search/azure-databases-and-ai-search.png" alt-text="Diagram of Vector indexing services.":::
