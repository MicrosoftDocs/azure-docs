---
title: 'Create an Azure Data Explorer cluster and database by using Azure CLI'
description: Learn how to create an Azure Data Explorer cluster and database by using the Azure CLI
author: radennis
ms.author: radennis
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 06/03/2019
---

# Create an Azure Data Explorer cluster and database by using Azure CLI

> [!div class="op_single_selector"]
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
>

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this article, you create a cluster and a database by using Azure CLI.

## Prerequisites

To complete this article, you need an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the Azure CLI locally, this article requires the Azure CLI version 2.0.4 or later. Run `az --version` to check your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).

## Configure the CLI parameters

The following steps are not required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow these steps to sign in to Azure and to set your current subscription:

1. Run the following command to sign in to Azure:

    ```azurecli-interactive
    az login
    ```

1. Set the subscription where you want your cluster to be created. Replace `MyAzureSub` with the name of the Azure subscription that you want to use:

    ```azurecli-interactive
    az account set --subscription MyAzureSub
    ```

## Create the Azure Data Explorer cluster

1. Create your cluster by using the following command:

    ```azurecli-interactive
    az kusto cluster create --name azureclitest --sku D11_v2 --resource-group testrg
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | name | *azureclitest* | The desired name of your cluster.|
   | sku | *D13_v2* | The SKU that will be used for your cluster. |
   | resource-group | *testrg* | The resource group name where the cluster will be created. |

    There are additional optional parameters that you can use, such as the capacity of the cluster.

1. Run the following command to check whether your cluster was successfully created:

    ```azurecli-interactive
    az kusto cluster show --name azureclitest --resource-group testrg
    ```

If the result contains `provisioningState` with the `Succeeded` value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database by using the following command:

    ```azurecli-interactive
    az kusto database create --cluster-name azureclitest --name clidatabase --resource-group testrg --soft-delete-period P365D --hot-cache-period P31D
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | cluster-name | *azureclitest* | The name of your cluster where the database will be created.|
   | name | *clidatabase* | The name of your database.|
   | resource-group | *testrg* | The resource group name where the cluster will be created. |
   | soft-delete-period | *P365D* | Signifies the amount of time that data will be kept available to query. See [retention policy](/azure/kusto/concepts/retentionpolicy) for more information. |
   | hot-cache-period | *P31D* | Signifies the amount of time that data will be kept in cache. See [cache policy](/azure/kusto/concepts/cachepolicy) for more information. |

1. Run the following command to see the database that you created:

    ```azurecli-interactive
    az kusto database show --name clidatabase --resource-group testrg --cluster-name azureclitest
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other articles, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

    ```azurecli-interactive
    az kusto cluster delete --name azureclitest --resource-group testrg
    ```

## Next steps

* [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)
