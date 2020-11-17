---
title: Java samples
titleSuffix: Azure Cognitive Search
description: Find Azure Cognitive Search demo Java code samples that use the Azure .NET SDK for Java.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/17/2020
---

# Java code samples for Azure Cognitive Search

Learn about the Java code samples that demonstrate the features and functionality of Azure Cognitive Search. The primary repositories are as follows:

| Repository | Description |
|------------|-------------|
| [azure-sdk-for-java/tree/master/sdk/search/azure-search-documents/src/samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/search/azure-search-documents/src/samples) | Samples produced by the Azure SDK team that ship with the Azure.Search.Documents client library in the SDK. You can also review [unit tests](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/search/azure-search-documents/src/test) for the client library to see how various APIs are called. |
| [Azure-Samples/azure-search-java-samples](https://github.com/Azure-Samples/azure-search-java-samples) | Code samples that accompany how-to articles. **Samples in this repository are not yet updated to the use the Azure SDK for Java**. Currently, these samples call REST APIs in Java code.|

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=csharp&products=azure-cognitive-search) to search for Microsoft code samples in Github, filtered by product, service, and language.

## Java SDK samples

The Azure SDK for Java includes numerous samples and a [getting started page](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/search/azure-search-documents/src/samples) that covers package installation. The page also lists a wide range of examples. Several of the more common operations are listed below for your convenience.

| Samples | Description |
|---------|-------------|
| [Search index creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexExample.java) | Demonstrates how to create [search indexes](search-what-is-an-index.md). |
| [Synonym creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/SynonymMapsCreateExample.java) | Demonstrates how to create [synonym maps](search-synonyms.md).  |
| [Search indexer creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexerExample.java) | Demonstrates how to create [indexers](search-indexer-overview.md). |
| [Search indexer data source creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/DataSourceExample.java) | Demonstrates how to create indexer data sources, required for indexer-based indexing of [supported Azure data sources](search-indexer-overview.md#supported-data-sources). |
| [Skillset creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateSkillsetExample.java) |  Demonstrates how to create [skillsets](cognitive-search-working-with-skillsets.md) that are attached indexers, and that perform AI-based enrichment during indexing. |
| [Load documents](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/IndexContentManagementExample.java) | Demonstrates how to upload or merge documents into an index in a [data import](search-what-is-data-import.md) operation. |
| [Query syntax](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/SearchAsyncWithFullyTypedDocumentsExample.java) | Demonstrates how to set up a [basic query](search-query-overview.md). |

## Documentation samples

The following samples have an associated article in [Azure Cognitive Search documentation](https://docs.microsoft.com/azure/search/).

| Samples | Description | 
|---------|-------------|
| [quickstart](https://github.com/Azure-Samples/azure-search-java-samples/tree/master/quickstart) | Source code for [Quickstart: Create a search index in Java](search-get-started-java.md). This sample calls the REST APIs. |
| [search-java-indexer-demo](https://github.com/Azure-Samples/azure-search-java-samples/tree/master/search-java-indexer-demo) | Demonstrates an Azure Cosmos DB indexer in Java. This sample calls the REST APIs. |