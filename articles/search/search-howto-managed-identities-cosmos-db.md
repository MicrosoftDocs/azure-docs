---
title: Set up an indexer connection to Azure Cosmos DB using a managed identity
titleSuffix: Azure AI Search
description: Learn how to set up an indexer connection to an Azure Cosmos DB account using a managed identity.
author: gmndrg
ms.author: gimondra

ms.service: cognitive-search
ms.topic: how-to
ms.date: 06/10/2024
ms.custom:
  - subject-rbac-steps
  - ignite-2023
---

# Connect to Azure Cosmos DB using a managed identity (Azure AI Search)

This article explains how to set up an indexer connection to an Azure Cosmos DB database using a managed identity instead of providing credentials in the connection string.'

You can use a system-assigned managed identity or a user-assigned managed identity. Managed identities are Microsoft Entra logins and require Azure role assignments to access data in Azure Cosmos DB. 

## Prerequisites

* [Create a managed identity](search-howto-managed-identities-data-sources.md) for your search service.

* Azure Cosmos DB for NoSQL. You can optionally [enforce role-based access as the only authentication method](/azure/cosmos-db/how-to-setup-rbac#disable-local-auth) for data connections by setting `disableLocalAuth` to `true` for your Cosmos DB account.

## Limitations

Indexer support for Azure Cosmos DB for Gremlin and MongoDB Collections is currently in preview. At this time, a preview limitation requires Azure AI Search to connect using keys. You can still set up a managed identity and role assignment, but Azure AI Search will only use the role assignment to get keys for the connection. This limitation means that you can't configure a [role-based approach](/azure/cosmos-db/how-to-setup-rbac#disable-local-auth) if your indexers are connecting to Gremlin or MongoDB.

## Create a role assignment in Azure Cosmos DB

### [**Azure portal**](#tab/portal)

1. Sign in to Azure portal and find your Cosmos DB for NoSQL account.

1. Select **Access control (IAM)**.

1. Select **Add** and then select **Role assignment**.

1. From the list of job function roles, select **Cosmos DB Account Reader**.

1. Select **Next**.

1. Select **Managed identity** and then select **Members**.

1. Filter by system-assigned managed identities or user-assigned managed identities. You should see the managed identity that you previously created for your search service. If you don't have one, see [Configure search to use a managed identity](search-howto-managed-identities-data-sources.md). If you already set one up but it's not available, give it a few minutes.

1. Select the identity and save the role assignment.

For more information, see [Configure role-based access control with Microsoft Entra ID for your Azure Cosmos DB account](/azure/cosmos-db/how-to-setup-rbac).

### [**PowerShell**](#tab/powershell)

Set variables:

```azurepowershell
$cosmosdb_acc_name = <cosmos db account name>
$resource_group = <resource group name>
$subsciption = <subscription ID>
$system_assigned_principal = <principal ID for the search service's system assigned identity>
$readOnlyRoleDefinitionId = "00000000-0000-0000-0000-00000000000"
$scope=$(az cosmosdb show --name $cosmosdbname --resource-group $resourcegroup --query id --output tsv)
```

Define a role assignment for the system-assigned identity:

```azurepowershell
az cosmosdb sql role assignment create --account-name $cosmosdbname --resource-group $resourcegroup --role-definition-id $readOnlyRoleDefinitionId --principal-id $sys_principal --scope $scope
```

---

## Specify a managed identity in a connection string

Once you have a role assignment, you can set up a connection to Azure Cosmos DB for NoSQL that operates under that role.

Indexers use a data source object for connections to an external data source. This section explains how to specify a system-assigned managed identity or a user-assigned managed identity on a data source connection string. You can find more [connection string examples](search-howto-managed-identities-data-sources.md#connection-string-examples) in the managed identity article.

> [!TIP]
> You can create a data source connection to CosmosDB in the Azure portal, specifying either a system or user-assigned managed identity, and then view the JSON definition to see how the connection string is formulated.

### System-assigned managed identity

The [REST API](/rest/api/searchservice/create-data-source), Azure portal, and the [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) support using a system-assigned managed identity. 

When you're connecting with a system-assigned managed identity, the only change to the data source definition is the format of the "credentials" property. Provide a database name and a ResourceId that has no account key or password. The ResourceId must include the subscription ID of Azure Cosmos DB, the resource group, and the Azure Cosmos DB account name.

* For SQL collections, the connection string doesn't require "ApiKind". 
* For SQL collections, add "IdentityAuthType=AccessToken" if role-based access is enforced as the only authentication method. It isn't applicable for MongoDB and Gremlin collections.
* For MongoDB collections, add "ApiKind=MongoDb" to the connection string and use a preview REST API.
* For Gremlin graphs, add "ApiKind=Gremlin" to the connection string and use a preview REST API.

Here's an example of how to create a data source to index data from a Cosmos DB account using the [Create Data Source](/rest/api/searchservice/create-data-source) REST API and a managed identity connection string. The managed identity connection string format is the same for the REST API, .NET SDK, and the Azure portal.

```http
POST https://[service name].search.windows.net/datasources?api-version=2024-07-01
{
    "name": "my-cosmosdb-ds",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "ResourceId=/subscriptions/[subscription-id]/resourceGroups/[rg-name]/providers/Microsoft.DocumentDB/databaseAccounts/[cosmos-account-name];Database=[cosmos-database];ApiKind=SQL;IdentityAuthType=[AccessToken | AccountKey]"
    },
    "container": { "name": "[my-cosmos-collection]", "query": null },
    "dataChangeDetectionPolicy": null

 
}
```

### User-assigned managed identity

When you're connecting with a user-assigned managed identity, there are two changes to the data source definition:

* First, the format of the "credentials" property is the database name and a ResourceId that has no account key or password. The ResourceId must include the subscription ID of Azure Cosmos DB, the resource group, and the Azure Cosmos DB account name.

  * For SQL collections, the connection string doesn't require "ApiKind". 
  * For SQL collections, add "IdentityAuthType=AccessToken" if role-based access is enforced as the only authentication method. It isn't applicable for MongoDB and Gremlin collections.
  * For MongoDB collections, add "ApiKind=MongoDb" to the connection string
  * For Gremlin graphs, add "ApiKind=Gremlin" to the connection string.

* Second, you add an "identity" property that contains the collection of user-assigned managed identities. Only one user-assigned managed identity should be provided when creating the data source. Set it to type "userAssignedIdentities".

Here's an example of how to create an indexer data source object using the REST API.

```http
POST https://[service name].search.windows.net/datasources?api-version=2024-07-01

{
    "name": "[my-cosmosdb-ds]",
    "type": "cosmosdb",
    "credentials": {
        "connectionString": "ResourceId=/subscriptions/[subscription-id]/resourceGroups/[rg-name]/providers/Microsoft.DocumentDB/databaseAccounts/[cosmos-account-name];Database=[cosmos-database];ApiKind=SQL;IdentityAuthType=[AccessToken | AccountKey]"
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

Connection information and permissions on the remote service are validated at run time during indexer execution. If the indexer is successful, the connection syntax and role assignments are valid. For more information, see [Run or reset indexers, skills, or documents](search-howto-run-reset-indexers.md).

## Troubleshooting

For Azure Cosmos DB for NoSQL, check whether the account has its access restricted to select networks. You can rule out any firewall issues by trying the connection without restrictions in place.

For Gremlin or MongoDB, if you recently rotated your Azure Cosmos DB account keys, you need to wait up to 15 minutes for the managed identity connection string to work.

## See also

* [Indexing via an Azure Cosmos DB for NoSQL](search-howto-index-cosmosdb.md)
* [Indexing via an Azure Cosmos DB for MongoDB](search-howto-index-cosmosdb-mongodb.md)
* [Indexing via an Azure Cosmos DB for Apache Gremlin](search-howto-index-cosmosdb-gremlin.md)
