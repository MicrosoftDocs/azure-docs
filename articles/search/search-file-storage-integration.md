---
title: Azure Files indexer (preview)
titleSuffix: Azure Cognitive Search
description: Set up an Azure Files indexer to automate indexing of file shares in Azure Cognitive Search.
manager: nitinme
author: mattmsft
ms.author: magottei
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/19/2022
---

# Index data from Azure Files

> [!IMPORTANT] 
> Azure Files indexer is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use a [preview REST API (2020-06-30-preview or later)](search-api-preview.md) to create the indexer data source.

Configure a [search indexer](search-indexer-overview.md) to extract content from Azure File Storage and make it searchable in Azure Cognitive Search. 

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information specific to indexing files in Azure Storage.

## Prerequisites

+ [Azure Files](../storage/files/storage-how-to-use-files-portal.md), Transaction Optimized tier.

+ An [SMB file share](../storage/files/files-smb-protocol.md) providing the source content. [NFS shares](../storage/files/files-nfs-protocol.md#support-for-azure-storage-features) are not supported.

+ Files containing text. If you have binary data, you can include [AI enrichment](cognitive-search-concept-intro.md) for image analysis.

## Supported document formats

The Azure Files indexer can extract text from the following document formats:

[!INCLUDE [search-document-data-sources](../../includes/search-blob-data-sources.md)]

## Define the data source

The data source definition specifies the data source type, content path, and how to connect.

1. [Create or update a data source](/rest/api/searchservice/preview-api/create-or-update-data-source) to set its definition, using a preview API version 2020-06-30-Preview or 2021-04-30-Preview for "type": `"azurefile"`.

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

| Managed identity connection string |
|------------------------------------|
|`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.Storage/storageAccounts/<your storage account name>/;" }`|
|This connection string does not require an account key, but you must have previously configured a search service to [connect using a managed identity](search-howto-managed-identities-storage.md).|

| Full access storage account connection string |
|-----------------------------------------------|
|`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }` |
| You can get the connection string from the Storage account page in Azure portal by selecting **Access keys** in the left navigation pane. Make sure to select a full connection string and not just a key. |

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
          { "name": "metadata_storage_content_type", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true },        
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
    + **metadata_storage_last_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the file. Azure Cognitive Search uses this timestamp to identify changed files, to avoid reindexing everything after the initial indexing.
    + **metadata_storage_size** (`Edm.Int64`) - file size in bytes.
    + **metadata_storage_content_md5** (`Edm.String`) - MD5 hash of the file content, if available.
    + **metadata_storage_sas_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the file. This token shouldn't be stored for later use as it might expire.

## Configure the file indexer

Indexer configuration specifies the inputs, parameters, and properties controlling run time behaviors. Under "configuration", you can specify which files are indexed by file type or by properties on the files themselves.

1. [Create or update an indexer](/rest/api/searchservice/create-indexer) to use the predefined data source and search index.

    ```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    {
      "name" : "my-file-indexer,
      "dataSourceName" : "my-file-datasource",
      "targetIndexName" : "my-search-index",
      "parameters": {
        "batchSize": null,
        "maxFailedItems": null,
        "maxFailedItemsPerBatch": null,
        "base64EncodeKeys": null,
        "configuration:" {
            "indexedFileNameExtensions" : ".pdf,.docx",
            "excludedFileNameExtensions" : ".png,.jpeg" 
        }
      },
      "schedule" : { },
      "fieldMappings" : [ ]
    }
    ```

1. In the optional "configuration" section, provide any inclusion or exclusion criteria. If left unspecified, all files in the file share are retrieved.

   If both `indexedFileNameExtensions` and `excludedFileNameExtensions` parameters are present, Azure Cognitive Search first looks at `indexedFileNameExtensions`, then at `excludedFileNameExtensions`. If the same file extension is present in both lists, it will be excluded from indexing.

1. [Specify field mappings](search-indexer-field-mappings.md) if there are differences in field name or type, or if you need multiple versions of a source field in the search index.

   In file indexing, you can often omit field mappings because the indexer has built-in support for mapping the "content" and metadata properties to similarly named and typed fields in an index. For metadata properties, the indexer will automatically replace hyphens `-` with underscores in the search index.

1. See [Create an indexer](search-howto-create-indexers.md) for more information about other properties.

## Next steps

You can now [run the indexer](search-howto-run-reset-indexers.md), [monitor status](search-howto-monitor-indexers.md), or [schedule indexer execution](search-howto-schedule-indexers.md). The following articles apply to indexers that pull content from Azure Storage:

+ [Change detection and deletion detection](search-howto-index-changed-deleted-blobs.md)
+ [Index large data sets](search-howto-large-index.md)
