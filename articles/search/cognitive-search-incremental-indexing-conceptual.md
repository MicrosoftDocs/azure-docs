---
title: Introduction to Incremental Indexing (preview) - Azure Search
description: Configure your AI enrichment pipeline to drive your data to eventual consistency to handle any updates to skills, skillsets, indexers, or data sources
manager: nitinme
author: Vkurpad
services: search
ms.service: search
ms.subservice: cognitive-search
ms.topic: overview
ms.date: 10/11/2019
ms.author: vikurpad

---

# What is incremental indexing in Azure Search?

> [!Note]
> Incremental indexing is in preview and not intended for production use. The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no .NET SDK support at this time.
>

Incremental indexing is a feature of Azure Search that brings a declarative approach to indexing your data. Indexers in Azure Search add documents to your search index from a data source. Indexers track updates to the documents in your data sources and update the index with the new or updated documents from the data source. Indexers can be executed on a recurring schedule ensuring the data source and the index are eventually consistent. Incremental indexing is a new feature that extends change tracking from only the data source to all aspects of the enrichment pipeline. With incremental indexing, the indexer will drive your documents to eventual consistency with your data source, the current version of your skillset, and the indexer.

Indexers have a few key characteristics:

1. Data source specific
2. State aware
3. Can be configured to drive eventual consistency between your data source and index.

Previously, you were responsible for determining the appropriate action when a skill was modified. When you added or update a skill, you had to choose between rerunning all the skills on the entire corpus or tolerating version drift. Rerunning all the skills essentially reset your indexer. Version drift could lead to different documents in your index being enriched with different versions of your skillset.

With the latest update to the preview release of the API (version 2019-05-06-Preview), the indexer's state management has improved. Now, state management includes not only the data source and indexer field mappings but also the skillset, output field mappings, and projections. Incremental indexing vastly improves the efficiency of your enrichment pipeline. It eliminates the painful choice between the time and money of a complete rerun and the potential confusion of version drift.

Indexers now track and respond to changes across your enrichment pipeline. Indexers now can determine which skills have changed and run only those that have been modified and their downstream dependent skills.

By using incremental indexing, all documents in your index will be processed with the current version of your enrichment pipeline with the least amount of work. For scenarios where you want full control, you can use fine-grained controls to determine how a change is handled.

## Indexer cache

Incremental indexing adds an indexer cache to the enrichment pipeline. The indexer caches the results from document cracking and the outputs of each skills for every document. When a data source needs to be reindexed due to a skillset update (new or updated skill), only the affected skills, changed, or downstream of the changes are rerun. The updated results are written to the cache and the document is updated in the index and the knowledge store.

Physically, the cache is a storage account. All indexes within a search service may share the same storage account for the indexer cache. Each indexer is assigned a unique and immutable cache IDentifier.

### Cache configuration

You'll need to set the cache property on the indexer to start benefitting from incremental indexing. Setting this property for the first time will require you to also reset your indexer, `which will result in all documents in your data source being processed again`. The goal of incremental indexing is to make the documents in your index consistent with your data source as defined by the current version of your skillset. Resetting the index is the first step toward this consistency by eliminating any documents enriched by previous versions of the skillset. The indexer needs to be reset to start with a consistent baseline.

### Cache lifecycle

The lifecycle of the cache is managed by the indexer. If the cache property in the indexer is set to null or the connection string changed, the existing cache is deleted. The cache lifecycle is also tied to the indexer lifecycle and if an indexer is deleted, the associated cache is also deleted.

```json
{
    "name": "myIndexerName",
    "targetIndexName": "myIndex",
    "dataSourceName": "myDatasource",
    "skillsetName": "mySkillset",
    "cache" : {
        "storageConnectionString" : "Your storage account connection string",
        "enableReprocessing": true,
        "id" : "Auto generated Id you do not need to set"
    },
    "fieldMappings" : [],
    "outputFieldMappings": [],
    "parameters":{}
}

```

## Indexer cache mode

The indexer cache can operate in modes where data is only written to the cache or data is written to the cache and used to re-enrich documents.  You can temporarily suspend incremental enrichment by setting the `enableReprocessing` property in the cache to `false`, and later resume incremental enrichment and drive eventual consistency by setting it to `true`. This control is particularly useful when you want to prioritize indexing new documents over ensuring consistency across your corpus of documents.

## Change-detection override

Incremental indexing gives you granular control over all aspects of the enrichment pipeline. This control allows you to deal with situations where a change might have unintended consequences. For example, editing a skillset and updating the URL for a custom skill will result in the indexer invalidating the cached results for that skill. If you're only moving the endpoint to a different VM or redeploying your skill with a new access key, you really don’t want any existing documents reprocessed.

To ensure that the indexer only performs enrichments you explicitly require, updates to the skillset can optionally set `disableCacheReprocessingChangeDetection` query string parameter to `true`. When set, this parameter will ensure that only updates to the skillset are committed and the change is not evaluated for effects on the existing corpus.

## Cache invalidation

The converse of that scenario is one where you may deploy a new version of a custom skill, nothing within the enrichment pipeline changes, but you need a specific skill invalidated and all affected documents reprocessed to reflect the benefits of an updated model. In such instances, you can call the invalidate skills operation on the skillset. The reset skills API accepts a POST request with the list of skill outputs in the cache that should be invalidated. For more information on the reset skills API, see the documentation [tk](tk).

## Change detection

Indexers not only move forward and process new documents but are now able to move backwards and drive previously processed documents to consistency. With this new capability, it's important to understand how changes to your enrichment pipeline components result in indexer work. The indexer will queue work to be done when it identifies a change that is either invalidating or inconsistent.

### Invalidating changes

Invalidating changes are rare but have a significant effect on the state of your enrichment pipeline. An invalidating change is one where the entire cache is no longer valid. An example of an invalidating change is one where your data source is updated. For scenarios when you know that the change should not invalidate the cache, like rotating the key on the storage account, the `ignoreResetRequirement` query string parameter should be set to `true` on the update operation of the specific resource to ensure that the operation is not rejected.

Here is the complete list of changes that would invalidate your cache:

1. Change to your data source type
2. Change to data source container
3. Data source credentials
4. Data source change detection policy
5. Data sources delete detection policy
6. Indexer field mappings
7. Indexer parameters
    1. Parsing Mode
    2. Excluded File Name Extensions
    3. Indexed File Name Extensions
    4. Index storage metadata only for oversized documents
    5. Delimited text headers
    6. Delimited text delimiter
    7. Document Root
    8. Image Action (Changes to how images are extracted)

### Inconsistent changes

An example of inconsistent change is an update to your skillset that modifies a skill. The modification can make a portion of the cache inconsistent. The indexer will identify the work to make things consistent again.  

The complete list of changes resulting in cache inconsistency:

1. Skill in the skillset has different type. The odata type of the skill is updated
2. Skill-specific parameters updated, for example the url, defaults or other parameters
3. Skill outputs changes, the skill returns additional or different outputs
4. Skill updates resulting is different ancestry, skill chaining has changed i.e skill inputs
5. Any upstream skill invalidation, if a skill that provides an input to this skill is updated
6. Updates to the knowledge store projection location, results in reprojecting documents
7. Changes to the knowledge store projections, results in reprojecting documents
8. Output field mappings changed on an indexer results in reprojecting documents to the index

## Updates To existing APIs

Introducing incremental indexing and enrichment will result in an update to some existing APIs.

### Indexers

Indexers will now expose a new property:

1. Cache
    1. StorageAccountConnectionString: The connection string to the storage account that will be used to cache the intermediate results.
    2. CacheId: The `cacheId` is the identifier of the container within the annotationCache storage account that will be used as the cache for this indexer. This cache will be unique to this indexer and if the indexer is deleted and recreated with the same name, the `cacheId` will be regenerated. The `cacheId` cannot be set, it is always generated by the service.
    3. EnableReprocessing: Set to `true` by default, when set to `false`, documents will continue to be written to the cache, but no existing documents will be reprocessed based on the cache data.

Indexers will also support a new querystring parameter:

1. `ignoreResetRequirement` set to `true` when your update action  version of the skill

### Skillsets

Skillsets will not support any new operations, but will support new querystring parameter:

1. `disableCacheReprocessingChangeDetection` set to `true` when you want no updates to on existing documents based on the current action.

### Datasources

Datasources will not support any new operations, but will support new querystring parameter:

1. `ignoreResetRequirement` set to `true` when your update action  version of the skill

## Best practices

The recommended approach to using incremental indexing is to configure incremental indexing by setting the cache property on a new indexer or reset an existing indexer and set the cache property.

Use the ignoreResetRequirement sparingly as it could lead to unintended inconsistency in your data that will not be detected easily.

## Takeaways

Incremental indexing is a powerful feature in which you declaratively ensure your document and search data are always consistent. As your skills, skillsets, or enrichments evolve, the enrichment pipeline ensures the least possible work is done while still driving your documents to eventual consistency.

## Next steps

Get started with incremental indexing by adding a cache to an existing indexer or add the cache when defining a new indexer.

> [!div class="nextstepaction"]
> [Reference: Create Indexer](cognitive-search-quickstart-blob.md)
