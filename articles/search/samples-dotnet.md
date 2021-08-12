---
title: .NET samples
titleSuffix: Azure Cognitive Search
description: Find Azure Cognitive Search demo C# code samples that use the .NET client libraries.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/27/2021
---

# .NET (C#) code samples for Azure Cognitive Search

Learn about the C# code samples that demonstrate the functionality and workflow of an Azure Cognitive Search solution. These samples use the [**Azure Cognitive Search client library**](/dotnet/api/overview/azure/search) for the [**Azure SDK for .NET**](/dotnet/azure/), which you can explore through the following links.

| Target | Link |
|--------|------|
| Package download | [www.nuget.org/packages/Azure.Search.Documents/](https://www.nuget.org/packages/Azure.Search.Documents/) |
| API reference | [azure.search.documents](/dotnet/api/azure.search.documents)  |
| API test cases | [github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/tests](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/tests) |
| Source code | [github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/src](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/src)  |

## SDK samples

Code samples from the Azure SDK development team demonstrate API usage. You can find these samples in [**Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/samples**](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/) on GitHub.

| Samples | Description |
|---------|-------------|
| ["Hello world", synchronously](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample01a_HelloWorld.md) | Demonstrates how to create a client, authenticate, and handle errors using synchronous methods.|
| ["Hello world", asynchronously](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample01b_HelloWorldAsync.md) | Demonstrates how to create a client, authenticate, and handle errors using asynchronous methods.  |
| [Service-level operations](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample02_Service.md) | Demonstrates how to create indexes, indexers, data sources, skillsets, and synonym maps. This sample also shows you how to get service statistics and how to query an index.  |
| [Index operations](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample03_Index.md) | Demonstrates how to perform an action on existing index, in this case getting a count of documents stored in the index.  |
| [FieldBuilderIgnore](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample04_FieldBuilderIgnore.md) | Demonstrates a technique for working with unsupported data types.  |
| [Indexing documents (push model)](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample05_IndexingDocuments.md) | "Push" model indexing, where you send a JSON payload to an index on a service.   |
| [Encryption key sample](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample06_EncryptedIndex.md) | Demonstrates using a customer-managed encryption key to add an extra layer of protection over sensitive content.  |

## Doc samples

Code samples from the Cognitive Search team demonstrate features and workflows. Many of these samples are referenced in tutorials, quickstarts, and how-to articles. You can find these samples in [**Azure-Samples/azure-search-dotnet-samples**](https://github.com/Azure-Samples/azure-search-dotnet-samples) and in [**Azure-Samples/search-dotnet-getting-started**](https://github.com/Azure-Samples/search-dotnet-getting-started/) on GitHub.

| Samples | Article  |
|---------|-------------|
| [quickstart](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart) | Source code for [Quickstart: Create a search index ](search-get-started-dotnet.md). Covers the basic workflow for creating, loading, and querying a search index using sample data. |
| [search-website](https://github.com/azure-samples/azure-search-dotnet-samples/tree/master/search-website) | Source code for [Tutorial: Add search to web apps](tutorial-csharp-overview.md). Demonstrates an end-to-end search app that includes a rich client plus components for hosting the app and handling search requests.|
| [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo)  | Source code for [How to use the .NET client library](search-howto-dotnet-sdk.md). Steps through the basic workflow, but in more detail and discussion of API usage.  |
| [DotNetHowToSynonyms](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToSynonyms)  | Source code for [Example: Add synonyms in C#](search-synonyms-tutorial-sdk.md). Synonym lists are used for query expansion, providing matchable  terms that are external to an index. |
| [DotNetToIndexers](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) | Source code for [Tutorial: Index Azure SQL data using the .NET SDK](search-indexer-tutorial.md). This article shows how to configure an Azure SQL indexer that has a schedule, field mappings, and parameters.  |
| [DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK)  | Source code for [How to configure customer-managed keys for data encryption](search-security-manage-encryption-keys.md). |
| [Create your first app in C#](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-first-app/v11) |  Source code for [Tutorial: Create your first search app](tutorial-csharp-create-first-app.md). While most samples are console applications, this MVC sample uses a web page to front the sample Hotels index, demonstrating basic search, pagination, autocomplete and suggested queries, facets, and filters. |
| [multiple-data-sources](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/multiple-data-sources)  | Source code for [Tutorial: Index from multiple data sources](tutorial-multiple-data-sources.md). |
|  [optimize-data-indexing](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/optimize-data-indexing) | Source code for [Tutorial: Optimize indexing with the push API](tutorial-optimize-indexing-push-api.md).  |
| [tutorial-ai-enrichment](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/tutorial-ai-enrichment)  | Source code for [Tutorial: AI-generated searchable content from Azure blobs using the .NET SDK](cognitive-search-tutorial-blob-dotnet.md).  |

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=csharp&products=azure-cognitive-search) to search for Microsoft code samples in GitHub, filtered by product, service, and language.

## Other samples

The following samples are also published by the Cognitive Search team, but are not referenced in documentation. Associated readme files provide usage instructions.

| Samples | Description |
|---------|-------------|
| [azure-search-power-skills](https://github.com/Azure-Samples/azure-search-power-skills)  | Source code for consumable custom skills that you can incorporate in your won solutions.  |
| [Knowledge Mining Solution Accelerator](/samples/azure-samples/azure-search-knowledge-mining/azure-search-knowledge-mining/) | Includes templates, support files, and analytical reports to help you prototype an end-to-end knowledge mining solution.  |
| [Covid-19 Search App repository](https://github.com/liamca/covid19search) | Source code repository for the Cognitive Search based [Covid-19 Search App](https://covid19search.azurewebsites.net/) |
| [JFK](https://github.com/Microsoft/AzureSearch_JFK_Files) | Learn more about the [JFK solution](https://www.microsoft.com/ai/ai-lab-jfk-files). |
| [Search + QnA Maker Accelerator](https://github.com/Azure-Samples/search-qna-maker-accelerator) | A [solution](https://techcommunity.microsoft.com/t5/azure-ai/qna-with-azure-cognitive-search/ba-p/2081381) combining the power of Search and QnA Maker. See the live [demo site](https://aka.ms/qnaWithAzureSearchDemo). |
