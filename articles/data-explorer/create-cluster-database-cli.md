---
title: 'Quickstart: Create an Azure Data Explorer cluster and database using CLI'
description: In this quickstart, you will learn how to create an Azure Data Explorer cluster and database using Azure CLI
services: data-explorer
author: radennis
ms.author: radennis
ms.reviewer: orspod
ms.service: data-explorer
ms.topic: quickstart
ms.date: 2/4/2019
---

# Create an Azure Data Explorer cluster and database using CLI

This quickstart describes how to create an Azure Data Explorer cluster and database using Azure CLI.

## Prerequisites

To complete this quickstart, you need an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use Azure CLI locally, this quickstart requires Azure CLI version 2.0.4 or later. Run `az --version` to check your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Configure the CLI parameters

The following steps are not required if you're running commands in Cloud Shell. If you're running the CLI locally, perform the following steps to sign in to Azure and set your current subscription:

1. Run the following command to sign in to Azure:

    ```azurecli-interactive
    az login
    ```

2. Set the subscription where you would like your cluster to be created. Replace `MyAzureSub` with the name of the Azure subscription you want to use:

    ```azurecli-interactive
    az account set --subscription MyAzureSub
    ```

## Create the Azure Data Explorer cluster

1. Create your cluster using the following command:

    ```azurecli-interactive
    az kusto cluster create --name azureclitest --sku D11_v2 --resource-group testrg
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | name | *azureclitest* | The desired name of your cluster.|
   | sku | *D13_v2* | The SKU which will be used for your cluster. |
   | resource-group | *testrg* | The resource group name where the cluster will be created. |

    There are additional optional parameters that you can use, such as the capacity of the cluster.

2. Run the following command to check whether your cluster was successfully created:

    ```azurecli-interactive
    az kusto cluster show --name azureclitest --resource-group testrg
    ```

If the result contains "provisioningState" with "Succeeded" value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database using the following command:

    ```azurecli-interactive
    az kusto database create --cluster-name azureclitest --name clidatabase --resource-group testrg --soft-delete-period 3650:00:00:00 --hot-cache-period 3650:00:00:00
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | cluster-name | *azureclitest* | The name of your cluster where the database should be created.|
   | name | *clidatabase* | The desired name of your database.|
   | resource-group | *testrg* | The resource group name where the cluster will be created. |
   | soft-delete-period | *3650:00:00:00* | Amount of time that data should be kept so it is available to query. |
   | hot-cache-period | *3650:00:00:00* | Amount of time that data should be kept in cache. |

2. Run the following command to see the database you created:

    ```azurecli-interactive
    az kusto database show --name clidatabase --resource-group testrg --cluster-name azureclitest
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other quickstarts and tutorials, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the command below to delete your cluster:

    ```azurecli-interactive
    az kusto cluster delete --name azureclitest --resource-group testrg
    ```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)
