---
title: Connect to an Azure Storage account using a managed identity (preview)
titleSuffix: Azure Cognitive Search
description: Learn how to connect to an Azure Storage account using managed identities (preview)

manager: luisca
author: markheff
ms.author: maheff
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/18/2020
---

# Connect to an Azure Storage account using a managed identity (preview)

> [!IMPORTANT] 
> Support for using managed identities to connect to data sources is currently in a gated public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads.
> You can request access to the preview by filling out [this form](https://aka.ms/azure-cognitive-search/mi-preview-request).

This document describes how to create an Azure Cognitive Search indexer that pulls content from an Azure storage account and connects to the storage account using a managed identity.

## Set up a connection using a managed identity

You can set up the managed identity connection using:

* Azure Cognitive Search REST API
* Azure Cognitive Search .NET SDK
* Azure portal
    * Additional information is required to use the managed identities in Azure portal that is not included on this page. This information will be provided to you when you sign up for the preview using [this form](https://aka.ms/azure-cognitive-search/mi-preview-request).

### 1 - Turn on system assigned managed identity

When a system assigned managed identity is enabled, Azure creates an identity for the instance in the Azure AD tenant that's trusted by the subscription of the instance. After the identity is created, the credentials are provisioned on the instance.

![Turn on system assigned managed identity](./media/search-managed-identities/turn-on-system-assigned-identity.png "Turn on system assigned managed identity")

After selecting **Save** you will see an Object ID that has been assigned to your search service.

![Object ID](./media/search-managed-identities/system-assigned-identity-object-id.png "Object ID")
 
### 2 - Add a role assignment

In this step you will give your Azure Cognitive Search service permission to read data from your storage account.

1. In the Azure Portal, navigate to the Storage account that contains the data that you would like to index.
2. Select **Access control (IAM)**
3. Select **Add** then **Add role assignment**

    ![Add role assignment](./media/search-managed-identities/add-role-assignment-storage.png "Add role assignment")

4. Select the appropriate role(s) based on the storage account type that you would like to index:
    1. Azure Blob requires that you add your search service to the **Reader and Data Access** and **Storage Blob Data Reader** roles.
    1. Azure Data Lake Storage Gen2 requires that you add your search service to the **Reader and Data Access** and **Storage Blob Data Reader** roles.
    1. Azure Table requires that you add your search service only to the **Reader and Data Access** role.
    1. Azure File requires that you add your search service only to the **Reader and Data Access** role.
5.	Leave **Assign access to** as **Azure AD user, group or service principal**
6.	Search for your search service, select it, then select **Save**

    ![Add reader and data access role assignment](./media/search-managed-identities/add-role-assignment-reader-and-data-access.png "Add reader and data access role assignment")

Note that when connecting to Azure blobs and Azure Data Lake Storage Gen2, you must also add the **Storage Blob Data Reader** role assignment.

![Add storage blob data reader role assignment](./media/search-managed-identities/add-role-assignment-storage-blob-data-reader.png "Add storage blob data reader role assignment")

### 3 - Create the data source

For indexing from a storage account, the data source must have the following required properties:

* **name** is the unique name of the data source within your search service.
* **type**
    * Azure Blob: `azureblob`
    * Azure Table: `azuretable`
    * Azure Data Lake Storage Gen2: **type** will be provided once you sign up for the preview using [this form](https://aka.ms/azure-cognitive-search/mi-preview-request).
    * Azure File: **type** will be provided once you sign up for the preview using [this form](https://aka.ms/azure-cognitive-search/mi-preview-request).
* **credentials**
    * When using a managed identity to authenticate, the **credentials** format is different than when not using a manged identity. Here you will provide a ResourceId that has no account key or password. The ResourceId must include the subscription ID of the storage account, the resource group of the storage account, and the storage account name.
    * Managed identity format: 
        * *ResourceId=/subscriptions/**your subscription ID**/resourceGroups/**your resource group name**/providers/Microsoft.Storage/storageAccounts/**your storage account name**/;*
* **container** specifies a container or table name in your storage account. By default, all blobs within the container are retrievable. If you only want to index blobs in a particular virtual directory, you can specify that directory using the optional **query** parameter.

Example for a blob data source:

```
POST https://[service name].search.windows.net/datasources?api-version=2019-05-06
Content-Type: application/json
api-key: [admin key]

{
    "name" : "blob-datasource",
    "type" : "azureblob",
    "credentials" : { "connectionString" : "ResourceId=/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Storage/storageAccounts/storage-account-name/;" },
    "container" : { "name" : "my-container", "query" : "<optional-virtual-directory-name>" }
}   
```

### 4 - Create the index

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

### 5 - Create the indexer

An indexer connects a data source with a target search index, and provides a schedule to automate the data refresh.

Once the index and data source have been created, you're ready to create the indexer.

Example indexer definition for a blob indexer:

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
