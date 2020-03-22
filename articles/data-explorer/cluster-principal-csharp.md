---
title: 'Add cluster principals for Azure Data Explorer by using C#'
description: In this article, you learn how to add cluster principals for Azure Data Explorer by using C#.
author: lucygoldbergmicrosoft
ms.author: lugoldbe
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 02/03/2020
---

# Add cluster principals for Azure Data Explorer by using C#

> [!div class="op_single_selector"]
> * [C#](cluster-principal-csharp.md)
> * [Python](cluster-principal-python.md)
> * [Azure Resource Manager template](cluster-principal-resource-manager.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. In this article, you add cluster principals for Azure Data Explorer by using C#.

## Prerequisites

* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.
* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* [Create a cluster](create-cluster-database-csharp.md).

## Install C# NuGet

* Install [Microsoft.Azure.Management.kusto](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install [Microsoft.Rest.ClientRuntime.Azure.Authentication](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime.Azure.Authentication) for authentication.

[!INCLUDE [data-explorer-authentication](../../includes/data-explorer-authentication.md)]

## Add a cluster principal

The following example shows you how to add a cluster principal programmatically.

```csharp
var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";

var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, clientSecret);
var kustoManagementClient = new KustoManagementClient(serviceCreds)
{
    SubscriptionId = subscriptionId
};

var resourceGroupName = "testrg";
//The cluster that is created as part of the Prerequisites
var clusterName = "mykustocluster";
string principalAssignmentName = "clusterPrincipalAssignment1";
string principalId = "xxxxxxxx";//User email, application ID, or security group name
string role = "AllDatabasesAdmin";//AllDatabasesAdmin or AllDatabasesViewer
string tenantIdForPrincipal = tenantId;
string principalType = "App";//User, App, or Group

var clusterPrincipalAssignment = new ClusterPrincipalAssignment(principalId, role, principalType, tenantId: tenantIdForPrincipal);
await kustoManagementClient.ClusterPrincipalAssignments.CreateOrUpdateAsync(resourceGroupName, clusterName, principalAssignmentName, clusterPrincipalAssignment);
```

|**Setting** | **Suggested value** | **Field description**|
|---|---|---|
| tenantId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | Your tenant ID. Also known as directory ID.|
| subscriptionId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The subscription ID that you use for resource creation.|
| clientId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The client ID of the application that can access resources in your tenant.|
| clientSecret | *xxxxxxxxxxxxxx* | The client secret of the application that can access resources in your tenant. |
| resourceGroupName | *testrg* | The name of the resource group containing your cluster.|
| clusterName | *mykustocluster* | The name of your cluster.|
| principalAssignmentName | *clusterPrincipalAssignment1* | The name of your cluster principal resource.|
| principalId | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The principal ID, which can be user email, application ID, or security group name.|
| role | *AllDatabasesAdmin* | The role of your cluster principal, which can be 'AllDatabasesAdmin' or 'AllDatabasesViewer'.|
| tenantIdForPrincipal | *xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx* | The tenant ID of the principal.|
| principalType | *App* | The type of the principal, which can be 'User', 'App', or 'Group'|

## Next steps

* [Add database principals](database-principal-csharp.md)
