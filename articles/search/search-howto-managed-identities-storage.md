---
title: Connect to Azure Storage
titleSuffix: Azure Cognitive Search
description: Learn how to set up an indexer connection to an Azure Storage account using a managed identity

author: gmndrg
ms.author: gimondra
manager: nitinme

ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/10/2022
---

# Set up a connection to an Azure Storage account using a managed identity

This page describes how to set up an indexer connection to an Azure Storage account using a managed identity instead of providing credentials in the data source object connection string.

You can use a system-assigned managed identity or a user-assigned managed identity (preview).

This article assumes familiarity with indexer concepts and configuration. If you're new to indexers, start with these links:

* [Indexer overview](search-indexer-overview.md)
* [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
* [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
* [Azure Table indexer](search-howto-indexing-azure-tables.md)

For a code example in C#, see [Index Data Lake Gen2 using Azure AD](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/data-lake-gen2-acl-indexing/README.md) on GitHub.

## Prerequisites

* [Create a managed identity](search-howto-managed-identities-data-sources.md) for your search service.

* [Assign a role](search-howto-managed-identities-data-sources.md#assign-roles). 

  * Assign **Storage Blob Data Reader** for read permissions to content in Blob Storage and Azure Data Lake Storage Gen2. 
  * Assign **Reader and Data** for read permissions to content in Table Storage and File Storage.

## Create the data source

Create the data source and provide either a system-assigned managed identity or a user-assigned managed identity (preview). Note that you are no longer using the Management REST API in the below steps.

### Option 1 - Create the data source with a system-assigned managed identity

The [REST API](/rest/api/searchservice/create-data-source), Azure portal, and the [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) support using a system-assigned managed identity. Below is an example of how to create a data source to index data from a storage account using the [REST API](/rest/api/searchservice/create-data-source) and a managed identity connection string. The managed identity connection string format is the same for the REST API, .NET SDK, and the Azure portal.

When indexing from a storage account, the data source must have the following required properties:

* **name** is the unique name of the data source within your search service.
* **type**
    * Azure Blob storage: `azureblob`
    * Azure Table storage: `azuretable`
    * Azure Data Lake Storage Gen2: `adlsgen2`
* **credentials**
    * When using a managed identity to authenticate, the **credentials** format is different than when not using a managed identity. Here you will provide a ResourceId that has no account key or password. The ResourceId must include the subscription ID of the storage account, the resource group of the storage account, and the storage account name.
    * Managed identity format: 
        * *ResourceId=/subscriptions/**your subscription ID**/resourceGroups/**your resource group name**/providers/Microsoft.Storage/storageAccounts/**your storage account name**/;*
* **container** specifies a container or table name in your storage account. By default, all blobs within the container are retrievable. If you only want to index blobs in a particular virtual directory, you can specify that directory using the optional **query** parameter.

Example of how to create a blob data source object using the [REST API](/rest/api/searchservice/create-data-source):

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

### Option 2 - Create the data source with a user-assigned managed identity

The 2021-04-30-preview REST API support the user-assigned managed identity. Below is an example of how to create a data source to index data from a storage account using the [REST API](/rest/api/searchservice/create-data-source), a managed identity connection string, and the user-assigned managed identity.

When indexing from a storage account, the data source must have the following required properties:

* **name** is the unique name of the data source within your search service.
* **type**
    * Azure Blob storage: `azureblob`
    * Azure Table storage: `azuretable`
    * Azure Data Lake Storage Gen2: `adlsgen2`
* **credentials**
    * When using a managed identity to authenticate, the **credentials** format is different than when not using a managed identity. Here you will provide a ResourceId that has no account key or password. The ResourceId must include the subscription ID of the storage account, the resource group of the storage account, and the storage account name.
    * Managed identity format: 
        * *ResourceId=/subscriptions/**your subscription ID**/resourceGroups/**your resource group name**/providers/Microsoft.Storage/storageAccounts/**your storage account name**/;*
* **container** specifies a container or table name in your storage account. By default, all blobs within the container are retrievable. If you only want to index blobs in a particular virtual directory, you can specify that directory using the optional **query** parameter.
* **identity** contains the collection of user-assigned managed identities. Only one user-assigned managed identity should be provided when creating the data source.
    * **userAssignedIdentities** includes the details of the user assigned managed identity.
        * User-assigned managed identity format: 
            * /subscriptions/**subscription ID**/resourcegroups/**resource group name**/providers/Microsoft.ManagedIdentity/userAssignedIdentities/**name of managed identity**

Example of how to create a blob data source object using the [REST API](/rest/api/searchservice/create-data-source):

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

Here's how to create an index with a searchable `content` field to store the text extracted from blobs:   

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

For more on creating indexes, see [Create Index](/rest/api/searchservice/create-index)

## Create the indexer

An indexer connects a data source with a target search index, and provides a schedule to automate the data refresh.

Once the index and data source have been created, you're ready to create and run the indexer.

Example indexer definition for a blob indexer:

```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "blob-indexer",
      "dataSourceName" : "blob-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" }
    }
```

This indexer will run every two hours (schedule interval is set to "PT2H"). To run an indexer every 30 minutes, set the interval to "PT30M". The shortest supported interval is 5 minutes. The schedule is optional - if omitted, an indexer runs only once when it's created. However, you can run an indexer on-demand at any time.   

For more details on the Create Indexer API, check out [Create Indexer](/rest/api/searchservice/create-indexer).

For more information about defining indexer schedules see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

## Accessing network secured data in storage accounts

Azure storage accounts can be further secured using firewalls and virtual networks. If you want to index content from a blob storage account or Data Lake Gen2 storage account that is secured using a firewall or virtual network, follow the instructions for [Accessing data in storage accounts securely via trusted service exception](search-indexer-howto-access-trusted-service-exception.md).

## See also

* [Azure Blob indexer](search-howto-indexing-azure-blob-storage.md)
* [Azure Data Lake Storage Gen2 indexer](search-howto-index-azure-data-lake-storage.md)
* [Azure Table indexer](search-howto-indexing-azure-tables.md)
* [C# Example: Index Data Lake Gen2 using Azure AD (GitHub)](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/data-lake-gen2-acl-indexing/README.md)