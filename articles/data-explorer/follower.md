---
title: Use follower database feature to share databases in Azure Data Explorer
description: Learn about how to share databases in Azure Data Explorer using follower.
author: orspod
ms.author: orspodek
ms.reviewer: gabilehner
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/06/2019
---

# Using Follower database to share databases in Azure Data Explorer

Azure Data Explorer database(s) hosted in one cluster can be attached as read-only database(s) to a different cluster. By attaching a database to a cluster, you allow the users of the cluster to view the data and execute queries on the attached database. The attached database is a read-only database. Therefore, the data, tables and policies in the database can't be modified. \\policies that can be modified (with link).\\
Attached databases can't be deleted and they can only be detached on the attaching side. If a database that was attached to another cluster is deleted on the original cluster, \\all the attached databases will be inaccessible.\\

* The original cluster and the attached database(s) cluster share the same storage account. Therefore, you don't need to ingest data to the cluster of the attached database(s) since the attached databases cluster is fetching the data from the original cluster storage. The storage costs are associated with the original database cluster.
* A cluster can hold both attached databases and databases attached to other clusters.
* You can attach a single database, multiple databases, or all databases in a specific cluster.
* Detaching databases can be performed on both leader and follower clusters.

## Use cases for Follower database
Attaching a database to a different cluster is useful for the following scenarios:
* Segregate compute resource to protect a production environment from non-production use cases.
* Associate cost of Azure Data Explorer cluster to the part that runs queries on the data.

## Prerequisites

1. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
1. Create cluster and DB?

## Attach a database

There are various methods you can use to share a database. In this article, we discuss sharing a database using C# or an Azure Resource Manager template. 

To attach a database, you must have permissions on both the leader cluster and the follower cluster. For more information about permissions, see [permission model](#Permission-model).

### Attach a database using C#

**Required NuGets**

* Install [Microsoft.Azure.Management.kusto](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install [Microsoft.Rest.ClientRuntime.Azure.Authentication for authentication](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime.Azure.Authentication).


```Csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, clientSecret);
var resourceManagementClient = new ResourceManagementClient(serviceCreds);

var leaderResourceGroupName = "testrg";
var followerResourceGroupName = "followerResouceGroup";
var leaderClusterName = "leader";
var followerClusterName = "follower";
var attachedDatabaseConfigurationName = "adc";
var databaseName = "db" // Can be specific database name or * for all databases
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

### Attach a database using an Azure Resource Manager template

In this section, you learn how to share a database by using an [Azure Resource Manager template](../azure-resource-manager/resource-group-overview.md). 

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

You can deploy the Azure Resource Manager template by [using the Azure portal](#use-the-azure-portal-to-deploy-the-template-and-verify-template-deployment) or [using powershell](#use-powershell-to-deploy-the-template-and-verify-template-deployment).

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

#### Detach the attached database from the follower cluster

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, clientSecret);
var resourceManagementClient = new ResourceManagementClient(serviceCreds);

var followerResourceGroupName = "testrg";
//The cluster and database that are created as part of the prerequisites
var followerClusterName = "follower";
var attachedDatabaseConfigurationsName = "adc";

resourceManagementClient.AttachedDatabaseConfigurations.Delete(followerResourceGroupName, followerClusterName, attachedDatabaseConfigurationsName);
```

#### Detach the attached database from the leader cluster

The leader cluster is able to detach any attached database as follows:

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client secret
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

When attaching a database you specify the **default principals modification kind"**:

|**Kind** |**Description**  |
|---------|---------|
|Union     |   The attached database principals will always include the original database principals plus additional new principals.      |
|Replace    |    No inheritance of principals from the original database. New principals must be created for the attached database.     |
|None    |   The attached database principals include only the principals of the original database with no additional principals.      |
 

## Managing permissions

Managing read only database permission is the same as for "regular" databases. See [manage permissions in the Azure portal](/azure/data-explorer/manage-database-permissions#manage-permissions-in-the-azure-portal). Note that managing permissions with management commands isn't supported.

## Configurable policies

The attached database admin can modify the caching policy of the attached database or any of its tables on the hosting cluster. Therefore, it's possible to have a 30 day caching policy on the read-write database for running monthly reporting and a three day caching policy on the secondary cluster to query only the recent data for troubleshooting.

## Limitations

* \\data plane level operations on databases that were attached using "Attach all DBs" are not supported at this point.\\
* The follower and the leader must be in the same region.
* A database that is being followed can't be deleted.
* Streaming ingestion can't be used on a database that is being followed.
* You can't delete a database that is attached to a different cluster before detaching it.
* You can't delete a cluster that has a database attached to a different cluster before detaching it.
* \\You can't stop a cluster that has database(s) that were detached to other clusters as well as stopping a cluster that has attached databases.\\