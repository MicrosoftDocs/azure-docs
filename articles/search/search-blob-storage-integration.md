---
title: Search over Azure Blob Storage content
titleSuffix: Azure Cognitive Search
description: Learn about extracting text from Azure blobs and making it full-text searchable in an Azure Cognitive Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/07/2023
---

# Search over Azure Blob Storage content

Searching across the variety of content types stored in Azure Blob Storage can be a difficult problem to solve, but [Azure Cognitive Search](search-what-is-azure-search.md) provides deep integration at the content layer, extracting and inferring textual information, which can then be queried in a search index.

In this article, review the basic workflow for extracting content and metadata from blobs and sending it to a [search index](search-what-is-an-index.md) in Azure Cognitive Search. The resulting index can be queried using full text search. Optionally, you can send processed blob content to a [knowledge store](knowledge-store-concept-intro.md) for non-search scenarios.

> [!NOTE]
> Already familiar with the workflow and composition? [Configure a blob indexer](search-howto-indexing-azure-blob-storage.md) is your next step.

## What it means to add full text search to blob data

Azure Cognitive Search is a standalone search service that supports indexing and query workloads over user-defined indexes that contain your remote searchable content hosted in the cloud. Co-locating your searchable content with the query engine is necessary for performance, returning results at a speed users have come to expect from search queries.

Cognitive Search integrates with Azure Blob Storage at the indexing layer, importing your blob content as search documents that are indexed into *inverted indexes* and other query structures that support free-form text queries and filter expressions. Because your blob content is indexed into a search index, you can use the full range of query features in Azure Cognitive Search to find information in your blob content.

Inputs are your blobs, in a single container, in Azure Blob Storage. Blobs can be almost any kind of text data. If your blobs contain images, you can add [AI enrichment](cognitive-search-concept-intro.md) to create and extract text from images.

Output is always an Azure Cognitive Search index, used for fast text search, retrieval, and exploration in client applications. In between is the indexing pipeline architecture itself. The pipeline is based on the *indexer* feature, discussed further on in this article.

Once the index is created and populated, it exists independently of your blob container, but you can rerun indexing operations to refresh your index based on changed documents. Timestamp information on individual blobs is used for change detection. You can opt for either scheduled execution or on-demand indexing as the refresh mechanism.

## Resources used in a blob-search solution

You need Azure Cognitive Search, Azure Blob Storage, and a client. Cognitive Search is typically one of several components in a solution, where your application code issues query API requests and handles the response. You might also write application code to handle indexing, although for proof-of-concept testing and impromptu tasks, it's common to use the Azure portal as the search client. 

Within Blob Storage, you'll need a container that provides source content. You can set file inclusion and exclusion criteria, and specify which parts of a blob are indexed in Cognitive Search.

You can start directly in your Storage Account portal page. 

1. In the left navigation page under **Data management**, select **Azure search** to select or create a search service. 

1. Follow the steps in the wizard to extract and optionally create searchable content from your blobs. The workflow is the [**Import data** wizard](cognitive-search-quickstart-blob.md).

   :::image type="content" source="media/search-blob-storage-integration/blob-blade.png" alt-text="Screenshot of the Azure search wizard in the Azure Storage portal page." border="true":::

1. Use [Search explorer](search-explorer.md) in the search portal page to query your content.

The wizard is the best place to start, but you'll discover more flexible options when you [configure a blob indexer](search-howto-indexing-azure-blob-storage.md) yourself. You can call the REST APIs using a tool like Postman. [Tutorial: Index and search semi-structured data (JSON blobs) in Azure Cognitive Search](search-semi-structured-data.md) walks you through the steps of calling the REST API in Postman.

## How blobs are indexed

By default, most blobs are indexed as a single search document in the index, including blobs with structured content, such as JSON or CSV, which are indexed as a single chunk of text. However, for JSON or CSV documents that have an internal structure (delimiters), you can assign parsing modes to generate individual search documents for each line or element:

+ [Indexing JSON blobs](search-howto-index-json-blobs.md)
+ [Indexing CSV blobs](search-howto-index-csv-blobs.md)

A compound or embedded document (such as a ZIP archive, a Word document with embedded Outlook email containing attachments, or an .MSG file with attachments) is also indexed as a single document. For example, all images extracted from the attachments of an .MSG file will be returned in the normalized_images field. If you have images, consider adding [AI enrichment](cognitive-search-concept-intro.md) to get more search utility from that content.

Textual content of a document is extracted into a string field named "content". You can also extract standard and user-defined metadata.

  > [!NOTE]
  > Azure Cognitive Search imposes [indexer limits](search-limits-quotas-capacity.md#indexer-limits) on how much text it extracts depending on the pricing tier. A warning will appear in the indexer status response if documents are truncated.  

## Use a Blob indexer for content extraction

An *indexer* is a data-source-aware subservice in Cognitive Search, equipped with internal logic for sampling data, reading and retrieving data and metadata, and serializing data from native formats into JSON documents for subsequent import. 

Blobs in Azure Storage are indexed using the [blob indexer](search-howto-indexing-azure-blob-storage.md). You can invoke this indexer by using the **Azure search** command in Azure Storage, the **Import data** wizard, a REST API, or the .NET SDK. In code, you use this indexer by setting the type, and by providing connection information that includes an Azure Storage account along with a blob container. You can subset your blobs by creating a virtual directory, which you can then pass as a parameter, or by filtering on a file type extension.

An indexer ["cracks a document"](search-indexer-overview.md#document-cracking), opening a blob to inspect content. After connecting to the data source, it's the first step in the pipeline. For blob data, this is where PDF, Office docs, and other content types are detected. Document cracking with text extraction is no charge. If your blobs contain image content, images are ignored unless you [add AI enrichment](cognitive-search-concept-intro.md). Standard indexing applies only to text content.

The Blob indexer comes with configuration parameters and supports change tracking if the underlying data provides sufficient information. You can learn more about the core functionality in [Blob indexer](search-howto-indexing-azure-blob-storage.md).

### Supported access tiers

Blob storage [access tiers](../storage/blobs/access-tiers-overview.md) include hot, cool, and archive. Only hot and cool can be accessed by indexers. 

### Supported content types

By running a Blob indexer over a container, you can extract text and metadata from the following content types with a single query:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

<a name="PartsOfBlobToIndex"></a> 

### Controlling which blobs are indexed

You can control which blobs are indexed, and which are skipped, by the blob's file type or by setting properties on the blob themselves, causing the indexer to skip over them.

Include specific file extensions by setting `"indexedFileNameExtensions"` to a comma-separated list of file extensions (with a leading dot). Exclude specific file extensions by setting `"excludedFileNameExtensions"` to the extensions that should be skipped. If the same extension is in both lists, it will be excluded from indexing.

```http
PUT /indexers/[indexer name]?api-version=2020-06-30
{
    "parameters" : { 
        "configuration" : { 
            "indexedFileNameExtensions" : ".pdf, .docx",
            "excludedFileNameExtensions" : ".png, .jpeg" 
        } 
    }
}
```

### Add "skip" metadata the blob

The indexer configuration parameters apply to all blobs in the container or folder. Sometimes, you want to control how *individual blobs* are indexed.

Add the following metadata properties and values to blobs in Blob Storage. When the indexer encounters this property, it will skip the blob or its content in the indexing run.

| Property name | Property value | Explanation |
| ------------- | -------------- | ----------- |
| "AzureSearch_Skip" |`"true"` |Instructs the blob indexer to completely skip the blob. Neither metadata nor content extraction is attempted. This is useful when a particular blob fails repeatedly and interrupts the indexing process. |
| "AzureSearch_SkipContent" |`"true"` |This is equivalent to the `"dataToExtract" : "allMetadata"` setting described [above](#PartsOfBlobToIndex) scoped to a particular blob. | 

### Indexing blob metadata

A common scenario that makes it easy to sort through blobs of any content type is to [index both custom metadata and system properties](search-blob-metadata-properties.md) for each blob. In this way, information for all blobs is indexed regardless of document type, stored in an index in your search service. Using your new index, you can then proceed to sort, filter, and facet across all Blob storage content.

> [!NOTE]
> Blob Index tags are natively indexed by the Blob storage service and exposed for querying. If your blobs' key/value attributes require indexing and filtering capabilities, Blob Index tags should be leveraged instead of metadata.
>
> To learn more about Blob Index, see [Manage and find data on Azure Blob Storage with Blob Index](../storage/blobs/storage-manage-find-blobs.md).

## Search blob content in a search index 

The output of an indexer is a search index, used for interactive exploration using free text and filtered queries in a client app. For initial exploration and verification of content, we recommend starting with [Search Explorer](search-explorer.md) in the portal to examine document structure. In Search explorer, you can use:

+ [Simple query syntax](query-simple-syntax.md)
+ [Full query syntax](query-lucene-syntax.md)
+ [Filter expression syntax](query-odata-filter-orderby-syntax.md)

A more permanent solution is to gather query inputs and present the response as search results in a client application. The following C# tutorial explains how to build a search application: [Add search to an ASP.NET Core (MVC) application](tutorial-csharp-create-mvc-app.md).

## Next steps

+ [Upload, download, and list blobs with the Azure portal (Azure Blob storage)](../storage/blobs/storage-quickstart-blobs-portal.md)
+ [Set up a blob indexer (Azure Cognitive Search)](search-howto-indexing-azure-blob-storage.md)
