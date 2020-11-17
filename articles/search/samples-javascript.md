---
title: JavaScript samples
titleSuffix: Azure Cognitive Search
description: Find Azure Cognitive Search demo JavaScript code samples that use the Azure .NET SDK for JavaScript.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/17/2020
---

# JavaScript code samples for Azure Cognitive Search

Learn about the JavaScript code samples that demonstrate the features and functionality of Azure Cognitive Search. The primary repositories are as follows:

| Repository | Description |
|------------|-------------|
| [azure-sdk-for-js/tree/master/sdk/search/search-documents](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents) | Samples produced by the Azure SDK team that ship with the Azure.Search.Documents client library in the SDK. You can also review [unit tests](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/test) for the client library to see how various APIs are called. |
| [Azure-Samples/azure-search-javascript-samples](https://github.com/Azure-Samples/azure-search-javascript-samples) | Code samples that accompany how-to articles, including [Quickstart: Create a search index in JavaScript](search-get-started-javascript.md).|

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=csharp&products=azure-cognitive-search) to search for Microsoft code samples in Github, filtered by product, service, and language.

## JavaScript SDK samples

The Azure SDK for Java includes numerous samples and a [getting started page](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/README.md#getting-started) that covers package install, client setup, and troubleshooting. The page also describes the following sample categories, listed here for your convenience.

| Samples | Description |
|---------|-------------|
| [indexes](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/indexes) | Demonstrates how to create, update, get, list, and delete [search indexes](search-what-is-an-index.md). This sample category also includes a service statistic sample. |
| [dataSourceConnections (for indexers)](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/dataSourceConnections) | Demonstrates how to create, update, get, list, and delete indexer data sources, required for indexer-based indexing of [supported Azure data sources](search-indexer-overview.md#supported-data-sources). |
| [indexers](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/indexers) |  Demonstrates how to create, update, get, list, reset and delete [indexers](search-indexer-overview.md).|
| [skillSet](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/skillSets) |   Demonstrates how to create, update, get, list, and delete [skillsets](cognitive-search-working-with-skillsets.md) that are attached indexers, and that perform AI-based enrichment during indexing. |
| [synonymMaps](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/synonymMaps) | Demonstrates how to create, update, get, list, and delete [synonym maps](search-synonyms.md).  |
| [Queries](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/search/search-documents/samples/javascript/src/readonlyQuery.js) | Queries are read-only. This sample query executes against a public index hosted by Microsoft.  |

## TypeScript samples

The SDK also provides TypeScript examples, listed here for your convenience.

| Samples | Description |
|---------|-------------|
| [indexes](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/indexes) | Demonstrates how to create, update, get, list, and delete [search indexes](search-what-is-an-index.md). This sample category also includes a service statistic sample. |
| [dataSourceConnections (for indexers)](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/dataSourceConnections) | Demonstrates how to create, update, get, list, and delete indexer data sources, required for indexer-based indexing of [supported Azure data sources](search-indexer-overview.md#supported-data-sources). |
| [indexers](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/indexers) |  Demonstrates how to create, update, get, list, reset and delete [indexers](search-indexer-overview.md).|
| [skillSet](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/skillSets) |   Demonstrates how to create, update, get, list, and delete [skillsets](cognitive-search-working-with-skillsets.md) that are attached indexers, and that perform AI-based enrichment during indexing. |
| [synonymMaps](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/synonymMaps) | Demonstrates how to create, update, get, list, and delete [synonym maps](search-synonyms.md).  |
| [Queries](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/search/search-documents/samples/typescript/src/readonlyQuery.js) | Demonstrates query execution against a read-only public index hosted by Microsoft.  |

## Documentation samples

The following samples have an associated article in [Azure Cognitive Search documentation](https://docs.microsoft.com/azure/search/).

| Samples | Description | 
|---------|-------------|
| [quickstart](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/Quickstart) | Source code for [Quickstart: Create a search index in JavaScript](search-get-started-javascript.md).  |

## Standalone samples

| Samples | Description |
|---------|-------------|
| [azure-search-react-template](https://github.com/dereklegenzoff/azure-search-react-template) | React template for Azure Cognitive Search (github.com) |