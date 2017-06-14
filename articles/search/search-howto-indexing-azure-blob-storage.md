---
title: Indexing Azure Blob Storage with Azure Search
description: Learn how to index Azure Blob Storage and extract text from documents with Azure Search
services: search
documentationcenter: ''
author: chaosrealm
manager: pablocas
editor: ''

ms.assetid: 2a5968f4-6768-4e16-84d0-8b995592f36a
ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 04/15/2017
ms.author: eugenesh
---

# Indexing Documents in Azure Blob Storage with Azure Search
This article shows how to use Azure Search to index documents (such as PDFs, Microsoft Office documents, and several other common formats) stored in Azure Blob storage. First, it explains the basics of setting up and configuring a blob indexer. Then, it offers a deeper exploration of behaviors and scenarios you are likely to encounter.

## Supported document formats
The blob indexer can extract text from the following document formats:

* PDF
* Microsoft Office formats: DOCX/DOC, XLSX/XLS, PPTX/PPT, MSG (Outlook emails)  
* HTML
* XML
* ZIP
* EML
* Plain text files  
* JSON (see [Indexing JSON blobs](search-howto-index-json-blobs.md) preview feature)
* CSV (see [Indexing CSV blobs](search-howto-index-csv-blobs.md) preview feature)

> [!IMPORTANT]
> Support for CSV and JSON arrays is currently in preview. These formats are available only using version **2015-02-28-Preview** of the REST API or version 2.x-preview of the .NET SDK. Please remember, preview APIs are intended for testing and evaluation, and should not be used in production environments.
>
>

## Setting up blob indexing
You can set up an Azure Blob Storage indexer using:

* [Azure portal](https://ms.portal.azure.com)
* Azure Search [REST API](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations)
* Azure Search [.NET SDK](https://aka.ms/search-sdk)

> [!NOTE]
> Some features (for example, field mappings) are not yet available in the portal, and have to be used programmatically.
>
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

    POST https://[service name].search.windows.net/datasources?api-version=2016-09-01
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

- **Full access storage account connection string**: `DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>`. You can get the connection string from the Azure portal by navigating to the storage account blade > Settings > Keys (for Classic storage accounts) or Settings > Access keys (for Azure Resource Manager storage accounts).
- **Storage account shared access signature** (SAS) connection string: `BlobEndpoint=https://<your account>.blob.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&srt=co&ss=b&sp=rl`. The SAS should have the list and read permissions on containers and objects (blobs in this case).
-  **Container shared access signature**: `ContainerSharedAccessUri=https://<your storage account>.blob.core.windows.net/<container name>?sv=2016-05-31&sr=c&sig=<the signature>&se=<the validity end time>&sp=rl`. The SAS should have the list and read permissions on the container.

For more info on storage shared access signatures, see [Using Shared Access Signatures](../storage/storage-dotnet-shared-access-signature-part-1.md).

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to `Credentials provided in the connection string are invalid or have expired.`.  

### Step 2: Create an index
The index specifies the fields in a document, attributes, and other constructs that shape the search experience.

Here's how to create an index with a searchable `content` field to store the text extracted from blobs:   

    POST https://[service name].search.windows.net/indexes?api-version=2016-09-01
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

    POST https://[service name].search.windows.net/indexers?api-version=2016-09-01
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

## How Azure Search indexes blobs

Depending on the [indexer configuration](#PartsOfBlobToIndex), the blob indexer can index storage metadata only (useful when you only care about the metadata and don't need to index the content of blobs), storage and content metadata, or both metadata and textual content. By default, the indexer extracts both metadata and content.

> [!NOTE]
> By default, blobs with structured content such as JSON or CSV are indexed as a single chunk of text. If you want to index JSON and CSV blobs in a structured way, see [Indexing JSON blobs](search-howto-index-json-blobs.md) and [Indexing CSV blobs](search-howto-index-csv-blobs.md) preview features.
> 
> A compound or embedded document (such as a ZIP archive or a Word document with embedded Outlook email containing attachments) is also indexed as a single document.

* The textual content of the document is extracted into a string field named `content`.

> [!NOTE]
> Azure Search limits how much text it extracts depending on the pricing tier: 32,000 characters for Free tier, 64,000 for Basic, and 4 million for Standard, Standard S2 and Standard S3 tiers. A warning is included in the indexer status response for truncated documents.  

* User-specified metadata properties present on the blob, if any, are extracted verbatim.
* Standard blob metadata properties are extracted into the following fields:

  * **metadata\_storage\_name** (Edm.String) - the file name of the blob. For example, if you have a blob /my-container/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.
  * **metadata\_storage\_path** (Edm.String) - the full URI of the blob, including the storage account. For example, `https://myaccount.blob.core.windows.net/my-container/my-folder/subfolder/resume.pdf`
  * **metadata\_storage\_content\_type** (Edm.String) - content type as specified by the code you used to upload the blob. For example, `application/octet-stream`.
  * **metadata\_storage\_last\_modified** (Edm.DateTimeOffset) - last modified timestamp for the blob. Azure Search uses this timestamp to identify changed blobs, to avoid reindexing everything after the initial indexing.
  * **metadata\_storage\_size** (Edm.Int64) - blob size in bytes.
  * **metadata\_storage\_content\_md5** (Edm.String) - MD5 hash of the blob content, if available.
* Metadata properties specific to each document format are extracted into the fields listed [here](#ContentSpecificMetadata).

You don't need to define fields for all of the above properties in your search index - just capture the properties you need for your application.

> [!NOTE]
> Often, the field names in your existing index will be different from the field names generated during document extraction. You can use **field mappings** to map the property names provided by Azure Search to the field names in your search index. You will see an example of field mappings use below.
>
>

<a name="DocumentKeys"></a>
### Defining document keys and field mappings
In Azure Search, the document key uniquely identifies a document. Every search index must have exactly one key field of type Edm.String. The key field is required for each document that is being added to the index (it is actually the only required field).  

You should carefully consider which extracted field should map to the key field for your index. The candidates are:

* **metadata\_storage\_name** - this might be a convenient candidate, but note that 1) the names might not be unique, as you may have blobs with the same name in different folders, and 2) the name may contain characters that are invalid in document keys, such as dashes. You can deal with invalid characters by using the `base64Encode` [field mapping function](search-indexer-field-mappings.md#base64EncodeFunction) - if you do this, remember to encode document keys when passing them in API calls such as Lookup. (For example, in .NET you can use the [UrlTokenEncode method](https://msdn.microsoft.com/library/system.web.httpserverutility.urltokenencode.aspx) for that purpose).
* **metadata\_storage\_path** - using the full path ensures uniqueness, but the path definitely contains `/` characters that are [invalid in a document key](https://docs.microsoft.com/rest/api/searchservice/naming-rules).  As above, you have the option of encoding the keys using the `base64Encode` [function](search-indexer-field-mappings.md#base64EncodeFunction).
* If none of the options above work for you, you can add a custom metadata property to the blobs. This option does, however, require your blob upload process to add that metadata property to all blobs. Since the key is a required property, all blobs that don't have that property will fail to be indexed.

> [!IMPORTANT]
> If there is no explicit mapping for the key field in the index, Azure Search automatically uses `metadata_storage_path` as the key and base-64 encodes key values (the second option above).
>
>

For this example, let's pick the `metadata_storage_name` field as the document key. Let's also assume your index has a key field named `key` and a field `fileSize` for storing the document size. To wire things up as desired, specify the following field mappings when creating or updating your indexer:

    "fieldMappings" : [
      { "sourceFieldName" : "metadata_storage_name", "targetFieldName" : "key", "mappingFunction" : { "name" : "base64Encode" } },
      { "sourceFieldName" : "metadata_storage_size", "targetFieldName" : "fileSize" }
    ]

To bring this all together, here's how you can add field mappings and enable base-64 encoding of keys for an existing indexer:

    PUT https://[service name].search.windows.net/indexers/blob-indexer?api-version=2016-09-01
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

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2016-09-01
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }
    }

### Exclude blobs with specific file extensions
You can exclude blobs with specific file name extensions from indexing by using the `excludedFileNameExtensions` configuration parameter. The value is a string containing a comma-separated list of file extensions (with a leading dot). For example, to index all blobs except those with the .PNG and .JPEG extensions, do this:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2016-09-01
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "excludedFileNameExtensions" : ".png,.jpeg" } }
    }

If both `indexedFileNameExtensions` and `excludedFileNameExtensions` parameters are present, Azure Search first looks at `indexedFileNameExtensions`, then at `excludedFileNameExtensions`. This means that if the same file extension is present in both lists, it will be excluded from indexing.

### Dealing with unsupported content types

By default, the blob indexer stops as soon as it encounters a blob with an unsupported content type (for example, an image). You can of course use the `excludedFileNameExtensions` parameter to skip certain content types. However, you may need to index blobs without knowing all the possible content types in advance. To continue indexing when an unsupported content type is encountered, set the `failOnUnsupportedContentType` configuration parameter to `false`:

	PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2016-09-01
    Content-Type: application/json
    api-key: [admin key]

    {
      ... other parts of indexer definition
      "parameters" : { "configuration" : { "failOnUnsupportedContentType" : false } }
    }

### Ignoring parsing errors

Azure Search document extraction logic isn't perfect and will sometimes fail to parse documents of a supported content type, such as .DOCX or .PDF. If you do not want to interrupt the indexing in such cases, set the `maxFailedItems` and `maxFailedItemsPerBatch` configuration parameters to some reasonable values. For example:

	{
	  ... other parts of indexer definition
	  "parameters" : { "maxFailedItems" : 10, "maxFailedItemsPerBatch" : 10 }
	}

<a name="PartsOfBlobToIndex"></a>
## Controlling which parts of the blob are indexed

You can control which parts of the blobs are indexed using the `dataToExtract` configuration parameter. It can take the following values:

* `storageMetadata` - specifies that only the [standard blob properties and user-specified metadata](../storage/storage-properties-metadata.md) are indexed.
* `allMetadata` - specifies that storage metadata and the [content-type specific metadata](#ContentSpecificMetadata) extracted from the blob content are indexed.
* `contentAndMetadata` - specifies that all metadata and textual content extracted from the blob are indexed. This is the default value.

For example, to index only the storage metadata, use:

    PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2016-09-01
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

## Incremental indexing and deletion detection
When you set up a blob indexer to run on a schedule, it re-indexes only the changed blobs, as determined by the blob's `LastModified` timestamp.

> [!NOTE]
> You don't have to specify a change detection policy – incremental indexing is enabled for you automatically.

To support deleting documents, use a "soft delete" approach. If you delete the blobs outright, corresponding documents will not be removed from the search index. Instead, use the following steps:  

1. Add a custom metadata property to the blob to indicate to Azure Search that it is logically deleted
2. Configure a soft deletion detection policy on the data source
3. Once the indexer has processed the blob (as shown by the indexer status API), you can physically delete the blob

For example, the following policy considers a blob to be deleted if it has a metadata property `IsDeleted` with the value `true`:

    PUT https://[service name].search.windows.net/datasources/blob-datasource?api-version=2016-09-01
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "blob-datasource",
        "type" : "azureblob",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-container", "query" : "my-folder" },
        "dataDeletionDetectionPolicy" : {
            "@odata.type" :"#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",     
            "softDeleteColumnName" : "IsDeleted",
            "softDeleteMarkerValue" : "true"
        }
    }   

## Indexing large datasets

Indexing blobs can be a time-consuming process. In cases where you have millions of blobs to index, you can speed up indexing by partitioning your data and using multiple indexers to process the data in parallel. Here's how you can set this up:

- Partition your data into multiple blob containers or virtual folders
- Set up several Azure Search data sources, one per container or folder. To point to a blob folder, use the `query` parameter:

	```
	{
	    "name" : "blob-datasource",
	    "type" : "azureblob",
	    "credentials" : { "connectionString" : "<your storage connection string>" },
		"container" : { "name" : "my-container", "query" : "my-folder" }
	}
	```

- Create a corresponding indexer for each data source. All the indexers can point to the same target search index.  

## Indexing documents along with related data

Your documents may have associated metadata - for example, the department that created the document - that's stored as structured data in one of the following locations.
-   In a separate data store, such as SQL Database or Azure Cosmos DB.
-   Directly attached to each document in Azure Blob Storage as custom metadata. (For more info, see [Setting and Retrieving Properties and Metadata for Blob Resources](https://docs.microsoft.com/rest/api/storageservices/setting-and-retrieving-properties-and-metadata-for-blob-resources).)

You can index the documents along with their metadata by assigning the same unique key value to each document and to its metadata, and by specifying the `mergeOrUpload` action for each indexer. For a detailed description of this solution, see this external article: [Combine documents with other data in Azure Search ](http://blog.lytzen.name/2017/01/combine-documents-with-other-data-in.html).

<a name="ContentSpecificMetadata"></a>
## Content type-specific metadata properties
The following table summarizes processing done for each document format, and describes the metadata properties extracted by Azure Search.

| Document format / content type | Content-type specific metadata properties | Processing details |
| --- | --- | --- |
| HTML (`text/html`) |`metadata_content_encoding`<br/>`metadata_content_type`<br/>`metadata_language`<br/>`metadata_description`<br/>`metadata_keywords`<br/>`metadata_title` |Strip HTML markup and extract text |
| PDF (`application/pdf`) |`metadata_content_type`<br/>`metadata_language`<br/>`metadata_author`<br/>`metadata_title` |Extract text, including embedded documents (excluding images) |
| DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| DOC (application/msword) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_character_count`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_page_count`<br/>`metadata_word_count` |Extract text, including embedded documents |
| XLSX (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| XLS (application/vnd.ms-excel) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified` |Extract text, including embedded documents |
| PPTX (application/vnd.openxmlformats-officedocument.presentationml.presentation) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| PPT (application/vnd.ms-powerpoint) |`metadata_content_type`<br/>`metadata_author`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_slide_count`<br/>`metadata_title` |Extract text, including embedded documents |
| MSG (application/vnd.ms-outlook) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_to`<br/>`metadata_message_cc`<br/>`metadata_message_bcc`<br/>`metadata_creation_date`<br/>`metadata_last_modified`<br/>`metadata_subject` |Extract text, including attachments |
| ZIP (application/zip) |`metadata_content_type` |Extract text from all documents in the archive |
| XML (application/xml) |`metadata_content_type`</br>`metadata_content_encoding`</br> |Strip XML markup and extract text |
| JSON (application/json) |`metadata_content_type`</br>`metadata_content_encoding` |Extract text<br/>NOTE: If you need to extract multiple document fields from a JSON blob, see [Indexing JSON blobs](search-howto-index-json-blobs.md) for details |
| EML (message/rfc822) |`metadata_content_type`<br/>`metadata_message_from`<br/>`metadata_message_to`<br/>`metadata_message_cc`<br/>`metadata_creation_date`<br/>`metadata_subject` |Extract text, including attachments |
| Plain text (text/plain) |`metadata_content_type`</br>`metadata_content_encoding`</br> | |

## Help us make Azure Search better
If you have feature requests or ideas for improvements, let us know on our [UserVoice site](https://feedback.azure.com/forums/263029-azure-search/).
