---
title: How to get started with an AI template
titleSuffix: Azure AI Studio
description: This article provides instructions on how to get started with an AI template.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: dantaylo
ms.author: eur
author: eric-urban
---

# How to get started with an AI template

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

Streamline your code-first development with prebuilt, task-specific Azure AI templates. Benefit from using the latest features and best practices from Microsoft Azure AI, with popular frameworks like LangChain, prompt flow, and Semantic Kernel in multiple languages.

> [!TIP]
> Discover the latest templates in our curated [AZD templates collection](https://aka.ms/azd-ai-templates). Deploy them with a single command ```azd up``` using the [Azure Developer CLI](/azure/developer/azure-developer-cli/). 

## Start with a sample application

Start with our sample applications! Choose the right template for your needs, then refer to the README in any of the following Azure Developer CLI enabled templates for more instructions and information.

### [Python](#tab/python)

| Template      | App host | Tech stack | Description |
| ----------- | ----------| ----------- | ------------|
| [Contoso Chat Retail copilot with Azure AI Studio](https://github.com/Azure-Samples/contoso-chat) | [Azure AI Studio online endpoints](../../../machine-learning/concept-endpoints-online.md) | [Azure Cosmos DB](../../../cosmos-db/index-overview.md), [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/overview), [Azure OpenAI Service](../../../ai-services/openai/overview.md), [Azure AI Search](../../../search/search-what-is-azure-search.md), Bicep  | A retailer conversation agent that can answer questions grounded in your product catalog and customer order history. This template uses a retrieval augmented generation architecture with cutting-edge models for chat completion, chat evaluation, and embeddings. Build, evaluate, and deploy, an end-to-end solution with a single command. | 
| [Process Automation: speech to text and summarization with Azure AI Studio](https://github.com/Azure-Samples/summarization-openai-python-prompflow) | [Azure AI Studio online endpoints](../../../machine-learning/concept-endpoints-online.md) | [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/overview), [Azure OpenAI Service](../../../ai-services/openai/overview.md), [Azure AI speech to text service](../../../ai-services/speech-service/index-speech-to-text.yml), Bicep  | An app for workers to report issues via text or speech, translating audio to text, summarizing it, and specify the relevant department. | 
| [Multi-Modal Creative Writing copilot with Dalle](https://github.com/Azure-Samples/agent-openai-python-prompty) | [Azure AI Studio online endpoints](../../../machine-learning/concept-endpoints-online.md) | [Azure AI Search](../../../search/search-what-is-azure-search.md), [Azure OpenAI Service](../../../ai-services/openai/overview.md), Bicep | demonstrates how to create and work with AI agents. The app takes a topic and instruction input and then calls a research agent, writer agent, and editor agent. |  
| [Assistant API Analytics Copilot with Python and Azure AI Studio](https://github.com/Azure-Samples/assistant-data-openai-python-promptflow) | [Azure AI Studio online endpoints](../../../machine-learning/concept-endpoints-online.md) |  [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/overview), [Azure AI Search](../../../search/search-what-is-azure-search.md), [Azure OpenAI Service](../../../ai-services/openai/overview.md), Bicep| A data analytics chatbot based on the Assistants API. The chatbot can answer questions in natural language, and interpret them as queries on an example sales dataset. |
| [Function Calling with Prompty, LangChain, and Pinecone](https://github.com/Azure-Samples/agent-openai-python-prompty-langchain-pinecone) | [Azure AI Studio online endpoints](../../../machine-learning/concept-endpoints-online.md) | [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/overview), [Azure OpenAI Service](../../../ai-services/openai/overview.md), [LangChain](https://python.langchain.com/v0.1/docs/get_started/introduction), [Pinecone](https://www.pinecone.io/), Bicep  | Utilize the new Prompty tool, LangChain, and Pinecone to build a large language model (LLM) search agent. This agent with Retrieval-Augmented Generation (RAG) technology is capable of answering user questions based on the provided data by integrating real-time information retrieval with generative responses. | 
| [Function Calling with Prompty, LangChain, and Elastic Search](https://github.com/Azure-Samples/agent-python-openai-prompty-langchain) | [Azure AI Studio online endpoints](../../../machine-learning/concept-endpoints-online.md) | [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/overview), [Azure OpenAI Service](../../../ai-services/openai/overview.md), [Elastic Search](https://www.elastic.co/elasticsearch), [LangChain](https://python.langchain.com/v0.1/docs/get_started/introduction) , Bicep  | Utilize the new Prompty tool, LangChain, and Elasticsearch to build a large language model (LLM) search agent. This agent with Retrieval-Augmented Generation (RAG) technology is capable of answering user questions based on the provided data by integrating real-time information retrieval with generative responses |

### [C#](#tab/csharp)

| Template      | App host | Tech stack | Description |
| ----------- | ----------| ----------- | -------------- |
| [Contoso Chat Retail copilot with .NET and Semantic Kernel](https://github.com/Azure-Samples/contoso-chat-csharp-prompty) | [Azure Container Apps](../../../container-apps/overview.md) | [Azure Cosmos DB](../../../cosmos-db/index-overview.md), [Azure Monitor](../../../azure-monitor/overview.md), [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/overview), [Azure Container Apps](../../../container-apps/overview.md), [Azure AI Search](../../../search/search-what-is-azure-search.md), [Azure OpenAI Services](../../../ai-services/openai/overview.md), [Semantic Kernel](/semantic-kernel/overview/?tabs=Csharp), Bicep | A retailer conversation agent that can answer questions grounded in your product catalog and customer order history. This template uses a retrieval augmented generation architecture with cutting-edge models for chat completion, chat evaluation, and embeddings. Build, evaluate, and deploy, an end-to-end solution with a single command. |
| [Process Automation: speech to text and summarization with .NET and GPT 3.5 Turbo](https://github.com/Azure-Samples/summarization-openai-csharp-prompty) | [Azure Container Apps](../../../container-apps/overview.md) | [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/overview), [Azure OpenAI Service](../../../ai-services/openai/overview.md), [Azure AI speech to text service](../../../ai-services/speech-service/index-speech-to-text.yml), Bicep | An app for workers to report issues via text or speech, translating audio to text, summarizing it, and specify the relevant department. |

---


## Related content

- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Work with projects in VS Code](vscode.md)
- [Connections in Azure AI Studio](../../concepts/connections.md)
