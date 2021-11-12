---
title: Index data from Azure Files (preview)
titleSuffix: Azure Cognitive Search
description: Set up an Azure Files indexer to automate indexing of file shares in Azure Cognitive Search.
manager: nitinme
author: mattmsft
ms.author: magottei
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/02/2021
---

# Index data from Azure Files

> [!IMPORTANT] 
> Azure Files is currently in public preview under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use a [preview REST API (2021-04-30-preview or later)](search-api-preview.md) to index your content. There is currently limited portal support and no .NET SDK support.

In this article, review the basic workflow for extracting content and metadata from Azure file shares and sending it to a search index in Azure Cognitive Search. The resulting index can be queried using full text search.

> [!NOTE]
> Already familiar with the workflow and composition? [How to configure a file indexer](#configure) is your next step.

## Functionality

An indexer in Azure Cognitive Search is a crawler that extracts searchable data and metadata from a data source. The Azure Files indexer will connect to your Azure file share and index files. The indexer provides the following functionality:

+ Index content from an Azure file share.
+ The indexer will support incremental indexing meaning that it will identify which content in the Azure file share has changed and only index the updated content on future indexing runs. For example, if 5 PDFs are originally indexed by the indexer, then 1 is updated, then the indexer runs again, the indexer will only index the 1 PDF that was updated.
+ Text and normalized images will be extracted by default from the files that are indexed. Optionally a skillset can be added to the pipeline for further content enrichment. More information on skillsets can be found in the article [Skillset concepts in Azure Cognitive Search](cognitive-search-working-with-skillsets.md).

## Supported document formats

The Azure Cognitive Search Azure Files indexer can extract text from the following document formats:

[!INCLUDE [search-document-data-sources](../../includes/search-blob-data-sources.md)]

## Required resources

You need both Azure Cognitive Search and [Azure Files](https://azure.microsoft.com/services/storage/files/). Within Azure Files, you need a file share that provides source content.

> [!NOTE]
> To index a file share, it must support access through the [file data plane REST API](/rest/api/storageservices/file-service-rest-api). [NFS shares](../storage/files/files-nfs-protocol.md#support-for-azure-storage-features) do not support the file data plane REST API and cannot be used with Azure Cognitive Search indexers.[SMB shares](../storage/files/files-smb-protocol.md) support the file data plane REST API and can be used with Azure Cognitive Search indexers.

<a name="configure"></a>

## Configuring a file indexer

Azure File indexers share many common configuration options with [Azure Blob indexers](search-howto-indexing-azure-blob-storage.md). For example, Azure File indexers support [producing multiple search documents from a single file](search-howto-index-one-to-many-blobs.md), [plain text files](search-howto-index-plaintext-blobs.md), [JSON files](search-howto-index-json-blobs.md), and [encrypted files](search-howto-index-encrypted-blobs.md). Many of the same [configuration options](search-howto-indexing-azure-blob-storage.md) also apply. Important differences are highlighted below.

## Data source definitions

The primary difference between a file indexer and any other indexer is the data source definition that's assigned to the indexer. The data source definition specifies the data source type ("type": "azurefile"), and other properties for authentication and connection to the content to be indexed.

A file data source definition looks similar to the example below:

```http
{
    "name" : "my-file-datasource",
    "type" : "azurefile",
    "credentials" : { "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<account key>;" },
    "container" : { "name" : "my-file", "query" : "<optional-directory-name>" }
}
```

The `"credentials"` property can be a connection string, as shown in the above example, or one of the alternative approaches described in the next section. The `"container"` property provides the file share within Azure Storage, and `"query"` is used to specify a subfolder in the share. For more information about data source definitions, see [Create Data Source (REST)](/rest/api/searchservice/create-data-source).

<a name="Credentials"></a>

## Credentials

You can provide the credentials for the file share in one of these ways:

**Managed identity connection string**:
`{ "connectionString" : "ResourceId=/subscriptions/<your subscription ID>/resourceGroups/<your resource group name>/providers/Microsoft.Storage/storageAccounts/<your storage account name>/;" }`

This connection string does not require an account key, but you must follow the instructions for [Setting up a connection to an Azure Storage account using a managed identity](search-howto-managed-identities-storage.md).

**Full access storage account connection string**: 
`{ "connectionString" : "DefaultEndpointsProtocol=https;AccountName=<your storage account>;AccountKey=<your account key>;" }`

You can get the connection string from the Azure portal by navigating to the storage account blade > Settings > Keys (for Classic storage accounts) or Security + networking  > Access keys (for Azure Resource Manager storage accounts).

**Storage account shared access signature** (SAS) connection string:
`{ "connectionString" : "BlobEndpoint=https://<your account>.file.core.windows.net/;SharedAccessSignature=?sv=2016-05-31&sig=<the signature>&spr=https&se=<the validity end time>&sp=rl&sr=s;" }`

The SAS should have the list and read permissions on file shares.

**Container shared access signature**: 
`{ "connectionString" : "ContainerSharedAccessUri=https://<your storage account>.file.core.windows.net/<share name>?sv=2016-05-31&sr=s&sig=<the signature>&se=<the validity end time>&sp=rl;" }`

The SAS should have the list and read permissions on the file share. For more information on storage shared access signatures, see [Using Shared Access Signatures](../storage/common/storage-sas-overview.md).

> [!NOTE]
> If you use SAS credentials, you will need to update the data source credentials periodically with renewed signatures to prevent their expiration. If SAS credentials expire, the indexer will fail with an error message similar to "Credentials provided in the connection string are invalid or have expired".

## Indexing file metadata

A common scenario that makes it easy to sort through files of any content type is to index both custom metadata and system properties for each file. In this way, information for all files is indexed regardless of document type, stored in an index in your search service. Using your new index, you can then proceed to sort, filter, and facet across all File storage content.

Standard file metadata properties can be extracted into the fields listed below. The file indexer automatically creates internal field mappings for these file metadata properties. You still have to add the fields you want to use the index definition, but you can omit creating field mappings in the indexer.

+ **metadata_storage_name** (`Edm.String`) - the file name. For example, if you have a file /my-share/my-folder/subfolder/resume.pdf, the value of this field is `resume.pdf`.
+ **metadata_storage_path** (`Edm.String`) - the full URI of the file, including the storage account. For example, `https://myaccount.file.core.windows.net/my-share/my-folder/subfolder/resume.pdf`
+ **metadata_storage_content_type** (`Edm.String`) - content type as specified by the code you used to upload the file. For example, `application/octet-stream`.
+ **metadata_storage_last_modified** (`Edm.DateTimeOffset`) - last modified timestamp for the file. Azure Cognitive Search uses this timestamp to identify changed files, to avoid reindexing everything after the initial indexing.
+ **metadata_storage_size** (`Edm.Int64`) - file size in bytes.
+ **metadata_storage_content_md5** (`Edm.String`) - MD5 hash of the file content, if available.
+ **metadata_storage_sas_token** (`Edm.String`) - A temporary SAS token that can be used by [custom skills](cognitive-search-custom-skill-interface.md) to get access to the file. This token shouldn't stored for later use as it might expire.

## Index by file type

You can control which documents are indexed and which are skipped.

### Include documents having specific file extensions

You can index only the documents with the file name extensions you specify by using the `indexedFileNameExtensions` indexer configuration parameter. The value is a string containing a comma-separated list of file extensions (with a leading dot). For example, to index only the .PDF and .DOCX documents, do this:

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [admin key]

{
    ... other parts of indexer definition
    "parameters" : { "configuration" : { "indexedFileNameExtensions" : ".pdf,.docx" } }
}
```

### Exclude documents having specific file extensions

You can exclude documents with specific file name extensions from indexing by using the `excludedFileNameExtensions` configuration parameter. The value is a string containing a comma-separated list of file extensions (with a leading dot). For example, to index all content except those with the .PNG and .JPEG extensions, do this:

```http
PUT https://[service name].search.windows.net/indexers/[indexer name]?api-version=2020-06-30-Preview
Content-Type: application/json
api-key: [admin key]

{
    ... other parts of indexer definition
    "parameters" : { "configuration" : { "excludedFileNameExtensions" : ".png,.jpeg" } }
}
```

If both `indexedFileNameExtensions` and `excludedFileNameExtensions` parameters are present, Azure Cognitive Search first looks at `indexedFileNameExtensions`, then at `excludedFileNameExtensions`. This means that if the same file extension is present in both lists, it will be excluded from indexing.

<a name="deleted-files"></a>

## Detecting deleted files

After an initial search index is created, you might want subsequent indexer jobs to only pick up new and changed documents. For search content that originates from Azure File Storage, change detection occurs automatically when you use a schedule to trigger indexing. By default, the service reindexes only the changed files, as determined by the file's `LastModified` timestamp. In contrast with other data sources supported by search indexers, files always have a timestamp, which eliminates the need to set up a change detection policy manually.

Although change detection is a given, deletion detection is not. If you want to detect deleted files, make sure to use a "soft delete" approach. If you delete the files outright, corresponding documents will not be removed from the search index.

## Soft delete using custom metadata

This method uses a file's metadata to determine whether a search document should be removed from the index. This method requires two separate actions, deleting the search document from the index, followed by file deletion in Azure Storage.

There are steps to follow in both File storage and Cognitive Search, but there are no other feature dependencies. This capability is supported in generally available APIs.

1. Add a custom metadata key-value pair to the file to indicate to Azure Cognitive Search that it is logically deleted.

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

1. Once the indexer has processed the blob and deleted the document from the index, you can delete the blob in Azure Blob Storage.

### Reindexing undeleted files (using custom metadata)

After an indexer processes a deleted file and removes the corresponding search document from the index, it won't revisit that file if you restore it later if the blob's `LastModified` timestamp is older than the last indexer run.

If you would like to reindex that document, change the `"softDeleteMarkerValue" : "false"` for that file and rerun the indexer.

## See also

+ [Indexers in Azure Cognitive Search](search-indexer-overview.md)
+ [What is Azure Files?](../storage/files/storage-files-introduction.md)
