---
title: Use follower to share databases in Azure Data Explorer
description: Learn about how to share databases in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/04/2019
---

# Using Follower database to share databases in Azure Data Explorer

Azure Data Explorer database(s) hosted in one cluster can be attached as read only database(s) to a different cluster. By attaching a database to a cluster you allow users of this cluster to view the data in the attached database and execute queries on such a database.
The attached database is a read-only database which means the data in the database, its tables and the equivalent policies cannot be modifed except for a specific set of policies. Attached databases cannot be delted and they can only be detached on the attaching side. In case a database that was attached to another cluster is deleted on the original cluster all the attached databases will be inaccssible.
Attaching a database to a different cluster is useful for seggragating compute resource in case we would like to protect a production environment from non-production use cases.
It is also usefull for associating cost of Azure Data Explorer cluster to the part that runs queries on the data.
Both the original cluster the the attached database(s) cluster are sharing the same storage account. This means there is no need to ingest data to the cluster of the attached database(s) and that cluster is fetching the data of the original cluster storage. It also means that the cost of the storage will still be associated to the original database cluster.
A cluster can hold both attached databases and databases attached to other clusters.
It is possible to attach a single database, multiple databases and all databases in a specific cluster

## How to share a database

You can share a database using Azure Resource Manager template.
In this section, you learn how to share a database by using an [Azure Resource Manager template](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/azure-resource-manager/resource-group-overview.md). 
In order to be able to share a database the user must have a permission on both leader cluster and follower cluster. 
In order to share a database, one must have right permission on both the follower cluster and the leader cluster. For more information about permission, see [permission model](#Permission-model).

### Azure Resource Manager template for sharing a database

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"followerClusterName": {
			"type": "string",
			"defaultValue": "",
			"metadata": {
				"description": "Name of the follower cluster."
			}
		},
		"attachedDatabaseConfigurationsName": {
			"type": "string",
			"defaultValue": "",
			"metadata": {
				"description": "Name of the attached database configurations to create."
			}
		},
		"databaseName": {
			"type": "string",
			"defaultValue": "",
			"metadata": {
				"description": "The Name of the database to follow. You can follow all databse by using '*'."
			}
		},
		"leaderClusterResourceId": {
			"type": "string",
			"defaultValue": "",
			"metadata": {
				"description": "Name of the leader cluster to create."
			}
		},
		"defaultPrincipalsModificationKind": {
			"type": "string",
			"defaultValue": "",
			"metadata": {
				"description": "The default principal modification kind."
			}
		},
		"location": {
			"type": "string",
			"defaultValue": "",
			"metadata": {
				"description": "Location for all resources."
			}
		}
	},
	"variables": {},
	"resources": [
		{
			"name": "[parameters('followerClusterName')]",
			"type": "Microsoft.Kusto/clusters",
			"sku": {
				"name": "Standard_D13_v2",
				"tier": "Standard",
				"capacity": 2
			},
			"apiVersion": "2019-09-07",
			"location": "[parameters('location')]"
		},
		{
			"name": "[concat(parameters('followerClusterName'), '/', parameters('attachedDatabaseConfigurationsName'))]",
			"type": "Microsoft.Kusto/clusters/attachedDatabaseConfigurations",
			"apiVersion": "2019-09-07",
			"location": "[parameters('location')]",
			"dependsOn": [
				"[resourceId('Microsoft.Kusto/clusters', parameters('followerClusterName'))]"
			],
			"properties": {
				"databaseName": "[parameters('databaseName')]",
				"clusterResourceId": "[parameters('leaderClusterResourceId')]",
				"defaultPrincipalsModificationKind": "[parameters('defaultPrincipalsModificationKind')]"
			}
		}
	]
}
```

### 2nd method Deploy the template and verify template deployment

#### Deploy

You can deploy the Azure Resource Manager template by using the Azure portal or using powershell.

![TemplateDeployment](TemplateDeployment.png)

1. **Follower Cluster Name** - the name of the follower cluster. 
2. **Attached Database Configurations Name** - the name of the attached database configurations object. The name must be unique in the cluster level.
3. **Database Name** - the name of the database to be followed. If you want to follow all leader's databases use '*'.
4. **Leader Cluster Resouce Id** - the resouce id of the leader cluster. 
5. **Default Principal Modification Kind** - the default principal modification kind. Can be Union, Replace or None. For more information about default principal modification kind, [see here]("#broken-link").
6. **Location** - the location of all the resouces. Please note that the leader and the follower must be in the same location. 

#### Verify 

Verifying that the database was successfully shared using [Azure Portal](https://portal.azure.com).

* Navigate to the follower cluster
* Go to Databases
* Search for new "Read Only" Databases in the database lists

    ![TemplateDeployment](ReadOnlyFollowingDatabase.png)

Alternatively:

* Navigate to the leader cluster
* Go to Databases
* Make sure that the relevant databases are marked as "SHARED WITH OTHERS"

    ![TemplateDeployment](readwriteDatabasesShared.png)

## How to detach the follower database

### Detach the following data using C# 

Follower cluster is able to detach any attached database as follows:

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
var credential = new ClientCredential(clientId, clientSecret);
var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
//The cluster and database that are created as part of the Prerequisites
var followerClusterName = "follower";
var attachedDatabaseConfigurationsName = "adc";

kustoManagementClient.AttachedDatabaseConfigurations.Delete(resourceGroupName, followerClusterName, attachedDatabaseConfigurationsName);
```
Leader cluster is also able to detach any attached database as follows:
```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
var credential = new ClientCredential(clientId, clientSecret);
var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

var kustoManagementClient = new KustoManagementClient(credentials)
{
    SubscriptionId = subscriptionId
};

var leaderResourceGroupName = "testrg";
var followerResourceGroupName = "followerResouceGroup";
var leaderClusterName = "leader";
var followerClusterName = "follower";
//The cluster and database that are created as part of the Prerequisites
var followerDatabaseDefinition = new FollowerDatabaseDefinition()
    {
        AttachedDatabaseConfigurationName = "adc",
        ClusterResourceId = $"/subscriptions/{subscriptionId}/resourceGroups/{followerResourceGroupName}/providers/Microsoft.Kusto/Clusters/{followerClusterName}"
    };

managementClient.Clusters.DetachFollowerDatabases(leaderResourceGroupName, leaderClusterName, followerDatabaseDefinition);
```

## Permission model

## Managing principals

When attaching a database you need to specify the "default principals modification kind" to one of the following values:
Union - the attached database principal list will always include the original database principals. In additionit it will be possible to add to it new principals.
Replace - There is no inheritance of principals from the original database. New principals should be created for the attached database.
None - the attached database principals can include only the principals of the original database and non can be added specifically to the attached one.

### Managing Permissions

Managing read only database permission is the same as "regular" databases, please see [manage permissions in Azure portal](https://docs.microsoft.com/en-us/azure/data-explorer/manage-database-permissions#manage-permissions-in-the-azure-portal).
**Note**: Managing permissions with management commands is not supported.

## Limitations

- The follower and the leader must be in the same region
- Database that is being followed cannot be deleted