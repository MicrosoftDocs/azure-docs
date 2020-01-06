---
title: Incremental enrichment (preview)
titleSuffix: Azure Cognitive Search
description: Cache intermediate content and incremental changes from AI enrichment pipeline in Azure Storage to preserve investments in existing processed documents. This feature is currently in public preview.

manager: nitinme
author: Vkurpad
ms.author: vikurpad
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/06/2020
---

# Introduction to incremental enrichment in Azure Cognitive Search

> [!IMPORTANT] 
> Incremental enrichment is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no portal or .NET SDK support at this time.

Incremental enrichment adds caching and statefulness to an enrichment pipeline, preserving your investment in existing output, while changing only those documents impacted by particular modification. Not only does this preserve your monetary investment in processing, but it also makes for a more efficient system. When structures and content are cached, an indexer can determine which skills have changed and run only those that have been modified, as well as any downstream dependent skills. 

With incremental enrichment, the current version of the enrichment pipeline does the least amount of work to guarantee consistency for all documents in your index. For scenarios where you want full control, you can use fine-grained controls to override the expected behaviors. For more information about configuration, see [Set up incremental enrichment](search-howto-incremental-index.md).

## Indexer cache

Incremental enrichment adds a cache to the enrichment pipeline. The indexer caches the results from document cracking plus the outputs of each skill for every document. When a skillset is updated, only the changed, or downstream, skills are rerun. The updated results are written to the cache and the document is updated in the search index or the knowledge store.

Physically, the cache is a blob container in your Azure Storage account. All indexes within a search service may share the same storage account for the indexer cache. Each indexer is assigned a unique and immutable cache identifier to the container it is using.

### Cache configuration

You'll need to set the `cache` property on the indexer to start benefitting from incremental enrichment. The following example illustrates an indexer with caching enabled. Specific parts of this configuration are described in following sections. For more information, see [How to set up incremental enrichment](search-howto-incremental-index.md).

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
    "parameters": {}
}
```

Setting this property for the first time on an existing indexer will require you to reset and rerun the indexer, which will result in all documents in your data source being processed again. Resetting the indexer eliminates any documents enriched by previous versions of the skillset. 

### Cache lifecycle

The lifecycle of the cache is managed by the indexer. If the `cache` property on the indexer is set to null or the connection string is changed, the existing cache is deleted. The cache lifecycle is also tied to the indexer lifecycle. If an indexer is deleted, the associated cache is also deleted.

### Indexer cache mode

The indexer cache can operate in modes where data is only written to the cache or data is written to the cache and used to re-enrich documents. You can temporarily suspend incremental enrichment by setting the `enableReprocessing` property in the cache to `false`, and later resume incremental enrichment and drive eventual consistency by setting it to `true`. This control is particularly useful when you want to prioritize indexing new documents over ensuring consistency across your corpus of documents.

## Change-detection override

Incremental indexing gives you granular control over all aspects of the enrichment pipeline. This control allows you to deal with situations where a change might have unintended consequences. For example, editing a skillset or updating the URL for a custom skill will result in the indexer invalidating the cached results for that skill. If you're only moving the endpoint to a different VM or redeploying your skill with a new access key, you really don’t want any existing documents reprocessed.

To ensure that the indexer only does enrichments you explicitly require, updates to the skillset can optionally set the `disableCacheReprocessingChangeDetection` parameter. When set to `true`, this parameter will ensure that only updates to the skillset definition are committed and the change isn't evaluated for effects on the existing corpus.

The following example shows an update request with the parameter. 

```http
PUT https://customerdemos.search.windows.net/skillsets/callcenter-text-skillset?api-version=2019-05-06-Preview&disableCacheReprocessingChangeDetection=true
```

## Cache invalidation

The converse of that scenario is one where you may deploy a new version of a custom skill; nothing within the enrichment pipeline changes, but you need a specific skill invalidated and all affected documents reprocessed to reflect the benefits of an updated model. In such instances, you can call the invalidate skills operation on the skillset. The Update Skillset API accepts a POST request with the list of skill outputs in the cache that should be invalidated. For more information, see [Update Skillset](https://docs.microsoft.com/rest/api/searchservice/update-skillset).

## Change detection

Indexers not only move forward and process new documents, but are now able to move backwards and drive previously processed documents to consistency. With this new capability, it's important to understand how changes to your enrichment pipeline impact indexer workflows. The indexer will queue work to be done when it identifies a change that is either invalidating or inconsistent relative to the cached content.

### Invalidating changes

Invalidating changes are rare but have a significant effect on the state of your enrichment pipeline. An invalidating change is one where the entire cache is no longer valid. An example of an invalidating change is one where your data source is updated. For scenarios when you know that the change should not invalidate the cache, like rotating the key on the storage account, the `ignoreResetRequirement` parameter should be set to `true` on the update operation of the specific resource to ensure that the operation is not rejected.

Here is the complete list of changes that would invalidate your cache:

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

### Inconsistent changes

An example of inconsistent change is an update to your skillset that modifies a skill. The modification can make a portion of the cache inconsistent. The indexer will identify the work to make things consistent again.  

The complete list of changes resulting in cache inconsistency:

* Skill in the skillset has different type. The odata type of the skill is updated
* Skill-specific parameters updated, for example the url, defaults or other parameters
* Skill outputs changes, the skill returns additional or different outputs
* Skill updates resulting is different ancestry, skill chaining has changed i.e skill inputs
* Any upstream skill invalidation, if a skill that provides an input to this skill is updated
* Updates to the knowledge store projection location, results in reprojecting documents
* Changes to the knowledge store projections, results in reprojecting documents
* Output field mappings changed on an indexer results in reprojecting documents to the index

## REST API reference for incremental enrichment

REST `api-version=2019-05-06-Preview` provides the APIs for incremental enrichment, with additions to indexers, skillsets, and data sources. Reference documentation does not currently include these additions. The following section describes API changes.

### Indexers

[Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer) and [Update Indexer](https://docs.microsoft.com/rest/api/searchservice/update-indexer) will now expose new properties relating to the cache:

* `StorageAccountConnectionString`: The connection string to the storage account that will be used to cache the intermediate results.

* `ID`: The `ID` is the identifier of the container within the `annotationCache` storage account that will be used as the cache for this indexer. This cache will be unique to this indexer and if the indexer is deleted and recreated with the same name, the `ID` will be regenerated. The `ID` cannot be set, it is always generated by the service.

* `EnableReprocessing`: Set to `true` by default, when set to `false`, documents will continue to be written to the cache, but no existing documents will be reprocessed based on the cache data.

Some indexers (via [data sources](https://docs.microsoft.com/rest/api/searchservice/create-data-source)) retrieve data through queries. For queries that retrieve data, indexers will also support a new query string parameter: `ignoreResetRequirement` should be set to `true` when your update action should not invalidate the cache.

### Skillsets

Skillsets will not support any new operations, but will support a new querystring parameter: `disableCacheReprocessingChangeDetection` should be set to `true` when you want no updates to existing documents based on the current action.

### Datasources

Datasources will not support any new operations, but will support a new querystring parameter: `ignoreResetRequirement` should be set to `true` when your update action should not invalidate the cache.

Use the `ignoreResetRequirement` sparingly as it could lead to unintended inconsistency in your data that will not be detected easily.

## Next steps

Incremental enrichment is a powerful feature that extends change tracking to skillsets and AI enrichment. As skillsets evolve, incremental enrichment ensures the least possible work is done while still driving your documents to eventual consistency.

Get started with incremental enrichment by adding a cache to an existing indexer or add the cache when defining a new indexer.

> [!div class="nextstepaction"]
> [Set up incremental enrichment](search-howto-incremental-index.md)
