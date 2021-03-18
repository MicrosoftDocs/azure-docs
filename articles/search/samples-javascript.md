---
title: JavaScript samples
titleSuffix: Azure Cognitive Search
description: Find Azure Cognitive Search demo JavaScript code samples that use the Azure .NET SDK for JavaScript.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/27/2021
---

# JavaScript code samples for Azure Cognitive Search

Learn about the JavaScript code samples that demonstrate the functionality and workflow of an Azure Cognitive Search solution. These samples use the [**Azure Cognitive Search client library**](/javascript/api/overview/azure/search-documents-readme) for the [**Azure SDK for JavaScript**](/azure/developer/javascript/), which you can explore through the following links.

| Target | Link |
|--------|------|
| Package download | [www.npmjs.com/package/@azure/search-documents](https://www.npmjs.com/package/@azure/search-documents) |
| API reference | [@azure/search-documents](/javascript/api/@azure/search-documents/)  |
| API test cases | [github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/test](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/test) |
| Source code | [github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents)  |

## SDK samples

Code samples from the Azure SDK development team demonstrate API usage. You can find these samples in [**azure-sdk-for-js/tree/master/sdk/search/search-documents/samples**](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples) on GitHub.

### JavaScript SDK samples

| Samples | Description |
|---------|-------------|
| [indexes](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/indexes) | Demonstrates how to create, update, get, list, and delete [search indexes](search-what-is-an-index.md). This sample category also includes a service statistic sample. |
| [dataSourceConnections (for indexers)](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/dataSourceConnections) | Demonstrates how to create, update, get, list, and delete indexer data sources, required for indexer-based indexing of [supported Azure data sources](search-indexer-overview.md#supported-data-sources). |
| [indexers](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/indexers) |  Demonstrates how to create, update, get, list, reset, and delete [indexers](search-indexer-overview.md).|
| [skillSet](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/skillSets) |   Demonstrates how to create, update, get, list, and delete [skillsets](cognitive-search-working-with-skillsets.md) that are attached indexers, and that perform AI-based enrichment during indexing. |
| [synonymMaps](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/javascript/src/synonymMaps) | Demonstrates how to create, update, get, list, and delete [synonym maps](search-synonyms.md).  |
| [Queries](https://docs.microsoft.com/azure/azure-sql/database/read-scale-out) | Demonstrates query execution against a read-only public index hosted by Microsoft.  |

### TypeScript samples

| Samples | Description |
|---------|-------------|
| [indexes](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/indexes) | Demonstrates how to create, update, get, list, and delete [search indexes](search-what-is-an-index.md). This sample category also includes a service statistic sample. |
| [dataSourceConnections (for indexers)](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/dataSourceConnections) | Demonstrates how to create, update, get, list, and delete indexer data sources, required for indexer-based indexing of [supported Azure data sources](search-indexer-overview.md#supported-data-sources). |
| [indexers](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/indexers) |  Demonstrates how to create, update, get, list, reset, and delete [indexers](search-indexer-overview.md).|
| [skillSet](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/skillSets) |   Demonstrates how to create, update, get, list, and delete [skillsets](cognitive-search-working-with-skillsets.md) that are attached indexers, and that perform AI-based enrichment during indexing. |
| [synonymMaps](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/search/search-documents/samples/typescript/src/synonymMaps) | Demonstrates how to create, update, get, list, and delete [synonym maps](search-synonyms.md).  |
| [Queries](https://docs.microsoft.com/azure/azure-sql/database/read-scale-out) | Demonstrates query execution against a read-only public index hosted by Microsoft.  |

## Doc samples

Code samples from the Cognitive Search team demonstrate features and workflows. Many of these samples are referenced in tutorials, quickstarts, and how-to articles. You can find these samples in [**Azure-Samples/azure-search-javascript-samples**](https://github.com/Azure-Samples/azure-search-javascript-samples) on GitHub.

| Samples | Article |
|---------|---------|
| [quickstart](https://github.com/Azure-Samples/azure-search-javascript-samples/tree/master/quickstart/v11) | Source code for [Quickstart: Create a search index in JavaScript](search-get-started-javascript.md). This article covers the basic workflow for creating, loading, and querying a search index using sample data. |

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=javascript&products=azure-cognitive-search) to search for Microsoft code samples in Github, filtered by product, service, and language.

## Other samples

The following samples are also published by the Cognitive Search team, but are not referenced in documentation. Associated readme files provide usage instructions.

| Samples | Description |
|---------|-------------|
| [azure-search-react-template](https://github.com/dereklegenzoff/azure-search-react-template) | React template for Azure Cognitive Search (github.com) |