---
title: Configure a Blob indexer
titleSuffix: Azure Cognitive Search
description: Set up an Azure Blob indexer to automate indexing of blob content for full text search operations in Azure Cognitive Search.

manager: nitinme
author: MarkHeff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/03/2021
---

# How to configure a blob indexer in Azure Cognitive Search

This article shows you how to configure a blob indexer for indexing text-based documents (such as PDFs, Microsoft Office documents, and several other common formats) in Azure Cognitive Search. If you're unfamiliar with indexer concepts and creation, start with [Indexers in Azure Cognitive Search](search-indexer-overview.md) and [Create a search indexer](search-howto-create-indexers.md) before diving into blob indexing.

<a name="SupportedFormats"></a>

## Supported formats

The blob indexer can extract text from the following document formats:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

## Data source definitions

The difference between a blob indexer and any other indexer is the data source definition that's assigned to the indexer. The data source encapsulates all properties that specify the type, connection, and location of the content to be indexed.

A blob data source definition looks similar to the example below:

```http
{
    "name" : "my-blob-datasource",
    "type" : "azureblob",
    "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
    "container" : { "name" : "my-container", "query" : "<optional-virtual-directory-name>" }
}
```

The `"credentials"` property can be a connection string, as shown in the above example, or one of the alternative approaches described in the next section. The `"container"` property provides the location of content within Azure Storage. For more information about data source definitions, see [Create Datasource (REST)](/rest/api/searchservice/create-data-source).

<a name="Credentials"></a>

## Credentials

You can provide the credentials for the blob container in one of these ways:

**Managed identity connection string**:
`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.Storage/storageAccounts/<your storage account name>/;" }`

This connection string does not require an account key, but you must follow the instructions for [Setting up a connection to an Azure Storage account using a managed identity](search-howto-managed-identities-storage.md).

**Full access storage account connection string**: 
`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }`

You can get the connection string from the Azure portal by navigating to the storage account blade > Settings > Keys (for Classic storage accounts) or Settings > Access keys (for Azure Resource Manager storage accounts).

**Storage account shared access signature** (SAS) connection string: 
`{ "connectionString" : "BlobEndpoint=https://<your account>.blob.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&srt=co&ss=b&sp=rl;" }`

The SAS should have the list and read permissions on containers and objects (blobs in this case).

**Container shared access signature**: 
`{ "connectionString" : "ContainerSharedAccessUri=https://<your storage account>.blob.core.windows.net/<container name>?sv=2016-05-31&sr=c&sig=<the signature>&se=<the validity end time>&sp=rl;" }`

The SAS should have the list and read permissions on the container. 

For more information on storage shared access signatures, see [Using Shared Access Signatures](../storage/common/storage-sas-overview.md).

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to `Credentials provided in the connection string are invalid or have expired.`.  

## Index definitions

The index specifies the fields in a document, attributes, and other constructs that shape the search experience. The following examples create a simple index using the [Create Index (REST API)](/rest/api/searchservice/create-index). The searchable `content` field is used to store the text extracted from blobs:

```http
POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
      "name" : "my-target-index",
      "fields": [
        { "name": "id", "type": "Edm.String", "key": true, "searchable": false },
        { "name": "content", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false }
      ]
}
```

<a name="DocumentKeys"></a>

### Defining document keys and field mappings

In a search index, the document key uniquely identifies each document. The field you choose must be of type `Edm.String`. For blob content, the best candidates for a document key are metadata properties on the blob.

+ **`metadata_storage_name`** - this might be a convenient candidate, but note that 1) the names might not be unique, as you may have blobs with the same name in different folders, and 2) the name may contain characters that are invalid in document keys, such as dashes. You can deal with invalid characters by using the `base64Encode` [field mapping function](search-indexer-field-mappings.md#base64EncodeFunction) - if you do this, remember to encode document keys when passing them in API calls such as Lookup. (For example, in .NET you can use the [UrlTokenEncode method](/dotnet/api/system.web.httpserverutility.urltokenencode) for that purpose).

+ **`metadata_storage_path`** - using the full path ensures uniqueness, but the path definitely contains `/` characters that are [invalid in a document key](/rest/api/searchservice/naming-rules).  As above, you have the option of encoding the keys using the `base64Encode` [function](search-indexer-field-mappings.md#base64EncodeFunction).

+ A third option is to add a custom metadata property to the blobs. This option does, however, require that your blob upload process adds that metadata property to all blobs. Since the key is a required property, all blobs that don't have that property will fail to be indexed.

> [!IMPORTANT]
> If there is no explicit mapping for the key field in the index, Azure Cognitive Search automatically uses `metadata_storage_path` as the key and base-64 encodes key values (the second option above).
>

For this example, let's pick the `metadata_storage_name` field as the document key. Let's also assume your index has a key field named `key` and a field `fileSize` for storing the document size. To wire things up as desired, specify the following field mappings when creating or updating your indexer:

```http
"fieldMappings" : [
  { "sourceFieldName" : "metadata_storage_name", "targetFieldName" : "key", "mappingFunction" : { "name" : "base64Encode" } },
  { "sourceFieldName" : "metadata_storage_size", "targetFieldName" : "fileSize" }
]
```

To bring this all together, here's how you can add field mappings and enable base-64 encoding of keys for an existing indexer:

```http
PUT https://[service name].search.windows.net/indexers/blob-indexer?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  "dataSourceName" : " blob-datasource ",
  "targetIndexName" : "my-target-index",
  "schedule" : { "interval" : "PT2H" },
  "fieldMappings" : [
    { "sourceFieldName" : "metadata_storage_name", "targetFieldName" : "key", "mappingFunction" : { "name" : "base64Encode" } },
    { "sourceFieldName" : "metadata_storage_size", "targetFieldName" : "fileSize" }
  ]
}
```

For more information, see [Field mappings and transformations](search-indexer-field-mappings.md).

#### What if you need to encode a field to use it as a key, but you also want to search it?

There are times when you need to use an encoded version of a field like metadata_storage_path as the key, but you also need that field to be searchable (without encoding). In order to resolve this issue, you can map it into two fields; one that will be used for the key, and another one that will be used for search purposes. In the example below the *key* field contains the encoded path, while the *path* field is not encoded and will be used as the searchable field in the index.

```http
PUT https://[service name].search.windows.net/indexers/blob-indexer?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

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

## Index parts of a blob

Blobs contain content and metadata. You can control which parts of the blobs are indexed using the `dataToExtract` configuration parameter. It can take the following values:

+ `contentAndMetadata` - specifies that all metadata and textual content extracted from the blob are indexed. This is the default value.

+ `storageMetadata` - specifies that only the [standard blob properties and user-specified metadata](../storage/blobs/storage-blob-container-properties-metadata.md) are indexed.

+ `allMetadata` - specifies that standard blob properties and any [metadata for found content types](search-blob-metadata-properties.md) are extracted from the blob content and indexed.

For example, to index only the storage metadata, use:

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "dataToExtract" : "storageMetadata" } }
}
```

<!-- ### Using blob metadata to control how blobs are indexed

The configuration parameters described above apply to all blobs. Sometimes, you may want to control how *individual blobs* are indexed. You can do this by adding the following blob metadata properties and values:

| Property name | Property value | Explanation |
| ------------- | -------------- | ----------- |
| AzureSearch_Skip |"true" |Instructs the blob indexer to completely skip the blob. Neither metadata nor content extraction is attempted. This is useful when a particular blob fails repeatedly and interrupts the indexing process. |
| AzureSearch_SkipContent |"true" |This is equivalent of `"dataToExtract" : "allMetadata"` setting described [above](#PartsOfBlobToIndex) scoped to a particular blob. | -->

<a name="how-azure-search-indexes-blobs"></a>

### Indexing content

By default, blobs with structured content, such as JSON or CSV, are indexed as a single chunk of text. If you want to index JSON and CSV blobs in a structured way, see [Indexing JSON blobs](search-howto-index-json-blobs.md) and [Indexing CSV blobs](search-howto-index-csv-blobs.md).

A compound or embedded document (such as a ZIP archive, a Word document with embedded Outlook email containing attachments, or a .MSG file with attachments) is also indexed as a single document. For example, all images extracted from the attachments of an .MSG file will be returned in the normalized_images field.

The textual content of the document is extracted into a string field named `content`.

  > [!NOTE]
  > Azure Cognitive Search limits how much text it extracts depending on the pricing tier: 32,000 characters for Free tier, 64,000 for Basic, 4 million for Standard, 8 million for Standard S2, and 16 million for Standard S3. A warning is included in the indexer status response for truncated documents.  

### Indexing metadata

Indexers can also index metadata.

+ User-specified metadata properties present on the blob, if any, are extracted verbatim. Note that this requires a field to be defined in the index with the same name as the metadata key of the blob. For example, if your blob has a metadata key of `Sensitivity` with value `High`, you should define a field named `Sensitivity` in your search index and it will be populated with the value `High`.

+ Standard blob metadata properties are extracted into the following fields:

  + **metadata\_storage\_name** (`Edm.String`) - the file name of the blob. For example, if you have a blob /my-container/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.

  + **metadata\_storage\_path** (`Edm.String`) - the full URI of the blob, including the storage account. For example, `https://myaccount.blob.core.windows.net/my-container/my-folder/subfolder/resume.pdf`

  + **metadata\_storage\_content\_type** (`Edm.String`) - content type as specified by the code you used to upload the blob. For example, `application/octet-stream`.

  + **metadata\_storage\_last\_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the blob. Azure Cognitive Search uses this timestamp to identify changed blobs, to avoid reindexing everything after the initial indexing.

  + **metadata\_storage\_size** (`Edm.Int64`) - blob size in bytes.

  + **metadata\_storage\_content\_md5** (`Edm.String`) - MD5 hash of the blob content, if available.

  + **metadata\_storage\_sas\_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the blob. This token should not be stored for later use as it might expire.

+ Metadata properties specific to each document format are extracted into the fields listed [here](search-blob-metadata-properties.md).

You don't need to define fields for all of the above properties in your search index - just capture the properties you need for your application.

> [!NOTE]
> Often, the field names in your existing index will be different from the field names generated during document extraction. You can use **field mappings** to map the property names provided by Azure Cognitive Search to the field names in your search index. You will see an example of field mappings use below.
>

<a name="WhichBlobsAreIndexed"></a>

## Index by file type

You can control which blobs are indexed, and which are skipped.

### Include blobs having specific file extensions

Use `indexedFileNameExtensions` to provide a comma-separated list of file extensions to index (with a leading dot). For example, to index only the .PDF and .DOCX blobs, do this:

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }
}
```

### Exclude blobs having specific file extensions

Use `excludedFileNameExtensions` to provide a comma-separated list of file extensions to skip (with a leading dot). For example, to index all blobs except those with the .PNG and .JPEG extensions, do this:

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "excludedFileNameExtensions" : ".png,.jpeg" } }
}
```

If both `indexedFileNameExtensions` and `excludedFileNameExtensions` parameters are present, the indexer first looks at `indexedFileNameExtensions`, then at `excludedFileNameExtensions`. If the same file extension is in both lists, it will be excluded from indexing.

## Index large datasets

Indexing blobs can be a time-consuming process. In cases where you have millions of blobs to index, you can speed up indexing by partitioning your data and using multiple indexers to process the data in parallel. Here's how you can set this up:

+ Partition your data into multiple blob containers or virtual folders

+ Set up several Azure Cognitive Search data sources, one per container or folder. To point to a blob folder, use the `query` parameter:

    ```json
    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : "my-folder" }
    }
    ```

+ Create a corresponding indexer for each data source. All the indexers can point to the same target search index.  

+ One search unit in your service can run one indexer at any given time. Creating multiple indexers as described above is only useful if they actually run in parallel. To run multiple indexers in parallel, scale out your search service by creating an appropriate number of partitions and replicas. For example, if your search service has 6 search units (for example, 2 partitions x 3 replicas), then 6 indexers can run simultaneously, resulting in a six-fold increase in the indexing throughput. To learn more about scaling and capacity planning, see [Adjust the capacity of an Azure Cognitive Search service](search-capacity-planning.md).

<a name="DealingWithErrors"></a>

## Handle errors

Errors that commonly occur during indexing include unsupported content types, missing content, or oversized blobs.

By default, the blob indexer stops as soon as it encounters a blob with an unsupported content type (for example, an image). You could use the `excludedFileNameExtensions` parameter to skip certain content types. However, you might want to indexing to proceed even if errors occur, and then debug individual documents later. For more information about indexer errors, see [Troubleshooting common indexer issues](search-indexer-troubleshooting.md) and [Indexer errors and warnings](cognitive-search-common-errors-warnings.md).

### Respond to errors

There are four indexer properties that control the indexer's response when errors occur. The following examples show how to set these properties in the indexer definition. If an indexer already exists, you can add these properties by editing the definition in the portal.

#### `"maxFailedItems"` and `"maxFailedItemsPerBatch"`

Continue indexing if errors happen at any point of processing, either while parsing blobs or while adding documents to an index. Set these properties to the number of acceptable failures. A value of `-1` allows processing no matter how many errors occur. Otherwise, the value is a positive integer.

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 10 }
}
```

#### `"failOnUnsupportedContentType"` and `"failOnUnprocessableDocument"` 

For some blobs, Azure Cognitive Search is unable to determine the content type, or unable to process a document of an otherwise supported content type. To ignore these failure conditions, set configuration parameters to `false`:

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
  ... other parts of indexer definition
  "parameters" : { "configuration" : { "failOnUnsupportedContentType" : false, "failOnUnprocessableDocument" : false } }
}
```

### Relax indexer constraints

You can also set [blob configuration properties](/rest/api/searchservice/create-indexer#blob-configuration-parameters) that effectively determine whether an error condition exists. The following properties relax constraints, suppressing errors that would otherwise occur.

+ `"excludedFileNameExtensions"` to exclude by file type.
+ `"indexedFileNameExtensions"` to include specific file types.
+ `"indexStorageMetadataOnlyForOversizedDocuments"` to index storage metadata for blob content that is too large to process. Oversized blobs are treated as errors by default. For limits on blob size, see [service Limits](search-limits-quotas-capacity.md).
+ `"dataToExtract"` to specify whether the indexer reads `"storageMetadata"`, `"allMetadata"`, or `"contentAndMetadata"` (default).

## See also

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [Understand blobs using AI](search-blob-ai-integration.md)
+ [Blob indexing overview](search-blob-storage-integration.md)