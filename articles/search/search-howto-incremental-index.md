---
title: Add incremental enrichment (preview) 
titleSuffix: Azure Cognitive Search
description: Enable change tracking and preserve state of enriched content for controlled processing in a cognitive skillset. This feature is currently in public preview.
author: vkurpad 
manager: eladz
ms.author: vikurpad
ms.service: cognitive-search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 12/31/2019
---

# How to set up incremental enrichment in Azure Cognitive Search

> [!IMPORTANT] 
> Incremental enrichment is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no portal or .NET SDK support at this time.

This article shows you how to add statefulness and caching to enriched documents moving through an Azure Cognitive Search enrichment pipeline so that you can incrementally enrich documents from any of the supported data sources. By default, a skillset is stateless, and changing any part of its composition requires a full rerun of the indexer. With incremental enrichment, the indexer can determine which parts of the pipeline have changed, reusing existing enrichments for unchanged parts, and revising enrichments for the steps that do change. 

Cached content is placed in Azure Storage using account information that you provide. The container is named `ms-az-search-indexercache-<alpha-numerc-string>`. It should be considered as an internal component and must not be modified.

If you're not familiar with setting up indexers, start with [indexer overview](search-indexer-overview.md) and then continue on to [skillsets](cognitive-search-working-with-skillsets.md) to learn about enrichment pipelines. For more background on key concepts, see [incremental enrichment](cognitive-search-incremental-indexing-conceptual.md).

## Add to an existing indexer

If you have an existing indexer that has a skillset, follow these steps to enable incremental enrichment. As a one-time operation, you will have to reset (rerun) the indexer in full before incremental processing is allowed.

### Step 1: Get the indexer definition

Start with a valid, existing indexer that has these components: data source, skillset, index. Your indexer should be runnable. Using an API client, construct a [GET Indexer request](https://docs.microsoft.com/rest/api/searchservice/get-indexer) to get the current configuration of the indexer, to which you want to add incremental enrichment.

```http
GET https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

Copy the indexer definition from the response.

### Step 2: Modify the cache property

By default the `cache` property is null. Modify the cache object to include required and optional properties. 

The `storageConnectionString` is required, and it must be set to an Azure storage connection string. 

The `enableReprocessing` boolean property is optional (`true` by default), and enables reprocessing on all documents, existing and new alike. You should set it to `false` if you want to prioritize enrichment of new documents. While set to `false`, the indexer skips existing documents when applying the changes in the enrichment pipeline. Once the indexer is caught up with the new documents, flipping flag to true would then allow the indexer to start driving existing documents to eventual consistency. 

```json
{
    "name": "<YOUR-INDEXER-NAME>",
    "targetIndexName": "<YOUR-INDEX-NAME>",
    "dataSourceName": "<YOUR-DATASOURCE-NAME>",
    "skillsetName": "<YOUR-SKILLSET-NAME>",
    "cache" : {
        "storageConnectionString" : "<YOUR-STORAGE-ACCOUNT-CONNECTION-STRING>",
        "enableReprocessing": true
    },
    "fieldMappings" : [],
    "outputFieldMappings": [],
    "parameters": {
        "configuration": {
            "enableAnnotationCache": true
        }
    }
}
```

### Step 3: Reset the indexer

> [!NOTE]
> Resetting the indexer will result in all documents in your data source being processed again so that content can be cached. All cognitive enrichments will be re-run on all documents.
>

A reset of the indexer is required when setting up incremental enrichment for existing indexers to ensure all documents are in a consistent state. Use the [Reset Indexer REST API](https://docs.microsoft.com/rest/api/searchservice/reset-indexer) for this task.

```http
POST https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]/reset?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

### Step 4: Save the updated definition

Update the indexer definition with a PUT request, the body of the request should contain the updated indexer definition. If you get a 400, check the indexer definition to ensure it meets requirements (data source, skillset, index).

```http
PUT https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
{
    "name" : "<YOUR-INDEXER-NAME>",
    ...
    "cache": {
        "storageConnectionString": "<YOUR-STORAGE-ACCOUNT-CONNECTION-STRING>",
        "enableReprocessing": true
    }
}
```

### Step 5: Verify the update

If you now issue another GET request on the indexer, the response from the service will include an `ID` property in the cache object. The alphanumeric string is appended to the name of the container containing all the cached results and intermediate state of each document processed by this indexer.

    "cache": {
        "ID": "<ALPHA-NUMERIC STRING>",
        "enableReprocessing": true,
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<YOUR-STORAGE-ACCOUNT>;AccountKey=<YOUR-STORAGE-KEY>;EndpointSuffix=core.windows.net"
    }

In the Azure portal, verify that incremental enrichment is working and that you have a new container in Azure Blob storage to store the cache. The container is created after you modify a skillset and rerun the indexer. 

To modify a skillset, you can use the portal to edit the JSON definition. For example, if you are using language detection, a simple inline change from `en` to `es` or another language is sufficient for proof-of-concept testing of incremental enrichment.

To run indexer, you can also use the portal. From the indexers list, select the indexer and click **Run**.

After the indexer runs, you can find the cache in Azure blob storage. The container name is in the following format: `ms-az-search-indexercache-<YOUR-CACHE-ID>`

## Enable incremental enrichment on new indexers

To set up incremental enrichment for a new indexer, all you have to do is include the `cache` property in the indexer definition payload when creating the indexer. Remember to use the `2019-05-06-Preview` version of the API. 


```json
{
    "name": "<YOUR-INDEXER-NAME>",
    "targetIndexName": "<YOUR-INDEX-NAME>",
    "dataSourceName": "<YOUR-DATASOURCE-NAME>",
    "skillsetName": "<YOUR-SKILLSET-NAME>",
    "cache" : {
        "storageConnectionString" : "<YOUR-STORAGE-ACCOUNT-CONNECTION-STRING>",
        "enableReprocessing": true
    },
    "fieldMappings" : [],
    "outputFieldMappings": [],
    "parameters": {
        "configuration": {
            "enableAnnotationCache": true
        }
    }
}
```

## Overriding incremental enrichment

When configured, incremental enrichment tracks changes across your indexing pipeline and drives documents to eventual consistency across your index and projections. In some cases, you'll need to override this behavior to ensure the indexer doesn't do additional work as a result of an update to the indexing pipeline. For example, updating the datasource connection string will require an indexer reset and reindexing of all documents as the datasource has changed. But if you were only updating the connection string with a new key, you wouldn't want the change to result in any updates to existing documents. Conversely, you may want the indexer to invalidate the cache and enrich documents even if no changes to the indexing pipeline are made. For instance, you might want to invalidate the indexer if you were to redeploy a custom skill with a new model and wanted the skill rerun on all your documents.

### How to override reset requirement

When making changes to the indexing pipeline, any changes resulting in an invalidation of the cache requires an indexer reset. If you're making a change to the indexer pipeline and don't want the change tracking to invalidate the cache, you'll need to set the `ignoreResetRequirement` querystring parameter to `true` for operations on the indexer or datasource.

### How to override change detection

When making updates to the skillset that would result in documents being flagged as inconsistent, for example updating a custom skill URL when the skill is redeployed, set the `disableCacheReprocessingChangeDetection` query string parameter to `true` on skillset updates.

### How to force change detection

Instanced when you want the indexing pipeline to recognize a change to an external entity, like deploying a new version of a custom skill, you'll need to update the skillset and "touch" the specific skill by editing the skill definition, specifically the URL to force change detection and invalidate the cache for that skill.

## Next steps

This article covers incremental enrichment for indexers that include skillsets. To further round out your knowledge, review articles about re-indexing in general, applicable to all indexing scenarios in Azure Cognitive Search.

+ [How to rebuild an Azure Cognitive Search index](search-howto-reindex.md). 
+ [How to index large data sets in Azure Cognitive Search](search-howto-large-index.md). 
