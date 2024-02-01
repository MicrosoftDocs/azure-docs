---
title: Azure Files indexer (preview)
titleSuffix: Azure AI Search
description: Set up an Azure Files indexer to automate indexing of file shares in Azure AI Search.
manager: nitinme
author: mattmsft
ms.author: magottei
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 12/12/2023
---

# Index data from Azure Files

> [!IMPORTANT] 
> Azure Files indexer is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use a [preview REST API (2020-06-30-preview or later)](search-api-preview.md) to create the indexer data source.

In this article, learn how to configure an [**indexer**](search-indexer-overview.md) that imports content from Azure Files and makes it searchable in Azure AI Search. Inputs to the indexer are your files in a single share. Output is a search index with searchable content and metadata stored in individual fields.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information that's specific to indexing files in Azure Storage. It uses the REST APIs to demonstrate a three-part workflow common to all indexers: create a data source, create an index, create an indexer. Data extraction occurs when you submit the Create Indexer request.

## Prerequisites

+ [Azure Files](../storage/files/storage-how-to-use-files-portal.md), Transaction Optimized tier.

+ An [SMB file share](../storage/files/files-smb-protocol.md) providing the source content. [NFS shares](../storage/files/files-nfs-protocol.md#support-for-azure-storage-features) are not supported.

+ Files containing text. If you have binary data, you can include [AI enrichment](cognitive-search-concept-intro.md) for image analysis.

+ Read permissions on Azure Storage. A "full access" connection string includes a key that grants access to the content.

+ Use a REST client, such as [Postman app](https://www.postman.com/downloads/), if you want to formulate REST calls similar to the ones shown in this article.

## Supported document formats

The Azure Files indexer can extract text from the following document formats:

[!INCLUDE [search-document-data-sources](../../includes/search-blob-data-sources.md)]


## How Azure Files are indexed

By default, most files are indexed as a single search document in the index, including files with structured content, such as JSON or CSV, which are indexed as a single chunk of text. 

A compound or embedded document (such as a ZIP archive, a Word document with embedded Outlook email containing attachments, or an .MSG file with attachments) is also indexed as a single document. For example, all images extracted from the attachments of an .MSG file will be returned in the normalized_images field. If you have images, consider adding [AI enrichment](cognitive-search-concept-intro.md) to get more search utility from that content.

Textual content of a document is extracted into a string field named "content". You can also extract standard and user-defined metadata.


## Define the data source

The data source definition specifies the data to index, credentials, and policies for identifying changes in the data. A data source is defined as an independent resource so that it can be used by multiple indexers.

1. [Create or update a data source](/rest/api/searchservice/preview-api/create-or-update-data-source) to set its definition, using a preview API version 2020-06-30-Preview or later for "type": `"azurefile"`.

    ```json
    {
        "name" : "my-file-datasource",
        "type" : "azurefile",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-file-share", "query" : "<optional-directory-name>" }
    }
    ```

1. Set "type" to `"azurefile"` (required).

1. Set "credentials" to an Azure Storage connection string. The next section describes the supported formats.

1. Set "container" to the root file share, and use "query" to specify any subfolders.

A data source definition can also include [soft deletion policies](search-howto-index-changed-deleted-blobs.md), if you want the indexer to delete a search document when the source document is flagged for deletion.

<a name="Credentials"></a>

### Supported credentials and connection strings

Indexers can connect to a file share using the following connections.

| Full access storage account connection string |
|-----------------------------------------------|
|`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }` |
| You can get the connection string from the Storage account page in Azure portal by selecting **Access keys** in the left navigation pane. Make sure to select a full connection string and not just a key. |

## Add search fields to an index

In the [search index](search-what-is-an-index.md), add fields to accept the content and metadata of your Azure files. 

1. [Create or update an index](/rest/api/searchservice/create-index) to define search fields that will store file content and metadata:

    ```http
    POST /indexes?api-version=2020-06-30
    {
      "name" : "my-search-index",
      "fields": [
          { "name": "ID", "type": "Edm.String", "key": true, "searchable": false },
          { "name": "content", "type": "Edm.String", "searchable": true, "filterable": false },
          { "name": "metadata_storage_name", "type": "Edm.String", "searchable": false, "filterable": true, "sortable": true  },
          { "name": "metadata_storage_path", "type": "Edm.String", "searchable": false, "filterable": true, "sortable": true },
          { "name": "metadata_storage_size", "type": "Edm.Int64", "searchable": false, "filterable": true, "sortable": true  },
          { "name": "metadata_storage_content_type", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true }        
      ]
    }
    ```

1. Create a document key field ("key": true). For blob content, the best candidates are metadata properties. Metadata properties often include characters, such as `/` and `-`, that are invalid for document keys. Because the indexer has a "base64EncodeKeys" property (true by default), it automatically encodes the metadata property, with no configuration or field mapping required.

   + **`metadata_storage_path`** (default) full path to the object or file

   + **`metadata_storage_name`** usable only if names are unique

   + A custom metadata property that you add to blobs. This option requires that your blob upload process adds that metadata property to all blobs. Since the key is a required property, any blobs that are missing a value will fail to be indexed. If you use a custom metadata property as a key, avoid making changes to that property. Indexers will add duplicate documents for the same blob if the key property changes.

1. Add a "content" field to store extracted text from each file through the blob's "content" property. You aren't required to use this name, but doing so lets you take advantage of implicit field mappings. 

1. Add fields for standard metadata properties. In file indexing, the standard metadata properties are the same as blob metadata properties. The file indexer automatically creates internal field mappings for these properties that converts hyphenated property names to underscored property names. You still have to add the fields you want to use the index definition, but you can omit creating field mappings in the data source.

    + **metadata_storage_name** (`Edm.String`) - the file name. For example, if you have a file /my-share/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.
    + **metadata_storage_path** (`Edm.String`) - the full URI of the file, including the storage account. For example, `https://myaccount.file.core.windows.net/my-share/my-folder/subfolder/resume.pdf`
    + **metadata_storage_content_type** (`Edm.String`) - content type as specified by the code you used to upload the file. For example, `application/octet-stream`.
    + **metadata_storage_last_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the file. Azure AI Search uses this timestamp to identify changed files, to avoid reindexing everything after the initial indexing.
    + **metadata_storage_size** (`Edm.Int64`) - file size in bytes.
    + **metadata_storage_content_md5** (`Edm.String`) - MD5 hash of the file content, if available.
    + **metadata_storage_sas_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the file. This token shouldn't be stored for later use as it might expire.

## Configure and run the file indexer

Once the index and data source have been created, you're ready to create the indexer. Indexer configuration specifies the inputs, parameters, and properties controlling run time behaviors.

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) by giving it a name and referencing the data source and target index:

    ```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    {
      "name" : "my-file-indexer",
      "dataSourceName" : "my-file-datasource",
      "targetIndexName" : "my-search-index",
      "parameters": {
         "batchSize": null,
         "maxFailedItems": null,
         "maxFailedItemsPerBatch": null,
         "base64EncodeKeys": null,
         "configuration": {
            "indexedFileNameExtensions" : ".pdf,.docx",
            "excludedFileNameExtensions" : ".png,.jpeg" 
        }
      },
      "schedule" : { },
      "fieldMappings" : [ ]
    }
    ```

1. In the optional "configuration" section, provide any inclusion or exclusion criteria. If left unspecified, all files in the file share are retrieved.

   If both `indexedFileNameExtensions` and `excludedFileNameExtensions` parameters are present, Azure AI Search first looks at `indexedFileNameExtensions`, then at `excludedFileNameExtensions`. If the same file extension is present in both lists, it will be excluded from indexing.

1. [Specify field mappings](search-indexer-field-mappings.md) if there are differences in field name or type, or if you need multiple versions of a source field in the search index.

   In file indexing, you can often omit field mappings because the indexer has built-in support for mapping the "content" and metadata properties to similarly named and typed fields in an index. For metadata properties, the indexer will automatically replace hyphens `-` with underscores in the search index.

1. See [Create an indexer](search-howto-create-indexers.md) for more information about other properties.

An indexer runs automatically when it's created. You can prevent this by setting "disabled" to true. To control indexer execution, [run an indexer on demand](search-howto-run-reset-indexers.md) or [put it on a schedule](search-howto-schedule-indexers.md).

## Check indexer status

To monitor the indexer status and execution history, send a [Get Indexer Status](/rest/api/searchservice/get-indexer-status) request:

```http
GET https://myservice.search.windows.net/indexers/myindexer/status?api-version=2020-06-30
  Content-Type: application/json  
  api-key: [admin key]
```

The response includes status and the number of items processed. It should look similar to the following example:

```json
    {
        "status":"running",
        "lastResult": {
            "status":"success",
            "errorMessage":null,
            "startTime":"2022-02-21T00:23:24.957Z",
            "endTime":"2022-02-21T00:36:47.752Z",
            "errors":[],
            "itemsProcessed":1599501,
            "itemsFailed":0,
            "initialTrackingState":null,
            "finalTrackingState":null
        },
        "executionHistory":
        [
            {
                "status":"success",
                "errorMessage":null,
                "startTime":"2022-02-21T00:23:24.957Z",
                "endTime":"2022-02-21T00:36:47.752Z",
                "errors":[],
                "itemsProcessed":1599501,
                "itemsFailed":0,
                "initialTrackingState":null,
                "finalTrackingState":null
            },
            ... earlier history items
        ]
    }
```

Execution history contains up to 50 of the most recently completed executions, which are sorted in the reverse chronological order so that the latest execution comes first.

## Next steps

You can now [run the indexer](search-howto-run-reset-indexers.md), [monitor status](search-howto-monitor-indexers.md), or [schedule indexer execution](search-howto-schedule-indexers.md). The following articles apply to indexers that pull content from Azure Storage:

+ [Change detection and deletion detection](search-howto-index-changed-deleted-blobs.md)
+ [Index large data sets](search-howto-large-index.md)
