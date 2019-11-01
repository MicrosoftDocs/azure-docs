---
title: Set up incremental indexing of enriched content based change tracking
titleSuffix: Azure Cognitive Search
description: Enable change tracking and preserve state of enriched content for controlled processing in a cognitive skillset.

author: vkurpad 
manager: eladz
ms.author: vikurpad

ms.service: cognitive-search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 11/04/2019
---

# How to set up incremental indexing of enriched documents in Azure Cognitive Search

This article shows you how to add state and caching to enriched documents moving through an Azure Cognitive Search enrichment pipeline so that you can incrementally index documents from any of the supported data sources. By default, a skillset is stateless, and changing any part of its composition requires a full rerun of the indexer. With incremental indexing, the indexer can determine which parts of the pipeline have changed, reusing existing enrichments for unchanged parts, and revising enrichments for the steps that do change. Cached content is placed in Azure Storage.

If you're not familiar with setting up indexers, start with [indexer overview](search-indexer-overview.md) and then continue on to [skillsets](cognitive-search-working-with-skillsets.md) to learn about enrichment pipelines. For more background on key concepts, see [incremental indexing](cognitive-search-incremental-indexing-conceptual.md).

Incremental indexing is configured using the [Search REST api-version=2019-05-06-Preview](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations).

> [!NOTE]
> This feature is not yet available in the portal and has to be used programmatically.
>

## Modify an existing indexer

If you have an existing indexer, follow these steps to enable incremental indexing.

### Step 1: Get the indexer

Start with a valid, existing indexer that has the required data source and index already defined. Your indexer should be runnable. Using an API client, construct a [GET request](https://docs.microsoft.com/rest/api/searchservice/get-indexer) to get the current configuration of the indexer, to which you want to add incremental indexing.

```http
GET https://[service name].search.windows.net/indexers/[your indexer name]?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [admin key]
```

### Step 2: Add the cache property

Edit the response from the GET request to add the `cache` property to the indexer. The cache object requires only a single property, and that is the connection string to an Azure Storage account.

```json
    "cache": {
        "storageConnectionString": "[your storage connection string]"
    }
```

### Step 3: Reset the indexer

> [!NOTE]
> Resetting the indexer will result in all documents in your data source being processed again so that content can be cached. All cognitive enrichments will be re-run on all documents.
>

A reset of the indexer is required when setting up incremental indexing for existing indexers to ensure all documents are in a consistent state. Reset the indexer using the [REST API](https://docs.microsoft.com/rest/api/searchservice/reset-indexer).

```http
POST https://[service name].search.windows.net/indexers/[your indexer name]/reset?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [admin key]
```

### Step 4: Save the updated definition

Update the indexer definition with a PUT request, the body of the request should contain the updated indexer definition.

```http
PUT https://[service name].search.windows.net/indexers/[your indexer name]/reset?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [admin key]
{
    "name" : "your indexer name",
    ...
    "cache": {
        "storageConnectionString": "[your storage connection string]",
        "enableReprocessing": true
    }
}
```

If you now issue another GET request on the indexer, the response from the service will include a `cacheId` property in the cache object. The `cacheId` is the name of the container that will contain all the cached results and intermediate state of each document processed by this indexer.

## Enable incremental indexing on new indexers

To set up incremental indexing for a new indexer, include the `cache` property in the indexer definition payload. Ensure you're using the `2019-05-06-Preview` version of the API.

## Overriding incremental indexing

When configured, incremental indexing tracks changes across your indexing pipeline and drives documents to eventual consistency across your index and projections. In some cases, you'll need to override this behavior to ensure the indexer doesn't do additional work as a result of an update to the indexing pipeline. For example, updating the datasource connection string will require an indexer reset and reindexing of all documents as the datasource has changed. But if you were only updating the connection string with a new key, you wouldn't want the change to result in any updates to existing documents. Conversely, you may want the indexer to invalidate the cache and enrich documents even if no changes to the indexing pipeline are made. For instance, you might want to invalidate the indexer if you were to redeploy a custom skill with a new model and wanted the skill rerun on all your documents.

### Override reset requirement

When making changes to the indexing pipeline, any changes resulting in an invalidation of the cache requires an indexer reset. If you're making a change to the indexer pipeline and don't want the change tracking to invalidate the cache, you'll need to set the `ignoreResetRequirement` querystring parameter to `true` for operations on the indexer or datasource.

### Override change detection

When making updates to the skillset that would result in documents being flagged as inconsistent, for example updating a custom skill URL when the skill is redeployed, set the `disableCacheReprocessingChangeDetection` query string parameter to `true` on skillset updates.

### Force change detection

Instanced when you want the indexing pipeline to recognize a change to an external entity, like deploying a new version of a custom skill, you'll need to update the skillset and "touch" the specific skill by editing the skill definition, specifically the URL to force change detection and invalidate the cache for that skill.

## Next steps

This article covers incremental indexing for indexers that include skillsets. To further round out your knowledge, review articles about re-indexing in general, applicable to all indexing scenarios in Azure Cognitive Search.

+ [How to rebuild an Azure Cognitive Search index](search-howto-reindex.md). 
+ [How to index large data sets in Azure Cognitive Search](search-howto-large-index.md). 
