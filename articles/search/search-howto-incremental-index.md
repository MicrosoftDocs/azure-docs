---
title: Incrementally index your documents with change tracking across the entire indexing pipeline - Azure Search
description: Learn how to index Azure Blob Storage and extract text from documents with Azure Search.

ms.date: 10/07/2019
author: vkurpad 
manager: eladz
ms.author: vikurpad
ms.reviewer: laobri

services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.custom: seonov2019
---

# Incrementally indexing documents with Azure Search

This article shows how to use Azure Search to incrementally index documents from any of the supported data sources. 
If you are not familiar with setting up indexers in Azure search start with [indexer overview](search-indexer-overview.md). If you need to learn more about the incremental indexing feature start with [incremental indexing](cognitive-search-incremental-indexing-conceptual.md)
First, it explains the basics of setting up and configuring incremental indexing. Then, it offers a deeper exploration of behaviors and scenarios you are likely to encounter.

## Setting up incremental indexing

Incremental indexing can be configured using:

* Azure Search [REST API](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations)

> [!NOTE]
> This feature is not yet available in the portal and has to be used programmatically.
>

Here, we demonstrate the flow to adding incremental indexing to an existing indexer.

### Step 1: Get the indexer

Using a API client construct a GET request to get the current configuration of the indexer you want to add incremental indexing to.
 
    GET https://[service name].search.windows.net/indexers/[your indexer name]?api-version=2019-05-06-preview
    Content-Type: application/json
    api-key: [admin key]

### Step 2: Update the indexer definition

Edit the response from the GET request to add the `cache` property to the indexer. The cache object requires only a single property, `storageConnectionString` which is the connection string to the storage account.

```json
    "cache": {
        "storageConnectionString": "[your storage connection string]"
    }
```

### Step 3: Reset the indexer

> [!NOTE]
> This will result in all documents in your datasource being processed again. All cognitive enrichments will be re-run on all documents.
>

A reset of the indexer is required when setting up incremental indexing for existing indexers to ensure that all documents are in a consistent state. Reset the indexer via the portal or using the REST API.
To create a data source:

    POST https://[service name].search.windows.net/indexers/[your indexer name]/reset?api-version=2019-05-06-preview
    Content-Type: application/json
    api-key: [admin key]

### Step 4: Update the indexer

Update the indexer definition with a PUT request, the body of the request should contain the updated indexer definition.
 
    PUT https://[service name].search.windows.net/indexers/[your indexer name]/reset?api-version=2019-05-06-preview
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

If you now issue another GET request on the indexer, the response from the service will include a `cacheId` property in the cache object. This is the container name that will contain all the cached results and intermediate state of each document processed by this indexer.

### Set up incremental indexing for a new indexer

Setting up incremental indexing for a new indexer, simply include the cache property in the indexer definition payload. Ensure you are using the `2019-05-06-preview` version of the API.

## Overriding incremental indexing

When configured, incremental indexing tracks changes across your indexing pipeline and drives documents to eventual consistency across your index and projections. In some cases you will need to override this behavior to ensure that the indexer does not perform additional work as a result of an update to the indexing pipeline. For example, updating the datasource connection string will require an indexer reset and reindexing of all documents as the datasource has changed. But if you were only updating the connection string with a new key, you do not want the change to result in any updates to existing documents. Conversely, you may want the indexer to invalidate the cache and enrich documents even if no changes to the indexing pipeline are made, for instance, if you redeploy a custom skill with a new model and want the skill rerun on all your documents.

### Override reset requirement

When making changes to the indexing pipeline, any changes resulting in an invalidation of the cache requires a indexer reset. If you are making a change to the indexer pipeline and do not want the change tracking to invalidate the cache, you will need to set the `ignoreResetRequirement` querystring parameter to `true` for operations on the indexer or datasource.

### Override change detection

When making updates to the skillset that would result in documents being flagged as inconsistent, for example updating a custom skill URL when the skill is redeployed, set the `disableCacheReprocessingChangeDetection` query string parameter to `true` on skillset updates.

### Force change detection

Instanced when you want the indexing pipeline to recognize a change to an external entity, like deploying a new version of a custom skill, you will need to update the skillset and "touch" the specific skill by editing the skill definition, specifically the URL to force change detection and invalidate the cache for that skill.
