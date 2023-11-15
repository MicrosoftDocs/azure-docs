---
title: .NET samples
titleSuffix: Azure AI Search
description: Find Azure AI Search demo C# code samples that use the .NET client libraries.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - devx-track-dotnet
  - ignite-2023
ms.topic: conceptual
ms.date: 08/02/2023
---

# C# samples for Azure AI Search

Learn about the C# code samples that demonstrate the functionality and workflow of an Azure AI Search solution. These samples use the [**Azure AI Search client library**](/dotnet/api/overview/azure/search) for the [**Azure SDK for .NET**](/dotnet/azure/), which you can explore through the following links.

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
| [Vector search sample](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/samples/Sample07_VectorSearch.md) | Shows you how to index a vector field and perform vector search using the Azure SDK for .NET. Vector search is in preview. A beta version of azure.search.documents provides support for this preview feature. |

## Doc samples

Code samples from the Azure AI Search team demonstrate features and workflows. All of the following samples are referenced in tutorials, quickstarts, and how-to articles that explain the code in detail. You can find these samples in [**Azure-Samples/azure-search-dotnet-samples**](https://github.com/Azure-Samples/azure-search-dotnet-samples) and in [**Azure-Samples/search-dotnet-getting-started**](https://github.com/Azure-Samples/search-dotnet-getting-started/) on GitHub.

> [!TIP]
> Try the [Samples browser](/samples/browse/?languages=csharp&products=azure-cognitive-search) to search for Microsoft code samples in GitHub, filtered by product, service, and language.

| Code sample | Related article  | Purpose |
|-------------|------------------|---------|
| [quickstart](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) | [Quickstart: Full text search using the Azure SDKs](search-get-started-text.md) | Covers the basic workflow for creating, loading, and querying a search index in C# using sample data. |
| [search-website](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/main/search-website-functions-v4) | [Tutorial: Add search to web apps](tutorial-csharp-overview.md) | Demonstrates an end-to-end search app that includes a rich client plus components for hosting the app and handling search requests.|
| [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo)  | [How to use the .NET client library](search-howto-dotnet-sdk.md) | Steps through the basic workflow, but in more detail and with discussion of API usage.  |
| [DotNetHowToSynonyms](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToSynonyms)  | [Example: Add synonyms in C#](search-synonyms-tutorial-sdk.md) | Synonym lists are used for query expansion, providing matchable  terms that are external to an index. |
| [DotNetToIndexers](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) | [Tutorial: Index Azure SQL data](search-indexer-tutorial.md) | Shows how to configure an Azure SQL indexer that has a schedule, field mappings, and parameters.  |
| [DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK)  | [How to configure customer-managed keys for data encryption](search-security-manage-encryption-keys.md) | Shows how to create objects that are encrypted with a Customer Key. |
| [multiple-data-sources](https://github.com/Azure-Samples/azure-search-dotnet-scale/tree/main/multiple-data-sources)  | [Tutorial: Index from multiple data sources](tutorial-multiple-data-sources.md). | Merges content from two data sources into one search index.
| [Optimize-data-indexing](https://github.com/Azure-Samples/azure-search-dotnet-scale/tree/main/optimize-data-indexing) | [Tutorial: Optimize indexing with the push API](tutorial-optimize-indexing-push-api.md).| Demonstrates optimization techniques for pushing data into a search index. |
| [tutorial-ai-enrichment](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/tutorial-ai-enrichment)  | [Tutorial: AI-generated searchable content from Azure blobs](cognitive-search-tutorial-blob-dotnet.md) | Shows how to configure an indexer and skillset. |
| [create-mvc-app](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-mvc-app) |  [Tutorial: Add search to an ASP.NET Core (MVC) app](tutorial-csharp-create-mvc-app.md) | While most samples are console applications, this MVC sample uses a web page to front the sample Hotels index, demonstrating basic search, pagination, and other server-side behaviors.|

## Accelerators

An accelerator is an end-to-end solution that includes code and documentation that you can adapt for your own implementation of a specific scenario.

| Samples | Repository | Description |
|---------|------------|-------------|
| [Search + QnA Maker Accelerator](https://github.com/Azure-Samples/search-qna-maker-accelerator) | [search-qna-maker-accelerator](https://github.com/Azure-Samples/search-qna-maker-accelerator)| A [solution](https://techcommunity.microsoft.com/t5/azure-ai/qna-with-azure-cognitive-search/ba-p/2081381) combining the power of Search and QnA Maker. See the live [demo site](https://aka.ms/qnaWithAzureSearchDemo). |
| [Knowledge Mining Solution Accelerator](/samples/azure-samples/azure-search-knowledge-mining/azure-search-knowledge-mining/) | [azure-search-knowledge-mining](https://github.com/azure-samples/azure-search-knowledge-mining/tree/main/) | Includes templates, support files, and analytical reports to help you prototype an end-to-end knowledge mining solution.  |

## Demos

A demo repo provides proof-of-concept source code for examples or scenarios shown in demonstrations. Demo solutions aren't designed for adaptation by customers.

| Samples | Repository | Description |
|---------|------------|-------------|
| [Covid-19 search app](https://github.com/liamca/covid19search/blob/master/README.md) | [covid19search](https://github.com/liamca/covid19search) | Source code repository for the Azure AI Search based [Covid-19 Search App](https://covid19search.azurewebsites.net/) |
| [JFK demo](https://github.com/Microsoft/AzureSearch_JFK_Files/blob/master/README.md) | [AzureSearch_JFK_Files](https://github.com/Microsoft/AzureSearch_JFK_Files) | Learn more about the [JFK solution](https://www.microsoft.com/ai/ai-lab-jfk-files). |

## Other samples

The following samples are also published by the Azure AI Search team, but aren't referenced in documentation. Associated readme files provide usage instructions.

| Samples | Repository | Description |
|---------|------------|-------------|
| [DotNetVectorDemo](https://github.com/Azure/cognitive-search-vector-pr/blob/main/demo-dotnet/readme.md) | [azure-search-vector](https://github.com/Azure/cognitive-search-vector-pr) | Calls Azure OpenAI to generate embeddings and Azure AI Search to create, load, and query an index. |
| [Query multiple services](https://github.com/Azure-Samples/azure-search-dotnet-scale/tree/main/multiple-search-services) |  [azure-search-dotnet-scale](https://github.com/Azure-Samples/azure-search-dotnet-samples) | Issue a single query across multiple search services and combine the results into a single page.  |
| [Check storage](https://github.com/Azure-Samples/azure-search-dotnet-utilities/blob/main/check-storage-usage/README.md) | [azure-search-dotnet-utilities](https://github.com/Azure-Samples/azure-search-dotnet-utilities) | Invokes an Azure function that checks search service storage on a schedule. |
| [Export an index](https://github.com/Azure-Samples/azure-search-dotnet-utilities/blob/main/export-data/README.md) | [azure-search-dotnet-utilities](https://github.com/Azure-Samples/azure-search-dotnet-utilities) | C# console app that partitions and export a large index. |
| [Backup and restore an index](https://github.com/Azure-Samples/azure-search-dotnet-utilities/blob/main/index-backup-restore/README.md) | [azure-search-dotnet-utilities](https://github.com/Azure-Samples/azure-search-dotnet-utilities) | C# console app that copies an index from one service to another, and in the process, creates JSON files on your computer with the index schema and documents.|
| [Index Data Lake Gen2 using Microsoft Entra ID](https://github.com/Azure-Samples/azure-search-dotnet-utilities/blob/master/data-lake-gen2-acl-indexing/README.md) | [azure-search-dotnet-utilities](https://github.com/Azure-Samples/azure-search-dotnet-utilities) | Source code demonstrating indexer connections and indexing of Azure Data Lake Gen2 files and folders that are secured through Microsoft Entra ID and role-based access controls. |
| [Search aggregations](https://github.com/Azure-Samples/azure-search-dotnet-utilities/blob/main/search-aggregations/README.md) | [azure-search-dotnet-utilities](https://github.com/Azure-Samples/azure-search-dotnet-utilities) | Proof-of-concept source code that demonstrates how to obtain aggregations from a search index and then filter by them. |
| [Power Skills](https://github.com/Azure-Samples/azure-search-power-skills/blob/main/README.md) | [azure-search-power-skills](https://github.com/Azure-Samples/azure-search-power-skills)  | Source code for consumable custom skills that you can incorporate in your won solutions.  |
