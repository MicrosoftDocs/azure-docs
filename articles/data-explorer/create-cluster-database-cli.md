---
title: 'Create an Azure Data Explorer cluster and a database using CLI'
description: This article describes how to create an Azure Data Explorer cluster and database using Azure CLI
services: data-explorer
author: radennis
ms.author: radennis
ms.reviewer: orspod
ms.service: data-explorer
ms.topic: howto
ms.date: 1/31/2019
---

# Create an Azure Data Explorer cluster and a database using CLI

This article describes how to create an Azure Data Explorer cluster and database using Azure CLI.

## What's the difference between the management plane and data plane APIs

There are two different API libraries, Management and Data plane APIs.
The Management APIs are used to manage the resources, for instance create a cluster, create a database, delete a data connection, change the number of instances count etc. The data plane APIs are used to interact with the data, run queries, ingest data etc.

## Configure the CLI parameters

Log in to your account

```Bash
az login
```

Set the subscription where you would like to cluster to be created.

```Bash
az account set --subscription "your_subscription"
```

## Create the Azure Data Explorer cluster

Create your cluster using the following command.

```Bash
az kusto cluster create --name azureclitest --sku D11_v2 --resource-group testrg
```

Provide the following values

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | name | *azureclitest* | The desired name of your cluster.|
    | sku | *D13_v2* | The SKU which will be used for your cluster. |
    | resource-group | *testrg* | The resource group name where the cluster would be created. |
    | | |

If you want, there are more optional parameters that you can use, such as the capacity of the cluster etc.

To check whether your cluster was successfully created, you can run

```Bash
az kusto cluster show --name azureclitest --resource-group testrg
```

If the result contains "provisioningState" with "Succeeded" value, that means the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

Create your database using the following command.

```Bash
az kusto database create --cluster-name azureclitest --name clidatabase --resource-group testrg --soft-delete-period 3650:00:00:00 --hot-cache-period 3650:00:00:00
```

Provide the following values

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | cluster-name | *azureclitest* | The name of your cluster where the should be created.|
    | name | *clidatabase* | The desired name of your database.|
    | resource-group | *testrg* | The resource group name where the cluster would be created. |
    | soft-delete-period | *3650:00:00:00* | Amount of time that data should be kept so it is available to query. |
    | hot-cache-period | *3650:00:00:00* | Amount of time that data should be kept in cache. |
    | | |

You can see the database you created by running

```Bash
az kusto database show --name clidatabase --resource-group testrg --cluster-name azureclitest
```

That's it you now have a cluster and a database.

## Clean up resources

If you plan to follow our other quickstarts and tutorials, keep the resources you created.

When you delete a cluster, it also deletes all the databases in it. Use the below command to delete your cluster.

```Bash
az kusto cluster delete --name azureclitest --resource-group testrg
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Ingest data from Event Hub into Azure Data Explorer](ingest-data-event-hub.md)
