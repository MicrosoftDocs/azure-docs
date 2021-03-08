---
title: Java samples
titleSuffix: Azure Cognitive Search
description: Find Azure Cognitive Search demo Java code samples that use the Azure .NET SDK for Java.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/27/2021
---

# Java code samples for Azure Cognitive Search

Learn about the Java code samples that demonstrate the functionality and workflow of an Azure Cognitive Search solution. These samples use the [**Azure Cognitive Search client library**](/java/api/overview/azure/search-documents-readme) for the [**Azure SDK for Java**](/azure/developer/java/sdk), which you can explore through the following links.

| Target | Link |
|--------|------|
| Package download | [search.maven.org/artifact/com.azure/azure-search-documents](https://search.maven.org/artifact/com.azure/azure-search-documents) |
| API reference | [com.azure.search.documents](/java/api/com.azure.search.documents)  |
| API test cases | [github.com/Azure/azure-sdk-for-java/tree/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src/test](https://github.com/Azure/azure-sdk-for-java/tree/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src/test) |
| Source code | [github.com/Azure/azure-sdk-for-java/tree/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src](https://github.com/Azure/azure-sdk-for-java/tree/azure-search-documents_11.1.3/sdk/search/azure-search-documents/src)  |

## SDK samples

Code samples from the Azure SDK development team demonstrate API usage. You can find these samples in [**Azure/azure-sdk-for-java/tree/master/sdk/search/azure-search-documents/src/samples**](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/search/azure-search-documents/src/samples) on GitHub.

| Samples | Description |
|---------|-------------|
| [Search index creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexExample.java) | Demonstrates how to create [search indexes](search-what-is-an-index.md). |
| [Synonym creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/SynonymMapsCreateExample.java) | Demonstrates how to create [synonym maps](search-synonyms.md).  |
| [Search indexer creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateIndexerExample.java) | Demonstrates how to create [indexers](search-indexer-overview.md). |
| [Search indexer data source creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/DataSourceExample.java) | Demonstrates how to create indexer data sources, required for indexer-based indexing of [supported Azure data sources](search-indexer-overview.md#supported-data-sources). |
| [Skillset creation](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/indexes/CreateSkillsetExample.java) |  Demonstrates how to create [skillsets](cognitive-search-working-with-skillsets.md) that are attached indexers, and that perform AI-based enrichment during indexing. |
| [Load documents](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/IndexContentManagementExample.java) | Demonstrates how to upload or merge documents into an index in a [data import](search-what-is-data-import.md) operation. |
| [Query syntax](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/search/azure-search-documents/src/samples/java/com/azure/search/documents/SearchAsyncWithFullyTypedDocumentsExample.java) | Demonstrates how to set up a [basic query](search-query-overview.md). |

## Doc samples

Code samples from the Cognitive Search team demonstrate features and workflows. Many of these samples are referenced in tutorials, quickstarts, and how-to articles. You can find these samples in [**Azure-Samples/azure-search-java-samples**](https://github.com/Azure-Samples/azure-search-java-samples) on GitHub.

| Samples | Article | 
|---------|-------------|
| [quickstart](https://github.com/Azure-Samples/azure-search-java-samples/tree/java-rest-api/quickstart) | Source code for [Quickstart: Create a search index in Java and REST](search-get-started-java.md). This sample has not been updated for the Java SDK. It calls the REST APIs. |

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=java&products=azure-cognitive-search) to search for Microsoft code samples in Github, filtered by product, service, and language.

## Other samples

The following samples are also published by the Cognitive Search team, but are not referenced in documentation. Associated readme files provide usage instructions.

| Samples | Description |
|---------|-------------|
| [search-java-getting-started](https://github.com/Azure-Samples/azure-search-java-samples/tree/master/search-java-getting-started) | Uses the Java SDK client library to create, load, and query a search index. This sample is currently standalone. |
| [search-java-indexer-demo](https://github.com/Azure-Samples/azure-search-java-samples/tree/java-rest-api/search-java-indexer-demo) | Demonstrates an Azure Cosmos DB indexer in Java. This sample has not been updated for the Java SDK. It calls the REST APIs.|