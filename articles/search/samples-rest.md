---
title: REST samples
titleSuffix: Azure AI Search
description: Find Azure AI Search demo REST code samples that use the Search or Management REST APIs.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/11/2024
---

# REST samples for Azure AI Search

Learn about the REST API samples that demonstrate the functionality and workflow of an Azure AI Search solution. These samples use the [**Search REST APIs**](/rest/api/searchservice).

REST is the definitive programming interface for Azure AI Search, and all operations that can be invoked programmatically are available first in REST, and then in SDKs. For this reason, most examples in the documentation use the REST APIs to demonstrate or explain important concepts.

You can use any client that supports HTTP calls. [Here's a quickstart](search-get-started-rest.md) that explains how to formulate the HTTP request using Visual Studio Code with a REST client.

## Doc samples

Code samples from the Azure AI Search team demonstrate features and workflows. Many of these samples are referenced in tutorials, quickstarts, and how-to articles. You can find these samples in [**Azure-Samples/azure-search-rest-samples**](https://github.com/Azure-Samples/azure-search-rest-samples) on GitHub.

| Samples | Description |
|---------|---------|
| [quickstart](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/Quickstart) | Source code for [Quickstart: Text search using REST](search-get-started-rest.md). This sample  covers the basic workflow for creating, loading, and querying a search index using sample data. |
| [quickstart-vectors](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/Quickstart-vectors) | Source code for [Quickstart: Vector search using REST APIs](search-get-started-vector.md). This sample  covers the basic workflow for indexing and querying vector data. |
| [skillset-tutorial](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/skillset-tutorial) | Source code for [Tutorial: Use REST and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob.md). This sample  shows you how to create a skillset that iterates over Azure blobs to extract information and infer structure.|
| [debug-sessions](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/Debug-sessions) | Source code for [Tutorial: Diagnose, repair, and commit changes to your skillset](cognitive-search-tutorial-debug-sessions.md). This sample  shows you how to use a skillset debug session in the Azure portal. REST is used to create the objects used during debug.|
| [custom-analyzers](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/custom-analyzers) | Source code for [Tutorial: Create a custom analyzer for phone numbers](tutorial-create-custom-analyzer.md). This sample  explains how to use analyzers to preserve patterns and special characters in searchable content.|
| [knowledge-store](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/knowledge-store) | Source code for [Create a knowledge store using REST](knowledge-store-create-rest.md). This sample  explains the necessary steps for populating a knowledge store used for knowledge mining workflows. |
| [projections](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/projections) | Source code for [Define projections in a knowledge store](knowledge-store-projections-examples.md). This sample explains how to specify the physical data structures in a knowledge store.|
| [index-encrypted-blobs](https://github.com/Azure-Samples/azure-search-rest-samples/commit/f5ebb141f1ff98f571ab84ac59dcd6fd06a46718) | Source code for [How to index encrypted blobs using blob indexers and skillsets](search-howto-index-encrypted-blobs.md). This article shows how to index documents in Azure Blob Storage that have been previously encrypted using Azure Key Vault. |

> [!TIP]
> Try the [Samples browser](/samples/browse/?expanded=azure&languages=http&products=azure-cognitive-search) to search for Microsoft code samples in GitHub, filtered by product, service, and language.