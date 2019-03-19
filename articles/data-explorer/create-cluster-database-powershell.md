---
title: 'Quickstart: Create an Azure Data Explorer cluster and database by using PowerShell'
description: Learn how to create an Azure Data Explorer cluster and database by using PowerShell
services: data-explorer
author: oflipman
ms.author: oflipman
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: quickstart
ms.date: 03/17/2019
---


# Create an Azure Data Explorer cluster and database by using PowerShell

> [!div class="op_single_selector"]
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
>  


This quickstart describes how to create an Azure Data Explorer cluster and database by using PowerShell.

You can run PowerShell cmdlets and scripts on Windows, Linux, or in [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) to create and configure [Azure Data Explorer](https://docs.microsoft.com/azure/kusto/ ).

The [**Az.Kusto**](https://docs.microsoft.com/powershell/module/az.kusto/?view=azps-1.4.0#kusto ). With Azure PowerShell and **Az.Kusto**, you can perform the following tasks:

## Prerequisites

To complete this quickstart, you need an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Configure parameters

The following steps are not required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow these steps to sign in to Azure and to set your current subscription:

1. Run the following command to sign in to Azure:

    ```azurepowershell-interactive
    Connect-AzAccount
    ```

2. Set the subscription where you want your cluster to be created.

    ```azurepowershell-interactive
     Set-AzContext -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ```
3. Install Az.Kusto module on your device:
	
	```azurepowershell-interactive
     Install-Module -Name Az.Kusto	
    ```

## Create the Azure Data Explorer cluster

1. Create your cluster by using the following command:

    ```azurepowershell-interactive
     New-AzKustoCluster -ResourceGroupName testrg -Name mykustocluster -Location 'Central US' -Sku D13_v2 -Capacity 10
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | Name | *mykustocluster* | The desired name of your cluster.|
   | Sku | *D13_v2* | The SKU that will be used for your cluster. |
   | ResourceGroupName | *testrg* | The resource group name where the cluster will be created. |

    There are additional optional parameters that you can use, such as the capacity of the cluster.

2. Run the following command to check whether your cluster was successfully created:

    ```azurepowershell-interactive
    Get-AzKustoCluster -Name mykustocluster --ResourceGroupName testrg
    ```

If the result contains `provisioningState` with the `Succeeded` value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database by using the following command:

    ```azurepowershell-interactive
    New-AzKustoDatabase -ResourceGroupName testrg -ClusterName mykustocluster -Name mykustodatabase -SoftDeletePeriod 3650:00:00:00 -HotCachePeriod 3650:00:00:00
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | ClusterName | *mykustocluster* | The name of your cluster where the database will be created.|
   | Name | *mykustodatabase* | The name of your database.|
   | ResourceGroupName | *testrg* | The resource group name where the cluster will be created. |
   | SoftDeletePeriod | *3650:00:00:00* | The amount of time that data will be kept available to query. |
   | HotCachePeriod | *3650:00:00:00* | The amount of time that data will be kept in cache. |

2. Run the following command to see the database that you created:

    ```azurepowershell-interactive
    Get-AzKustoDatabase -ClusterName mykustocluster --ResourceGroupName testrg -Name mykustodatabase
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other quickstarts and tutorials, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

    ```azurepowershell-interactive
    Remove-AzKustoCluster -ResourceGroupName testrg -Name mykustocluster
    ```

## Next steps

You can find more Az.Kusto commands [**here**](https://docs.microsoft.com/powershell/module/az.kusto/?view=azps-1.4.0#kusto )

> [!div class="nextstepaction"]
> [Quickstart: Ingest data using the Azure Data Explorer .NET Standard SDK (Preview)](net-standard-ingest-data.md)
