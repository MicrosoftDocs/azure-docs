---
title: Incremental enrichment concepts (preview)
titleSuffix: Azure AI Search
description: Cache intermediate content and incremental changes from AI enrichment pipeline in Azure Storage to preserve investments in existing processed documents. This feature is currently in public preview.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 04/21/2023
---

# Incremental enrichment and caching in Azure AI Search

> [!IMPORTANT] 
> This feature is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [preview REST API](/rest/api/searchservice/index-preview) supports this feature.

*Incremental enrichment* refers to the use of cached enrichments during [skillset execution](cognitive-search-working-with-skillsets.md) so that only new and changed skills and documents incur AI processing. The cache contains the output from [document cracking](search-indexer-overview.md#document-cracking), plus the outputs of each skill for every document. Although caching is billable (it uses Azure Storage), the overall cost of enrichment is reduced because the costs of storage are less than image extraction and AI processing.

When you enable caching, the indexer evaluates your updates to determine whether existing enrichments can be pulled from the cache. Image and text content from the document cracking phase, plus skill outputs that are upstream or orthogonal to your edits, are likely to be reusable.

After performing the incremental enrichments as indicated by the skillset update, refreshed results are written back to the cache, and also to the search index or knowledge store.

## Cache configuration

Physically, the cache is stored in a blob container in your Azure Storage account, one per indexer. Each indexer is assigned a unique and immutable cache identifier that corresponds to the container it is using.

The cache is created when you specify the "cache" property and run the indexer. Only enriched content can be cached. If your indexer does not have an attached skillset, then caching does not apply. 

The following example illustrates an indexer with caching enabled. See [Enable enrichment caching](search-howto-incremental-index.md) for full instructions. Notice that when adding the cache property, use preview API version, 2020-06-30-Preview or later, on the request.

```json
POST https://[search service name].search.windows.net/indexers?api-version=2020-06-30-Preview
    {
        "name": "myIndexerName",
        "targetIndexName": "myIndex",
        "dataSourceName": "myDatasource",
        "skillsetName": "mySkillset",
        "cache" : {
            "storageConnectionString" : "<Your storage account connection string>",
            "enableReprocessing": true
        },
        "fieldMappings" : [],
        "outputFieldMappings": [],
        "parameters": []
    }
```

## Cache management

The lifecycle of the cache is managed by the indexer. If an indexer is deleted, its cache is also deleted. If the "cache" property on the indexer is set to null or the connection string is changed, the existing cache is deleted on the next indexer run. 

While incremental enrichment is designed to detect and respond to changes with no intervention on your part, there are parameters you can use to invoke specific behaviors:

+ [Prioritize new documents](#Prioritize-new-documents)
+ [Bypass skillset checks](#Bypass-skillset-checks)
+ [Bypass data source checks](#Bypass-data-source-check)
+ [Force skillset evaluation](#Force-skillset-evaluation)

<a name="Prioritize-new-documents"></a>

### Prioritize new documents

The "cache" property includes an "enableReprocessing" parameter. It's used to control processing over incoming documents already represented in the cache. When true (default), documents already in the cache are reprocessed when you rerun the indexer, assuming your skill update affects that doc. 

When false, existing documents are not reprocessed, effectively prioritizing new, incoming content over existing content. You should only set "enableReprocessing" to false on a temporary basis. Having "enableReprocessing" set to true most of the time ensures that all documents, both new and existing, are valid per the current skillset definition.

<a name="Bypass-skillset-checks"></a>

### Bypass skillset evaluation

Modifying a skill and reprocessing of that skill typically go hand in hand. However, some changes to a skill should not result in reprocessing (for example, deploying a custom skill to a new location or with a new access key). Most likely, these are peripheral modifications that have no genuine impact on the substance of the skill output itself. 

If you know that a change to the skill is indeed superficial, you should override skill evaluation by setting the "disableCacheReprocessingChangeDetection" parameter to true:

1. Call [Update Skillset](/rest/api/searchservice/update-skillset) and modify the skillset definition.
1. Append the "disableCacheReprocessingChangeDetection=true" parameter on the request.
1. Submit the change.

Setting this parameter ensures that only updates to the skillset definition are committed and the change isn't evaluated for effects on the existing cache. Use a preview API version, 2020-06-30-Preview or later.

```http
PUT https://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2020-06-30-Preview&disableCacheReprocessingChangeDetection
  
```

<a name="Bypass-data-source-check"></a>

### Bypass data source validation checks

Most changes to a data source definition will invalidate the cache. However, for scenarios where you know that a change should not invalidate the cache - such as changing a connection string or rotating the key on the storage account - append the "ignoreResetRequirement" parameter on the [data source update](/rest/api/searchservice/update-data-source). Setting this parameter to true allows the commit to go through, without triggering a reset condition that would result in all objects being rebuilt and populated from scratch.

```http
PUT https://[search service].search.windows.net/datasources/[data source name]?api-version=2020-06-30-Preview&ignoreResetRequirement
 
```

<a name="Force-skillset-evaluation"></a>

### Force skillset evaluation

The purpose of the cache is to avoid unnecessary processing, but suppose you make a change to a skill that the indexer doesn't detect (for example, changing something in external code, such as a custom skill).

In this case, you can use the [Reset Skills](/rest/api/searchservice/preview-api/reset-skills) to force reprocessing of a particular skill, including any downstream skills that have a dependency on that skill's output. This API accepts a POST request with a list of skills that should be invalidated and marked for reprocessing. After Reset Skills, follow with a [Run Indexer](/rest/api/searchservice/run-indexer) request to invoke the pipeline processing.

## Re-cache specific documents

[Resetting an indexer](/rest/api/searchservice/reset-indexer) will result in all documents in the search corpus being reprocessed. In scenarios where only a few documents need to be reprocessed, use [Reset Documents (preview)](/rest/api/searchservice/preview-api/reset-documents) to force reprocessing of specific documents. When a document is reset, the indexer invalidates the cache for that document, which is then reprocessed by reading it from the data source. For more information, see [Run or reset indexers, skills, and documents](search-howto-run-reset-indexers.md).

To reset specific documents, the request provides a list of document keys as read from the search index. If the key is mapped to a field in the external data source, the value that you provide should be the one used in the search index.

Depending on how you call the API, the request will either append, overwrite, or queue up the key list:

+ Calling the API multiple times with different keys appends the new keys to the list of document keys reset. 

+ Calling the API with the "overwrite" query string parameter set to true will overwrite the current list of document keys to be reset with the request's payload.

+ Calling the API only results in the document keys being added to the queue of work the indexer performs. When the indexer is next invoked, either as scheduled or on demand, it will prioritize processing the reset document keys before any other changes from the data source.

The following example illustrates a reset document request:

```http
POST https://[search service name].search.windows.net/indexers/[indexer name]/resetdocs?api-version=2020-06-30-Preview
    {
        "documentKeys" : [
            "key1",
            "key2",
            "key3"
        ]
    }
```

## Changes that invalidate the cache

Once you enable a cache, the indexer evaluates changes in your pipeline composition to determine which content can be reused and which needs reprocessing. This section enumerates changes that invalidate the cache outright, followed by changes that trigger incremental processing. 

An invalidating change is one where the entire cache is no longer valid. An example of an invalidating change is one where your data source is updated. Here is the complete list of changes to any part of the indexer pipeline that would invalidate your cache:

+ Changing the data source type
+ Changing data source container
+ Changing data source credentials
+ Changing data source change detection policy
+ Changing data source delete detection policy
+ Changing indexer field mappings
+ Changing indexer parameters:
  + Parsing Mode
  + Excluded File Name Extensions
  + Indexed File Name Extensions
  + Index storage metadata only for oversized documents
  + Delimited text headers
  + Delimited text delimiter
  + Document Root
  + Image Action (Changes to how images are extracted)

## Changes that trigger incremental processing

Incremental processing evaluates your skillset definition and determines which skills to rerun, selectively updating the affected portions of the document tree. Here is the complete list of changes resulting in incremental enrichment:

+ Changing the skill type (the OData type of the skill is updated)
+ Skill-specific parameters are updated, for example a URL, defaults, or other parameters
+ Skill output changes, the skill returns additional or different outputs
+ Skill input changes resulting in different ancestry, skill chaining has changed
+ Any upstream skill invalidation, if a skill that provides an input to this skill is updated
+ Updates to the knowledge store projection location, results in re-projecting documents
+ Changes to the knowledge store projections, results in re-projecting documents
+ Output field mappings changed on an indexer results in re-projecting documents to the index

## APIs used for caching

REST API version `2020-06-30-Preview` or later provides incremental enrichment through additional properties on indexers. Skillsets and data sources can use the generally available version. In addition to the reference documentation, see  [Configure caching for incremental enrichment](search-howto-incremental-index.md) for details about order of operations.

+ [Create or Update Indexer (api-version=2020-06-30-Preview)](/rest/api/searchservice/preview-api/create-or-update-indexer) 

+ [Update Skillset (api-version=2020-06-30)](/rest/api/searchservice/update-skillset) (New URI parameter on the request)

+ [Reset Skills (api-version=2020-06-30)](/rest/api/searchservice/preview-api/reset-skills)

+ [Update Data Source](/rest/api/searchservice/update-data-source), when called with a preview API version, provides a new parameter named "ignoreResetRequirement", which should be set to true when your update action should not invalidate the cache. Use "ignoreResetRequirement" sparingly as it could lead to unintended inconsistency in your data that will not be detected easily.

## Limitations

> [!CAUTION]
> If you're using the [SharePoint Online indexer (Preview)](search-howto-index-sharepoint-online.md), you should avoid incremental enrichment. Under certain circumstances, the cache becomes invalid, requiring an [indexer reset and run](search-howto-run-reset-indexers.md), should you choose to reload it.

## Next steps

Incremental enrichment is a powerful feature that extends change tracking to skillsets and AI enrichment. Incremental enrichment enables reuse of existing processed content as you iterate over skillset design. As a next step, enable caching on your indexers.

> [!div class="nextstepaction"]
> [Enable caching for incremental enrichment](search-howto-incremental-index.md)
