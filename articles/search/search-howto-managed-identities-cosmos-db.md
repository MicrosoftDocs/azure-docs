---
title: Set up an indexer connection to Azure Cosmos DB via a managed identity
titleSuffix: Azure AI Search
description: Learn how to set up an indexer connection to an Azure Cosmos DB account via a managed identity
author: gmndrg
ms.author: gimondra
manager: liamca

ms.service: cognitive-search
ms.topic: how-to
ms.date: 09/19/2022
ms.custom: subject-rbac-steps, 
---

# Set up an indexer connection to Azure Cosmos DB via a managed identity

This article explains how to set up an indexer connection to an Azure Cosmos DB database using a managed identity instead of providing credentials in the connection string.'

You can use a system-assigned managed identity or a user-assigned managed identity (preview). Managed identities are Microsoft Entra logins and require Azure role assignments to access data in Azure Cosmos DB. 

## Prerequisites

* [Create a managed identity](search-howto-managed-identities-data-sources.md) for your search service.

* Assign the **Cosmos DB Account Reader** role to the search service managed identity. This role grants the ability to read Azure Cosmos DB account data. For more information about role assignments in Cosmos DB, see [Configure role-based access control to data](search-howto-managed-identities-data-sources.md#assign-a-role).

* Data Plane Role assignment: Follow [Data plane Role assignment](../cosmos-db/how-to-setup-rbac.md)
to know more.

* Example for a read-only data plane role assignment:
```azurepowershell
$cosmosdb_acc_name = <cosmos db account name>
$resource_group = <resource group name>
$subsciption = <subscription id>
$system_assigned_principal = <principal id for system assigned identity>
$readOnlyRoleDefinitionId = "00000000-0000-0000-0000-000000000001"
$scope=$(az cosmosdb show --name $cosmosdbname --resource-group $resourcegroup --query id --output tsv)
```

Role assignment for system-assigned identity:

```azurepowershell
az cosmosdb sql role assignment create --account-name $cosmosdbname --resource-group $resourcegroup --role-definition-id $readOnlyRoleDefinitionId --principal-id $sys_principal --scope $scope
```
* For Cosmos DB for NoSQL, you can optionally [Enforcing RBAC as the only authentication method](../cosmos-db/how-to-setup-rbac.md#disable-local-auth)
for data connections by setting `disableLocalAuth` to `true` for your Cosmos DB account.

* *For Gremlin and MongoDB Collections*: 
   Indexer support is currently in preview. At this time, a preview limitation exists that requires Azure AI Search to connect using keys. You can still set up a managed identity and role assignment, but Azure AI Search will only use the role assignment to get keys for the connection. This limitation means that you can't configure an [RBAC-only approach](../cosmos-db/how-to-setup-rbac.md#disable-local-auth) if your indexers are connecting to Gremlin or MongoDB using Search with managed identities to connect to Azure Cosmos DB.

* You should be familiar with [indexer concepts](search-indexer-overview.md) and [configuration](search-howto-index-cosmosdb.md).

## Create the data source

Create the data source and provide either a system-assigned managed identity or a user-assigned managed identity (preview) in the connection string. 

### System-assigned managed identity

The [REST API](/rest/api/searchservice/create-data-source), Azure portal, and the [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) support using a system-assigned managed identity. 

When you're connecting with a system-assigned managed identity, the only change to the data source definition is the format of the "credentials" property. You'll provide the database name and a ResourceId that has no account key or password. The ResourceId must include the subscription ID of Azure Cosmos DB, the resource group, and the Azure Cosmos DB account name.

* For SQL collections, the connection string doesn't require "ApiKind". 
* For SQL collections add "IdentityAuthType=AccessToken" if RBAC is enforced as the only authentication method. It is not applicable for MongoDB and Gremlin collections.
* For MongoDB collections, add "ApiKind=MongoDb" to the connection string and use a preview REST API.
* For Gremlin graphs, add "ApiKind=Gremlin" to the connection string and use a preview REST API.

Here's an example of how to create a data source to index data from a storage account using the [Create Data Source](/rest/api/searchservice/create-data-source) REST API and a managed identity connection string. The managed identity connection string format is the same for the REST API, .NET SDK, and the Azure portal.

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30
Content-Type: application/json
api-key: [Search service admin key]

{
    "name": "[my-cosmosdb-ds]",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "ResourceId=/subscriptions/[subscription-id]/resourceGroups/[rg-name]/providers/Microsoft.DocumentDB/databaseAccounts/[cosmos-account-name];Database=[cosmos-database];ApiKind=[SQL | Gremlin | MongoDB];IdentityAuthType=[AccessToken | AccountKey]"
    },
    "container": { "name": "[my-cosmos-collection]", "query": null },
    "dataChangeDetectionPolicy": null

 
}
```

### User-assigned managed identity (preview)

The 2021-04-30-preview REST API supports connections based on a user-assigned managed identity. When you're connecting with a user-assigned managed identity, there are two changes to the data source definition:

* First, the format of the "credentials" property is the database name and a ResourceId that has no account key or password. The ResourceId must include the subscription ID of Azure Cosmos DB, the resource group, and the Azure Cosmos DB account name.

  * For SQL collections, the connection string doesn't require "ApiKind". 
  * For SQL collections add "IdentityAuthType=AccessToken" if RBAC is enforced as the only authentication method. It is not applicable for MongoDB and Gremlin collections.
  * For MongoDB collections, add "ApiKind=MongoDb" to the connection string
  * For Gremlin graphs, add "ApiKind=Gremlin" to the connection string.

* Second, you'll add an "identity" property that contains the collection of user-assigned managed identities. Only one user-assigned managed identity should be provided when creating the data source. Set it to type "userAssignedIdentities".

Here's an example of how to create an indexer data source object using the [preview Create or Update Data Source](/rest/api/searchservice/preview-api/create-or-update-data-source) REST API:


```http
POST https://[service name].search.windows.net/datasources?api-version=2021-04-30-preview
Content-Type: application/json
api-key: [Search service admin key]

{
    "name": "[my-cosmosdb-ds]",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "ResourceId=/subscriptions/[subscription-id]/resourceGroups/[rg-name]/providers/Microsoft.DocumentDB/databaseAccounts/[cosmos-account-name];Database=[cosmos-database];ApiKind=[SQL | Gremlin | MongoDB];IdentityAuthType=[AccessToken | AccountKey]"
    },
    "container": { 
        "name": "[my-cosmos-collection]", "query": null 
    },
    "identity" : { 
        "@odata.type": "#Microsoft.Azure.Search.DataUserAssignedIdentity",
        "userAssignedIdentity": "/subscriptions/[subscription-id]/resourcegroups/[rg-name]/providers/Microsoft.ManagedIdentity/userAssignedIdentities/[my-user-managed-identity-name]" 
    },
    "dataChangeDetectionPolicy": null
}
```

## Create the index

The index specifies the fields in a document, attributes, and other constructs that shape the search experience.

Here's a [Create Index](/rest/api/searchservice/create-index) REST API call with a searchable `booktitle` field:

```http
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

## Create the indexer

An indexer connects a data source with a target search index and provides a schedule to automate the data refresh. Once the index and data source have been created, you're ready to create and run the indexer. If the indexer is successful, the connection syntax and role assignments are valid.

Here's a [Create Indexer](/rest/api/searchservice/create-indexer) REST API call with an Azure Cosmos DB indexer definition. The indexer will run when you submit the request.

```http
    POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
    Content-Type: application/json
    api-key: [admin key]

    {
      "name" : "cosmos-db-indexer",
      "dataSourceName" : "cosmos-db-datasource",
      "targetIndexName" : "my-target-index"
    }
```

## Troubleshooting

If you recently rotated your Azure Cosmos DB account keys, you'll need to wait up to 15 minutes for the managed identity connection string to work.

Check to see if the Azure Cosmos DB account has its access restricted to select networks. You can rule out any firewall issues by trying the connection without restrictions in place.

## See also

* [Indexing via an Azure Cosmos DB for NoSQL](search-howto-index-cosmosdb.md)
* [Indexing via an Azure Cosmos DB for MongoDB](search-howto-index-cosmosdb-mongodb.md)
* [Indexing via an Azure Cosmos DB for Apache Gremlin](search-howto-index-cosmosdb-gremlin.md)
