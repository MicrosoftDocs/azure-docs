---
title: Azure Files indexing (preview)
titleSuffix: Azure Cognitive Search
description: Set up an Azure Files indexer to automate indexing of file shares in Azure Cognitive Search.
manager: nitinme
author: mattmsft
ms.author: magottei
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/17/2022
---

# Index data from Azure Files

> [!IMPORTANT] 
> Azure Files indexer is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use a [preview REST API (2020-06-30-preview or later)](search-api-preview.md) to create the indexer data source.

In this article, learn the steps for extracting content and metadata from file shares in Azure Storage and sending the content to a search index in Azure Cognitive Search. The resulting index can be queried using full text search.

This article supplements [**Create an indexer**](search-howto-create-indexers.md) with information specific to indexing files in Azure Storage.

## Prerequisites

+ [Azure Files](https://azure.microsoft.com/services/storage/files/), Transaction Optimized tier.

+ An [SMB file share](../storage/files/files-smb-protocol.md) providing the source content. [NFS shares](../storage/files/files-nfs-protocol.md#support-for-azure-storage-features) are not supported.

+ Files should contain non-binary textual content for text-based indexing. This indexer also supports [AI enrichment](cognitive-search-concept-intro.md) if you have binary files.

## Supported document formats

The Azure Files indexer can extract text from the following document formats:

[!INCLUDE [search-document-data-sources](../../includes/search-blob-data-sources.md)]

## Define the data source

A primary difference between a file share indexer and other indexers is the data source assignment. The data source definition specifies "type": `"azurefile"`, a content path, and how to connect.

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

A data source definition can also include additional properties for [soft deletion policies](#soft-delete-using-custom-metadata) and [field mappings](search-indexer-field-mappings.md) if field names and types are not the same.

<a name="Credentials"></a>

### Supported credentials and connection strings

Indexers can connect to a file share using the following connections.

**Full access storage account connection string**:
`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }`

You can get the connection string from the Storage account page in Azure portal by selecting **Access keys** in the left navigation pane. Make sure to select a full connection string and not just a key.

**Managed identity connection string**:
`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.Storage/storageAccounts/<your storage account name>/;" }`

This connection string requires [configuring your search service as a trusted service](search-howto-managed-identities-storage.md) under Azure Active Directory,and then granting **Reader and data access** rights to the search service in Azure Storage. 

**Storage account shared access signature** (SAS) connection string:
`{ "connectionString" : "BlobEndpoint=https://<your account>.file.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&sp=rl&sr=s;" }`

The SAS should have the list and read permissions on file shares.

**Container shared access signature**: 
`{ "connectionString" : "ContainerSharedAccessUri=https://<your storage account>.file.core.windows.net/<share name>?sv=2016-05-31&sr=s&sig=<the signature>&se=<the validity end time>&sp=rl;" }`

The SAS should have the list and read permissions on the file share. For more information on storage shared access signatures, see [Using Shared Access Signatures](../storage/common/storage-sas-overview.md).

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to "Credentials provided in the connection string are invalid or have expired".

## Add search fields to an index

In the [search index](search-what-is-an-index.md), add fields to accept the content and metadata of your Azure files. 

1. [Create or update an index](/rest/api/searchservice/create-index) to define search fields that will store file content, metadata, and system properties:

    ```json
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

1. Create a key field ("key": true) to uniquely identify each search document based on unique identifiers in the files. For this data source type, the indexer will automatically identify and encode a value for this field. No field mappings are necessary.

1. Add a "content" field to store extracted text from each file. 

1. Add fields for standard metadata properties. In file indexing, the standard metadata properties are the same as blob metadata properties. The file indexer automatically creates internal field mappings for these properties that converts hyphenated property names to underscored property names. You still have to add the fields you want to use the index definition, but you can omit creating field mappings in the data source.

    + **metadata_storage_name** (`Edm.String`) - the file name. For example, if you have a file /my-share/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.
    + **metadata_storage_path** (`Edm.String`) - the full URI of the file, including the storage account. For example, `https://myaccount.file.core.windows.net/my-share/my-folder/subfolder/resume.pdf`
    + **metadata_storage_content_type** (`Edm.String`) - content type as specified by the code you used to upload the file. For example, `application/octet-stream`.
    + **metadata_storage_last_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the file. Azure Cognitive Search uses this timestamp to identify changed files, to avoid reindexing everything after the initial indexing.
    + **metadata_storage_size** (`Edm.Int64`) - file size in bytes.
    + **metadata_storage_content_md5** (`Edm.String`) - MD5 hash of the file content, if available.
    + **metadata_storage_sas_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the file. This token shouldn't be stored for later use as it might expire.

## Configure the file indexer

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

1. See [Create an indexer](search-howto-create-indexers.md) for more information about other properties.

## Change and deletion detection

After an initial search index is created, you might want subsequent indexer jobs to pick up only new and changed documents. Fortunately, content in Azure Storage is timestamped, which gives indexers sufficient information for determining what's new and changed automatically. For search content that originates from Azure File Storage, the indexer keeps track of the file's `LastModified` timestamp and reindexes only new and changed files.

Although change detection is a given, deletion detection is not. If you want to detect deleted files, make sure to use a "soft delete" approach. If you delete the files outright in a file share, corresponding search documents will not be removed from the search index.

## Soft delete using custom metadata

This method uses a file's metadata to determine whether a search document should be removed from the index. This method requires two separate actions, deleting the search document from the index, followed by file deletion in Azure Storage.

There are steps to follow in both File storage and Cognitive Search, but there are no other feature dependencies. 

1. Add a custom metadata key-value pair to the file in Azure storage to indicate to Azure Cognitive Search that it is logically deleted.

1. Configure a soft deletion column detection policy on the data source. For example, the following policy considers a file to be deleted if it has a metadata property `IsDeleted` with the value `true`:

    ```http
    PUT https://[service name].search.windows.net/datasources/file-datasource?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
        "name" : "file-datasource",
        "type" : "azurefile",
        "credentials" : { "connectionString" : "<your storage connection string>" },
        "container" : { "name" : "my-share", "query" : null },
        "dataDeletionDetectionPolicy" : {
            "@odata.type" :"#Microsoft.Azure.Search.SoftDeleteColumnDeletionDetectionPolicy",
            "softDeleteColumnName" : "IsDeleted",
            "softDeleteMarkerValue" : "true"
        }
    }
    ```

1. Once the indexer has processed the file and deleted the document from the search index, you can delete the file in Azure Storage.

### Reindexing undeleted files (using custom metadata)

After an indexer processes a deleted file and removes the corresponding search document from the index, it won't revisit that file if you restore it later if the file's `LastModified` timestamp is older than the last indexer run.

If you would like to reindex that document, change the `"softDeleteMarkerValue" : "false"` for that file and rerun the indexer.

## See also

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [What is Azure Files?](../storage/files/storage-files-introduction.md)
