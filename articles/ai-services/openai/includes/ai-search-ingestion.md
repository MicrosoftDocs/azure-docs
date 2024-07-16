---
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
ms.topic: include
ms.date: 03/25/2024
ms.author: aahi
author: aahill
---

### How data is ingested into Azure AI search

Data is ingested into Azure AI search using the following process:

1. Ingestion assets are created in Azure AI Search resource and Azure storage account. Currently these assets are: indexers, indexes, data sources, a [custom skill](/azure/search/cognitive-search-custom-skill-interface) in the search resource, and a container (later called the chunks container) in the Azure storage account. You can specify the input Azure storage container using the [Azure OpenAI studio](https://oai.azure.com/), or the [ingestion API (preview)](/rest/api/azureopenai/ingestion-jobs).  

2. Data is read from the input container, contents are opened and chunked into small chunks with a maximum of 1,024 tokens each. If vector search is enabled, the service calculates the vector representing the embeddings on each chunk. The output of this step (called the "preprocessed" or "chunked" data) is stored in the chunks container created in the previous step. 

3. The preprocessed data is loaded from the chunks container, and indexed in the Azure AI Search index.