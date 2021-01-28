---
title: Create an indexer
titleSuffix: Azure Cognitive Search
description: Set properties on an indexer to determine data origin and destinations. You can set parameters to modify runtime behaviors.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/28/2021
---

# Create a search indexer

A search indexer can extract text and other content from Azure data sources, serialize the data into JSON, and pass the resulting documents off to a search engine for indexing.

Within the indexer definition are required properties that determine the data source and destination search index. Optionally, indexers can also take a skillset for interim processing, a [schedule for recurring execution](search-howto-schedule-indexers.md), or [field mappings](search-indexer-field-mappings.md) if you need to resolve differences between origin and index fields.

Indexers also accept parameters used to pass in source-specific information that can be used at run time. For example, if the source is Blob storage, you can set a parameter that filters on file extensions: `"parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }`. Similarly, for SQL database sources, you can set a query timeout: `"parameters" : {"configuration" : { "queryTimeout" : "00:10:00" } }`.

This article focuses on global properties and operations that are the same for all indexers. With a basic understanding in place, any source-related variations will be easier to spot and manage.

## Indexer definition

TBD - reproduced from the REST API reference for convenience.

## Approaches for creating and managing indexers

You can create and manage indexers using these approaches:

+ [Portal > Import Data Wizard](search-import-data-portal.md)
+ [Service REST API](/rest/api/searchservice/Indexer-operations)
+ [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexer)

If you're using an SDK, create a [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient) to work with indexers, data sources, and skillsets. The above link is for the .NET SDK, but all SDKs provide a SearchIndexerClient and similar APIs.

Initially, new data sources are announced as preview features and are REST-only. After graduating to general availability, full support is built into the portal and into the various SDKs, each of which are on their own release schedules.

## Permissions

All operations related to indexers, including GET requests for status or definitions, require an [admin api-key](search-security-api-keys.md) on the request.

## Next steps