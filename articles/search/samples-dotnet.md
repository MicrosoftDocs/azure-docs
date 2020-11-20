---
title: .NET samples
titleSuffix: Azure Cognitive Search
description: Find Azure Cognitive Search demo C# code samples that use the .NET client libraries.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/17/2020
---

# .NET (C#) code samples for Azure Cognitive Search

Learn about the C# code samples that demonstrate the features and functionality of Azure Cognitive Search. The primary repositories are as follows:

| Repository | Description |
|------------|-------------|
| [azure-sdk-for-net/sdk/search/Azure.Search.Documents/samples/](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/samples) | Samples produced by the Azure SDK team that ship with the Azure.Search.Documents client library in the SDK. You can also review [unit tests](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/tests) for the client library to see how various APIs are called. |
| [Azure-Samples/azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples) | Samples that accompany how-to articles in the documentation, including [How to use the .NET client library](search-howto-dotnet-sdk.md).|
| [Azure-Samples/search-dotnet-getting-started](https://github.com/Azure-Samples/search-dotnet-getting-started) | Samples that accompany quickstarts and tutorials in the documentation.|

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=csharp&products=azure-cognitive-search) to search for Microsoft code samples in Github, filtered by product, service, and language.

## .NET SDK samples

The Azure SDK for .NET includes numerous samples and a [samples readme](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/README.md) that describes each one. That list is provided below for your convenience.

| Samples | Description |
|---------|-------------|
| ["Hello world", synchronously](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample01a_HelloWorld.md) | Demonstrates how to create a client, authenticate, and handle errors using synchronous methods.|
| ["Hello world", asynchronously](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample01b_HelloWorldAsync.md) | Demonstrates how to create a client, authenticate, and handle errors using asynchronous methods.  |
| [Service-level operations](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample02_Service.md) | Demonstrates how to create indexes, indexers, data sources, skillsets, and synonym maps. This sample also shows you how to get service statistics and how to query an index.  |
| [Index operations](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample03_Index.md) | Demonstrates how to perform an action on existing index, in this case getting a count of documents stored in the index.  |
| [FieldBuilderIgnore](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample04_FieldBuilderIgnore.md) | Demonstrates a technique for working with unsupported data types.  |
| [Indexing documents (push model)](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample05_IndexingDocuments.md) | "Push" model indexing, where you send a JSON payload to an index on a service.   |
| [Encryption key sample](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample06_EncryptedIndex.md) | Demonstrates using a customer-managed encryption key to add an extra layer of protection over sensitive content.  |

## Documentation samples

The following samples have an associated article in [Azure Cognitive Search documentation](https://docs.microsoft.com/azure/search/).

| Samples | Description |
|---------|-------------|
| [quickstart](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart) | Source code for [Quickstart: Create a search index ](search-get-started-dotnet.md).  |
| [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo)  | Source code for [How to use the .NET client library](search-howto-dotnet-sdk.md) |
| [DotNetHowToSynonyms](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToSynonyms)  | Synonym lists are used for query expansion, providing matchable  terms that are external to an index. This sample is included in [Example: Add synonyms in C#](search-synonyms-tutorial-sdk.md). |
| [DotNetToIndexers](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) | Source code behind indexer-related snippets in various articles. This example shows how to configure an indexer that has a schedule, field mappings, and parameters.  |
| [DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK)  | Source code for [How to configure customer-managed keys for data encryption](search-security-manage-encryption-keys.md) |
| [Create your first app in C#](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-first-app/v11) |  Source code for [Tutorial: Create your first search app](tutorial-csharp-create-first-app.md). While most samples are console applications, this MVC sample uses a web page to front the sample Hotels index, demonstrating basic search, pagination, autocomplete and suggested queries, facets, and filters. |
| [multiple-data-sources](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/multiple-data-sources)  | Source code for [Tutorial: Index from multiple data sources](tutorial-multiple-data-sources.md). |
|  [optimize-data-indexing](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/optimize-data-indexing) | Source code for [Tutorial: Optimize indexing with the push API](tutorial-optimize-indexing-push-api.md).  |
| [tutorial-ai-enrichment](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/tutorial-ai-enrichment)  | Source code for [Tutorial: AI-generated searchable content from Azure blobs using the .NET SDK](cognitive-search-tutorial-blob-dotnet.md).  |

## Standalone samples and solutions

| Samples | Description |
|---------|-------------|
| [azure-search-power-skills](https://github.com/Azure-Samples/azure-search-power-skills)  | Source code for consumable custom skills that you can incorporate in your won solutions.  |
| [Knowledge Mining Solution Accelerator](https://docs.microsoft.com/samples/azure-samples/azure-search-knowledge-mining/azure-search-knowledge-mining/) | Includes templates, support files, and analytical reports to help you prototype an end-to-end knowledge mining solution.  |
| [Covid-19 Search App repository](https://github.com/liamca/covid19search) | Source code repository for the Cognitive Search based [Covid-19 Search App](https://covid19search.azurewebsites.net/) |
| [JFK](https://github.com/Microsoft/AzureSearch_JFK_Files) | Learn more about the [JFK solution](https://www.microsoft.com/ai/ai-lab-jfk-files). |