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

Find C# code samples that demonstrate the features and functionality of Azure Cognitive Search.

The primary repositories are as follows:

| Repository | Description |
|------------|-------------|
| [Azure-Samples/azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples) | Code samples that accompany how-to articles, including [How to use the .NET client library](search-howto-dotnet-sdk.md).|
| [Azure-Samples/search-dotnet-getting-started](https://github.com/Azure-Samples/search-dotnet-getting-started) | Code samples that accompany quickstarts and tutorials.|
| [azure-sdk-for-net/sdk/search/Azure.Search.Documents/samples/](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/samples) | Targeted samples that ship with the Azure.Search.Documents client library in the Azure .NET SDK. You can also review [unit tests](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/search/Azure.Search.Documents/tests) for the client library to see how various APIs are called. |

> [!Tip]
> Try the [Samples browser](/samples/browse/?languages=csharp&products=azure-cognitive-search) to search for Microsoft code samples in Github, filtered by product, service, and language

## Create and query indexes

| Samples | Description | 
|---------|-------------|
| [quickstart](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart) | Source code for [Quickstart: Create a search index ](search-get-started-dotnet.md).  |
| [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo)  | Source code for [How to use the .NET client library](search-howto-dotnet-sdk.md) |
| [DotNetHowToSynonyms](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToSynonyms)  | Synonym lists are used for query expansion, providing matchable  terms that are external to an index. This sample is included in [Example: Add synonyms in C#](search-synonyms-tutorial-sdk.md). |
|  | Code sample from the Azure SDK team. |
|  | Code sample from the Azure SDK team. |
|  | Code sample from the Azure SDK team. |

## Indexers and indexing

| Samples | Description | 
|---------|-------------|
| [DotNetToIndexers](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) | Source code behind indexer-related snippets in various articles. This example shows how to configure an indexer that has a schedule, field mappings, and parameters.  |
| [multiple-data-sources](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/multiple-data-sources)  | Source code for [Tutorial: Index from multiple data sources](tutorial-multiple-data-sources.md). |
|  [optimize-data-indexing](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/optimize-data-indexing) | Source code for [Tutorial: Optimize indexing with the push API](tutorial-optimize-indexing-push-api.md).  |

## Skillsets and enrichment

| Samples | Description | 
|---------|-------------|
| [tutorial-ai-enrichment](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/tutorial-ai-enrichment)  | Source code for [Tutorial: AI-generated searchable content from Azure blobs using the .NET SDK](cognitive-search-tutorial-blob-dotnet.md).  |
| [azure-search-power-skills](https://github.com/Azure-Samples/azure-search-power-skills)  | Source code for consumable custom skills that you can incorporate in your won solutions.  |

## Security

| Samples | Description | 
|---------|-------------|
| [DotNetHowToEncryptionUsingCMK](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToEncryptionUsingCMK)  | Source code for [How to configure customer-managed keys for data encryption](search-security-manage-encryption-keys.md) |

## Create apps (web-front ends)

The following samples are comprehensive in scope, and include client code that showcases Cognitive Search functionality in realistic scenarios.

| Repository | Description |
|------------|-------------|
| [Create your first app in C#](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/create-first-app/v11) | A web page that fronts the sample Hotels index, demonstrating basic search, pagination, autocomplete and suggested queries, facets, and filters. For more information, see [Tutorial: Create your first search app](tutorial-csharp-create-first-app.md). |
| [Knowledge Mining Solution Accelerator](https://docs.microsoft.com/samples/azure-samples/azure-search-knowledge-mining/azure-search-knowledge-mining/) | Includes templates, support files, and analytical reports to help you prototype an end-to-end knowledge mining solution.  |
| [Covid-19 Search App repository](https://github.com/liamca/covid19search) | Source Code Repository for the Cognitive Search based [Covid-19 Search App](https://covid19search.azurewebsites.net/) |
| [JFK](https://github.com/Microsoft/AzureSearch_JFK_Files) | Learn more about the [JFK solution](https://www.microsoft.com/ai/ai-lab-jfk-files). |
