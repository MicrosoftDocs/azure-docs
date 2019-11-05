---
title: Use follower database feature to share databases in Azure Data Explorer
description: Learn about how to share databases in Azure Data Explorer using follower.
author: orspod
ms.author: orspodek
ms.reviewer: gabilehner
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/05/2019
---

# Using Follower database to share databases in Azure Data Explorer

Azure Data Explorer database(s) hosted in one cluster can be attached as read only database(s) to a different cluster. By attaching a database to a cluster, you allow users of the cluster to view the data and execute queries on the attached database.
The attached database is a read-only database which means the data in the database, its tables and the equivalent policies cannot be modified except for a specific set of policies. Attached databases cannot be deleted and they can only be detached on the attaching side. In case a database that was attached to another cluster is deleted on the original cluster all the attached databases will be inaccessible.
Attaching a database to a different cluster is useful for segregating compute resource in case we would like to protect a production environment from non-production use cases.
It is also useful for associating cost of Azure Data Explorer cluster to the part that runs queries on the data.
Both the original cluster the the attached database(s) cluster are sharing the same storage account. This means there is no need to ingest data to the cluster of the attached database(s) and that cluster is fetching the data of the original cluster storage. It also means that the cost of the storage will still be associated to the original database cluster.
A cluster can hold both attached databases and databases attached to other clusters.
It is possible to attach a single database, multiple databases and all databases in a specific cluster

## Share a database

You can share a database using Azure Resource Manager template.
In this section, you learn how to share a database by using an [Azure Resource Manager template](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/azure-resource-manager/resource-group-overview.md). 
In order to be able to share a database the user must have a permission on both leader cluster and follower cluster. 
In order to share a database, one must have right permission on both the follower cluster and the leader cluster. For more information about permission, see [permission model](#Permission-model).

### Share a database using C#

**Required NuGets**

* Install [Microsoft.Azure.Management.kusto](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install [Microsoft.Rest.ClientRuntime.Azure.Authentication for authentication](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime.Azure.Authentication).


```Csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, clientSecret);
var resourceManagementClient = new ResourceManagementClient(serviceCreds);

var leaderResourceGroupName = "testrg";
var followerResourceGroupName = "followerResouceGroup";
var leaderClusterName = "leader";
var followerClusterName = "follower";
var attachedDatabaseConfigurationName = "adc";
var databaseName = "db" // Can be either specific database name or * for all databases
var defaultPrincipalsModificationKind = "Union"; 
var location = "North Central US";

AttachedDatabaseConfiguration attachedDatabaseConfigurationProperties = new AttachedDatabaseConfiguration()
{
	ClusterResourceId = $"/subscriptions/{subscriptionId}/resourceGroups/{followerResourceGroupName}/providers/Microsoft.Kusto/Clusters/{followerClusterName}",
	DatabaseName = databaseName,
	DefaultPrincipalsModificationKind = defaultPrincipalsModificationKind,
	Location = location
};

var attachedDatabaseConfigurations = resourceManagementClient.AttachedDatabaseConfigurations.CreateOrUpdate(followerResourceGroupName, followerClusterName, attachedDatabaseConfigurationName, attachedDatabaseConfigurationProperties);

```

### Share a database using an Azure Resource Manager template

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
				"description": "The name of the database to follow. You can follow all databases by using '*'."
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

### Deploy the template 

You can deploy the Azure Resource Manager template by using the Azure portal or using powershell.

   ![template deployment](media/follower/template-deployment.png)


|**Setting**  |**Description**  |
|---------|---------|
|Follower Cluster Name     |  The name of the follower cluster       |
|Attached Database Configurations Name    |    The name of the attached database configurations object. The name must be unique at the cluster level.     |
|Database Name     |      The name of the database to be followed. If you want to follow all the leader's databases use '*'.   |
|Leader Cluster Resource Id    |   The resource ID of the leader cluster.      |
|Default Principals Modification Kind    |   The default principal modification kind. Can be `Union`, `Replace` or `None`. For more information about default principal modification kind, [see link](need link).      |
|Location   |   The location of all the resources. The leader and the follower must be in the same location.       |
 
### Verify that the database was successfully shared

To verify that the database was successfully shared, find your shared databases in the [Azure portal](https://portal.azure.com). 

1. Navigate to the follower cluster and select **Databases**
1. Search for new Read-Only databases in the database list.

    ![Read only follower database](media/follower/read-only-follower-database.png)

Alternatively:

1. Navigate to the leader cluster and select **Databases**
2. Check that the relevant databases are marked as **SHARED WITH OTHERS** > **Yes**

    ![Read and write shared databases](media/follower/read-write-databases-shared.png)

### Detach the follower database using C# 

Follower cluster is able to detach any attached database as follows:

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, clientSecret);
var resourceManagementClient = new ResourceManagementClient(serviceCreds);

var followerResourceGroupName = "testrg";
//The cluster and database that are created as part of the Prerequisites
var followerClusterName = "follower";
var attachedDatabaseConfigurationsName = "adc";

resourceManagementClient.AttachedDatabaseConfigurations.Delete(followerResourceGroupName, followerClusterName, attachedDatabaseConfigurationsName);
```
Leader cluster is also able to detach any attached database as follows:
```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, clientSecret);
var resourceManagementClient = new ResourceManagementClient(serviceCreds);

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

resourceManagementClient.Clusters.DetachFollowerDatabases(leaderResourceGroupName, leaderClusterName, followerDatabaseDefinition);
```

## Managing principals

When attaching a database you need to specify the "default principals modification kind" to one of the following values:
Union - the attached database principal list will always include the original database principals. In addition, it it will be possible to add to it new principals.
Replace - There is no inheritance of principals from the original database. New principals should be created for the attached database.
None - the attached database principals can include only the principals of the original database and non can be added specifically to the attached one.

## Managing permissions

Managing read only database permission is the same as "regular" databases, please see [manage permissions in Azure portal](https://docs.microsoft.com/en-us/azure/data-explorer/manage-database-permissions#manage-permissions-in-the-azure-portal).
**Note**: Managing permissions with management commands is not supported.

## Configurable policies

The attached database admin can modify the caching policy of the attached database or any of its tables on the hosting cluster. This means, it is possible to have a caching policy of 30 days on the original cluster for running monthly analytics and a policy of 3 days on the secondary cluster to query only the recent data for troubleshooting.

## Limitations

* The follower and the leader must be in the same region
* Database that is being followed cannot be deleted