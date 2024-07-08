---
title: RAG with Azure Cosmos DB for MongoDB (vCore), Langchain, and OpenAI
titleSuffix: Azure Cosmos DB
description: Use vector store in Azure Cosmos DB for MongoDB (vCore) to enhance AI-based applications.
author: khelanmodi
ms.author: khelanmodi
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 07/08/2024
---

# RAG with vCore-based Azure Cosmos DB for MongoDB
In the dynamic world of generative AI, while Large Language Models (LLMs) have garnered significant attention, another crucial trend is emerging: the rise of vector stores. Vector stores or vector databases are essential in building applications leveraging LLMs. Azure Cosmos DB for MongoDB vCore positions itself as a strong contender in the vector store arena.

This tutorial aims to provide an overview of the key concepts of Azure Cosmos DB for MongoDB vCore as a vector store, alongside discussing LLMs and their limitations. We will explore the rapidly adopted paradigm of "retrieval-augmented generation" (RAG), and briefly discuss the LangChain framework, OpenAI models, and Azure App Service. Finally, we will integrate these concepts into a real-world application. By the end, readers will have a solid understanding of these concepts and a newfound appreciation for Azure Cosmos DB for MongoDB vCore.

### Understanding Large Language Models (LLMs) and Their Limitations

Large Language Models (LLMs) are advanced deep neural network models trained on extensive text datasets, enabling them to understand and generate human-like text. While revolutionary in natural language processing, LLMs have inherent limitations:

- **Hallucinations**: LLMs sometimes generate factually incorrect or ungrounded information, known as "hallucinations."
- **Stale Data**: LLMs are trained on static datasets that might not include the most recent information, limiting their current relevance.
- **No Access to User’s Local Data**: LLMs do not have direct access to personal or localized data, restricting their ability to provide personalized responses.
- **Token Limits**: LLMs have a maximum token limit per interaction, constraining the amount of text they can process at once. For example, OpenAI’s gpt-3.5-turbo has a token limit of 4096.

### Leveraging Retrieval-Augmented Generation (RAG)

Retrieval-augmented generation (RAG) is an architecture designed to overcome LLM limitations. RAG uses vector search to retrieve relevant documents based on an input query, providing these documents as context to the LLM for generating more informed and accurate responses. Instead of relying solely on pre-trained patterns, RAG enhances responses by incorporating up-to-date, relevant information. This approach helps to:

- **Minimize Hallucinations**: Grounding responses in factual information.
- **Ensure Current Information**: Retrieving the most recent data to ensure up-to-date responses.
- **Utilize External Databases**: Though it doesn't grant direct access to personal data, RAG allows integration with external, user-specific knowledge bases.
- **Optimize Token Usage**: By focusing on the most relevant documents, RAG makes token usage more efficient.

This tutorial will demonstrate how RAG can be implemented using Azure Cosmos DB for MongoDB vCore to build a question-answering application tailored to your data.

### Application Architecture

The architecture of our application is outlined below:

<!-- TODO
![Architecture Diagram](architecture-diagram.png) -->

We will now discuss the various frameworks, models, and components used in this tutorial, emphasizing their roles and nuances.

### Azure Cosmos DB for MongoDB (vCore)

Azure Cosmos DB for MongoDB (vCore) supports semantic similarity searches, essential for AI-powered applications. It allows data in various formats to be represented as vector embeddings, which can be stored alongside source data and metadata. Using an approximate nearest neighbors algorithm, these embeddings can be queried for fast semantic similarity searches.

### LangChain Framework

LangChain simplifies the creation of LLM applications by providing a standard interface for chains, multiple tool integrations, and end-to-end chains for common tasks. It enables AI developers to build LLM applications that leverage external data sources.

Key aspects of LangChain:

- **Chains**: Sequences of components solving specific tasks.
- **Components**: Modules like LLM wrappers, vector store wrappers, prompt templates, data loaders, text splitters, and retrievers.
- **Modularity**: Simplifies development, debugging, and maintenance.
- **Popularity**: An open-source project rapidly gaining adoption and evolving to meet user needs.

### Web Services Interface

Web services provide a robust platform for building user-friendly web interfaces for ML and data science applications. This tutorial uses web services to create an interactive interface for the application.

### OpenAI Models

OpenAI is a leader in AI research, providing various models for language generation, text vectorization, image creation, and audio-to-text conversion. For this tutorial, we will use OpenAI’s embedding and language models, crucial for understanding and generating language-based applications.

### Embedding Models vs. Language Generation Models

Understanding the distinction is vital:

- **Embedding Models**: Convert text into vector embeddings that capture semantic meaning.
- **Language Generation Models**: Generate contextually relevant text based on input.

### Main Components of the Application

- **Azure Cosmos DB for MongoDB vCore**: For storing and querying vector embeddings.
- **LangChain**: For constructing the application’s LLM workflow.
- **Azure App Services**: For building the user interface.
- **OpenAI**: For providing LLM and embedding models.

By the end of this tutorial, you will have a comprehensive understanding of how to build an AI-powered application using Azure Cosmos DB for MongoDB vCore, LangChain, web services, and OpenAI models, optimizing retrieval-augmented generation (RAG) with vector search for robust performance.

## Next step

> [!div class="nextstepaction"]
> [Check out RAG sample on Github](aka.ms/vcorelangchain)
