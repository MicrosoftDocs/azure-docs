---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/07/2025
ms.author: cephalin
ms.custom:
  - build-2025
---

Before you begin deployment, it's helpful to understand the architecture of the application you'll build. The following diagram is from [Custom RAG pattern for Azure AI Search](/azure/search/retrieval-augmented-generation-overview?tabs=docs#custom-rag-pattern-for-azure-ai-search):

:::image type="content" source="../../media/tutorial-ai-openai-search-dotnet/architecture-diagram.png" alt-text="Architecture diagram showing a web app connecting to Azure OpenAI and Azure AI Search, with Storage as the data source":::

In this tutorial, the Blazer application in App Service takes care of both the app UX and the app server. However, it doesn't make a separate knowledge query to Azure AI Search. Instead, it tells Azure OpenAI to do the knowledge querying specifying Azure AI Search as a data source. This architecture offers several key advantages:

- **Integrated Vectorization**: Azure AI Search's integrated vectorization capabilities make it easy and quick to ingest all your documents for searching, without requiring more code for generating embeddings.
- **Simplified API Access**: By using the [Azure OpenAI On Your Data](/azure/ai-services/openai/concepts/use-your-data) pattern with Azure AI Search as a data source for Azure OpenAI completions, there's no need to implement complex vector search or embedding generation. It's just one API call and Azure OpenAI handles everything, including prompt engineering and query optimization.
- **Advanced Search Capabilities**: The integrated vectorization provides everything needed for advanced hybrid search with semantic reranking, which combines the strengths of keyword matching, vector similarity, and AI-powered ranking.
- **Complete Citation Support**: Responses automatically include citations to source documents, making information verifiable and traceable.

