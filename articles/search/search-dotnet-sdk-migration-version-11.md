---
title: Upgrade to Azure Cognitive Search .NET SDK version 10
titleSuffix: Azure Cognitive Search
description: Migrate code to the Azure Cognitive Search .NET SDK version 10 from older versions. Learn what is new and which code changes are required.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 08/05/2020
---

# Upgrade to Azure Cognitive Search .NET SDK version 11

If you're using version 10.0 or older of the [.NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/search), this article will help you upgrade to version 11.

Version 11 is a fully redesigned client library, released by the Azure SDK development team (as opposed to the Azure Cognitive Search development team). The library has been redesigned for greater consistency with other Azure client libraries, taking a dependency on [Azure.Core](https://docs.microsoft.com/dotnet/api/azure.core) and [System.Text.Json](https://docs.microsoft.com/dotnet/api/system.text.json), and implementing familiar approaches for common tasks.

Some key updates in the new version include:

+ One [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/) and one [client library](https://docs.microsoft.com/dotnet/api/overview/azure/search.documents-readme?view=azure-dotnet) as opposed to multiple.
+ Three clients instead of two: [SearchClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.searchclient), [SearchIndexClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.searchindexclient), [SearchIndexerClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.searchindexerclient)
+ Naming differences across a range of APIs and small structural differences that simplify some tasks

## Package and library consolidation

Version 11 consolidates multiple packages and libraries into one. Post-migration, you will have fewer libraries to manage.

## Client differences

Where applicable, the following table maps the client libraries between the two versions.

| Scope of operations | Microsoft.Azure.Search&nbsp;(v10) | Azure.Search.Documents&nbsp;(v11) |
|---------------------|------------------------------|------------------------------|
| Client used for queries and to populate an index. | [SearchIndexClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.searchindexclient) | [SearchIndexClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.searchindexclient) |
| Client used for indexes, analyzers, synonym maps | [SearchServiceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient) | [SearchClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.searchclient) |
| Client used for indexers, data sources, skillsets | [SearchServiceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient) | [SearchIndexerClient (new)](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.searchindexerclient)|

## Naming differences

API name differences are summarized below. This list is not exhaustive but provides a basic change list when updating classes, methods, and properties.

| Version 10 | Version 11 equivalent |
|------------|-----------------------|
| [SearchParameters](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameters) |  [SearchOptions](https://docs.microsoft.com/dotnet/api/azure.search.documents.searchoptions)  |
| [IndexBatch](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexbatch) | [IndexDocumentsBatch](https://docs.microsoft.com/dotnet/api/azure.search.documents.models.indexdocumentsbatch) |
| [DocumentSearchResult](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.documentsearchresult-1) | [SearchResult](https://docs.microsoft.com/dotnet/api/azure.search.documents.models.searchresult-1) or [SearchResults](https://docs.microsoft.com/dotnet/api/azure.search.documents.models.searchresults-1), depending on whether the result is a single document or multiple. |

Field definitions are streamlined: [SearchableField](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.models.searchablefield), [SimpleField](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.models.simplefield), [ComplexField](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.models.complexfield) are new APIs for creating field definitions.

<a name="WhatsNew"></a>

## What's in version 11

Each version of an Azure Cognitive Search client library targets a corresponding version of the REST API. The REST API is considered foundational to the service, with individual SDKs wrapping a version of the REST API. As a .NET developer, it can be helpful to review REST API documentation if you want more background on specific objects or operations.

Version 11 targets the [Search Service 2020-06-30 REST API](https://docs.microsoft.com/rest/api/searchservice/). Because version 11 is also a new client library built from the ground up, most of the development effort has focused on equivalency with version 10, with some REST API feature support still pending.

Version 11 fully supports the following objects and operations:

+ Index creation and management
+ Synonym map creation and management
+ All query types and syntax (except geo-spatial filters)
+ Indexer objects and operations for indexing Azure data sources, including data sources and skillsets

### Pending features

The following version 10 are not yet available in version 11. If you use these features, hold off on migration until they are supported.

+ [geo-spatial filters](search-query-odata-geo-spatial-functions.md)
+ [FieldBuilder](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.fieldbuilder) 
+ [Knowledge store](knowledge-store-concept-intro.md)

<a name="UpgradeSteps"></a>

## Steps to upgrade

1. Install the [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/) by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

1. Replace using directives for Microsoft.Azure.Search to the following:

   ```csharp
   using Azure;
   using Azure.Search.Documents;
   using Azure.Search.Documents.Indexes;
   using Azure.Search.Documents.Indexes.Models;
   using Azure.Search.Documents.Models;
   ```

1. If you are using indexers or indexer-related objects, update the client to [SearchIndexerClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.indexes.searchindexerclient). This client is new in version 11 and has no anticedent.
 
1. Next, update the [SearchServiceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient) references to [SearchClient](https://docs.microsoft.com/dotnet/api/azure.search.documents.searchclient). 

1. As much as possible, update classes, methods, and properties to use the APIs of the new library. The [naming differences](#naming-differences) section is a place to start.

1. Rebuild the solution. After fixing any build errors or warnings, you can make changes to your application to take advantage of [new functionality](#WhatsNew).

<a name="ListOfChanges"></a>

## Breaking changes in version 11

The following breaking changes in version 11 may require code changes in addition to migrating and rebuilding your application.

+ [BM25 ranking algorithm](index-ranking-similarity.md) replaces the previous ranking algorithm with newer technology. New services will use this algorithm automatically. For existing services, you must set parameters to use the new algorithm.

+ [Ordered results](search-query-odata-orderby.md) for null values have changed in this version, with null values appearing first if the sort is asc and last if the sort is desc. If you wrote code to handle how null values are sorted, be aware of this change.

## Next steps

+ [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/)
+ [Samples on GitHub](https://github.com/azure/azure-sdk-for-net/tree/Azure.Search.Documents_11.0.0/sdk/search/Azure.Search.Documents/samples)
+ [Azure.Search.Document API reference](https://docs.microsoft.com/dotnet/api/overview/azure/search.documents-readme?view=azure-dotnet)