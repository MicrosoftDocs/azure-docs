---
title: Manage read replicas - Azure CLI, REST API - Azure Database for MySQL
description: Learn how to set up and manage read replicas in Azure Database for MySQL using the Azure CLI or REST API.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 06/20/2022
ms.custom: devx-track-azurecli
---

# How to create and manage read replicas in Azure Database for MySQL using the Azure CLI and REST API

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

In this article, you will learn how to create and manage read replicas in the Azure Database for MySQL service using the Azure CLI and REST API. To learn more about read replicas, see the [overview](concepts-read-replicas.md).

## Azure CLI
You can create and manage read replicas using the Azure CLI.

### Prerequisites

- [Install Azure CLI 2.0](/cli/azure/install-azure-cli)
- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md) that will be used as the source server. 

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MySQL servers in the General Purpose or Memory Optimized pricing tiers. Ensure the source server is in one of these pricing tiers.

### Create a read replica

> [!IMPORTANT]
> If your source server has no existing replica servers, source server might need a restart to prepare itself for replication depending upon the storage used (v1/v2). Please consider server restart and perform this operation during off-peak hours. See [Source Server restart](./concepts-read-replicas.md#source-server-restart) for more details.  
>
>If GTID is enabled on a primary server (`gtid_mode` = ON), newly created replicas will also have GTID enabled and use GTID based replication. To learn more refer to [Global transaction identifier (GTID)](concepts-read-replicas.md#global-transaction-identifier-gtid)

A read replica server can be created using the following command:

```azurecli-interactive
az mysql server replica create --name mydemoreplicaserver --source-server mydemoserver --resource-group myresourcegroup
```

The `az mysql server replica create` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server will be created to.  |
| name | mydemoreplicaserver | The name of the new replica server that is created. |
| source-server | mydemoserver | The name or ID of the existing source server to replicate from. |

To create a cross region read replica, use the `--location` parameter. The CLI example below creates the replica in West US.

```azurecli-interactive
az mysql server replica create --name mydemoreplicaserver --source-server mydemoserver --resource-group myresourcegroup --location westus
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md). 

> [!NOTE]
> * The `az mysql server replica create` command has `--sku-name` argument which allows you to specify the sku (`{pricing_tier}_{compute generation}_{vCores}`) while you create a replica using Azure CLI. </br>
> * The primary server and read replica should be on same pricing tier (General Purpose or Memory Optimized). </br>
> * The replica server configuration can also be changed after it has been created. It is recommended that the replica server's configuration should be kept at equal or greater values than the source to ensure the replica is able to keep up with the master.


### List replicas for a source server

To view all replicas for a given source server, run the following command: 

```azurecli-interactive
az mysql server replica list --server-name mydemoserver --resource-group myresourcegroup
```

The `az mysql server replica list` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server will be created to.  |
| server-name | mydemoserver | The name or ID of the source server. |

### Stop replication to a replica server

> [!IMPORTANT]
> Stopping replication to a server is irreversible. Once replication has stopped between a source and replica, it cannot be undone. The replica server then becomes a standalone server and now supports both read and writes. This server cannot be made into a replica again.

Replication to a read replica server can be stopped using the following command:

```azurecli-interactive
az mysql server replica stop --name mydemoreplicaserver --resource-group myresourcegroup
```

The `az mysql server replica stop` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server exists.  |
| name | mydemoreplicaserver | The name of the replica server to stop replication on. |

### Delete a replica server

Deleting a read replica server can be done by running the **[az mysql server delete](/cli/azure/mysql/server)** command.

```azurecli-interactive
az mysql server delete --resource-group myresourcegroup --name mydemoreplicaserver
```

### Delete a source server

> [!IMPORTANT]
> Deleting a source server stops replication to all replica servers and deletes the source server itself. Replica servers become standalone servers that now support both read and writes.

To delete a source server, you can run the **[az mysql server delete](/cli/azure/mysql/server)** command.

```azurecli-interactive
az mysql server delete --resource-group myresourcegroup --name mydemoserver
```


## REST API
You can create and manage read replicas using the [Azure REST API](/rest/api/azure/).

### Create a read replica
You can create a read replica by using the [create API](/rest/api/mysql/flexibleserver/servers/create):

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{replicaName}?api-version=2017-12-01
```

```json
{
  "location": "southeastasia",
  "properties": {
    "createMode": "Replica",
    "sourceServerId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{masterServerName}"
  }
}
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md). 

A replica is created by using the same compute and storage settings as the master. After a replica is created, several settings can be changed independently from the source server: compute generation, vCores, storage, and back-up retention period. The pricing tier can also be changed independently, except to or from the Basic tier.


> [!IMPORTANT]
> Before a source server setting is updated to a new value, update the replica setting to an equal or greater value. This action helps the replica keep up with any changes made to the master.

### List replicas
You can view the list of replicas of a source server using the [replica list API](/rest/api/mysql/flexibleserver/replicas/list-by-server):

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{masterServerName}/Replicas?api-version=2017-12-01
```

### Stop replication to a replica server
You can stop replication between a source server and a read replica by using the [update API](/rest/api/mysql/flexibleserver/servers/update).

After you stop replication to a source server and a read replica, it can't be undone. The read replica becomes a standalone server that supports both reads and writes. The standalone server can't be made into a replica again.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{masterServerName}?api-version=2017-12-01
```

```json
{
  "properties": {
    "replicationRole":"None"  
   }
}
```

### Delete a source or replica server
To delete a source or replica server, you use the [delete API](/rest/api/mysql/flexibleserver/servers/delete):

When you delete a source server, replication to all read replicas is stopped. The read replicas become standalone servers that now support both reads and writes.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{serverName}?api-version=2017-12-01
```

### Known issue

There are two generations of storage which the servers in General Purpose and Memory Optimized tier use, General purpose storage v1 (Supports up to 4-TB) & General purpose storage v2 (Supports up to 16-TB storage).
Source server and the replica server should have same storage type. As [General purpose storage v2](./concepts-pricing-tiers.md#general-purpose-storage-v2-supports-up-to-16-tb-storage) is not available in all regions, please make sure you choose the correct replica region while you use location with the CLI or REST API for read replica creation. On how to identify the storage type of your source server refer to link [How can I determine which storage type my server is running on](./concepts-pricing-tiers.md#how-can-i-determine-which-storage-type-my-server-is-running-on). 

If you choose a region where you cannot create a read replica for your source server, you will encounter the issue where the deployment will keep running as shown in the figure below and then will timeout with the error *“The resource provision operation did not complete within the allowed timeout period.”*

[ :::image type="content" source="media/how-to-read-replicas-cli/replica-cli-known-issue.png" alt-text="Read replica cli error.":::](media/how-to-read-replicas-cli/replica-cli-known-issue.png#lightbox)

## Next steps

- Learn more about [read replicas](concepts-read-replicas.md)
