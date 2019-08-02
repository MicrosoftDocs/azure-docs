---
title: 'Create an Azure Data Explorer cluster and database by using C#'
description: Learn how to create an Azure Data Explorer cluster and database by using the C#
author: oflipman
ms.author: oflipman
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/03/2019
---

# Create an Azure Data Explorer cluster and database by using C#

> [!div class="op_single_selector"]
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this article, you create a cluster and a database by using C#.

## Prerequisites

* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Install C# Nuget

1. Install the [Azure Data Explorer (Kusto) nuget package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

1. Install the [Microsoft.IdentityModel.Clients.ActiveDirectory nuget package](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) for authentication.

## Create the Azure Data Explorer cluster

1. Create your cluster by using the following code:

    ```csharp
    var resourceGroupName = "testrg";
    var clusterName = "mykustocluster";
    var location = "Central US";
    var sku = new AzureSku("D13_v2", 5);
    var cluster = new Cluster(location, sku);

    var authenticationContext = new AuthenticationContext("https://login.windows.net/{tenantName}");
    var credential = new ClientCredential(clientId: "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx", clientSecret: "xxxxxxxxxxxxxx");
    var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

    var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    };

    kustoManagementClient.Clusters.CreateOrUpdate(resourceGroupName, clusterName, cluster);
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | clusterName | *mykustocluster* | The desired name of your cluster.|
   | sku | *D13_v2* | The SKU that will be used for your cluster. |
   | resourceGroupName | *testrg* | The resource group name where the cluster will be created. |

    There are additional optional parameters that you can use, such as the capacity of the cluster.

1. Set [your credentials](https://docs.microsoft.com/dotnet/azure/dotnet-sdk-azure-authenticate?view=azure-dotnet)

1. Run the following command to check whether your cluster was successfully created:

    ```csharp
    kustoManagementClient.Clusters.Get(resourceGroupName, clusterName);
    ```

If the result contains `ProvisioningState` with the `Succeeded` value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database by using the following code:

    ```csharp
    var hotCachePeriod = new TimeSpan(3650, 0, 0, 0);
    var softDeletePeriod = new TimeSpan(3650, 0, 0, 0);
    var databaseName = "mykustodatabase";
    var database = new Database(location: location, softDeletePeriod: softDeletePeriod, hotCachePeriod: hotCachePeriod);

    kustoManagementClient.Databases.CreateOrUpdate(resourceGroupName, clusterName, databaseName, database);
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | clusterName | *mykustocluster* | The name of your cluster where the database will be created.|
   | databaseName | *mykustodatabase* | The name of your database.|
   | resourceGroupName | *testrg* | The resource group name where the cluster will be created. |
   | softDeletePeriod | *3650:00:00:00* | The amount of time that data will be kept available to query. |
   | hotCachePeriod | *3650:00:00:00* | The amount of time that data will be kept in cache. |

2. Run the following command to see the database that you created:

    ```csharp
    kustoManagementClient.Databases.Get(resourceGroupName, clusterName, databaseName);
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other articles, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

    ```csharp
    kustoManagementClient.Clusters.Delete(resourceGroupName, clusterName);
    ```

## Next steps

* [Ingest data using the Azure Data Explorer .NET Standard SDK (Preview)](net-standard-ingest-data.md)
