---
title: Set up a connection to a Cosmos DB account using a managed identity
titleSuffix: Azure Cognitive Search
description: Learn how to set up an indexer connection to a Cosmos DB account using a managed identity

author: markheff
ms.author: maheff
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/02/2021
---

# Set up an indexer connection to a Cosmos DB database using a managed identity

This page describes how to set up an indexer connection to an Azure Cosmos DB database using a managed identity instead of providing credentials in the data source object connection string.

You can use a system-assigned managed identity or a user-assigned managed identity (preview).

Before learning more about this feature, it is recommended that you have an understanding of what an indexer is and how to set up an indexer for your data source. More information can be found at the following links:

* [Indexer overview](search-indexer-overview.md)
* [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)

## 1 - Set up a managed identity

Set up the [managed identity](../active-directory/managed-identities-azure-resources/overview.md) using one of the following options.

### Option 1 - Turn on system-assigned managed identity

When a system-assigned managed identity is enabled, Azure creates an identity for your search service that can be used to authenticate to other Azure services within the same tenant and subscription. You can then use this identity in Azure role-based access control (Azure RBAC) assignments that allow access to data during indexing.

![Turn on system assigned managed identity](./media/search-managed-identities/turn-on-system-assigned-identity.png "Turn on system assigned managed identity")

After selecting **Save** you will see an Object ID that has been assigned to your search service.

![Object ID](./media/search-managed-identities/system-assigned-identity-object-id.png "Object ID")
 
### Option 2 - Assign a user-assigned managed identity to the search service (preview)

If you don't already have a user-assigned managed identity created, you'll need to create one. A user-assigned managed identity is a resource on Azure.

1. Sign into the [Azure portal](https://portal.azure.com/).
1. Select **+ Create a resource**.
1. In the "Search services and marketplace" search bar, search for "User Assigned Managed Identity" and then select **Create**.
1. Give the identity a descriptive name.

Next, assign the user-assigned managed identity to the search service. This can be done using the [2021-04-01-preview management API](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update).

The identity property takes a type and one or more fully-qualified user-assigned identities:

* **type** is the type of identity. Valid values are "SystemAssigned", "UserAssigned", or "SystemAssigned, UserAssigned" if you want to use both. A value of "None" will clear any previously assigned identities from the search service.
* **userAssignedIdentities** includes the details of the user assigned managed identity.
    * User-assigned managed identity format: 
        * /subscriptions/**subscription ID**/resourcegroups/**resource group name**/providers/Microsoft.ManagedIdentity/userAssignedIdentities/**name of managed identity**

Example of how to assign a user-assigned managed identity to a search service:

```http
PUT https://management.azure.com/subscriptions/[subscription ID]/resourceGroups/[resource group name]/providers/Microsoft.Search/searchServices/[search service name]?api-version=2021-04-01-preview
Content-Type: application/json

{
  "location": "[region]",
  "sku": {
    "name": "[sku]"
  },
  "properties": {
    "replicaCount": [replica count],
    "partitionCount": [partition count],
    "hostingMode": "default"
  },
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/[subscription ID]/resourcegroups/[resource group name]/providers/Microsoft.ManagedIdentity/userAssignedIdentities/[name of managed identity]": {}
    }
  }
} 
```
 
## 2 - Add a role assignment

In this step you will either give your Azure Cognitive Search service or user-assigned managed identity permission to read data from your Cosmos DB database.

1. In the Azure portal, navigate to the Cosmos DB account that contains the data that you would like to index.
2. Select **Access control (IAM)**
3. Select **Add** then **Add role assignment**

    ![Add role assignment](./media/search-managed-identities/add-role-assignment-cosmos-db.png "Add role assignment")

4. Select the **Cosmos DB Account Reader Role**
5. Leave **Assign access to** as **Azure AD user, group or service principal**
6. If you're using a system-assigned managed identity, search for your search service, then select it. If you're using a user-assigned managed identity, search for the name of the user-assigned managed identity, then select it. Select **Save**.

    Example for Cosmos DB using a system-assigned managed identity:

    ![Add reader and data access role assignment](./media/search-managed-identities/add-role-assignment-cosmos-db-account-reader-role.png "Add reader and data access role assignment")

## 3 - Create the data source

Create the data source and provide either a system-assigned managed identity or a user-assigned managed identity (preview). Note that you are no longer using the Management REST API in the below steps.

### Option 1 - Create the data source with a system-assigned managed identity

The [REST API](/rest/api/searchservice/create-data-source), Azure portal, and the [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourcetype) support using a system-assigned managed identity. Below is an example of how to create a data source to index data from Cosmos DB using the [REST API](/rest/api/searchservice/create-data-source) and a managed identity connection string. The managed identity connection string format is the same for the REST API, .NET SDK, and the Azure portal.

When using managed identities to authenticate, the **credentials** will not include an account key.

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30
Content-Type: application/json
api-key: [Search service admin key]

{
    "name": "cosmos-db-datasource",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "Database=sql-test-db;ResourceId=/subscriptions/[subscription ID]/resourceGroups/[resource group name]/providers/Microsoft.DocumentDB/databaseAccounts/[Cosmos DB account name]/;"
    },
    "container": { "name": "myCollection", "query": null },
    "dataChangeDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
        "highWaterMarkColumnName": "_ts"
    }
}
```    

The body of the request contains the data source definition, which should include the following fields:

| Field   | Description |
|---------|-------------|
| **name** | Required. Choose any name to represent your data source object. |
|**type**| Required. Must be `cosmosdb`. |
|**credentials** | Required. <br/><br/>When connecting using a managed identity, the **credentials** format should be: *Database=[database-name];ResourceId=[resource-id-string];(ApiKind=[api-kind];)*<br/> <br/>The ResourceId format: *ResourceId=/subscriptions/**your subscription ID**/resourceGroups/**your resource group name**/providers/Microsoft.DocumentDB/databaseAccounts/**your cosmos db account name**/;*<br/><br/>For SQL collections, the connection string does not require an ApiKind.<br/><br/>For MongoDB collections, add **ApiKind=MongoDb** to the connection string. <br/><br/>For Gremlin graphs, sign up for the [gated indexer preview](https://aka.ms/azure-cognitive-search/indexer-preview) to get access to the preview and information about how to format the credentials.<br/>|
| **container** | Contains the following elements: <br/>**name**: Required. Specify the ID of the database collection to be indexed.<br/>**query**: Optional. You can specify a query to flatten an arbitrary JSON document into a flat schema that Azure Cognitive Search can index.<br/>For the MongoDB API and Gremlin API, queries are not supported. |
| **dataChangeDetectionPolicy** | Recommended |
|**dataDeletionDetectionPolicy** | Optional |

### Option 2 - Create the data source with a user-assigned managed identity

The 2021-04-30-preview REST API support the user-assigned managed identity. Below is an example of how to create a data source to index data from a storage account using the [REST API](/rest/api/searchservice/create-data-source), a managed identity connection string, and the user-assigned managed identity.

```http
POST https://[service name].search.windows.net/datasources?api-version=2021-04-30-preview
Content-Type: application/json
api-key: [Search service admin key]

{
    "name": "cosmos-db-datasource",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "Database=sql-test-db;ResourceId=/subscriptions/[subscription ID]/resourceGroups/[resource group name]/providers/Microsoft.DocumentDB/databaseAccounts/[Cosmos DB account name]/;"
    },
    "container": { 
        "name": "myCollection", "query": null 
    },
    "identity" : { 
        "@odata.type": "#Microsoft.Azure.Search.DataUserAssignedIdentity",
        "userAssignedIdentity" : "/subscriptions/[subscription ID]/resourcegroups/[resource group name]/providers/Microsoft.ManagedIdentity/userAssignedIdentities/[managed identity name]" 
    },
    "dataChangeDetectionPolicy": {
        "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
        "highWaterMarkColumnName": "_ts"
    }
}
```    

The body of the request contains the data source definition, which should include the following fields:

| Field   | Description |
|---------|-------------|
| **name** | Required. Choose any name to represent your data source object. |
|**type**| Required. Must be `cosmosdb`. |
|**credentials** | Required. <br/><br/>When connecting using a managed identity, the **credentials** format should be: *Database=[database-name];ResourceId=[resource-id-string];(ApiKind=[api-kind];)*<br/> <br/>The ResourceId format: *ResourceId=/subscriptions/**your subscription ID**/resourceGroups/**your resource group name**/providers/Microsoft.DocumentDB/databaseAccounts/**your cosmos db account name**/;*<br/><br/>For SQL collections, the connection string does not require an ApiKind.<br/><br/>For MongoDB collections, add **ApiKind=MongoDb** to the connection string. <br/><br/>For Gremlin graphs, sign up for the [gated indexer preview](https://aka.ms/azure-cognitive-search/indexer-preview) to get access to the preview and information about how to format the credentials.<br/>|
| **container** | Contains the following elements: <br/>**name**: Required. Specify the ID of the database collection to be indexed.<br/>**query**: Optional. You can specify a query to flatten an arbitrary JSON document into a flat schema that Azure Cognitive Search can index.<br/>For the MongoDB API and Gremlin API, queries are not supported. |
| **identity** | Contains the collection of user-assigned managed identities. Only one user-assigned managed identity should be provided when creating the data source. Contains the following elements: <br/>**userAssignedIdentities** includes the details of the user assigned managed identity.<br/><br/>User-assigned managed identity format: /subscriptions/**subscription ID**/resourcegroups/**resource group name**/providers/Microsoft.ManagedIdentity/userAssignedIdentities/**name of managed identity**|
| **dataChangeDetectionPolicy** | Recommended |
|**dataDeletionDetectionPolicy** | Optional |

## 4 - Create the index

The index specifies the fields in a document, attributes, and other constructs that shape the search experience.

Here's how to create an index with a searchable `booktitle` field:

```
POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "my-target-index",
    "fields": [
    { "name": "id", "type": "Edm.String", "key": true, "searchable": false },
    { "name": "booktitle", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false }
    ]
}
```

For more on creating indexes, see [Create Index](/rest/api/searchservice/create-index)

## 5 - Create the indexer

An indexer connects a data source with a target search index and provides a schedule to automate the data refresh.

Once the index and data source have been created, you're ready to create the indexer.

Example indexer definition:

```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "cosmos-db-indexer",
      "dataSourceName" : "cosmos-db-datasource",
      "targetIndexName" : "my-target-index",
      "schedule" : { "interval" : "PT2H" }
    }
```

This indexer will run every two hours (schedule interval is set to "PT2H"). To run an indexer every 30 minutes, set the interval to "PT30M". The shortest supported interval is 5 minutes. The schedule is optional - if omitted, an indexer runs only once when it's created. However, you can run an indexer on-demand at any time.   

For more details on the Create Indexer API, check out [Create Indexer](/rest/api/searchservice/create-indexer).

For more information about defining indexer schedules see [How to schedule indexers for Azure Cognitive Search](search-howto-schedule-indexers.md).

## Troubleshooting

If you find that you are not able to index data from Cosmos DB consider the following:

1. If you recently rotated your Cosmos DB account keys you will need to wait up to 15 minutes for the managed identity connection string to work.

1. Check to see if the Cosmos DB account has its access restricted to select networks. If it does, refer to [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md).

## Next steps

* [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)