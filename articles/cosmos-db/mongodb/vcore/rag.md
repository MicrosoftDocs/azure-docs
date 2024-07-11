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
In the dynamic world of generative AI, while Large Language Models (LLMs) have garnered significant attention, another crucial trend is emerging: the rise of vector stores. Vector stores or vector databases are essential in building applications using LLMs. Azure Cosmos DB for MongoDB (vCore) positions itself as a strong contender in the vector store arena.

This tutorial aims to provide an overview of the key concepts of Azure Cosmos DB for MongoDB (vCore) as a vector store, alongside discussing LLMs and their limitations. We explore the rapidly adopted paradigm of "retrieval-augmented generation" (RAG), and briefly discuss the LangChain framework, OpenAI models, and Azure App Service. Finally, we integrate these concepts into a real-world application. By the end, readers will have a solid understanding of these concepts.

### Understanding Large Language Models (LLMs) and Their Limitations

Large Language Models (LLMs) are advanced deep neural network models trained on extensive text datasets, enabling them to understand and generate human-like text. While revolutionary in natural language processing, LLMs have inherent limitations:

- **Hallucinations**: LLMs sometimes generate factually incorrect or ungrounded information, known as "hallucinations."
- **Stale Data**: LLMs are trained on static datasets that might not include the most recent information, limiting their current relevance.
- **No Access to User’s Local Data**: LLMs don't have direct access to personal or localized data, restricting their ability to provide personalized responses.
- **Token Limits**: LLMs have a maximum token limit per interaction, constraining the amount of text they can process at once. For example, OpenAI’s gpt-3.5-turbo has a token limit of 4096.

### Leveraging Retrieval-Augmented Generation (RAG)

Retrieval-augmented generation (RAG) is an architecture designed to overcome LLM limitations. RAG uses vector search to retrieve relevant documents based on an input query, providing these documents as context to the LLM for generating more accurate responses. Instead of relying solely on pretrained patterns, RAG enhances responses by incorporating up-to-date, relevant information. This approach helps to:

- **Minimize Hallucinations**: Grounding responses in factual information.
- **Ensure Current Information**: Retrieving the most recent data to ensure up-to-date responses.
- **Utilize External Databases**: Though it doesn't grant direct access to personal data, RAG allows integration with external, user-specific knowledge bases.
- **Optimize Token Usage**: By focusing on the most relevant documents, RAG makes token usage more efficient.

This tutorial demonstrates how RAG can be implemented using Azure Cosmos DB for MongoDB (vCore) to build a question-answering application tailored to your data.

### Application Architecture

The architecture of our application is outlined below:

![Architecture Diagram](./media/vector/architecture-diagram.png)

We'll now discuss the various frameworks, models, and components used in this tutorial, emphasizing their roles and nuances.

### Azure Cosmos DB for MongoDB (vCore)

Azure Cosmos DB for MongoDB (vCore) supports semantic similarity searches, essential for AI-powered applications. It allows data in various formats to be represented as vector embeddings, which can be stored alongside source data and metadata. Using an approximate nearest neighbors algorithm (HNSW vector index), these embeddings can be queried for fast semantic similarity searches.

### LangChain Framework

LangChain simplifies the creation of LLM applications by providing a standard interface for chains, multiple tool integrations, and end-to-end chains for common tasks. It enables AI developers to build LLM applications that leverage external data sources.

Key aspects of LangChain:

- **Chains**: Sequences of components solving specific tasks.
- **Components**: Modules like LLM wrappers, vector store wrappers, prompt templates, data loaders, text splitters, and retrievers.
- **Modularity**: Simplifies development, debugging, and maintenance.
- **Popularity**: An open-source project rapidly gaining adoption and evolving to meet user needs.

### Azure App Services Interface

App services provide a robust platform for building user-friendly web interfaces for Gen-AI applications. This tutorial uses Azure App services to create an interactive interface for the application.

### OpenAI Models

OpenAI is a leader in AI research, providing various models for language generation, text vectorization, image creation, and audio-to-text conversion. For this tutorial, we'll use OpenAI’s embedding and language models, crucial for understanding and generating language-based applications.

### Embedding Models vs. Language Generation Models

- **Text Embedding Model**:
  - **Purpose**: Converting text into vector embeddings.
    - These models transform textual data into high-dimensional arrays of numbers, capturing the semantic meaning of the text.
  - **Output**: Array of numbers, also known as vector embeddings.
    - Each embedding represents the semantic meaning of the text in a numerical form.
    - The length of the array corresponds to the number of dimensions in the embedding space.
    - The dimensionality is determined by the specific model used.
    - For example, the `text-embedding-ada-002` model generates vectors with 1536 dimensions, meaning each text input is converted into a 1536-dimensional vector.
  
- **Language Model**:
  - **Purpose**: Understanding and generating natural language.
    - These models are designed to comprehend and produce human-like text based on given input.
    - They can perform a wide range of language tasks, including text generation, translation, summarization, and more.
  - **Output**: Text, answers, translations, code, etc.
    - The output is contextually relevant and coherent text generated based on the input provided.
    - These models can generate responses to questions, translate text between languages, write code snippets, and more.
  - **Example**: `gpt-3.5-turbo`.
    - This model is an advanced language model capable of generating high-quality text, understanding context, and providing relevant answers, making it suitable for applications such as chatbots, automated content creation, and interactive AI systems.


### Main Components of the Application

- **Azure Cosmos DB for MongoDB vCore**: Storing and querying vector embeddings.
- **LangChain**: Constructing the application’s LLM workflow. Utilizes tools such as:
  - **Document Loader**: For loading and processing documents from a directory.
  - **Vector Store Integration**: For storing and querying vector embeddings in Azure Cosmos DB.
- **Azure App Services**: Building the user interface.
- **Azure OpenAI**: For providing LLM and embedding models, including:
  - **text-embedding-ada-002**: A text embedding model that converts text into vector embeddings with 1536 dimensions.
  - **gpt-3.5-turbo**: A language model for understanding and generating natural language.

By the end of this tutorial, you'll have a comprehensive understanding of how to build an AI-powered application using Azure Cosmos DB for MongoDB (vCore), LangChain, Azure App Services, and OpenAI models, optimizing retrieval-augmented generation (RAG) with vector search for robust performance.

### How to Use?

To get started with optimizing retrieval-augmented generation (RAG) using Azure Cosmos DB for MongoDB (vCore), follow these steps:

1. **Create the following resources on Microsoft Azure:**
    - **Azure Cosmos DB for MongoDB vCore cluster**: See the [Quick Start guide here](https://aka.ms/tryvcore).
    - **Azure OpenAI resource with:**
        - **Embedding model deployment** (e.g., `text-embedding-ada-002`).
        - **Chat model deployment** (e.g., `gpt-35-turbo`).

2. **Open the repository in GitHub Codespaces:**

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/Cosmic-Food-RAG-app?devcontainer_path=.devcontainer/devcontainer.json)


## Next Steps

For a hands-on experience and to see how RAG can be implemented using Azure Cosmos DB for MongoDB (vCore), LangChain, and OpenAI models, visit our GitHub repository.

> [!div class="nextstepaction"]
> [Check out RAG sample on GitHub](https://github.com/Azure-Samples/Cosmic-Food-RAG-app)

