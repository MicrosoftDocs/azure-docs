---
title: Configure a Blob indexer
titleSuffix: Azure Cognitive Search
description: Set up an Azure Blob indexer to automate indexing of blob content for full text search operations in Azure Cognitive Search.

manager: nitinme
author: MarkHeff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/22/2021
ms.custom: contperf-fy21q3
---

# How to configure blob indexing in Cognitive Search

A blob indexer is used for ingesting content from Azure Blob storage into a Cognitive Search index. Blob indexers are frequently used in [AI enrichment](cognitive-search-concept-intro.md), where an attached [skillset](cognitive-search-working-with-skillsets.md) adds image and natural language processing to create searchable content. But you can also use blob indexers without AI enrichment, to ingest content from text-based documents such as PDFs, Microsoft Office documents, and file formats.

This article shows you how to configure a blob indexer for either scenario. If you're unfamiliar with indexer concepts, start with [Indexers in Azure Cognitive Search](search-indexer-overview.md) and [Create a search indexer](search-howto-create-indexers.md) before diving into blob indexing.

<a name="SupportedFormats"></a>

## Supported document formats

The Azure Cognitive Search blob indexer can extract text from the following document formats:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

## Data source definitions

The primary difference between a blob indexer and any other indexer is the data source definition that's assigned to the indexer. The data source definition specifies the data source type ("type": "azureblob"), as well as other properties for authentication and connection to the content to be indexed.

A blob data source definition looks similar to the example below:

```http
{
    "name" : "my-blob-datasource",
    "type" : "azureblob",
    "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
    "container" : { "name" : "my-container", "query" : "<optional-virtual-directory-name>" }
}
```

The `"credentials"` property can be a connection string, as shown in the above example, or one of the alternative approaches described in the next section. The `"container"` property provides the location of content within Azure Storage, and `"query"` is used to specify a subfolder in the container. For more information about data source definitions, see [Create Data Source (REST)](/rest/api/searchservice/create-data-source).

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

The SAS should have the list and read permissions on the container. For more information on storage shared access signatures, see [Using Shared Access Signatures](../storage/common/storage-sas-overview.md).

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to "Credentials provided in the connection string are invalid or have expired".  

## Index definitions

The index specifies the fields in a document, attributes, and other constructs that shape the search experience. All indexers require that you specify a search index definition as the destination. The following example creates a simple index using the [Create Index (REST API)](/rest/api/searchservice/create-index). 

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

Index definitions require one field in the `"fields"` collection to act as the document key. Index definitions should also include fields for content and metadata.

A **`content`** field is common to blob content. It contains the text extracted from blobs. Your definition of this field might look similar to the one above. You aren't required to use this name, but doing lets you take advantage of implicit field mappings. The blob indexer can send blob contents to a content Edm.String field in the index, with no field mappings required.

You could also add fields for any blob metadata that you want in the index. The indexer can read custom metadata properties, [standard metadata](#indexing-blob-metadata) properties, and [content-specific metadata](search-blob-metadata-properties.md) properties. For more information about indexes, see [Create an index](search-what-is-an-index.md).

<a name="DocumentKeys"></a>

### Defining document keys and field mappings

In a search index, the document key uniquely identifies each document. The field you choose must be of type `Edm.String`. For blob content, the best candidates for a document key are metadata properties on the blob.

+ **`metadata_storage_name`** - this property is a candidate, but only if names are unique across all containers and folders you are indexing. Regardless of blob location, the end result is that the document key (name) must be unique in the search index after all content has been indexed. 

  Another potential issue about the storage name is that it might contain characters that are invalid for document keys, such as dashes. You can handle invalid characters by using the `base64Encode` [field mapping function](search-indexer-field-mappings.md#base64EncodeFunction). If you do this, remember to also encode document keys when passing them in API calls such as [Lookup Document (REST)](/rest/api/searchservice/lookup-document). In .NET, you can use the [UrlTokenEncode method](/dotnet/api/system.web.httpserverutility.urltokenencode) to encode characters.

+ **`metadata_storage_path`** - using the full path ensures uniqueness, but the path definitely contains `/` characters that are [invalid in a document key](/rest/api/searchservice/naming-rules). As above, you can use the `base64Encode` [function](search-indexer-field-mappings.md#base64EncodeFunction) to encode characters.

+ A third option is to add a custom metadata property to the blobs. This option requires that your blob upload process adds that metadata property to all blobs. Since the key is a required property, any blobs that are missing a value will fail to be indexed.

> [!IMPORTANT]
> If there is no explicit mapping for the key field in the index, Azure Cognitive Search automatically uses `metadata_storage_path` as the key and base-64 encodes key values (the second option above).
>

#### Example

The following example demonstrates `metadata_storage_name` as the document key. Assume the index has a key field named `key` and another field named `fileSize` for storing the document size. [Field mappings](search-indexer-field-mappings.md) in the indexer definition establish field associations, and `metadata_storage_name` has the [`base64Encode` field mapping function](search-indexer-field-mappings.md#base64EncodeFunction) to handle unsupported characters.

```http
PUT https://[service name].search.windows.net/indexers/my-blob-indexer?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

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

#### How to make an encoded field "searchable"

There are times when you need to use an encoded version of a field like `metadata_storage_path` as the key, but also need that field to be searchable (without encoding) in the search index. To support both use cases, you can map `metadata_storage_path` to two fields; one for the key (encoded), and a second for a path field that we can assume is attributed as "searchable" in the index schema. The example below shows two field mappings for `metadata_storage_path`.

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

## Index content and metadata

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

<a name="how-azure-search-indexes-blobs"></a>

### Indexing blob content

By default, blobs with structured content, such as JSON or CSV, are indexed as a single chunk of text. But if the JSON or CSV documents have an internal structure (delimiters), you can assign parsing modes to generate individual search documents for each line or element. For more information, see [Indexing JSON blobs](search-howto-index-json-blobs.md) and [Indexing CSV blobs](search-howto-index-csv-blobs.md).

A compound or embedded document (such as a ZIP archive, a Word document with embedded Outlook email containing attachments, or a .MSG file with attachments) is also indexed as a single document. For example, all images extracted from the attachments of an .MSG file will be returned in the normalized_images field.

The textual content of the document is extracted into a string field named `content`.

  > [!NOTE]
  > Azure Cognitive Search limits how much text it extracts depending on the pricing tier. The current [service limits](search-limits-quotas-capacity.md#indexer-limits) are 32,000 characters for Free tier, 64,000 for Basic, 4 million for Standard, 8 million for Standard S2, and 16 million for Standard S3. A warning is included in the indexer status response for truncated documents.  

<a name="indexing-blob-metadata"></a>

### Indexing blob metadata

Indexers can also index blob metadata. First, any user-specified metadata properties can be extracted verbatim. To receive the values, you must define field in the search index of type `Edm.String`, with same name as the metadata key of the blob. For example, if a blob has a metadata key of `Sensitivity` with value `High`, you should define a field named `Sensitivity` in your search index and it will be populated with the value `High`.

Second, standard blob metadata properties can be extracted into the fields listed below. The blob indexer automatically creates internal field mappings for these blob metadata properties. You still have to add the fields you want to use the index definition, but you can omit creating field mappings in the indexer.

  + **metadata_storage_name** (`Edm.String`) - the file name of the blob. For example, if you have a blob /my-container/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.

  + **metadata_storage_path** (`Edm.String`) - the full URI of the blob, including the storage account. For example, `https://myaccount.blob.core.windows.net/my-container/my-folder/subfolder/resume.pdf`

  + **metadata_storage_content_type** (`Edm.String`) - content type as specified by the code you used to upload the blob. For example, `application/octet-stream`.

  + **metadata_storage_last_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the blob. Azure Cognitive Search uses this timestamp to identify changed blobs, to avoid reindexing everything after the initial indexing.

  + **metadata_storage_size** (`Edm.Int64`) - blob size in bytes.

  + **metadata_storage_content_md5** (`Edm.String`) - MD5 hash of the blob content, if available.

  + **metadata_storage_sas_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the blob. This token should not be stored for later use as it might expire.

Lastly, any metadata properties specific to the document format of the blobs you are indexing can also be represented in the index schema. For more information about content-specific metadata, see [Content metadata properties](search-blob-metadata-properties.md).

It's important to point out that you don't need to define fields for all of the above properties in your search index - just capture the properties you need for your application.

<a name="WhichBlobsAreIndexed"></a>

## How to control which blobs are indexed

You can control which blobs are indexed, and which are skipped, by the blob's file type or by setting properties on the blob themselves, causing the indexer to skip over them.

### Include specific file extensions

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

### Exclude specific file extensions

Use `excludedFileNameExtensions` to provide a comma-separated list of file extensions to skip (again, with a leading dot). For example, to index all blobs except those with the .PNG and .JPEG extensions, do this:

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

### Add "skip" metadata the blob

The indexer configuration parameters apply to all blobs in the container or folder. Sometimes, you want to control how *individual blobs* are indexed. You can do this by adding the following metadata properties and values to blobs in Blob storage. When the indexer encounters this properties, it will skip the blob or its content in the indexing run.

| Property name | Property value | Explanation |
| ------------- | -------------- | ----------- |
| `AzureSearch_Skip` |`"true"` |Instructs the blob indexer to completely skip the blob. Neither metadata nor content extraction is attempted. This is useful when a particular blob fails repeatedly and interrupts the indexing process. |
| `AzureSearch_SkipContent` |`"true"` |This is equivalent of `"dataToExtract" : "allMetadata"` setting described [above](#PartsOfBlobToIndex) scoped to a particular blob. |

## Index large datasets

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

You can also set [blob configuration properties](/rest/api/searchservice/create-indexer#blob-configuration-parameters) that effectively determine whether an error condition exists. The following property can relax constraints, suppressing errors that would otherwise occur.

+ `"indexStorageMetadataOnlyForOversizedDocuments"` to index storage metadata for blob content that is too large to process. Oversized blobs are treated as errors by default. For limits on blob size, see [service Limits](search-limits-quotas-capacity.md).

## See also

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [Create an indexer](search-howto-create-indexers.md)
+ [AI enrichment over blobs overview](search-blob-ai-integration.md)
+ [Search over blobs overview](search-blob-storage-integration.md)