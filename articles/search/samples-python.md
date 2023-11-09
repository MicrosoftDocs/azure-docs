---
title: Python samples
titleSuffix: Azure AI Search
description: Find Azure AI Search demo Python code samples that use the Azure .NET SDK for Python or REST.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom: devx-track-dotnet, devx-track-python
ms.topic: conceptual
ms.date: 08/02/2023
---

# Python samples for Azure AI Search

Learn about the Python code samples that demonstrate the functionality and workflow of an Azure AI Search solution. These samples use the [**Azure AI Search client library**](/python/api/overview/azure/search-documents-readme) for the [**Azure SDK for Python**](/azure/developer/python/), which you can explore through the following links.

| Target | Link |
|--------|------|
| Package download | [pypi.org/project/azure-search-documents/](https://pypi.org/project/azure-search-documents/) |
| API reference | [azure-search-documents](/python/api/azure-search-documents)  |
| API test cases | [github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/tests](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/tests) |
| Source code | [github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents)  |

## SDK samples

Code samples from the Azure SDK development team demonstrate API usage. You can find these samples in [**azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/samples**](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/samples) on GitHub.

| Samples | Description |
|---------|-------------|
| [Authenticate](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_authentication.py) | Demonstrates how to configure a client and authenticate to the service. | 
| [Index Create-Read-Update-Delete operations](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_index_crud_operations.py) | Demonstrates how to create, update, get, list, and delete [search indexes](search-what-is-an-index.md). |
| [Indexer Create-Read-Update-Delete operations](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_indexers_operations.py) | Demonstrates how to create, update, get, list, reset, and delete [indexers](search-indexer-overview.md). |
| [Search indexer data sources](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_indexer_datasource_skillset.py) | Demonstrates how to create, update, get, list, and delete indexer data sources, required for indexer-based indexing of [supported Azure data sources](search-indexer-overview.md#supported-data-sources). |
| [Synonyms](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_synonym_map_operations.py) | Demonstrates how to create, update, get, list, and delete [synonym maps](search-synonyms.md).  |
| [Load documents](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_crud_operations.py) | Demonstrates how to upload or merge documents into an index in a [data import](search-what-is-data-import.md) operation. |
| [Simple query](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_simple_query.py) | Demonstrates how to set up a [basic query](search-query-overview.md). |
| [Filter query](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_filter_query.py) | Demonstrates setting up a [filter expression](search-filters.md). |
| [Facet query](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_facet_query.py) | Demonstrates working with [facets](search-faceted-navigation.md). |
| [Vector search](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_vector_search.py) | Demonstrates how to get embeddings from a description field and then send vector queries against the data. |

## Doc samples

Code samples from the Azure AI Search team demonstrate features and workflows. Many of these samples are referenced in tutorials, quickstarts, and how-to articles. You can find these samples in [**Azure-Samples/azure-search-python-samples**](https://github.com/Azure-Samples/azure-search-python-samples) on GitHub.

| Samples | Article |
|---------|---------|
| [quickstart](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/Quickstart/v11) | Source code for the Python portion of [Quickstart: Full text search using the Azure SDKs](search-get-started-text.md). This article covers the basic workflow for creating, loading, and querying a search index using sample data. |
| [search-website-functions-v4](https://github.com/Azure-Samples/azure-search-python-samples/tree/main/search-website-functions-v4) | Source code for [Tutorial: Add search to web apps](tutorial-python-overview.md). Demonstrates an end-to-end search app that includes a rich client plus components for hosting the app and handling search requests.|
| [tutorial-ai-enrichment](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/Tutorial-AI-Enrichment)  | Source code for [Tutorial: Use Python and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob-python.md). This article shows how to create a blob indexer with a cognitive skillset, where the skillset creates and transforms raw content to make it searchable or consumable. |

## Demos

A demo repo provides proof-of-concept source code for examples or scenarios shown in demonstrations. Demo solutions aren't designed for adaptation by customers.

| Repository | Description |
|------------|-------------|
| [**azure-search-vector-python-sample.ipynb**](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-python/code/azure-search-vector-image-python-sample.ipynb) | Uses the latest beta release of the **azure.search.documents** library in the Azure SDK for Python to generate embeddings, create and load an index, and run several vector queries. For more vector search Python demos, see [cognitive-search-vector-pr/demo-python](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-python). |
| [**ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search**](https://github.com/Azure-Samples/azure-search-openai-demo/blob/main/README.md) | Python code showing how to use Azure AI Search with the large language models in Azure OpenAI. For background, see this Tech Community blog post: [Revolutionize your Enterprise Data with ChatGPT](https://techcommunity.microsoft.com/t5/ai-applied-ai-blog/revolutionize-your-enterprise-data-with-chatgpt-next-gen-apps-w/ba-p/3762087). |


> [!TIP]
> Try the [Samples browser](/samples/browse/?languages=python&products=azure-cognitive-search) to search for Microsoft code samples in GitHub, filtered by product, service, and language.
