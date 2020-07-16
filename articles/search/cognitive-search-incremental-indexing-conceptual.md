---
title: Incremental enrichment concepts (preview)
titleSuffix: Azure Cognitive Search
description: Cache intermediate content and incremental changes from AI enrichment pipeline in Azure Storage to preserve investments in existing processed documents. This feature is currently in public preview.

manager: nitinme
author: Vkurpad
ms.author: vikurpad
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/18/2020
---

# Incremental enrichment and caching in Azure Cognitive Search

> [!IMPORTANT] 
> Incremental enrichment is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API versions 2019-05-06-Preview and 2020-06-30-Preview](search-api-preview.md) provide this feature. There is no portal or .NET SDK support at this time.

*Incremental enrichment* is a feature that targets [skillsets](cognitive-search-working-with-skillsets.md). It leverages Azure Storage to save the processing output emitted by an enrichment pipeline for reuse in future indexer runs. Wherever possible, the indexer reuses any cached output that is still valid. 

Not only does incremental enrichment preserve your monetary investment in processing (in particular, OCR and image processing) but it also makes for a more efficient system. When structures and content are cached, an indexer can determine which skills have changed and run only those that have been modified, as well as any downstream dependent skills. 

A workflow that uses incremental caching includes the following steps:

1. [Create or identify an Azure storage account](../storage/common/storage-account-create.md) to store the cache.
1. [Enable incremental enrichment](search-howto-incremental-index.md) in the indexer.
1. [Create an indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer) - plus a [skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset) - to invoke the pipeline. During processing, stages of enrichment are saved for each document in Blob storage for future use.
1. Test your code, and after making changes, use [Update Skillset](https://docs.microsoft.com/rest/api/searchservice/update-skillset) to modify a definition.
1. [Run Indexer](https://docs.microsoft.com/rest/api/searchservice/run-indexer) to invoke the pipeline, retrieving cached output for faster and more cost-effective processing.

For more information about steps and considerations when working with an existing indexer, see [Set up incremental enrichment](search-howto-incremental-index.md).

## Indexer cache

Incremental enrichment adds a cache to the enrichment pipeline. The indexer caches the results from document cracking plus the outputs of each skill for every document. When a skillset is updated, only the changed, or downstream, skills are rerun. The updated results are written to the cache and the document is updated in the search index or the knowledge store.

Physically, the cache is stored in a blob container in your Azure Storage account. The cache also uses table storage for an internal record of processing updates. All indexes within a search service may share the same storage account for the indexer cache. Each indexer is assigned a unique and immutable cache identifier to the container it is using.

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

+ Prioritize new documents
+ Bypass skillset checks
+ Bypass data source checks
+ Force skillset evaluation

### Prioritize new documents

Set the `enableReprocessing` property to control processing over incoming documents already represented in the cache. When `true` (default), documents already in the cache are reprocessed when you rerun the indexer, assuming your skill update affects that doc. 

When `false`, existing documents are not reprocessed, effectively prioritizing new, incoming content over existing content. You should only set `enableReprocessing` to `false` on a temporary basis. To ensure consistency across the corpus, `enableReprocessing` should be `true` most of the time, ensuring that all documents, both new and existing, are valid per the current skillset definition.

### Bypass skillset evaluation

Modifying a skillset and reprocessing of that skillset typically go hand in hand. However, some changes to a skillset should not result in reprocessing (for example, deploying a custom skill to a new location or with a new access key). Most likely, these are peripheral modifications that have no genuine impact on the substance of the skillset itself. 

If you know that a change to the skillset is indeed superficial, you should override skillset evaluation by setting the `disableCacheReprocessingChangeDetection` parameter to `true`:

1. Call Update Skillset and modify the skillset definition.
1. Append the `disableCacheReprocessingChangeDetection=true` parameter on the request.
1. Submit the change.

Setting this parameter ensures that only updates to the skillset definition are committed and the change isn't evaluated for effects on the existing corpus.

The following example shows an Update Skillset request with the parameter:

```http
PUT https://customerdemos.search.windows.net/skillsets/callcenter-text-skillset?api-version=2020-06-30-Preview&disableCacheReprocessingChangeDetection=true
```

### Bypass data source validation checks

Most changes to a data source definition will invalidate the cache. However, for scenarios where you know that a change should not invalidate the cache - such as changing a connection string or rotating the key on the storage account - append the`ignoreResetRequirement` parameter on the data source update. Setting this parameter to `true` allows the commit to go through, without triggering a reset condition that would result in all objects being rebuilt and populated from scratch.

```http
PUT https://customerdemos.search.windows.net/datasources/callcenter-ds?api-version=2020-06-30-Preview&ignoreResetRequirement=true
```

### Force skillset evaluation

The purpose of the cache is to avoid unnecessary processing, but suppose you make a change to a skill that the indexer doesn't detect (for example, changing something in external code, such as a custom skill).

In this case, you can use the [Reset Skills](https://docs.microsoft.com/rest/api/searchservice/reset-skills) to force reprocessing of a particular skill, including any downstream skills that have a dependency on that skill's output. This API accepts a POST request with a list of skills that should be invalidated and marked for reprocessing. After Reset Skills, run the indexer to invoke the pipeline.

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

## API reference

REST API version `2020-06-30-Preview` provides incremental enrichment through additional properties on indexers. Skillsets and data sources can use the generally available version. In addition to the reference documentation, see  [Configure caching for incremental enrichment](search-howto-incremental-index.md) for details on how to call the APIs.

+ [Create Indexer (api-version=2020-06-30-Preview)](https://docs.microsoft.com/rest/api/searchservice/2019-05-06-preview/create-indexer) 

+ [Update Indexer (api-version=2020-06-30-Preview)](https://docs.microsoft.com/rest/api/searchservice/2019-05-06-preview/update-indexer) 

+ [Update Skillset (api-version=2020-06-30)](https://docs.microsoft.com/rest/api/searchservice/update-skillset) (New URI parameter on the request)

+ [Reset Skills (api-version=2020-06-30)](https://docs.microsoft.com/rest/api/searchservice/reset-skills)

+ Database indexers (Azure SQL, Cosmos DB). Some indexers retrieve data through queries. For queries that retrieve data, [Update Data Source](https://docs.microsoft.com/rest/api/searchservice/update-data-source) supports a new parameter on a request **ignoreResetRequirement**, which should be set to `true` when your update action should not invalidate the cache. 

  Use **ignoreResetRequirement** sparingly as it could lead to unintended inconsistency in your data that will not be detected easily.

## Next steps

Incremental enrichment is a powerful feature that extends change tracking to skillsets and AI enrichment. AIncremental enrichment enables reuse of existing processed content as you iterate over skillset design.

As a next step, enable caching on an existing indexer or add a cache when defining a new indexer.

> [!div class="nextstepaction"]
> [Configure caching for incremental enrichment](search-howto-incremental-index.md)
