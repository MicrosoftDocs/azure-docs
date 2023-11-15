---
title: Enable caching for incremental enrichment (preview)
titleSuffix: Azure AI Search
description: Enable caching of enriched content for potential reuse when modifying downstream skills and projections in an AI enrichment pipeline.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/31/2023
---

# Enable caching for incremental enrichment in Azure AI Search

> [!IMPORTANT] 
> This feature is in public preview under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [preview REST API](/rest/api/searchservice/index-preview) supports this feature

This article explains how to add caching to an enrichment pipeline so that you can modify downstream enrichment steps without having to rebuild in full every time. By default, a skillset is stateless, and changing any part of its composition requires a full rerun of the indexer. With an [**enrichment cache**](cognitive-search-incremental-indexing-conceptual.md), the indexer can determine which parts of the document tree must be refreshed based on changes detected in the skillset or indexer definitions. Existing processed output is preserved and reused wherever possible. 

Cached content is placed in Azure Storage using account information that you provide. The container, named `ms-az-search-indexercache-<alpha-numerc-string>`, is created when you run the indexer. It should be considered an internal component managed by your search service and must not be modified.

If you're not familiar with setting up indexers, start with [indexer overview](search-indexer-overview.md) and then continue on to [skillsets](cognitive-search-working-with-skillsets.md) to learn about enrichment pipelines. For more background on key concepts, see [incremental enrichment](cognitive-search-incremental-indexing-conceptual.md).

## Prerequisites

Azure Storage is used to store cached enrichments. The storage account must be [general purpose v2](../storage/common/storage-account-overview.md#types-of-storage-accounts).

Preview APIs or beta Azure SDKs are required for enabling cache on an indexer. The portal does not currently provide an option for caching enrichment.

> [!CAUTION]
> If you're using the [SharePoint Online indexer (Preview)](search-howto-index-sharepoint-online.md), you should avoid incremental enrichment. Under certain circumstances, the cache becomes invalid, requiring an [indexer reset and run](search-howto-run-reset-indexers.md), should you choose to reload it.

## Enable on new indexers

On new indexers, add the "cache" property in the indexer definition payload when calling [Create or Update Indexer (2021-04-30-Preview)](/rest/api/searchservice/preview-api/create-or-update-indexer). You can also use the previous preview API version, 2020-06-30-Preview.

```https
POST https://[service name].search.windows.net/indexers?api-version=2021-04-30-Preview
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

## Enable on existing indexers

For existing indexers that already have a skillset, use the following steps to add caching. As a one-time operation, reset and rerun the indexer in full to load the cache.

### Step 1: Get the indexer definition

Start with a valid, work indexer that has these components: data source, skillset, index. Using an API client, send a [GET Indexer](/rest/api/searchservice/get-indexer) request to retrieve the indexer. When you use the preview API version to the GET the indexer, a "cache" property set to null is added to the definition automatically.

```http
GET https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]?api-version=2021-04-30-Preview
    Content-Type: application/json
    api-key: [YOUR-ADMIN-KEY]
```

### Step 2: Set the cache property

In the index definition, modify "cache" to include the following required and optional properties:

+ (Required) `storageConnectionString` must be set to an Azure Storage connection string.
+ (Optional) `enableReprocessing` boolean property (`true` by default), indicates that incremental enrichment is enabled. Set to `false` if you want to suspend incremental processing while other resource-intensive operations, such as indexing new documents, are underway and then switch back to `true` later.

```http
POST https://[service name].search.windows.net/indexers?api-version=2021-04-30-Preview
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

[Reset Indexer](/rest/api/searchservice/reset-indexer) is required when setting up incremental enrichment for existing indexers to ensure all documents are in a consistent state. You can use the portal or an API client for this task.

```https
POST https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]/reset?api-version=2021-04-30-Preview
    Content-Type: application/json
    api-key: [YOUR-ADMIN-KEY]
```

### Step 4: Save the indexer

[Update Indexer (2021-04-30-Preview)](/rest/api/searchservice/preview-api/create-or-update-indexer) with a PUT request, where the body of the request includes "cache".

```http
PUT https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]?api-version=2021-04-30-Preview
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

```http
    "cache": {
        "ID": "<ALPHA-NUMERIC STRING>",
        "enableReprocessing": true,
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<YOUR-STORAGE-ACCOUNT>;AccountKey=<YOUR-STORAGE-KEY>;EndpointSuffix=core.windows.net"
    }
```

### Step 5: Run the indexer

To run indexer, you can use the portal or the API. In the portal, from the indexers list, select the indexer and click **Run**. One advantage to using the portal is that you can monitor indexer status, note the duration of the job, and how many documents are processed. Portal pages are refreshed every few minutes.

Alternatively, you can use REST to [run the indexer](/rest/api/searchservice/run-indexer):

```http
POST https://[YOUR-SEARCH-SERVICE].search.windows.net/indexers/[YOUR-INDEXER-NAME]/run?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [YOUR-ADMIN-KEY]
```

> [!NOTE]
> A reset and rerun of the indexer results in a full rebuild so that content can be cached. All cognitive enrichments will be rerun on all documents. Reusing enriched content from the cache begins after the cache is loaded.
>

## Check for cached output

Find the cache in Azure Storage, under Blob container. The container name will be  `ms-az-search-indexercache-<some-alphanumeric-string>`.

A cache is created and used by an indexer. Its content is not human readable.

To verify whether the cache is operational, modify a skillset and run the indexer, then compare before-and-after metrics for execution time and document counts. 

Skillsets that include image analysis and Optical Character Recognition (OCR) of scanned documents make good test cases. If you modify a downstream text skill or any skill that is not image-related, the indexer can retrieve all of the previously processed image and OCR content from cache, updating and processing only the text-related changes indicated by your edits.  You can expect to see fewer documents in the indexer execution document count, shorter execution times, and fewer charges on your bill. 

The [file set](https://github.com/Azure-Samples/azure-search-sample-data/tree/master/ai-enrichment-mixed-media) used in [cog-search-demo tutorials](cognitive-search-tutorial-blob.md) is a useful test case because it contains 14 files of various formats JPG, PNG, HTML, DOCX, PPTX, and other types. Change `en` to `es` or another language in the text translation skill for proof-of-concept testing of incremental enrichment.

## Common errors

The following error occurs if you forget to specify a preview API version on the request:

`"The request is invalid. Details: indexer : A resource without a type name was found, but no expected type was specified. To allow entries without type information, the expected type must also be specified when the model is specified."`

A 400 Bad Request error will also occur if you are missing an indexer requirement. The error message will specify any missing dependencies.

## Next steps

Incremental enrichment is applicable on indexers that contain skillsets, providing reusable content for both indexes and knowledge stores. The following links provide more information about caching and skillsets.

+ [Incremental enrichment (lifecycle and management)](cognitive-search-incremental-indexing-conceptual.md)
+ [Skillset concepts and composition](cognitive-search-working-with-skillsets.md)
+ [Create a skillset](cognitive-search-defining-skillset.md)
+ [Tutorial: Use REST and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob.md)
