---
title: Azure Blob indexer
titleSuffix: Azure Cognitive Search
description: Set up an Azure Blob indexer to automate indexing of blob content for full text search operations and knowledge mining in Azure Cognitive Search.

author: gmndrg
ms.author: gimondra
manager: nitinme

ms.service: cognitive-search
ms.topic: how-to
ms.date: 03/30/2023
---

# Index data from Azure Blob Storage

In this article, learn how to configure an [**indexer**](search-indexer-overview.md) that imports content from Azure Blob Storage and makes it searchable in Azure Cognitive Search. Inputs to the indexer are your blobs, in a single container. Output is a search index with searchable content and metadata stored in individual fields.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information that's specific to Blob Storage. It uses the REST APIs to demonstrate a three-part workflow common to all indexers: create a data source, create an index, create an indexer. Data extraction occurs when you submit the Create Indexer request.

Blob indexers are frequently used for both [AI enrichment](cognitive-search-concept-intro.md) and text-based processing. This article focuses on indexers for text-based indexing, where just the textual content and metadata are ingested for full text search scenarios. 

## Prerequisites

+ [Azure Blob Storage](../storage/blobs/storage-blobs-overview.md), Standard performance (general-purpose v2).

+ [Access tiers](../storage/blobs/access-tiers-overview.md) for Blob Storage include Hot, Cool, and Archive. Only Hot and Cool can be accessed by search indexers.

+ Blobs providing text content and metadata. If blobs contain binary content or unstructured text, consider adding [AI enrichment](cognitive-search-concept-intro.md) for image and natural language processing. Blob content can’t exceed the [indexer limits](search-limits-quotas-capacity.md#indexer-limits) for your search service tier.

+ A supported network configuration and data access. At a minimum, you'll need read permissions in Azure Storage. A storage connection string that includes an access key will give you read access to storage content. If instead you're using Azure AD logins and roles, make sure the [search service's managed identity](search-howto-managed-identities-data-sources.md) has **Storage Blob Data Reader** permissions.

  By default, both search and storage accept requests from public IP addresses. If network security isn't an immediate concern, you can index blob data using just the connection string and read permissions. When you're ready to add network protections, see [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md) for guidance about data access.

+ Use a REST client, such as [Postman app](https://www.postman.com/downloads/), if you want to formulate REST calls similar to the ones shown in this article.

<a name="SupportedFormats"></a>

## Supported document formats

The blob indexer can extract text from the following document formats:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

## Determine which blobs to index

Before you set up indexing, review your source data to determine whether any changes should be made up front. An indexer can index content from one container at a time. By default, all blobs in the container are processed. You have several options for more selective processing:

+ Place blobs in a virtual folder. An indexer [data source definition](#define-the-data-source) includes a "query" parameter that can take a virtual folder. If you specify a virtual folder, only those blobs in the folder are indexed.

+ Include or exclude blobs by file type. The [supported document formats list](#SupportedFormats) can help you determine which blobs to exclude. For example, you might want to exclude image or audio files that don't provide searchable text. This capability is controlled through [configuration settings](#configure-and-run-the-blob-indexer) in the indexer.

+ Include or exclude arbitrary blobs. If you want to skip a specific blob for whatever reason, you can add the following metadata properties and values to blobs in Blob Storage. When an indexer encounters this property, it skips the blob or its content in the indexing run.

  | Property name | Property value | Explanation |
  | ------------- | -------------- | ----------- |
  | "AzureSearch_Skip" |`"true"` |Instructs the blob indexer to completely skip the blob. Neither metadata nor content extraction is attempted. This is useful when a particular blob fails repeatedly and interrupts the indexing process. |
  | "AzureSearch_SkipContent" |`"true"` | Skips content and extracts just the metadata. this is equivalent to the `"dataToExtract" : "allMetadata"` setting described in [configuration settings](#configure-and-run-the-blob-indexer) , just scoped to a particular blob. |

If you don't set up inclusion or exclusion criteria, the indexer will report an ineligible blob as an error and move on. If enough errors occur, processing might stop. You can specify error tolerance in the indexer [configuration settings](#configure-and-run-the-blob-indexer).

An indexer typically creates one search document per blob, where the text content and metadata are captured as searchable fields in an index. If blobs are whole files, you can potentially parse them into [multiple search documents](search-howto-index-one-to-many-blobs.md). For example, you can parse rows in a [CSV file](search-howto-index-csv-blobs.md) to create one search document per row.

<a name="indexing-blob-metadata"></a>

### Indexing blob metadata

Blob metadata can also be indexed, and that's helpful if you think any of the standard or custom metadata properties will be useful in filters and queries.

User-specified metadata properties are extracted verbatim. To receive the values, you must define field in the search index of type `Edm.String`, with same name as the metadata key of the blob. For example, if a blob has a metadata key of `Sensitivity` with value `High`, you should define a field named `Sensitivity` in your search index and it will be populated with the value `High`.

Standard blob metadata properties can be extracted into similarly named and typed fields, as listed below. The blob indexer automatically creates internal field mappings for these blob metadata properties, converting the original hyphenated name ("metadata-storage-name") to an underscored equivalent name ("metadata_storage_name").

You still have to add the underscored fields to the index definition, but you can omit field mappings because the indexer will make the association automatically.

+ **metadata_storage_name** (`Edm.String`) - the file name of the blob. For example, if you have a blob /my-container/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.

+ **metadata_storage_path** (`Edm.String`) - the full URI of the blob, including the storage account. For example, `https://myaccount.blob.core.windows.net/my-container/my-folder/subfolder/resume.pdf`

+ **metadata_storage_content_type** (`Edm.String`) - content type as specified by the code you used to upload the blob. For example, `application/octet-stream`.

+ **metadata_storage_last_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the blob. Azure Cognitive Search uses this timestamp to identify changed blobs, to avoid reindexing everything after the initial indexing.

+ **metadata_storage_size** (`Edm.Int64`) - blob size in bytes.

+ **metadata_storage_content_md5** (`Edm.String`) - MD5 hash of the blob content, if available.

+ **metadata_storage_sas_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the blob. This token shouldn't be stored for later use as it might expire.

Lastly, any metadata properties specific to the document format of the blobs you're indexing can also be represented in the index schema. For more information about content-specific metadata, see [Content metadata properties](search-blob-metadata-properties.md).

It's important to point out that you don't need to define fields for all of the above properties in your search index - just capture the properties you need for your application.

## Define the data source

The data source definition specifies the data to index, credentials, and policies for identifying changes in the data. A data source is defined as an independent resource so that it can be used by multiple indexers.

1. [Create or update a data source](/rest/api/searchservice/create-data-source) to set its definition: 

    ```json
    {
        "name" : "my-blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-container", "query" : "<optional-virtual-directory-name>" }
    }
    ```

1. Set "type" to `"azureblob"` (required).

1. Set "credentials" to an Azure Storage connection string. The next section describes the supported formats.

1. Set "container" to the blob container, and use "query" to specify any subfolders.

A data source definition can also include [soft deletion policies](search-howto-index-changed-deleted-blobs.md), if you want the indexer to delete a search document when the source document is flagged for deletion.

<a name="credentials"></a>

### Supported credentials and connection strings

Indexers can connect to a blob container using the following connections.

| Full access storage account connection string |
|-----------------------------------------------|
|`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }` |
| You can get the connection string from the Storage account page in Azure portal by selecting **Access keys** in the left navigation pane. Make sure to select a full connection string and not just a key. |

| Managed identity connection string |
|------------------------------------|
|`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.Storage/storageAccounts/<your storage account name>/;" }`|
|This connection string doesn't require an account key, but you must have previously configured a search service to [connect using a managed identity](search-howto-managed-identities-data-sources.md).|

| Storage account shared access signature** (SAS) connection string |
|-------------------------------------------------------------------|
| `{ "connectionString" : "BlobEndpoint=https://<your account>.blob.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&srt=co&ss=b&sp=rl;" }` |
| The SAS should have the list and read permissions on containers and objects (blobs in this case). |

| Container shared access signature |
|-----------------------------------|
| `{ "connectionString" : "ContainerSharedAccessUri=https://<your storage account>.blob.core.windows.net/<container name>?sv=2016-05-31&sr=c&sig=<the signature>&se=<the validity end time>&sp=rl;" }` |
| The SAS should have the list and read permissions on the container. For more information, see [Using Shared Access Signatures](../storage/common/storage-sas-overview.md). |

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to "Credentials provided in the connection string are invalid or have expired".  

## Add search fields to an index

In a [search index](search-what-is-an-index.md), add fields to accept the content and metadata of your Azure blobs.

1. [Create or update an index](/rest/api/searchservice/create-index) to define search fields that will store blob content and metadata:

    ```http
    POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
    {
        "name" : "my-search-index",
        "fields": [
            { "name": "ID", "type": "Edm.String", "key": true, "searchable": false },
            { "name": "content", "type": "Edm.String", "searchable": true, "filterable": false },
            { "name": "metadata_storage_name", "type": "Edm.String", "searchable": false, "filterable": true, "sortable": true  },
            { "name": "metadata_storage_size", "type": "Edm.Int64", "searchable": false, "filterable": true, "sortable": true  },
            { "name": "metadata_storage_content_type", "type": "Edm.String", "searchable": false, "filterable": true, "sortable": true },        
        ]
      }
    }
    ```

1. Create a document key field ("key": true). For blob content, the best candidates are metadata properties. 

   + **`metadata_storage_path`** (default) full path to the object or file. The key field ("ID" in this example) will be populated with values from metadata_storage_path because it's the default.

   + **`metadata_storage_name`**, usable only if names are unique. If you want this field as the key, move `"key": true` to this field definition.

   + A custom metadata property that you add to blobs. This option requires that your blob upload process adds that metadata property to all blobs. Since the key is a required property, any blobs that are missing a value will fail to be indexed. If you use a custom metadata property as a key, avoid making changes to that property. Indexers will add duplicate documents for the same blob if the key property changes.

   Metadata properties often include characters, such as `/` and `-`, that are invalid for document keys. Because the indexer has a "base64EncodeKeys" property (true by default), it automatically encodes the metadata property, with no configuration or field mapping required.

1. Add a "content" field to store extracted text from each file through the blob's "content" property. You aren't required to use this name, but doing so lets you take advantage of implicit field mappings. 

1. Add fields for standard metadata properties. The indexer can read custom metadata properties, [standard metadata](#indexing-blob-metadata) properties, and [content-specific metadata](search-blob-metadata-properties.md) properties.

<a name="PartsOfBlobToIndex"></a> 

## Configure and run the blob indexer

Once the index and data source have been created, you're ready to create the indexer. Indexer configuration specifies the inputs, parameters, and properties controlling run time behaviors. You can also specify which parts of a blob to index.

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) by giving it a name and referencing the data source and target index:

    ```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    {
      "name" : "my-blob-indexer",
      "dataSourceName" : "my-blob-datasource",
      "targetIndexName" : "my-search-index",
      "parameters": {
          "batchSize": null,
          "maxFailedItems": null,
          "maxFailedItemsPerBatch": null,
          "base64EncodeKeys": null,
          "configuration": {
              "indexedFileNameExtensions" : ".pdf,.docx",
              "excludedFileNameExtensions" : ".png,.jpeg",
              "dataToExtract": "contentAndMetadata",
              "parsingMode": "default"
          }
      },
      "schedule" : { },
      "fieldMappings" : [ ]
    }
    ```

1. Set `batchSize` if the default (10 documents) is either underutilizing or overwhelming available resources. Default batch sizes are data source specific. Blob indexing sets batch size at 10 documents in recognition of the larger average document size. 

1. Under "configuration", control which blobs are indexed based on file type, or leave unspecified to retrieve all blobs.

   For `"indexedFileNameExtensions"`, provide a comma-separated list of file extensions (with a leading dot). Do the same for `"excludedFileNameExtensions"` to indicate which extensions should be skipped. If the same extension is in both lists, it will be excluded from indexing.

1. Under "configuration", set "dataToExtract" to control which parts of the blobs are indexed:

   + "contentAndMetadata" specifies that all metadata and textual content extracted from the blob are indexed. This is the default value.

   + "storageMetadata" specifies that only the [standard blob properties and user-specified metadata](../storage/blobs/storage-blob-container-properties-metadata.md) are indexed.

   + "allMetadata" specifies that standard blob properties and any [metadata for found content types](search-blob-metadata-properties.md) are extracted from the blob content and indexed.

1. Under "configuration", set "parsingMode" if blobs should be mapped to [multiple search documents](search-howto-index-one-to-many-blobs.md), or if they consist of [plain text](search-howto-index-plaintext-blobs.md), [JSON documents](search-howto-index-json-blobs.md), or [CSV files](search-howto-index-csv-blobs.md).

1. [Specify field mappings](search-indexer-field-mappings.md) if there are differences in field name or type, or if you need multiple versions of a source field in the search index.

   In blob indexing, you can often omit field mappings because the indexer has built-in support for mapping the "content" and metadata properties to similarly named and typed fields in an index. For metadata properties, the indexer will automatically replace hyphens `-` with underscores in the search index.

1. See [Create an indexer](search-howto-create-indexers.md) for more information about other properties. For the full list of parameter descriptions, see [Blob configuration parameters](/rest/api/searchservice/create-indexer#blob-configuration-parameters) in the REST API.

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

<a name="DealingWithErrors"></a>

## Handle errors

Errors that commonly occur during indexing include unsupported content types, missing content, or oversized blobs.

By default, the blob indexer stops as soon as it encounters a blob with an unsupported content type (for example, an audio file). You could use the "excludedFileNameExtensions" parameter to skip certain content types. However, you might want to indexing to proceed even if errors occur, and then debug individual documents later. For more information about indexer errors, see [Indexer troubleshooting guidance](search-indexer-troubleshooting.md) and [Indexer errors and warnings](cognitive-search-common-errors-warnings.md).

There are five indexer properties that control the indexer's response when errors occur. 

```http
PUT /indexers/[indexer name]?api-version=2020-06-30
{
  "parameters" : { 
    "maxFailedItems" : 10, 
    "maxFailedItemsPerBatch" : 10,
    "configuration" : { 
        "failOnUnsupportedContentType" : false, 
        "failOnUnprocessableDocument" : false,
        "indexStorageMetadataOnlyForOversizedDocuments": false
  }
}
```

| Parameter | Valid values | Description |
|-----------|--------------|-------------|
| "maxFailedItems" | -1, null or 0, positive integer | Continue indexing if errors happen at any point of processing, either while parsing blobs or while adding documents to an index. Set these properties to the number of acceptable failures. A value of `-1` allows processing no matter how many errors occur. Otherwise, the value is a positive integer. |
| "maxFailedItemsPerBatch" | -1, null or 0, positive integer | Same as above, but used for batch indexing. |
| "failOnUnsupportedContentType" | true or false |  If the indexer is unable to determine the content type, specify whether to continue or fail the job. |
|"failOnUnprocessableDocument" |  true or false | If the indexer is unable to process a document of an otherwise supported content type, specify whether to continue or fail the job. |
| "indexStorageMetadataOnlyForOversizedDocuments"  | true or false |  Oversized blobs are treated as errors by default. If you set this parameter to true, the indexer will try to index its metadata even if the content can’t be indexed. For limits on blob size, see [service Limits](search-limits-quotas-capacity.md). |

## Next steps

You can now control how you [run the indexer](search-howto-run-reset-indexers.md), [monitor status](search-howto-monitor-indexers.md), or [schedule indexer execution](search-howto-schedule-indexers.md). The following articles apply to indexers that pull content from Azure Storage:

+ [Change detection and deletion detection](search-howto-index-changed-deleted-blobs.md)
+ [Index large data sets](search-howto-large-index.md)
+ [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md)
