---
title: 'Quickstart: Create an Azure Data Explorer cluster and database by using Python'
description: Learn how to create an Azure Data Explorer cluster and database by using the Python
services: data-explorer
author: oflipman
ms.author: oflipman
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: quickstart
ms.date: 03/17/2019
---


# Create an Azure Data Explorer cluster and database by using Python

> [!div class="op_single_selector"]
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
>  

This quickstart describes how to create an Azure Data Explorer cluster and database by using Python.

## Prerequisites

To complete this quickstart, you need an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Install Python package

To install the Python package for Azure Data Explorer (Kusto), open a command prompt that has Python in its path, and then run this command:

```
pip install azure-mgmt-kusto
```

## Create the Azure Data Explorer cluster

1. Create your cluster by using the following command:

    

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | cluster_name | *mykustocluster* | The desired name of your cluster.|
   | sku | *D13_v2* | The SKU that will be used for your cluster. |
   | resource_group_name | *testrg* | The resource group name where the cluster will be created. |

    There are additional optional parameters that you can use, such as the capacity of the cluster.
	
	Set the 'credentials' to your credentials (for more information see https://docs.microsoft.com/python/azure/python-sdk-azure-authenticate?view=azure-python )

2. Run the following command to check whether your cluster was successfully created:

    ```Python
    cluster_operations.get(resource_group_name = resource_group_name, cluster_name= clusterName, custom_headers=None, raw=False)
    ```

If the result contains `provisioningState` with the `Succeeded` value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database by using the following command:

    ```Python
    from azure.mgmt.kusto.models import Database
	from datetime import timedelta
	
	softDeletePeriod = timedelta(days=3650)
	hotCachePeriod = timedelta(days=3650)
	databaseName="mykustodatabase"
	
	database_operations = kusto_management_client.databases	
	_database = Database(location=location,
						soft_delete_period=softDeletePeriod,
						hot_cache_period=hotCachePeriod)
	
	database_operations.create_or_update(resource_group_name = resource_group_name, cluster_name = clusterName, database_name = databaseName, parameters = _database)
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | cluster_name | *mykustocluster* | The name of your cluster where the database will be created.|
   | database_name | *mykustodatabase* | The name of your database.|
   | resource_group_name | *testrg* | The resource group name where the cluster will be created. |
   | soft_delete_period | *3650 days, 0:00:00* | The amount of time that data will be kept available to query. |
   | hot_cache_period | *3650 days, 0:00:00* | The amount of time that data will be kept in cache. |

2. Run the following command to see the database that you created:

    ```Python
    database_operations.get(resource_group_name = resource_group_name, cluster_name = clusterName, database_name = databaseName)
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other quickstarts and tutorials, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

    ```Python
    cluster_operations.delete(resource_group_name = resource_group_name, cluster_name = clusterName)
    ```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)
