---
title: Incremental enrichment (preview)
titleSuffix: Azure Cognitive Search
description: Cache intermediate content and incremental changes from AI enrichment pipeline in Azure Storage to preserve investments in existing processed documents. This feature is currently in public preview.

manager: nitinme
author: Vkurpad
ms.author: vikurpad
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/09/2020
---

# Introduction to incremental enrichment and caching in Azure Cognitive Search

> [!IMPORTANT] 
> Incremental enrichment is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no portal or .NET SDK support at this time.

Incremental enrichment adds caching and statefulness to an enrichment pipeline, preserving your investment in existing output, while changing only those documents impacted by particular modification. Not only does this preserve your monetary investment in processing (in particular, OCR and image processing) but it also makes for a more efficient system. When structures and content are cached, an indexer can determine which skills have changed and run only those that have been modified, as well as any downstream dependent skills. 

## Indexer cache

Incremental enrichment adds a cache to the enrichment pipeline. The indexer caches the results from document cracking plus the outputs of each skill for every document. When a skillset is updated, only the changed, or downstream, skills are rerun. The updated results are written to the cache and the document is updated in the search index or the knowledge store.

Physically, the cache is stored in a blob container in your Azure Storage account. All indexes within a search service may share the same storage account for the indexer cache. Each indexer is assigned a unique and immutable cache identifier to the container it is using.

## Cache configuration

You'll need to set the `cache` property on the indexer to start benefitting from incremental enrichment. The following example illustrates an indexer with caching enabled. Specific parts of this configuration are described in following sections. For more information, see [Set up incremental enrichment](search-howto-incremental-index.md).

```json
{
    "name": "myIndexerName",
    "targetIndexName": "myIndex",
    "dataSourceName": "myDatasource",
    "skillsetName": "mySkillset",
    "cache" : {
        "storageConnectionString" : "Your storage account connection string",
        "enableReprocessing": true
    },
    "fieldMappings" : [],
    "outputFieldMappings": [],
    "parameters": []
}
```

Setting this property on an existing indexer will require you to reset and rerun the indexer, which will result in all documents in your data source being processed again. This step is necessary to eliminate any documents enriched by previous versions of the skillset. 

## Cache management

The lifecycle of the cache is managed by the indexer. If the `cache` property on the indexer is set to null or the connection string is changed, the existing cache is deleted on the next indexer run. The cache lifecycle is also tied to the indexer lifecycle. If an indexer is deleted, the associated cache is also deleted.

While incremental enrichment is designed to detect and respond to changes with no intervention on your part, there are parameters you can use to override default behaviors:

+ Suspend caching
+ Bypass skillset checks
+ Bypass data source checks
+ Force skillset evaluation

### Suspend caching

You can temporarily suspend incremental enrichment by setting the `enableReprocessing` property in the cache to `false`, and later resume incremental enrichment and drive eventual consistency by setting it to `true`. This control is particularly useful when you want to prioritize indexing new documents over ensuring consistency across your corpus of documents.

### Bypass skillset evaluation

Modifying a skillset and reprocessing of that skillset typically go hand in hand. However, some changes to a skillset should not result in reprocessing (for example, deploying a custom skill to a new location or with a new access key). Most likely, these are peripheral modifications that have no genuine impact on the substance of the skillset itself. 

If you know that a change to the skillset is indeed superficial, you should override skillset evaluation by setting the `disableCacheReprocessingChangeDetection` parameter to `true`:

1. Call Update Skillset and modify the skillset definition.
1. Append the `disableCacheReprocessingChangeDetection=true` parameter on the request.
1. Submit the change.

Setting this parameter ensures that only updates to the skillset definition are committed and the change isn't evaluated for effects on the existing corpus.

The following example shows an Update Skillset request with the parameter:

```http
PUT https://customerdemos.search.windows.net/skillsets/callcenter-text-skillset?api-version=2019-05-06-Preview&disableCacheReprocessingChangeDetection=true
```

### Bypass data source validation checks

Most changes to a data source definition will invalidate the cache. However, for scenarios where you know that a change should not invalidate the cache - such as changing a connection string or rotating the key on the storage account - append the`ignoreResetRequirement` parameter on the data source update. Setting this parameter to `true` allows the commit to go through, without triggering a reset condition that would result in all objects being rebuilt and populated from scratch.

```http
PUT https://customerdemos.search.windows.net/datasources/callcenter-ds?api-version=2019-05-06-Preview&ignoreResetRequirement=true
```

### Force skillset evaluation

The purpose of the cache is to avoid unnecessary processing, but suppose you have made a change to a skill or skillset that the indexer doesn't detect (for example, changes to external components like a custom skillset). 

In this case, you can use the [Reset Skills](preview-api-resetskills.md) API to force reprocessing of a particular skill, including any downstream skills that have a dependency on that skill's output. This API accepts a POST request with a list of skills that should be invalidated and rerun. After Reset Skills, run the indexer to execute the operation.

## Change detection

Once you enable a cache, the indexer evaluates changes in your pipeline composition to determine which content can be reused and which needs reprocessing. This section enumerates changes that invalidate the cache outright, followed by changes that trigger incremental processing. 

### Changes that invalidate the cache

An invalidating change is one where the entire cache is no longer valid. An example of an invalidating change is one where your data source is updated. Here is the complete list of changes that would invalidate your cache:

* Change to your data source type
* Change to data source container
* Data source credentials
* Data source change detection policy
* Data sources delete detection policy
* Indexer field mappings
* Indexer parameters
    * Parsing Mode
    * Excluded File Name Extensions
    * Indexed File Name Extensions
    * Index storage metadata only for oversized documents
    * Delimited text headers
    * Delimited text delimiter
    * Document Root
    * Image Action (Changes to how images are extracted)

### Changes that trigger incremental processing

Incremental processing evaluates your skillset definition and determines which skills to rerun, selectively updating the affected portions of the document tree. Here is the complete list of changes resulting in incremental enrichment:

* Skill in the skillset has different type. The odata type of the skill is updated
* Skill-specific parameters updated, for example the url, defaults or other parameters
* Skill outputs changes, the skill returns additional or different outputs
* Skill updates resulting is different ancestry, skill chaining has changed i.e skill inputs
* Any upstream skill invalidation, if a skill that provides an input to this skill is updated
* Updates to the knowledge store projection location, results in reprojecting documents
* Changes to the knowledge store projections, results in reprojecting documents
* Output field mappings changed on an indexer results in reprojecting documents to the index

## API reference content for incremental enrichment

REST `api-version=2019-05-06-Preview` provides the APIs for incremental enrichment, with additions to indexers, skillsets, and data sources. [Official reference documentation](https://docs.microsoft.com/rest/api/searchservice/) is for generally available APIs and does not cover preview features. The following section provides the reference content for impacted APIs.

Usage information and examples can be found in [Configure caching for incremental enrichment](search-howto-incremental-index.md).

### Indexers

[Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer) and [Update Indexer](https://docs.microsoft.com/rest/api/searchservice/update-indexer) will now expose new properties relating to the cache:

+ `StorageAccountConnectionString`: The connection string to the storage account that will be used to cache the intermediate results.

+ `EnableReprocessing`: Set to `true` by default, when set to `false`, documents will continue to be written to the cache, but no existing documents will be reprocessed based on the cache data.

+ `ID` (read-only): The `ID` is the identifier of the container within the `annotationCache` storage account that will be used as the cache for this indexer. This cache will be unique to this indexer and if the indexer is deleted and recreated with the same name, the `ID` will be regenerated. The `ID` cannot be set, it is always generated by the service.

### Skillsets

+ [Update Skillset](https://docs.microsoft.com/rest/api/searchservice/update-skillset) supports a new parameter on the request: `disableCacheReprocessingChangeDetection`, which should be set to `true` when you want no updates to existing documents based on the current action.

+ [Reset Skills](preview-api-resetskills.md) is a new operation used to invalidate a skillset.

### Datasources

+ Some indexers retrieve data through queries. For queries that retrieve data, [Update Data Source](https://docs.microsoft.com/rest/api/searchservice/update-data-source) supports a new parameter on a request `ignoreResetRequirement`, which should be set to `true` when your update action should not invalidate the cache.

Use the `ignoreResetRequirement` sparingly as it could lead to unintended inconsistency in your data that will not be detected easily.

## Next steps

Incremental enrichment is a powerful feature that extends change tracking to skillsets and AI enrichment. As skillsets evolve, incremental enrichment ensures the least possible work is done while still driving your documents to eventual consistency.

Get started by adding a cache to an existing indexer or add the cache when defining a new indexer.

> [!div class="nextstepaction"]
> [Configure caching for incremental enrichment](search-howto-incremental-index.md)
