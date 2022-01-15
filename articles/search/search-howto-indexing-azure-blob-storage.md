---
title: Azure Blob indexer
titleSuffix: Azure Cognitive Search
description: Set up an Azure Blob indexer to automate indexing of blob content for full text search operations and knowledge mining in Azure Cognitive Search.

author: gmndrg
ms.author: gimondra
manager: nitinme

ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/17/2022
---

# Configure a Blob indexer to import data from Azure Blob Storage

In Azure Cognitive Search, blob [indexers](search-indexer-overview.md) are frequently used for both [AI enrichment](cognitive-search-concept-intro.md) and text-based processing. 

This article focuses on how to configure a blob indexer for text-based indexing, where just the textual content and metadata are loaded into a search index for full text search scenarios. Inputs are your blobs, in a single container. Output is a search index with searchable content and metadata stored in individual fields.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information specific to indexing from Blob Storage.

## Prerequisites

+ [Azure Blob Storage](../storage/blobs/storage-blobs-overview.md), Standard performance (general-purpose v2).

+ [Access tiers](../storage/blobs/access-tiers-overview.md) for Blob storage include hot, cool, and archive. Only hot and cool can be accessed by search indexers.

+ Blob content cannot exceed the [indexer limits](search-limits-quotas-capacity.md#indexer-limits) for your search service tier.

<a name="SupportedFormats"></a>

## Supported document formats

The Azure Cognitive Search blob indexer can extract text from the following document formats:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

## Define the data source

A primary difference between a blob indexer and other indexers is the data source assignment. The data source definition specifies the type ("type": `"azureblob"`) and how to connect.

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

1. Set "credentials" to the connection string, as shown in the above example, or one of the alternative approaches described in the next section. 

1. Set "container" to the blob container within Azure Storage. If the container uses folders to organize content, set "query" to specify a subfolder.

<a name="credentials"></a>

### Supported credentials and connection strings

You can provide the credentials for the blob container in one of these ways:

| Managed identity connection string |
|------------------------------------|
|`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.Storage/storageAccounts/<your storage account name>/;" }`|
|This connection string does not require an account key, but you must follow the instructions for [Setting up a connection to an Azure Storage account using a managed identity](search-howto-managed-identities-storage.md).|

| Full access storage account connection string |
|-----------------------------------------------|
|`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }` |
| You can get the connection string from the Azure portal by navigating to the Storage Account > Settings > Keys (for Classic storage accounts) or Security + networking  > Access keys (for Azure Resource Manager storage accounts). |

| Storage account shared access signature** (SAS) connection string |
|-------------------------------------------------------------------|
| `{ "connectionString" : "BlobEndpoint=https://<your account>.blob.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&srt=co&ss=b&sp=rl;" }` |
| The SAS should have the list and read permissions on containers and objects (blobs in this case). |

| Container shared access signature |
|-----------------------------------|
| `{ "connectionString" : "ContainerSharedAccessUri=https://<your storage account>.blob.core.windows.net/<container name>?sv=2016-05-31&sr=c&sig=<the signature>&se=<the validity end time>&sp=rl;" }` |
| The SAS should have the list and read permissions on the container. For more information on Azure Storage shared access signatures, see [Using Shared Access Signatures](../storage/common/storage-sas-overview.md). |

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to "Credentials provided in the connection string are invalid or have expired".  

## Define search fields for blob data

A [search index](search-what-is-an-index.md) specifies the fields in a search document, attributes, and other constructs that shape the search experience. All indexers require that you specify a search index definition as the destination.

1. [Create or update an index](/rest/api/searchservice/create-index) to define search fields that will store blob content and metadata:

    ```http
    PUT /indexes?api-version=2020-06-30
    {
      "name" : "my-target-index",
      "fields": [
          { "name": "metadata_storage_path", "type": "Edm.String", "key": true, "searchable": false },
          { "name": "content", "type": "Edm.String", "searchable": true, "filterable": false }
      ]
    }
    ```

1. <a name="DocumentKeys"></a> Designate one string field as the document key that uniquely identifies each document. For blob content, the best candidates for a document key are metadata properties on the blob:

   + **`metadata_storage_path`** (default). Using the full path ensures uniqueness, but the path contains `/` characters that are [invalid in a document key](/rest/api/searchservice/naming-rules). Use the [base64Encode function](search-indexer-field-mappings.md#base64EncodeFunction) to encode characters (see the example in the next section). If using the portal to define the indexer, the encoding step is built in.

   + **`metadata_storage_name`** is a candidate, but only if names are unique across all containers and folders you are indexing. When considering this option, watch for characters that are invalid for document keys, such as dashes. You can handle invalid characters by using the [base64Encode function](search-indexer-field-mappings.md#base64EncodeFunction) (see the example in the next section). If you do this, remember to also encode document keys when passing them in API calls such as [Lookup Document (REST)](/rest/api/searchservice/lookup-document). In .NET, you can use the [UrlTokenEncode method](/dotnet/api/system.web.httpserverutility.urltokenencode) to encode characters.

   + A custom metadata property that you add to blobs. This option requires that your blob upload process adds that metadata property to all blobs. Since the key is a required property, any blobs that are missing a value will fail to be indexed. If you use a custom metadata property as a key, avoid making changes to that property. Indexers will add duplicate documents for the same blob if the key property changes.

     > [!NOTE]
     > If there is no explicit mapping for the key field in the index, Azure Cognitive Search automatically uses "metadata_storage_path" as the key and base-64 encodes key values.

1. Add a "content" field if you want to import the content, or text, extracted from blobs. You aren't required to name the field "content", but doing lets you take advantage of implicit field mappings. The blob indexer can send blob contents to a "content" field of type `Edm.String` in the index, with no field mappings required.

1. Add more fields for any blob metadata that you want in the index. The indexer can read custom metadata properties, [standard metadata](#indexing-blob-metadata) properties, and [content-specific metadata](search-blob-metadata-properties.md) properties.

## Set field mappings

Field mappings are a section in the indexer definition that maps source fields to destination fields in the search index.

In blob indexing, you can often omit field mappings because the indexer has built-in support for mapping the "content" property and [blob metadata properties](#indexing-blob-metadata) to fields in an index, assuming the search field name matches the blob property name, and is of the expected data type.

Reasons for [creating an explicit field mapping](search-indexer-field-mappings.md) might be to handle naming or data type differences, or to add functions such as base64encoding, as illustrated in the following examples.

### Example: Base-encoding metadata_storage_name

The following example demonstrates "metadata_storage_name" as the document key. Assume the index has a key field named "key" and another field named "fileSize" for storing the document size. [Field mappings](search-indexer-field-mappings.md) in the indexer definition establish field associations, and "metadata_storage_name" has the [base64Encode field mapping function](search-indexer-field-mappings.md#base64EncodeFunction) to handle unsupported characters.

```http
PUT /indexers/my-blob-indexer?api-version=2020-06-30
{
  "dataSourceName" : "my-blob-datasource ",
  "targetIndexName" : "my-target-index",
  "schedule" : { "interval" : "PT2H" },
  "fieldMappings" : [
    { "sourceFieldName" : "metadata_storage_name", "targetFieldName" : "key", "mappingFunction" : { "name" : "base64Encode" } },
    { "sourceFieldName" : "metadata_storage_size", "targetFieldName" : "fileSize" }
  ]
}
```

### Example: How to make an encoded field "searchable"

There are times when you need to use an encoded version of a field like "metadata_storage_path" as the key, but also need that field to be searchable (without encoding) in the search index. To support both use cases, you can map "metadata_storage_path" to two fields; one for the key (encoded), and a second for a path field that we can assume is attributed as "searchable" in the index schema. The example below shows two field mappings for "metadata_storage_path".

```http
PUT /indexers/blob-indexer?api-version=2020-06-30
{
    "dataSourceName" : " blob-datasource ",
    "targetIndexName" : "my-target-index",
    "schedule" : { "interval" : "PT2H" },
    "fieldMappings" : [
        { "sourceFieldName" : "metadata_storage_path", "targetFieldName" : "key", "mappingFunction" : { "name" : "base64Encode" } },
        { "sourceFieldName" : "metadata_storage_path", "targetFieldName" : "path" }
      ]
}
```

<a name="PartsOfBlobToIndex"></a>

## Set parameters

Blob indexers include parameters that optimize indexing for specific use cases, such as content types (JSON, CSV, PDF), or to specify which parts of the blob to index.

This section describes several of the more frequently used parameters. For the full list, see [Blob configuration parameters reference](/rest/api/searchservice/create-indexer#blob-configuration-parameters).

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) to set its parameters:

   ```json
   "parameters": {
        "batchSize": null,
        "maxFailedItems": 0,
        "maxFailedItemsPerBatch": 0,
        "configuration": {
           "dataToExtract": "contentAndMetadata",
           "parsingMode": "default",
           "imageAction": "none"
        }
   }
   ```

1. Set "dataToExtract" to control which parts of the blobs are indexed:

   + "contentAndMetadata" specifies that all metadata and textual content extracted from the blob are indexed. This is the default value.

   + "storageMetadata" specifies that only the [standard blob properties and user-specified metadata](../storage/blobs/storage-blob-container-properties-metadata.md) are indexed.

   + "allMetadata" specifies that standard blob properties and any [metadata for found content types](search-blob-metadata-properties.md) are extracted from the blob content and indexed.

1. Set "parsingMode" if blobs should be mapped to [multiple search documents](search-howto-index-one-to-many-blobs.md), or if they consist of [plain text](search-howto-index-plaintext-blobs.md), [JSON documents](search-howto-index-json-blobs.md), or [CSV files](search-howto-index-csv-blobs.md).

1. Set "batchSize` if the default (10 documents) is either under utilizing or overwhelming available resources. Default batch sizes are data source specific. Blob indexing sets batch size at 10 documents in recognition of the larger average document size. 

1. See [Handling errors](#handling-errors) for guidance on setting "maxFailedItems" or "maxFailedItemsPerBatch".

<a name="indexing-blob-metadata"></a>

## Indexing blob metadata

Blob metadata can be helpful in search solutions, providing information about blob origin and content types that could be useful for filtering and queries. 

First, any user-specified metadata properties can be extracted verbatim. To receive the values, you must define field in the search index of type `Edm.String`, with same name as the metadata key of the blob. For example, if a blob has a metadata key of `Sensitivity` with value `High`, you should define a field named `Sensitivity` in your search index and it will be populated with the value `High`.

Second, standard blob metadata properties can be extracted into the fields listed below. The blob indexer automatically creates internal field mappings for these blob metadata properties. You still have to add the fields to the index definition, but you can omit creating field mappings in the indexer.

+ **metadata_storage_name** (`Edm.String`) - the file name of the blob. For example, if you have a blob /my-container/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.

+ **metadata_storage_path** (`Edm.String`) - the full URI of the blob, including the storage account. For example, `https://myaccount.blob.core.windows.net/my-container/my-folder/subfolder/resume.pdf`

+ **metadata_storage_content_type** (`Edm.String`) - content type as specified by the code you used to upload the blob. For example, `application/octet-stream`.

+ **metadata_storage_last_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the blob. Azure Cognitive Search uses this timestamp to identify changed blobs, to avoid reindexing everything after the initial indexing.

+ **metadata_storage_size** (`Edm.Int64`) - blob size in bytes.

+ **metadata_storage_content_md5** (`Edm.String`) - MD5 hash of the blob content, if available.

+ **metadata_storage_sas_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the blob. This token should not be stored for later use as it might expire.

Lastly, any metadata properties specific to the document format of the blobs you are indexing can also be represented in the index schema. For more information about content-specific metadata, see [Content metadata properties](search-blob-metadata-properties.md).

It's important to point out that you don't need to define fields for all of the above properties in your search index - just capture the properties you need for your application.

## How blobs are indexed

By default, most blobs are indexed as a single search document in the index, including blobs with structured content, such as JSON or CSV, which are indexed as a single chunk of text. However, for JSON or CSV documents that have an internal structure (delimiters), you can assign parsing modes to generate individual search documents for each line or element. For more information, see [Indexing JSON blobs](search-howto-index-json-blobs.md) and [Indexing CSV blobs](search-howto-index-csv-blobs.md).

A compound or embedded document (such as a ZIP archive, a Word document with embedded Outlook email containing attachments, or a .MSG file with attachments) is also indexed as a single document. For example, all images extracted from the attachments of an .MSG file will be returned in the normalized_images field within the same search document.

<a name="WhichBlobsAreIndexed"></a>

## How to control which blobs are indexed

You can control which blobs are indexed, and which are skipped, by the blob's file type or by setting properties on the blob themselves, causing the indexer to skip over them.

### Include specific file extensions

Use "indexedFileNameExtensions" to provide a comma-separated list of file extensions to index (with a leading dot). For example, to index only the .PDF and .DOCX blobs, do this:

```http
PUT /indexers/[indexer name]?api-version=2020-06-30
{
    "parameters" : { 
        "configuration" : { 
            "indexedFileNameExtensions" : ".pdf, .docx" 
        } 
    }
}
```

### Exclude specific file extensions

Use "excludedFileNameExtensions" to provide a comma-separated list of file extensions to skip (again, with a leading dot). For example, to index all blobs except those with the .PNG and .JPEG extensions, do this:

```http
PUT /indexers/[indexer name]?api-version=2020-06-30
{
    "parameters" : { 
        "configuration" : { 
            "excludedFileNameExtensions" : ".png, .jpeg" 
        } 
    }
}
```

If both "indexedFileNameExtensions" and "excludedFileNameExtensions" parameters are present, the indexer first looks at "indexedFileNameExtensions", then at "excludedFileNameExtensions". If the same file extension is in both lists, it will be excluded from indexing.

### Add "skip" metadata the blob

The indexer configuration parameters apply to all blobs in the container or folder. Sometimes, you want to control how *individual blobs* are indexed. You can do this by adding the following metadata properties and values to blobs in Blob storage. When the indexer encounters this property, it will skip the blob or its content in the indexing run.

| Property name | Property value | Explanation |
| ------------- | -------------- | ----------- |
| "AzureSearch_Skip" |`"true"` |Instructs the blob indexer to completely skip the blob. Neither metadata nor content extraction is attempted. This is useful when a particular blob fails repeatedly and interrupts the indexing process. |
| "AzureSearch_SkipContent" |`"true"` |This is equivalent of "dataToExtract" : "allMetadata" setting described [above](#PartsOfBlobToIndex) scoped to a particular blob. |

## How to index large datasets

Indexing blobs can be a time-consuming process. In cases where you have millions of blobs to index, you can speed up indexing by partitioning your data and using multiple indexers to [process the data in parallel](search-howto-large-index.md#parallel-indexing). Here's how you can set this up:

+ Partition your data into multiple blob containers or virtual folders

+ Set up several data sources, one per container or folder. To point to a blob folder, use the `query` parameter:

    ```json
    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : "my-folder" }
    }
    ```

+ Create a corresponding indexer for each data source. All of the indexers should point to the same target search index.  

+ One search unit in your service can run one indexer at any given time. Creating multiple indexers as described above is only useful if they actually run in parallel.

  To run multiple indexers in parallel, scale out your search service by creating an appropriate number of partitions and replicas. For example, if your search service has 6 search units (for example, 2 partitions x 3 replicas), then 6 indexers can run simultaneously, resulting in a six-fold increase in the indexing throughput. To learn more about scaling and capacity planning, see [Adjust the capacity of an Azure Cognitive Search service](search-capacity-planning.md).

<a name="DealingWithErrors"></a>

## Handling errors

Errors that commonly occur during indexing include unsupported content types, missing content, or oversized blobs.

By default, the blob indexer stops as soon as it encounters a blob with an unsupported content type (for example, an image). You could use the "excludedFileNameExtensions" parameter to skip certain content types. However, you might want to indexing to proceed even if errors occur, and then debug individual documents later. For more information about indexer errors, see [Indexer troubleshooting guidance](search-indexer-troubleshooting.md) and [Indexer errors and warnings](cognitive-search-common-errors-warnings.md).

### Respond to errors

There are four indexer properties that control the indexer's response when errors occur. The following examples show how to set these properties in the indexer definition. If an indexer already exists, you can add these properties by editing the definition in the portal.

#### `"maxFailedItems"` and `"maxFailedItemsPerBatch"`

Continue indexing if errors happen at any point of processing, either while parsing blobs or while adding documents to an index. Set these properties to the number of acceptable failures. A value of `-1` allows processing no matter how many errors occur. Otherwise, the value is a positive integer.

```http
PUT /indexers/[indexer name]?api-version=2020-06-30
{
  "parameters" : { 
    "maxFailedItems" : 10, 
    "maxFailedItemsPerBatch" : 10
  }
}
```

#### `"failOnUnsupportedContentType"` and `"failOnUnprocessableDocument"` 

For some blobs, Azure Cognitive Search is unable to determine the content type, or unable to process a document of an otherwise supported content type. To ignore these failure conditions, set configuration parameters to `false`:

```http
PUT /indexers/[indexer name]?api-version=2020-06-30
{
  "parameters" : { 
    "configuration" : { 
        "failOnUnsupportedContentType" : false, 
        "failOnUnprocessableDocument" : false
    } 
  }
}
```

### Relax indexer constraints

You can also set [blob configuration parameters](/rest/api/searchservice/create-indexer#blob-configuration-parameters) that effectively determine whether an error condition exists. The following property can relax constraints, suppressing errors that would otherwise occur.

+ "indexStorageMetadataOnlyForOversizedDocuments" to index storage metadata for blob content that is too large to process. Oversized blobs are treated as errors by default. For limits on blob size, see [service Limits](search-limits-quotas-capacity.md).

## See also

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [Create an indexer](search-howto-create-indexers.md)
+ [AI enrichment overview](cognitive-search-concept-intro.md)
+ [Search over blobs overview](search-blob-storage-integration.md)
