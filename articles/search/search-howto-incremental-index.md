---
title: Configure cache and incremental enrichment (preview) 
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

# How to configure caching for incremental enrichment in Azure Cognitive Search

> [!IMPORTANT] 
> Incremental enrichment is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API versions 2019-05-06-Preview and 2020-06-30-Preview](search-api-preview.md) provide this feature. There is no portal or .NET SDK support at this time.

This article shows you how to add caching to an enrichment pipeline so that you can incrementally modify steps without having to rebuild every time. By default, a skillset is stateless, and changing any part of its composition requires a full rerun of the indexer. With incremental enrichment, the indexer can determine which parts of the document tree need to be refreshed based on changes detected in the skillset or indexer definitions. Existing processed output is preserved and reused wherever possible. 

Cached content is placed in Azure Storage using account information that you provide. The container, named `ms-az-search-indexercache-<alpha-numerc-string>`, is created when you run the indexer. It should be considered an internal component managed by your search service and must not be modified.

If you're not familiar with setting up indexers, start with [indexer overview](search-indexer-overview.md) and then continue on to [skillsets](cognitive-search-working-with-skillsets.md) to learn about enrichment pipelines. For more background on key concepts, see [incremental enrichment](cognitive-search-incremental-indexing-conceptual.md).

## Enable caching on an existing indexer

If you have an existing indexer that already has a skillset, follow the steps in this section to add caching. As a one-time operation, you will have to reset and rerun the indexer in full before incremental processing can take effect.

> [!TIP]
> As proof-of-concept, you can run through this [portal quickstart](cognitive-search-quickstart-blob.md) to create necessary objects, and then use Postman or the portal to make your updates. You might want to attach a billable Cognitive Services resource. Running the indexer multiple times will exhaust the free daily allocation before you can complete all of the steps.

### Step 1: Get the indexer definition

Start with a valid, existing indexer that has these components: data source, skillset, index. Your indexer should be runnable. 

Using an API client, construct a [GET Indexer request](https://docs.microsoft.com/rest/api/searchservice/get-indexer) to get the current configuration of the indexer. When you use the preview API version to the GET the indexer, a `cache` property set to null is added to the definitions.

```http
GET https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

Copy the indexer definition from the response.

### Step 2: Modify the cache property in the indexer definition

By default the `cache` property is null. Use an API client to set the cache configuration (the portal does not support this particulate update). 

Modify the cache object to include the following required and optional properties: 

+ The `storageConnectionString` is required, and it must be set to an Azure storage connection string. 
+ The `enableReprocessing` boolean property is optional (`true` by default), and it indicates that incremental enrichment is enabled. When needed, you can set it to `false` to suspend incremental processing while other resource-intensive operations, such as indexing new documents, are underway and then flip it back to `true` later.

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
POST https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]/reset?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

### Step 4: Save the updated definition

[Update the indexer](https://docs.microsoft.com/rest/api/searchservice/preview-api/update-indexer) with a PUT request, the body of the request should contain the updated indexer definition that has the cache property. If you get a 400, check the indexer definition to make sure all requirements are met (data source, skillset, index).

```http
PUT https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]?api-version=2020-06-30-Preview
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

To run indexer, you can use the portal or the API. In the portal, from the indexers list, select the indexer and click **Run**. One advantage to using the portal is that you can monitor indexer status, note the duration of the job, and how many documents are processed. Portal pages are refreshed every few minutes.

Alternatively, you can use REST to [run the indexer](https://docs.microsoft.com/rest/api/searchservice/run-indexer):

```http
POST https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]/run?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

After the indexer runs, you can find the cache in Azure Blob storage. The container name is in the following format: `ms-az-search-indexercache-<YOUR-CACHE-ID>`

> [!NOTE]
> A reset and rerun of the indexer results in a full rebuild so that content can be cached. All cognitive enrichments will be rerun on all documents.
>

### Step 6: Modify a skillset and confirm incremental enrichment

To modify a skillset, you can use the portal or the API. For example, if you are using text translation, a simple inline change from `en` to `es` or another language is sufficient for proof-of-concept testing of incremental enrichment.

Run the indexer again. Only those parts of an enriched document tree are updated. If you used the [portal quickstart](cognitive-search-quickstart-blob.md) as proof-of-concept, modifying the text translation skill to 'es', you'll notice that only 8 documents are updated instead of the original 14. Image files unaffected by the translation process are reused from cache.

## Enable caching on new indexers

To set up incremental enrichment for a new indexer, all you have to do is include the `cache` property in the indexer definition payload when calling [Create Indexer (2020-06-30-Preview)](https://docs.microsoft.com/rest/api/searchservice/preview-api/create-indexer). 


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

## Checking for cached output

The cache is created, used, and managed by the indexer, and its contents are not represented in a format that is human readable. The best way to determine whether the cache is used is by running the indexer and compare before-and-after metrics for execution time and document counts. 

For example, assume a skillset that starts with image analysis and Optical Character Recognition (OCR) of scanned documents, followed by downstream analysis of the resulting text. If you modify a downstream text skill, the indexer can retrieve all of the previously processed image and OCR content from cache, updating and processing just text-related changes indicated by your edits. You can expect to see fewer documents in the document count (for example 8/8 as opposed to 14/14 in the original run), shorter execution times, and fewer charges on your bill.

## Working with the cache

Once the cache is operational, indexers check the cache whenever [Run Indexer](https://docs.microsoft.com/rest/api/searchservice/run-indexer) is called, to see which parts of the existing output can be used. 

The following table summarizes how various APIs relate to the cache:

| API           | Cache impact     |
|---------------|------------------|
| [Create Indexer (2020-06-30-Preview)](https://docs.microsoft.com/rest/api/searchservice/preview-api/create-indexer) | Creates and runs an indexer on first use, including creating a cache if your indexer definition specifies it. |
| [Run Indexer](https://docs.microsoft.com/rest/api/searchservice/run-indexer) | Executes an enrichment pipeline on demand. This API reads from the cache if it exists, or creates a cache if you added caching to an updated indexer definition. When you run an indexer that has caching enabled, the indexer omits steps if cached output can be used. You can use the generally available or preview API version of this API.|
| [Reset Indexer](https://docs.microsoft.com/rest/api/searchservice/reset-indexer)| Clears the indexer of any incremental indexing information. The next indexer run (either on-demand or schedule) is full reprocessing from scratch, including re-running all skills and rebuilding the cache. It is functionally equivalent to deleting the indexer and recreating it. You can use the generally available or preview API version of this API.|
| [Reset Skills](https://docs.microsoft.com/rest/api/searchservice/reset-skills) | Specifies which skills to rerun on the next indexer run, even if you haven't modified any skills. The cache is updated accordingly. Outputs, such as a knowledge store or search index, are refreshed using reusable data from the cache plus new content per the updated skill. |

For more information about controlling what happens to the cache, see [Cache management](cognitive-search-incremental-indexing-conceptual.md#cache-management).

## Next steps

Incremental enrichment is applicable on indexers that contain skillsets. As a next step, visit the skillset documentation to understand concepts and composition. 

Additionally, once you enable the cache, you will want to know about the parameters and APIs that factor into caching, including how to override or force particular behaviors. For more information, see the following links.

+ [Skillset concepts and composition](cognitive-search-working-with-skillsets.md)
+ [How to create a skillset](cognitive-search-defining-skillset.md)
+ [Introduction to incremental enrichment and caching](cognitive-search-incremental-indexing-conceptual.md)
