---
title: Search over Azure Blob storage content
titleSuffix: Azure Cognitive Search
description: Learn how to index Azure Blob Storage and extract text from documents with Azure Cognitive Search.

manager: nitinme
author: mgottein 
ms.author: magottei
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
ms.custom: fasttrack-edit
---

# How to index documents in Azure Blob Storage with Azure Cognitive Search

This article shows how to use Azure Cognitive Search to index documents (such as PDFs, Microsoft Office documents, and several other common formats) stored in Azure Blob storage. First, it explains the basics of setting up and configuring a blob indexer. Then, it offers a deeper exploration of behaviors and scenarios you are likely to encounter.

<a name="SupportedFormats"></a>

## Supported document formats
The blob indexer can extract text from the following document formats:

[!INCLUDE [search-blob-data-sources](../../includes/search-blob-data-sources.md)]

## Setting up blob indexing
You can set up an Azure Blob Storage indexer using:

* [Azure portal](https://ms.portal.azure.com)
* Azure Cognitive Search [REST API](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations)
* Azure Cognitive Search [.NET SDK](https://aka.ms/search-sdk)

> [!NOTE]
> Some features (for example, field mappings) are not yet available in the portal, and have to be used programmatically.
>

Here, we demonstrate the flow using the REST API.

### Step 1: Create a data source
A data source specifies which data to index, credentials needed to access the data, and policies to efficiently identify changes in the data (new, modified, or deleted rows). A data source can be used by multiple indexers in the same search service.

For blob indexing, the data source must have the following required properties:

* **name** is the unique name of the data source within your search service.
* **type** must be `azureblob`.
* **credentials** provides the storage account connection string as the `credentials.connectionString` parameter. See [How to specify credentials](#Credentials) below for details.
* **container** specifies a container in your storage account. By default, all blobs within the container are retrievable. If you only want to index blobs in a particular virtual directory, you can specify that directory using the optional **query** parameter.

To create a data source:

    POST https://[service name].search.windows.net/datasources?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
        "container" : { "name" : "my-container", "query" : "<optional-virtual-directory-name>" }
    }   

For more on the Create Datasource API, see [Create Datasource](https://docs.microsoft.com/rest/api/searchservice/create-data-source).

<a name="Credentials"></a>
#### How to specify credentials ####

You can provide the credentials for the blob container in one of these ways:

- **Full access storage account connection string**: `DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>`
 You can get the connection string from the Azure portal by navigating to the storage account blade > Settings > Keys (for Classic storage accounts) or Settings > Access keys (for Azure Resource Manager storage accounts).
- **Storage account shared access signature** (SAS) connection string: `BlobEndpoint=https://<your account>.blob.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&srt=co&ss=b&sp=rl`
 The SAS should have the list and read permissions on containers and objects (blobs in this case).
-  **Container shared access signature**: `ContainerSharedAccessUri=https://<your storage account>.blob.core.windows.net/<container name>?sv=2016-05-31&sr=c&sig=<the signature>&se=<the validity end time>&sp=rl`
 The SAS should have the list and read permissions on the container.

For more info on storage shared access signatures, see [Using Shared Access Signatures](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to `Credentials provided in the connection string are invalid or have expired.`.  

### Step 2: Create an index
The index specifies the fields in a document, attributes, and other constructs that shape the search experience.

Here's how to create an index with a searchable `content` field to store the text extracted from blobs:   

    POST https://[service name].search.windows.net/indexes?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
          "name" : "my-target-index",
          "fields": [
            { "name": "id", "type": "Edm.String", "key": true, "searchable": false },
            { "name": "content", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false }
          ]
    }

For more on creating indexes, see [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index)

### Step 3: Create an indexer
An indexer connects a data source with a target search index, and provides a schedule to automate the data refresh.

Once the index and data source have been created, you're ready to create the indexer:

    POST https://[service name].search.windows.net/indexers?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "blob-indexer",
      "dataSourceName" : "blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" }
    }

This indexer will run every two hours (schedule interval is set to "PT2H"). To run an indexer every 30 minutes, set the interval to "PT30M". The shortest supported interval is 5 minutes. The schedule is optional - if omitted, an indexer runs only once when it's created. However, you can run an indexer on-demand at any time.   

For more details on the Create Indexer API, check out [Create Indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).

For more information about defining indexer schedules see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

<a name="how-azure-search-indexes-blobs"></a>

## How Azure Cognitive Search indexes blobs

Depending on the [indexer configuration](#PartsOfBlobToIndex), the blob indexer can index storage metadata only (useful when you only care about the metadata and don't need to index the content of blobs), storage and content metadata, or both metadata and textual content. By default, the indexer extracts both metadata and content.

> [!NOTE]
> By default, blobs with structured content such as JSON or CSV are indexed as a single chunk of text. If you want to index JSON and CSV blobs in a structured way, see [Indexing JSON blobs](search-howto-index-json-blobs.md) and [Indexing CSV blobs](search-howto-index-csv-blobs.md) for more information.
>
> A compound or embedded document (such as a ZIP archive or a Word document with embedded Outlook email containing attachments) is also indexed as a single document.

* The textual content of the document is extracted into a string field named `content`.

> [!NOTE]
> Azure Cognitive Search limits how much text it extracts depending on the pricing tier: 32,000 characters for Free tier, 64,000 for Basic, 4 million for Standard, 8 million for Standard S2, and 16 million for Standard S3. A warning is included in the indexer status response for truncated documents.  

* User-specified metadata properties present on the blob, if any, are extracted verbatim. Note that this requires a field to be defined in the index with the same name as the metadata key of the blob. For example, if your blob has a metadata key of `Sensitivity` with value `High`, you should define a field named `Sensitivity` in your search index and it will be populated with the value `High`.
* Standard blob metadata properties are extracted into the following fields:

  * **metadata\_storage\_name** (Edm.String) - the file name of the blob. For example, if you have a blob /my-container/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.
  * **metadata\_storage\_path** (Edm.String) - the full URI of the blob, including the storage account. For example, `https://myaccount.blob.core.windows.net/my-container/my-folder/subfolder/resume.pdf`
  * **metadata\_storage\_content\_type** (Edm.String) - content type as specified by the code you used to upload the blob. For example, `application/octet-stream`.
  * **metadata\_storage\_last\_modified** (Edm.DateTimeOffset) - last modified timestamp for the blob. Azure Cognitive Search uses this timestamp to identify changed blobs, to avoid reindexing everything after the initial indexing.
  * **metadata\_storage\_size** (Edm.Int64) - blob size in bytes.
  * **metadata\_storage\_content\_md5** (Edm.String) - MD5 hash of the blob content, if available.
  * **metadata\_storage\_sas\_token** (Edm.String) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the blob. This token should not be stored for later use as it might expire.

* Metadata properties specific to each document format are extracted into the fields listed [here](#ContentSpecificMetadata).

You don't need to define fields for all of the above properties in your search index - just capture the properties you need for your application.

> [!NOTE]
> Often, the field names in your existing index will be different from the field names generated during document extraction. You can use **field mappings** to map the property names provided by Azure Cognitive Search to the field names in your search index. You will see an example of field mappings use below.
>
>

<a name="DocumentKeys"></a>
### Defining document keys and field mappings
In Azure Cognitive Search, the document key uniquely identifies a document. Every search index must have exactly one key field of type Edm.String. The key field is required for each document that is being added to the index (it is actually the only required field).  

You should carefully consider which extracted field should map to the key field for your index. The candidates are:

* **metadata\_storage\_name** - this might be a convenient candidate, but note that 1) the names might not be unique, as you may have blobs with the same name in different folders, and 2) the name may contain characters that are invalid in document keys, such as dashes. You can deal with invalid characters by using the `base64Encode` [field mapping function](search-indexer-field-mappings.md#base64EncodeFunction) - if you do this, remember to encode document keys when passing them in API calls such as Lookup. (For example, in .NET you can use the [UrlTokenEncode method](https://msdn.microsoft.com/library/system.web.httpserverutility.urltokenencode.aspx) for that purpose).
* **metadata\_storage\_path** - using the full path ensures uniqueness, but the path definitely contains `/` characters that are [invalid in a document key](https://docs.microsoft.com/rest/api/searchservice/naming-rules).  As above, you have the option of encoding the keys using the `base64Encode` [function](search-indexer-field-mappings.md#base64EncodeFunction).
* If none of the options above work for you, you can add a custom metadata property to the blobs. This option does, however, require your blob upload process to add that metadata property to all blobs. Since the key is a required property, all blobs that don't have that property will fail to be indexed.

> [!IMPORTANT]
> If there is no explicit mapping for the key field in the index, Azure Cognitive Search automatically uses `metadata_storage_path` as the key and base-64 encodes key values (the second option above).
>
>

For this example, let's pick the `metadata_storage_name` field as the document key. Let's also assume your index has a key field named `key` and a field `fileSize` for storing the document size. To wire things up as desired, specify the following field mappings when creating or updating your indexer:

    "fieldMappings" : [
      { "sourceFieldName" : "metadata_storage_name", "targetFieldName" : "key", "mappingFunction" : { "name" : "base64Encode" } },
      { "sourceFieldName" : "metadata_storage_size", "targetFieldName" : "fileSize" }
    ]

To bring this all together, here's how you can add field mappings and enable base-64 encoding of keys for an existing indexer:

    PUT https://[service name].search.windows.net/indexers/blob-indexer?api-version=2019-05-06
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

> [!NOTE]
> To learn more about field mappings, see [this article](search-indexer-field-mappings.md).
>
>

<a name="WhichBlobsAreIndexed"></a>
## Controlling which blobs are indexed
You can control which blobs are indexed, and which are skipped.

### Index only the blobs with specific file extensions
You can index only the blobs with the file name extensions you specify by using the `indexedFileNameExtensions` indexer configuration parameter. The value is a string containing a comma-separated list of file extensions (with a leading dot). For example, to index only the .PDF and .DOCX blobs, do this:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }
    }

### Exclude blobs with specific file extensions
You can exclude blobs with specific file name extensions from indexing by using the `excludedFileNameExtensions` configuration parameter. The value is a string containing a comma-separated list of file extensions (with a leading dot). For example, to index all blobs except those with the .PNG and .JPEG extensions, do this:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "excludedFileNameExtensions" : ".png,.jpeg" } }
    }

If both `indexedFileNameExtensions` and `excludedFileNameExtensions` parameters are present, Azure Cognitive Search first looks at `indexedFileNameExtensions`, then at `excludedFileNameExtensions`. This means that if the same file extension is present in both lists, it will be excluded from indexing.

<a name="PartsOfBlobToIndex"></a>
## Controlling which parts of the blob are indexed

You can control which parts of the blobs are indexed using the `dataToExtract` configuration parameter. It can take the following values:

* `storageMetadata` - specifies that only the [standard blob properties and user-specified metadata](../storage/blobs/storage-properties-metadata.md) are indexed.
* `allMetadata` - specifies that storage metadata and the [content-type specific metadata](#ContentSpecificMetadata) extracted from the blob content are indexed.
* `contentAndMetadata` - specifies that all metadata and textual content extracted from the blob are indexed. This is the default value.

For example, to index only the storage metadata, use:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "dataToExtract" : "storageMetadata" } }
    }

### Using blob metadata to control how blobs are indexed

The configuration parameters described above apply to all blobs. Sometimes, you may want to control how *individual blobs* are indexed. You can do this by adding the following blob metadata properties and values:

| Property name | Property value | Explanation |
| --- | --- | --- |
| AzureSearch_Skip |"true" |Instructs the blob indexer to completely skip the blob. Neither metadata nor content extraction is attempted. This is useful when a particular blob fails repeatedly and interrupts the indexing process. |
| AzureSearch_SkipContent |"true" |This is equivalent of `"dataToExtract" : "allMetadata"` setting described [above](#PartsOfBlobToIndex) scoped to a particular blob. |

<a name="DealingWithErrors"></a>
## Dealing with errors

By default, the blob indexer stops as soon as it encounters a blob with an unsupported content type (for example, an image). You can of course use the `excludedFileNameExtensions` parameter to skip certain content types. However, you may need to index blobs without knowing all the possible content types in advance. To continue indexing when an unsupported content type is encountered, set the `failOnUnsupportedContentType` configuration parameter to `false`:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "failOnUnsupportedContentType" : false } }
    }

For some blobs, Azure Cognitive Search is unable to determine the content type, or unable to process a document of otherwise supported content type. To ignore this failure mode, set the `failOnUnprocessableDocument` configuration parameter to false:

      "parameters" : { "configuration" : { "failOnUnprocessableDocument" : false } }

Azure Cognitive Search limits the size of blobs that are indexed. These limits are documented in [Service Limits in Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity). Oversized blobs are treated as errors by default. However, you can still index storage metadata of oversized blobs if you set `indexStorageMetadataOnlyForOversizedDocuments` configuration parameter to true: 

    "parameters" : { "configuration" : { "indexStorageMetadataOnlyForOversizedDocuments" : true } }

You can also continue indexing if errors happen at any point of processing, either while parsing blobs or while adding documents to an index. To ignore a specific number of errors, set the `maxFailedItems` and `maxFailedItemsPerBatch` configuration parameters to the desired values. For example:

    {
      ... other parts of indexer definition
      "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 10 }
    }

## Incremental indexing and deletion detection

When you set up a blob indexer to run on a schedule, it reindexes only the changed blobs, as determined by the blob's `LastModified` timestamp.

> [!NOTE]
> You don't have to specify a change detection policy – incremental indexing is enabled for you automatically.

To support deleting documents, use a "soft delete" approach. If you delete the blobs outright, corresponding documents will not be removed from the search index.

There are two ways to implement the soft delete approach. Both are described below.

### Native blob soft delete (preview)

> [!IMPORTANT]
> Support for native blob soft delete is in preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The [REST API version 2019-05-06-Preview](https://docs.microsoft.com/azure/search/search-api-preview) provides this feature. There is currently no portal or .NET SDK support.

> [!NOTE]
> When using the native blob soft delete policy the document keys for the documents in your index must either be a blob property or blob metadata.

In this method you will use the [native blob soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) feature offered by Azure Blob storage. If native blob soft delete is enabled on your storage account, your data source has a native soft delete policy set, and the indexer finds a blob that has been transitioned to a soft deleted state, the indexer will remove that document from the index. The native blob soft delete policy is not supported when indexing blobs from Azure Data Lake Storage Gen2.

Use the following steps:
1. Enable [native soft delete for Azure Blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete). We recommend setting the retention policy to a value that's much higher than your indexer interval schedule. This way if there's an issue running the indexer or if you have a large number of documents to index, there's plenty of time for the indexer to eventually process the soft deleted blobs. Azure Cognitive Search indexers will only delete a document from the index if it processes the blob while it's in a soft deleted state.
1. Configure a native blob soft deletion detection policy on the data source. An example is shown below. Since this feature is in preview, you must use the preview REST API.
1. Run the indexer or set the indexer to run on a schedule. When the indexer runs and processes the blob the document will be removed from the index.

    ```
    PUT https://[service name].search.windows.net/datasources/blob-datasource?api-version=2019-05-06-Preview
    Content-Type: application/json
    api-key: [admin key]
    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : null },
        "dataDeletionDetectionPolicy" : {
            "@odata.type" :"#Microsoft.Azure.Search.NativeBlobSoftDeleteDeletionDetectionPolicy"
        }
    }
    ```

#### Reindexing undeleted blobs

If you delete a blob from Azure Blob storage with native soft delete enabled on your storage account the blob will transition to a soft deleted state giving you the option to undelete that blob within the retention period. When an Azure Cognitive Search data source has a native blob soft delete policy and the indexer processes a soft deleted blob it will remove that document from the index. If that blob is later undeleted the indexer will not always reindex that blob. This is because the indexer determines which blobs to index based on the blob's `LastModified` timestamp. When a soft deleted blob is undeleted its `LastModified` timestamp does not get updated, so if the indexer has already processed blobs with `LastModified` timestamps more recent than the undeleted blob it won't reindex the undeleted blob. To make sure that an undeleted blob is reindexed, you will need to update the blob's `LastModified` timestamp. One way to do this is by resaving the metadata of that blob. You don't need to change the metadata but resaving the metadata will update the blob's `LastModified` timestamp so that the indexer knows that it needs to reindex this blob.

### Soft delete using custom metadata

In this method you will use a blob's metadata to indicate when a document should be removed from the search index.

Use the following steps:

1. Add a custom metadata key-value pair to the blob to indicate to Azure Cognitive Search that it is logically deleted.
1. Configure a soft deletion column detection policy on the data source. An example is shown below.
1. Once the indexer has processed the blob and deleted the document from the index, you can delete the blob for Azure Blob storage.

For example, the following policy considers a blob to be deleted if it has a metadata property `IsDeleted` with the value `true`:

    PUT https://[service name].search.windows.net/datasources/blob-datasource?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : null },
        "dataDeletionDetectionPolicy" : {
            "@odata.type" :"#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",     
            "softDeleteColumnName" : "IsDeleted",
            "softDeleteMarkerValue" : "true"
        }
    }

#### Reindexing undeleted blobs

If you set a soft delete column detection policy on your data source, then add the custom metadata to a blob with the marker value, then run the indexer, the indexer will remove that document from the index. If you would like to reindex that document, simply change the soft delete metadata value for that blob and rerun the indexer.

## Indexing large datasets

Indexing blobs can be a time-consuming process. In cases where you have millions of blobs to index, you can speed up indexing by partitioning your data and using multiple indexers to process the data in parallel. Here's how you can set this up:

- Partition your data into multiple blob containers or virtual folders
- Set up several Azure Cognitive Search data sources, one per container or folder. To point to a blob folder, use the `query` parameter:

    ```
    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : "my-folder" }
    }
    ```

- Create a corresponding indexer for each data source. All the indexers can point to the same target search index.  

- One search unit in your service can run one indexer at any given time. Creating multiple indexers as described above is only useful if they actually run in parallel. To run multiple indexers in parallel, scale out your search service by creating an appropriate number of partitions and replicas. For example, if your search service has 6 search units (for example, 2 partitions x 3 replicas), then 6 indexers can run simultaneously, resulting in a six-fold increase in the indexing throughput. To learn more about scaling and capacity planning, see [Scale resource levels for query and indexing workloads in Azure Cognitive Search](search-capacity-planning.md).

## Indexing documents along with related data

You may want to "assemble" documents from multiple sources in your index. For example, you may want to merge text from blobs with other metadata stored in Cosmos DB. You can even use the push indexing API together with various indexers to  build up search documents from multiple parts. 

For this to work, all indexers and other components need to agree on the document key. For additional details on this topic, refer to [Index multiple Azure data sources](https://docs.microsoft.com/azure/search/tutorial-multiple-data-sources). For a detailed walk-through, see this external article: [Combine documents with other data in Azure Cognitive Search](https://blog.lytzen.name/2017/01/combine-documents-with-other-data-in.html).

<a name="IndexingPlainText"></a>
## Indexing plain text 

If all your blobs contain plain text in the same encoding, you can significantly improve indexing performance by using **text parsing mode**. To use text parsing mode, set the `parsingMode` configuration property to `text`:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2019-05-06
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "parsingMode" : "text" } }
    }

By default, the `UTF-8` encoding is assumed. To specify a different encoding, use the `encoding` configuration property: 

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "parsingMode" : "text", "encoding" : "windows-1252" } }
    }


<a name="ContentSpecificMetadata"></a>
## Content type-specific metadata properties
The following table summarizes processing done for each document format, and describes the metadata properties extracted by Azure Cognitive Search.

| Document format / content type | Content-type specific metadata properties | Processing details |
| --- | --- | --- |
| HTML (text/html) |`metadata_content_encoding`<br/>`metadata_content_type`<br/>`metadata_language`<br/>`metadata_description`<br/>`metadata_keywords`<br/>`metadata_title` |Strip HTML markup and extract text |
| PDF (application/pdf) |`metadata_content_type`<br/>`metadata_language`<br/>`metadata_author`<br/>`metadata_title` |Extract text, including embedded documents (excluding images) |
| DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| DOC (application/msword) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| DOCM (application/vnd.ms-word.document.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| WORD XML (application/vnd.ms-word2006ml) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Strip XML markup and extract text |
| WORD 2003 XML (application/vnd.ms-wordml) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date` |Strip XML markup and extract text |
| XLSX (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XLS (application/vnd.ms-excel) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XLSM (application/vnd.ms-excel.sheet.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| PPTX (application/vnd.openxmlformats-officedocument.presentationml.presentation) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| PPT (application/vnd.ms-powerpoint) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| PPTM (application/vnd.ms-powerpoint.presentation.macroenabled.12) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| MSG (application/vnd.ms-outlook) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_from_email`<br/>`metadata_message_to`<br/>`metadata_message_to_email`<br/>`metadata_message_cc`<br/>`metadata_message_cc_email`<br/>`metadata_message_bcc`<br/>`metadata_message_bcc_email`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_subject` |Extract text, including attachments. `metadata_message_to_email`, `metadata_message_cc_email` and `metadata_message_bcc_email` are string collections, the rest of the fields are strings.|
| ODT (application/vnd.oasis.opendocument.text) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| ODS (application/vnd.oasis.opendocument.spreadsheet) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| ODP (application/vnd.oasis.opendocument.presentation) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`title` |Extract text, including embedded documents |
| ZIP (application/zip) |`metadata_content_type` |Extract text from all documents in the archive |
| GZ (application/gzip) |`metadata_content_type` |Extract text from all documents in the archive |
| EPUB (application/epub+zip) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_title`<br/>`metadata_description`<br/>`metadata_language`<br/>`metadata_keywords`<br/>`metadata_identifier`<br/>`metadata_publisher` |Extract text from all documents in the archive |
| XML (application/xml) |`metadata_content_type`<br/>`metadata_content_encoding`<br/> |Strip XML markup and extract text |
| JSON (application/json) |`metadata_content_type`<br/>`metadata_content_encoding` |Extract text<br/>NOTE: If you need to extract multiple document fields from a JSON blob, see [Indexing JSON blobs](search-howto-index-json-blobs.md) for details |
| EML (message/rfc822) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_to`<br/>`metadata_message_cc`<br/>`metadata_creation_date`<br/>`metadata_subject` |Extract text, including attachments |
| RTF (application/rtf) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_page_count`<br/>`metadata_word_count`<br/> | Extract text|
| Plain text (text/plain) |`metadata_content_type`<br/>`metadata_content_encoding`<br/> | Extract text|


## Help us make Azure Cognitive Search better
If you have feature requests or ideas for improvements, let us know on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).
