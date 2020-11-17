---
title: Python samples
titleSuffix: Azure Cognitive Search
description: Find Azure Cognitive Search demo Python code samples that use the Azure .NET SDK for Python or REST.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/17/2020
---

# Python code samples for Azure Cognitive Search

Learn about the Python code samples that demonstrate the features and functionality of Azure Cognitive Search. The primary repositories are as follows:

| Repository | Description |
|------------|-------------|
| [azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/samples/](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/samples) | Samples produced by the Azure SDK team that ship with the Azure.Search.Documents client library in the SDK. You can also review [unit tests](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/tests) for the client library to see how various APIs are called. |
| [Azure-Samples/azure-search-python-samples](https://github.com/Azure-Samples/azure-search-python-samples) | Code samples that accompany how-to articles, including [Quickstart: Create a search index in Python](search-get-started-python.md).|

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=csharp&products=azure-cognitive-search) to search for Microsoft code samples in Github, filtered by product, service, and language.

## Python SDK samples

The Azure SDK for Python includes numerous samples and a [getting started page](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/search/azure-search-documents/samples) that includes prerequisites and package installation. The page also contains links to the following samples, listed here for your convenience.

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
| [Facet query](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/search/azure-search-documents/samples/sample_facet_query.py) | Demonstrates working with [facets](search-filters-facets.md). |

## Documentation samples

The following samples have an associated article in [Azure Cognitive Search documentation](https://docs.microsoft.com/azure/search/).

| Samples | Description | 
|---------|-------------|
| [quickstart](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/Quickstart) | Source code for [Quickstart: Create a search index in Python](search-get-started-python.md).  |
| [tutorial-ai-enrichment](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/Tutorial-AI-Enrichment)  | Source code for [Tutorial: Use Python and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob-python.md).  |
| [AzureML-Custom-Skill](https://github.com/Azure-Samples/azure-search-python-samples/tree/master/AzureML-Custom-Skill)  | Source code for [Example: Create a custom skill using Python](cognitive-search-custom-skill-python.md).  |