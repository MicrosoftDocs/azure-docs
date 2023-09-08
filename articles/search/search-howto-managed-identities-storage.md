---
title: Connect to Azure Storage
titleSuffix: Azure Cognitive Search
description: Learn how to set up an indexer connection to an Azure Storage account using a managed identity
author: gmndrg
ms.author: gimondra
manager: nitinme

ms.service: cognitive-search
ms.topic: how-to
ms.date: 09/19/2022
ms.custom: subject-rbac-steps
---

# Set up an indexer connection to Azure Storage using a managed identity

This article explains how to set up an indexer connection to an Azure Storage account using a managed identity instead of providing credentials in the connection string.

You can use a system-assigned managed identity or a user-assigned managed identity (preview). Managed identities are Azure Active Directory logins and require Azure role assignments to access data in Azure Storage. 

> [!NOTE]
> If storage is network-protected and in the same region as your search service, you must use a system-assigned managed identity and either one of the following network options: [connect as a trusted service](search-indexer-howto-access-trusted-service-exception.md), or [connect using the resource instance rule](../storage/common/storage-network-security.md#grant-access-from-azure-resource-instances). 

## Prerequisites

* [Create a managed identity](search-howto-managed-identities-data-sources.md) for your search service.

* [Assign a role](search-howto-managed-identities-data-sources.md#assign-a-role) in Azure Storage: 

  * Choose **Storage Blob Data Reader** for data read access in Blob Storage and ADLS Gen2. 

  * Choose **Reader and Data** for data read access in Table Storage and File Storage.

* You should be familiar with [indexer concepts](search-indexer-overview.md) and [configuration](search-howto-indexing-azure-blob-storage.md).

> [!TIP]
> For a code example in C#, see [Index Data Lake Gen2 using Azure AD](https://github.com/Azure-Samples/azure-search-dotnet-utilities/blob/master/data-lake-gen2-acl-indexing/README.md) on GitHub.

## Create the data source

Create the data source and provide either a system-assigned managed identity or a user-assigned managed identity (preview). 

### System-assigned managed identity

The [REST API](/rest/api/searchservice/create-data-source), Azure portal, and the [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) support using a system-assigned managed identity.

When you're connecting with a system-assigned managed identity, the only change to the data source definition is the format of the "credentials" property. You'll provide a ResourceId that has no account key or password. The ResourceId must include the subscription ID of the storage account, the resource group of the storage account, and the storage account name.

Here's an example of how to create a data source to index data from a storage account using the [Create Data Source](/rest/api/searchservice/create-data-source) REST API and a managed identity connection string. The managed identity connection string format is the same for the REST API, .NET SDK, and the Azure portal.

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "blob-datasource",
    "type" : "azureblob",
    "credentials" : { 
        "connectionString" : "ResourceId=/subscriptions/[subscription ID]/resourceGroups/[resource group name]/providers/Microsoft.Storage/storageAccounts/[storage account name]/;" 
    },
    "container" : { 
        "name" : "my-container", "query" : "<optional-virtual-directory-name>" 
    }
}   
```

### User-assigned managed identity (preview)

The 2021-04-30-preview REST API supports connections based on a user-assigned managed identity. When you're connecting with a user-assigned managed identity, there are two changes to the data source definition:

* First, the format of the "credentials" property is a ResourceId that has no account key or password. The ResourceId must include the subscription ID of the storage account, the resource group of the storage account, and the storage account name. This format is the same format as the system-assigned managed identity.

* Second, you'll add an "identity" property that contains the collection of user-assigned managed identities. Only one user-assigned managed identity should be provided when creating the data source. Set it to type "userAssignedIdentities".

Here's an example of how to create an indexer data source object using the [preview Create or Update Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source) REST API:

```http
POST https://[service name].search.windows.net/datasources?api-version=2021-04-30-preview
Content-Type: application/json
api-key: [admin key]

{
    "name" : "blob-datasource",
    "type" : "azureblob",
    "credentials" : { 
        "connectionString" : "ResourceId=/subscriptions/[subscription ID]/resourceGroups/[resource group name]/providers/Microsoft.Storage/storageAccounts/[storage account name]/;" 
    },
    "container" : { 
        "name" : "my-container", "query" : "<optional-virtual-directory-name>" 
    },
    "identity" : { 
        "@odata.type": "#Microsoft.Azure.Search.DataUserAssignedIdentity",
        "userAssignedIdentity" : "/subscriptions/[subscription ID]/resourcegroups/[resource group name]/providers/Microsoft.ManagedIdentity/userAssignedIdentities/[managed identity name]" 
    }
}   
```

## Create the index

The index specifies the fields in a document, attributes, and other constructs that shape the search experience.

Here's a [Create Index](/rest/api/searchservice/create-index) REST API call with a searchable `content` field to store the text extracted from blobs:

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

## Create the indexer

An indexer connects a data source with a target search index, and provides a schedule to automate the data refresh. Once the index and data source have been created, you're ready to create and run the indexer. If the indexer is successful, the connection syntax and role assignments are valid.

Here's a [Create Indexer](/rest/api/searchservice/create-indexer) REST API call with a blob indexer definition. The indexer will run when you submit the request.

```http
POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "blob-indexer",
    "dataSourceName" : "blob-datasource",
    "targetIndexName" : "my-target-index"
}
```

## Accessing network secured data in storage accounts

Azure storage accounts can be further secured using firewalls and virtual networks. If you want to index content from a storage account that is secured using a firewall or virtual network, see [Make indexer connections to Azure Storage as a trusted service](search-indexer-howto-access-trusted-service-exception.md).

## See also

* [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
* [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
* [Azure Table indexer](search-howto-indexing-azure-tables.md)
* [C# Example: Index Data Lake Gen2 using Azure AD (GitHub)](https://github.com/Azure-Samples/azure-search-dotnet-utilities/blob/master/data-lake-gen2-acl-indexing/README.md)
