---
title: Add incremental enrichment (preview) 
titleSuffix: Azure Cognitive Search
description: Enable caching and preserve state of enriched content for controlled processing in a cognitive skillset. This feature is currently in public preview.
author: vkurpad 
manager: eladz
ms.author: vikurpad
ms.service: cognitive-search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 01/06/2020
---

# How to cache output and perform incremental enrichment in Azure Cognitive Search

> [!IMPORTANT] 
> Incremental enrichment is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no portal or .NET SDK support at this time.

This article shows you how to add caching to an enrichment pipeline so that you can incrementally modify steps without having to rebuild every time. By default, a skillset is stateless, and changing any part of its composition requires a full rerun of the indexer. With incremental enrichment, the indexer can determine which parts of the document tree need to be refreshed based on changes detected in the skillset or indexer definitions. Existing processed output is preserved and reused wherever possible. 

Cached content is placed in Azure Storage using account information that you provide. The container, named `ms-az-search-indexercache-<alpha-numerc-string>`, is created when you run the indexer. It should be considered an internal component managed by your search service and must not be modified.

If you're not familiar with setting up indexers, start with [indexer overview](search-indexer-overview.md) and then continue on to [skillsets](cognitive-search-working-with-skillsets.md) to learn about enrichment pipelines. For more background on key concepts, see [incremental enrichment](cognitive-search-incremental-indexing-conceptual.md).

## Enable caching on an existing indexer

If you have an existing indexer that already has a skillset, follow the steps in this section to add caching. As a one-time operation, you will have to reset and rerun the indexer in full before incremental processing can take effect.

> [!TIP]
> As proof-of-concept, you can run through this [portal quickstart](cognitive-search-quickstart-blob.md) to create necessary objects, and then use Postman or the portal to make your updates. You might want to attach a billable Cognitive Services resource. Running the indexer multiple times will exhaust the free daily allocation before you can complete all of the steps.

### Step 1: Get the indexer definition

Start with a valid, existing indexer that has these components: data source, skillset, index. Your indexer should be runnable. Using an API client, construct a [GET Indexer request](https://docs.microsoft.com/rest/api/searchservice/get-indexer) to get the current configuration of the indexer.

```http
GET https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

Copy the indexer definition from the response.

### Step 2: Modify the cache property in the indexer definition

By default the `cache` property is null. Use an API client to add cache configuration (the portal does not support this particulate update). 

Modify the cache object to include the following required and optional properties: 

+ The `storageConnectionString` is required, and it must be set to an Azure storage connection string. 
+ The `enableReprocessing` boolean property is optional (`true` by default), and it indicates that incremental enrichment is enabled. You can set it to `false` to suspend incremental processing while other resource-intensive operations, such as indexing new documents, are underway and then flip it back to `true` later.

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
    "parameters": []
}
```

### Step 3: Reset the indexer

A reset of the indexer is required when setting up incremental enrichment for existing indexers to ensure all documents are in a consistent state. You can use the portal or an API client and the [Reset Indexer REST API](https://docs.microsoft.com/rest/api/searchservice/reset-indexer) for this task.

```http
POST https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]/reset?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

### Step 4: Save the updated definition

Update the indexer definition with a PUT request, the body of the request should contain the updated indexer definition that has the cache property. If you get a 400, check the indexer definition to make sure all requirements are met (data source, skillset, index).

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

If you now issue another GET request on the indexer, the response from the service will include an `ID` property in the cache object. The alphanumeric string is appended to the name of the container containing all the cached results and intermediate state of each document processed by this indexer. The ID will be used to uniquely name the cache in Blob storage.

    "cache": {
        "ID": "<ALPHA-NUMERIC STRING>",
        "enableReprocessing": true,
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<YOUR-STORAGE-ACCOUNT>;AccountKey=<YOUR-STORAGE-KEY>;EndpointSuffix=core.windows.net"
    }

### Step 5: Run the indexer

To run indexer, you can also use the portal. From the indexers list, select the indexer and click **Run**. One advantage to using the portal is that you can monitor indexer status, note the duration of the job, and how many documents are processed. Portal pages are refreshed every few minutes.

Alternatively, you can use REST to run the indexer:

```http
POST https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]/run?api-version=2019-05-06-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

After the indexer runs, you can find the cache in Azure blob storage. The container name is in the following format: `ms-az-search-indexercache-<YOUR-CACHE-ID>`

> [!NOTE]
> A reset and re-run of the indexer results in a full rebuild so that content can be cached. All cognitive enrichments will be re-run on all documents.
>

### Step 6: Modify a skillset and confirm incremental enrichment

To modify a skillset, you can use the portal to edit the JSON definition. For example, if you are using text translation, a simple inline change from `en` to `es` or another language is sufficient for proof-of-concept testing of incremental enrichment.

Run the indexer again. Only those parts of an enriched document tree are updated. If you used the [portal quickstart](cognitive-search-quickstart-blob.md) as proof-of-concept, modifying the text translation skill to 'es', you'll notice that only 8 documents are updated instead of the original 14. Image files unaffected by the translation process are reused from cache.

## Enable incremental enrichment on new indexers

To set up incremental enrichment for a new indexer, all you have to do is include the `cache` property in the indexer definition payload when calling [Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer). Remember to use the `2019-05-06-Preview` version of the API when creating the indexer. 


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
    "parameters": []
    }
}
```

## How to manage the cache

When configured, incremental enrichment tracks changes across your indexing pipeline and drives documents to eventual consistency across your index and projections. 

While incremental enrichment comes with its own change detection logic for knowing when and what to reprocess, there are situations where you will want to override default behaviors:

+ Force a re-evaluation of skillset. You might make internal changes to a custom skillset that the indexer cannot detect. In this case, you can use the [Reset Skillset](https://docs.microsoft.com/rest/api/searchservice/reset-skillset) API to force reprocessing of a particular skill, including any downstream skills that have a dependency on that skill's output.

+ Bypass re-evaluation when making peripheral changes. In some cases, the change detection logic picks up on changes that shouldn't result in reprocessing. For example, changing the endpoint of a custom skill is an update to the `uri` property in a skillset definition, but it shouldn't result in reprocessing of content if the skill itself didn't change. Similarly, updates to a data source connection string, or changing a key, are inline edits that change a data source definition, but shouldn't invalidate the cache. You can set parameters on a request to suppress the change detection logic, while allowing a commit on a definition to go through. For more information about these scenarios, see [Cache management](cognitive-search-incremental-indexing-conceptual.md#cache-management).

## Next steps

Incremental enrichment is applicable on indexers that contain skillsets. As a next step, visit the skillset documentation to understand concepts and composition. 

Additionally, once you enable the cache, you will want to know about the parameters and APIs that factor into caching, including how to override or force particular behaviors. For more information, see the following links.

+ [Skillset concepts and composition](cognitive-search-working-with-skillsets.md)
+ [How to create a skillset](cognitive-search-defining-skillset.md)
+ [Introduction to incremental enrichment and caching](cognitive-search-incremental-indexing-conceptual.md)