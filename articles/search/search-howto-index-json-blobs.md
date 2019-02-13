---
title: Index JSON blobs from Azure Blob indexer for full text search - Azure Search
description: Crawl Azure JSON blobs for text content using the Azure Search Blob indexer. Indexers automate data ingestion for selected data sources like Azure Blob storage.

ms.date: 12/21/2018
author: HeidiSteen
manager: cgronlun
ms.author: heidist

services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.custom: seodec2018
---

# Indexing JSON blobs with Azure Search Blob indexer
This article shows you how to configure an Azure Search blob indexer to extract structured content from JSON blobs in Azure Blob storage.

You can use the [portal](#json-indexer-portal), [REST APIs](#json-indexer-rest), or [.NET SDK](#json-indexer-dotnet) to index JSON content. Common to all approaches is JSON documents located in a blob container in an Azure Storage account. For guidance on pushing JSON documents from other non-Azure platforms, see [Data import in Azure Search](search-what-is-data-import.md).

JSON blobs in Azure Blob storage are typically either a single JSON document or a collection of JSON entities. For JSON collections, the blob could have an **array** of well-formed JSON elements. Blobs could also be composed of multiple individual JSON entities separated by a newline. The blob indexer in Azure Search can parse any such construction, depending on how you set the **parsingMode** parameter on the request.

> [!IMPORTANT]
> `json` parsing mode is generally available, but `jsonArray` and `jsonLines` parsing modes are in public preview and should not be used in production environments. For more information, see [REST api-version=2017-11-11-Preview](search-api-2017-11-11-preview.md). 

> [!NOTE]
> Follow recommendations from [one-to-many indexing](search-howto-index-one-to-many-blobs.mds) to modify your indexer configuration to enable one azure blob to produce multiple search documents.

<a name="json-indexer-portal"></a>

## Use the portal

The easiest method for indexing JSON documents is to use a wizard in the [Azure portal](https://portal.azure.com/). By parsing metadata in the Azure blob container, the [**Import data**](search-import-data-portal.md) wizard can create a default index, map source fields to target index fields, and load the index in a single operation. Depending on the size and complexity of source data, you could have an operational full text search index in minutes.

### 1 - Prepare source data

You should have an Azure storage account, with Blob storage, and a container of JSON documents. If you are unfamiliar with any of these tasks, review the prerequisite "Set up Azure Blob service and load sample data" in the [cognitive search-quickstart](cognitive-search-quickstart-blob.md#set-up-azure-blob-service-and-load-sample-data).

### 2 - Start Import data wizard

You can [start the wizard](search-import-data-portal.md) from the command bar in the Azure Search service page, or by clicking **Add Azure Search** in the **Blob service** section of your storage account's left navigation pane.

### 3 - Set the data source

In the **data source** page, the source must be **Azure Blob Storage**, with the following specifications:

+ **Data to extract** should be *Content and metadata*. Choosing this option allows the wizard to infer an index schema and map the fields for import.
   
+ **Parsing mode** should be set to *JSON*, *JSON array* or *JSON lines*. 

  *JSON* articulates each blob as a single search document, showing up as an independent item in search results. 

  *JSON array* is for blobs that contain well-formed JSON data - the well-formed JSON corresponds to an array of objects, or has a property which is an array of objects and you want each element to be articulated as a standalone, independent search document. If blobs are complex, and you don't choose *JSON array* the entire blob is ingested as a single document.

  *JSON lines* is for blobs composed of multiple JSON entities separated by a new-line, where you want each entity to be articulated as a standalone independent search document. If blobs are complex, and you don't choose *JSON lines* parsing mode, then the entire blob is ingested as a single document.
   
+ **Storage container** must specify your storage account and container, or a connection string that resolves to the container. You can get connection strings on the Blob service portal page.

   ![Blob data source definition](media/search-howto-index-json/import-wizard-json-data-source.png)

### 4 - Skip the "Add cognitive search" page in the wizard

Adding cognitive skills is not necessary for JSON document import. Unless you have a specific need to [include Cognitive Services APIs and transformations](cognitive-search-concept-intro.md) to your indexing pipeline, you should skip this step.

To skip the step, click the next page **Customize target index**.

### 5 - Set index attributes

In the **Index** page, you should see a list of fields with a data type and a series of checkboxes for setting index attributes. The wizard can generate a default index based on metadata and by sampling the source data. 

The defaults often produce a workable solution: selecting a field (cast as string) to serve as the key or document ID to uniquely identify each document, as well as fields that are good candidates for full text search and retrievable in a result set. For blobs, the `content` field is the best candidate for searchable content.

You can accept the defaults, or review the description of [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index#bkmk_indexAttrib) and [language analyzers](https://docs.microsoft.com/rest/api/searchservice/language-support) to override or supplement the initial values. 

Take a moment to review your selections. Once you run the wizard, physical data structures are created and you won't be able to edit these fields without dropping and recreating all objects.

   ![Blob index definition](media/search-howto-index-json/import-wizard-json-index.png)

### 6 - Create indexer

Fully specified, the wizard creates three distinct objects in your search service. A data source object and index object are saved as named resources in your Azure Search service. The last step creates an indexer object. Naming the indexer allows it to exist as a standalone resource, which you can schedule and manage independently of the index and data source object, created in the same wizard sequence.

If you are not familiar with indexers, an *indexer* is a resource in Azure Search that crawls an external data source for searchable content. The output of the **Import data** wizard is an indexer that crawls your JSON data source, extracts searchable content, and imports it into an index on Azure Search.

   ![Blob indexer definition](media/search-howto-index-json/import-wizard-json-indexer.png)

Click **OK** to run the wizard and create all objects. Indexing commences immediately.

You can monitor data import in the portal pages. Progress notifications indicate indexing status and how many documents are uploaded. When indexing is complete, you can use [Search explorer](search-explorer.md) to query your index.

<a name="json-indexer-rest"></a>

## Use REST APIs

Indexing JSON blobs is similar to the regular document extraction in a three-part workflow common to all indexers in Azure Search: create a data source, create an index, create an indexer.

For code-based JSON indexing, you can use the REST API with APIs for [indexers](https://docs.microsoft.com/rest/api/searchservice/create-indexer), [data sources](https://docs.microsoft.com/rest/api/searchservice/create-data-source), and [indexes](https://docs.microsoft.com/rest/api/searchservice/create-index). In contrast with the portal wizard, a code approach requires that you have an index in-place, ready to accept the JSON documents when you send the **Create Indexer** request.

JSON blobs in Azure Blob storage are typically either a single JSON document or a JSON "array". The blob indexer in Azure Search can parse either construction, depending on how you set the **parsingMode** parameter on the request.

| JSON document | parsingMode | Description | Availability |
|--------------|-------------|--------------|--------------|
| One per blob | `json` | Parses JSON blobs as a single chunk of text. Each JSON blob becomes a single Azure Search document. | Generally available in both [REST](https://docs.microsoft.com/rest/api/searchservice/indexer-operations) API and [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexer) SDK. |
| Multiple per blob | `jsonArray` | Parses a JSON array in the blob, where each element of the array becomes a separate Azure Search document.  | Available in preview in both [REST](https://docs.microsoft.com/rest/api/searchservice/indexer-operations) API and [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexer) SDK. |
| Multiple per blob | `jsonLines` | Parses a blob which contains multiple JSON entities (an "array") separated by a newline, where each entity becomes a separate Azure Search document. | Available in preview in both [REST](https://docs.microsoft.com/rest/api/searchservice/indexer-operations) API and [.NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexer) SDK. |


### Step 1: Create a data source

The first step is to provide data source connection information used by the indexer. 
The data source type, specified here as `azureblob`, determines which data extraction behaviors are invoked by the indexer. For JSON blob indexing, data source definition is the same for both JSON documents and arrays. 

    POST https://[service name].search.windows.net/datasources?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "my-blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-container", "query" : "optional, my-folder" }
    }   

### Step 2: Create a target search index 

Indexers are paired with an index schema. If you are using the API (rather than the portal), prepare an index in advance so that you can specify it on the indexer operation.

The index stores searchable content in Azure Search. To create an index, provide a schema that specifies the fields in a document, attributes, and other constructs that shape the search experience. If you create an index that has the same field names and data types as the source, the indexer will match the source and destination fields, saving you the work of having to explicitly map the fields.

The following example shows a [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) request. The index will have a searchable `content` field to store the text extracted from blobs:   

    POST https://[service name].search.windows.net/indexes?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
          "name" : "my-target-index",
          "fields": [
            { "name": "id", "type": "Edm.String", "key": true, "searchable": false },
            { "name": "content", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false }
          ]
    }


### Step 3: Configure and run the indexer

Until now, definitions for the data source and index have been parsingMode agnostic. However, in step 3 for Indexer configuration, the path diverges depending on how you want the JSON blob content to be parsed and structured in an Azure Search index. Choices include `json` or `jsonArray`:

+ Set **parsingMode** to `json` to index each blob as a single document.

+ Set **parsingMode** to `jsonArray` if your blobs consist of JSON arrays, and you need each element of the array to become a separate document in Azure Search. 

+ Set **parsingMode** to `jsonLines` if your blobs consist of multiple JSON entities, that are separated by a new line, and you need each entity to become a separate document in Azure Search.

You can think of a document as a single item in search results. If you want each element in the array to show up in search results as an independent item, then use the `jsonArray` or `jsonLines` option as appropriate.

Within the indexer definition, you can optionally use [field mappings](search-indexer-field-mappings.md) to choose which properties of the source JSON document are used to populate your target search index. For `jsonArray` parsing mode, if the array exists as a lower-level property, you can set a document root indicating where the array is placed within the blob.

> [!IMPORTANT]
> When you use `json`, `jsonArray` or `jsonLines` parsing mode, Azure Search assumes that all blobs in your data source contain JSON. If you need to support a mix of JSON and non-JSON blobs in the same data source, let us know on [our UserVoice site](https://feedback.azure.com/forums/263029-azure-search).


### How to parse single JSON blobs

By default, [Azure Search blob indexer](search-howto-indexing-azure-blob-storage.md) parses JSON blobs as a single chunk of text. Often, you want to preserve the structure of your JSON documents. For example, assume you have the following JSON document in Azure Blob storage:

    {
        "article" : {
            "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13",
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

The blob indexer parses the JSON document into a single Azure Search document. The indexer loads an index by matching "text", "datePublished", and "tags" from the source against identically named and typed target index fields.

Configuration is provided in the body of an indexer operation. Recall that the data source object, previously defined, specifies the data source type and connection information. Additionally, the target index must also exist as an empty container in your service. Schedule and parameters are optional, but if you omit them, the indexer runs immediately, using `json` as the parsing mode.

A fully specified request might look as follows:

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "json" } }
    }

As noted, field mappings are not required. Given an index with "text", "datePublished, and "tags" fields, the blob indexer can infer the correct mapping without a field mapping present in the request.

### How to parse JSON arrays in a well-formed JSON document

Alternatively, you can opt for the JSON array feature. This capability is useful when blobs contain an *array of JSON objects*, and you want each element to become a separate Azure Search document. For example, given the following JSON blob, you can populate your Azure Search index with three separate documents, each with "id" and "text" fields.  

    [
        { "id" : "1", "text" : "example 1" },
        { "id" : "2", "text" : "example 2" },
        { "id" : "3", "text" : "example 3" }
    ]

For a JSON array, the indexer definition should look similar to the following example. Notice that the parsingMode parameter specifies the `jsonArray` parser. Specifying the right parser and having the right data input are the only two array-specific requirements for indexing JSON blobs.

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "jsonArray" } }
    }

Again, notice that field mappings can be omitted. Assuming an index with identically named "id" and "text" fields, the blob indexer can infer the correct mapping without an explicit field mapping list.

<a name="nested-json-arrays"></a>

### Nested JSON arrays
What if you wish to index an array of JSON objects, but that array is nested somewhere within the document? You can pick which property contains the array using the `documentRoot` configuration property. For example, if your blobs look like this:

    {
        "level1" : {
            "level2" : [
                { "id" : "1", "text" : "Use the documentRoot property" },
                { "id" : "2", "text" : "to pluck the array you want to index" },
                { "id" : "3", "text" : "even if it's nested inside the document" }  
            ]
        }
    }

Use this configuration to index the array contained in the `level2` property:

    {
        "name" : "my-json-array-indexer",
        ... other indexer properties
        "parameters" : { "configuration" : { "parsingMode" : "jsonArray", "documentRoot" : "/level1/level2" } }
    }

### How to parse blobs with multiple JSON entities separated by newlines

If your blob contains multiple JSON entities separated by a newline, and you want each element to become a separate Azure Search document, you can opt for the JSON lines feature. For example, given the following blob (where there are three different JSON entities), you can populate your Azure Search index with three seprate documents, each with "id" and "text" fields.

    { "id" : "1", "text" : "example 1" }
    { "id" : "2", "text" : "example 2" }
    { "id" : "3", "text" : "example 3" }

For a JSON lines, the indexer definition should look similar to the following example. Notice that the parsingMode parameter specifies the `jsonLines` parser. 

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "jsonLines" } }
    }

Again, notice that field mappings can be omitted, similar to the `jsonArray` parsing mode.

### Using field mappings to build search documents

When source and target fields are not perfectly aligned, you can define a field mapping section in the request body for explicit field-to-field associations.

Currently, Azure Search cannot index arbitrary JSON documents directly, because it supports only primitive data types, string arrays, and GeoJSON points. However, you can use **field mappings** to pick parts of your JSON document and "lift" them into top-level fields of the search document. To learn about field mappings basics, see [Field mappings in Azure Search indexers](search-indexer-field-mappings.md).

Revisiting our example JSON document:

    {
        "article" : {
            "text" : "A hopefully useful article explaining how to parse JSON blobs",
            "datePublished" : "2016-04-13"
            "tags" : [ "search", "storage", "howto" ]    
        }
    }

Assume a search index with the following fields: `text` of type `Edm.String`, `date` of type `Edm.DateTimeOffset`, and `tags` of type `Collection(Edm.String)`. Notice the discrepancy between "datePublished" in the source and `date` field in the index. To map your JSON into the desired shape, use the following field mappings:

    "fieldMappings" : [
        { "sourceFieldName" : "/article/text", "targetFieldName" : "text" },
        { "sourceFieldName" : "/article/datePublished", "targetFieldName" : "date" },
        { "sourceFieldName" : "/article/tags", "targetFieldName" : "tags" }
      ]

The source field names in the mappings are specified using the [JSON Pointer](https://tools.ietf.org/html/rfc6901) notation. You start with a forward slash to refer to the root of your JSON document, then pick the desired property (at arbitrary level of nesting) by using forward slash-separated path.

You can also refer to individual array elements by using a zero-based index. For example, to pick the first element of the "tags" array from the above example, use a field mapping like this:

    { "sourceFieldName" : "/article/tags/0", "targetFieldName" : "firstTag" }

> [!NOTE]
> If a source field name in a field mapping path refers to a property that doesn't exist in JSON, that mapping is skipped without an error. This is done so that we can support documents with a different schema (which is a common use case). Because there is no validation, you need to take care to avoid typos in your field mapping specification.
>
>

### REST Example: Indexer request with field mappings

The following example is a fully specified indexer payload, including field mappings:

    POST https://[service name].search.windows.net/indexers?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "my-json-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" },
      "parameters" : { "configuration" : { "parsingMode" : "json" } },
      "fieldMappings" : [
        { "sourceFieldName" : "/article/text", "targetFieldName" : "text" },
        { "sourceFieldName" : "/article/datePublished", "targetFieldName" : "date" },
        { "sourceFieldName" : "/article/tags", "targetFieldName" : "tags" }
        ]
    }

<a name="json-indexer-dotnet"></a>

## Use .NET SDK

The .NET SDK has fully parity with the REST API. We recommend that you review the previous REST API section to learn concepts, workflow, and requirements. You can then refer to following .NET API reference documentation to implement a JSON indexer in managed code.

+ [microsoft.azure.search.models.datasource](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.datasource?view=azure-dotnet)
+ [microsoft.azure.search.models.datasourcetype](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.datasourcetype?view=azure-dotnet) 
+ [microsoft.azure.search.models.index](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.index?view=azure-dotnet) 
+ [microsoft.azure.search.models.indexer](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexer?view=azure-dotnet)

## See also

+ [Indexers in Azure Search](search-indexer-overview.md)
+ [Indexing Azure Blob Storage with Azure Search](search-howto-index-json-blobs.md)
+ [Indexing CSV blobs with Azure Search blob indexer](search-howto-index-csv-blobs.md)
+ [Tutorial: Search semi-structured data from Azure Blob storage](search-semi-structured-data.md)
