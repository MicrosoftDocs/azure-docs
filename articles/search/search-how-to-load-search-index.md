---
title: Load a search index
titleSuffix: Azure AI Search
description: Import and refresh data in a search index using the portal, REST APIs, or an Azure SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/21/2022
---

# Load data into a search index in Azure AI Search

This article explains how to import, refresh, and manage content in a predefined search index. In Azure AI Search, a [search index is created first](search-how-to-create-search-index.md), with data import following as a second step. The exception is Import Data wizard, which creates and loads an index in one workflow.

A search service imports and indexes text in JSON, used in full text search or knowledge mining scenarios. Text content is obtainable from alphanumeric fields in the external data source, metadata that's useful in search scenarios, or enriched content created by a [skillset](cognitive-search-working-with-skillsets.md) (skills can extract or infer textual descriptions from images and unstructured content).

Once data is indexed, the physical data structures of the index are locked in. For guidance on what can and can't be changed, see [Drop and rebuild an index](search-howto-reindex.md).

Indexing isn't a background process. A search service will balance indexing and query workloads, but if [query latency is too high](search-performance-analysis.md#impact-of-indexing-on-queries), you can either [add capacity](search-capacity-planning.md#add-or-reduce-replicas-and-partitions) or identify periods of low query activity for loading an index.

## Load documents

A search service accepts JSON documents that conform to the index schema.

You can prepare these documents yourself, but if content resides in a [supported data source](search-indexer-overview.md#supported-data-sources), running an [indexer](search-indexer-overview.md) or the Import data wizard can automate document retrieval, JSON serialization, and indexing.

### [**Azure portal**](#tab/portal)

Using Azure portal, the sole means for loading an index is an indexer or running the [Import Data wizard](search-import-data-portal.md). The wizard creates objects. If you want to load an existing index, you'll need to use an alternative approach.

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

1. [Find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/) and on the Overview page, select **Import data** on the command bar to create and populate a search index. You can follow this link to review the workflow: [Quickstart: Create an Azure AI Search index in the Azure portal](search-get-started-portal.md).

   :::image type="content" source="media/search-import-data-portal/import-data-cmd.png" alt-text="Screenshot of the Import data command" border="true":::

1. Alternatively, you can [reset and run an indexer](search-howto-run-reset-indexers.md), which is useful if you're adding fields incrementally. Reset forces the indexer to start over, picking up all fields from all source documents.

### [**REST**](#tab/import-rest)

[Add, Update or Delete Documents (REST)](/rest/api/searchservice/addupdate-or-delete-documents) is the means by which you can import data into a search index. The @search.action parameter determines whether documents are added in full, or partially in terms of new or replacement values for specific fields.

[**REST Quickstart: Create, load, and query an index**](search-get-started-rest.md) explains the steps. The following example is a modified version of the example. It's been trimmed for brevity and the first HotelId value has been altered to avoid overwriting an existing document.

1. Formulate a POST call specifying the index name, the "docs/index" endpoint, and a request body that includes the @search.action parameter.

    ```http
    POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/index?api-version=2020-06-30
    Content-Type: application/json   
    api-key: [admin key] 
    {
        "value": [
        {
        "@search.action": "upload",
        "HotelId": "1111",
        "HotelName": "Secret Point Motel",
        "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
        "Category": "Boutique",
        "Tags": [ "pool", "air conditioning", "concierge" ]
        },
        {
        "@search.action": "mergeOrUpload",
        "HotelId": "2",
        "HotelName": "Twin Dome Motel",
        "Description": "This is description is replacing the original one for this hotel. New and changed values overwrite the previous ones. In a comma-delimited list like Tags, be sure to provide the full list because there is no merging of values within the field itself.",
        "Category": "Boutique",
        "Tags": [ "pool", "free wifi", "concierge", "my first new tag", "my second new tag" ]
        }
      ]
    }
    ```

1. [Look up the documents](/rest/api/searchservice/lookup-document) you just added as a validation step:

    ```http
    GET https://[service name].search.windows.net/indexes/hotel-sample-index/docs/1111?api-version=2020-06-30
    ```

When the document key or ID is new, **null** becomes the value for any field that is unspecified in the document. For actions on an existing document, updated values replace the previous values. Any fields that weren't specified in a "merge" or "mergeUpload" are left intact in the search index.

### [**.NET SDK (C#)**](#tab/importcsharp)

Azure AI Search supports the following APIs for simple and bulk document uploads into an index:

+ [IndexDocumentsAction](/dotnet/api/azure.search.documents.models.indexdocumentsaction)
+ [IndexDocumentsBatch](/dotnet/api/azure.search.documents.models.indexdocumentsbatch)

There are several samples that illustrate indexing in context of simple and large-scale indexing:

+ [**"Load an index"**](search-howto-dotnet-sdk.md#load-an-index) explains basic steps.

+ [**Azure.Search.Documents Samples - Indexing Documents**](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/samples/Sample05_IndexingDocuments.md) from the Azure SDK team adds [SearchIndexingBufferedSender](/dotnet/api/azure.search.documents.searchindexingbufferedsender-1).

+ [**Tutorial: Index any data**](tutorial-optimize-indexing-push-api.md) couples batch indexing with testing strategies for determining an optimum size.

---

## Delete orphan documents

Azure AI Search supports document-level operations so that you can look up, update, and delete a specific document in isolation. The following example shows how to delete a document. In a search service, documents are unrelated so deleting one will have no impact on the rest of the index.

1. Identify which field is the document key. In the portal, you can view the fields of each index. Document keys are string fields and are denoted with a key icon to make them easier to spot.

1. Check the values of the document key field: `search=*&$select=HotelId`. A simple string is straightforward, but if the index uses a base-64 encoded field, or if search documents were generated from a `parsingMode` setting, you might be working with values that you aren't familiar with.

1. [Look up the document](/rest/api/searchservice/lookup-document) to verify the value of the document ID and to review its content before deleting it. Specify the key or document ID in the request. The following examples illustrate a simple string for the [Hotels sample index](search-get-started-portal.md) and a base-64 encoded string for the metadata_storage_path key of the [cog-search-demo index](cognitive-search-tutorial-blob.md).

    ```http
    GET https://[service name].search.windows.net/indexes/hotel-sample-index/docs/1111?api-version=2020-06-30
    ```

    ```http
    GET https://[service name].search.windows.net/indexes/cog-search-demo/docs/aHR0cHM6Ly9oZWlkaWJsb2JzdG9yYWdlMi5ibG9iLmNvcmUud2luZG93cy5uZXQvY29nLXNlYXJjaC1kZW1vL2d1dGhyaWUuanBn0?api-version=2020-06-30
    ```

1. [Delete the document](/rest/api/searchservice/addupdate-or-delete-documents) to remove it from the search index.

    ```http
    POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/index?api-version=2020-06-30
    Content-Type: application/json   
    api-key: [admin key] 
    {  
      "value": [  
        {  
          "@search.action": "delete",  
          "id": "1111"  
        }  
      ]  
    }
    ```

## See also

+ [Search indexes overview](search-what-is-an-index.md)
+ [Data import overview](search-what-is-data-import.md)
+ [Import data wizard overview](search-import-data-portal.md)
+ [Indexers overview](search-indexer-overview.md)
