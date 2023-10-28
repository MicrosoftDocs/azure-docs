---
title: REST samples
titleSuffix: Azure AI Search
description: Find Azure AI Search demo REST code samples that use the Search or Management REST APIs.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/04/2023
---

# REST samples for Azure AI Search

Learn about the REST API samples that demonstrate the functionality and workflow of an Azure AI Search solution. These samples use the [**Search REST APIs**](/rest/api/searchservice).

REST is the definitive programming interface for Azure AI Search, and all operations that can be invoked programmatically are available first in REST, and then in SDKs. For this reason, most examples in the documentation leverage the REST APIs to demonstrate or explain important concepts.

REST samples are usually developed and tested on Postman, but you can use any client that supports HTTP calls, including the [Postman app](https://www.postman.com/downloads/). [This quickstart](search-get-started-rest.md) explains how to formulate the HTTP request from end-to-end.

## Doc samples

Code samples from the Azure AI Search team demonstrate features and workflows. Many of these samples are referenced in tutorials, quickstarts, and how-to articles. You can find these samples in [**Azure-Samples/azure-search-postman-samples**](https://github.com/Azure-Samples/azure-search-postman-samples) on GitHub.

| Samples | Article |
|---------|---------|
| [Quickstart](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/Quickstart) | Source code for [Quickstart: Create a search index using REST APIs](search-get-started-rest.md). This article covers the basic workflow for creating, loading, and querying a search index using sample data. |
| [Tutorial](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/Tutorial) | Source code for [Tutorial: Use REST and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob.md). This article shows you how to create a skillset that iterates over Azure blobs to extract information and infer structure.|
| [Debug-sessions](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/Debug-sessions) | Source code for [Tutorial: Diagnose, repair, and commit changes to your skillset](cognitive-search-tutorial-debug-sessions.md). This article shows you how to use a skillset debug session in the Azure portal. REST is used to create the objects used during debug.|
| [custom-analyzers](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/custom-analyzers) | Source code for [Tutorial: Create a custom analyzer for phone numbers](tutorial-create-custom-analyzer.md). This article explains how to use analyzers to preserve patterns and special characters in searchable content.|
| [knowledge-store](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/knowledge-store) | Source code for [Create a knowledge store using REST and Postman](knowledge-store-create-rest.md). This article explains the necessary steps for populating a knowledge store used for knowledge mining workflows. |
| [projections](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/projections) | Source code for [Define projections in a knowledge store](knowledge-store-projections-examples.md). This article explains how to specify the physical data structures in a knowledge store.|
| [index-encrypted-blobs](https://github.com/Azure-Samples/azure-search-postman-samples/commit/f5ebb141f1ff98f571ab84ac59dcd6fd06a46718) | Source code for [How to index encrypted blobs using blob indexers and skillsets](search-howto-index-encrypted-blobs.md). This article shows how to index documents in Azure Blob Storage that have been previously encrypted using Azure Key Vault. |

> [!TIP]
> Try the [Samples browser](/samples/browse/?expanded=azure&languages=http&products=azure-cognitive-search) to search for Microsoft code samples in GitHub, filtered by product, service, and language.

## Other samples

The following samples are also published by the Azure AI Search team, but are not referenced in documentation. Associated readme files provide usage instructions.

| Samples | Description |
|---------|-------------|
| [Query-examples](https://github.com/Azure-Samples/azure-search-postman-samples/tree/master/Query-examples) | Postman collections demonstrating the various query techniques, including fuzzy search, RegEx and wildcard search, autocomplete, and so on. |
