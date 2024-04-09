---
title: Manage read replicas - Azure CLI, REST API - Azure Database for MariaDB
description: This article describes how to set up and manage read replicas in Azure Database for MariaDB using the Azure CLI and REST API.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 06/24/2022
---

# How to create and manage read replicas in Azure Database for MariaDB using the Azure CLI and REST API

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

In this article, you will learn how to create and manage read replicas in the Azure Database for MariaDB service using the Azure CLI and REST API.

## Azure CLI

You can create and manage read replicas using the Azure CLI.

### Prerequisites

- [Install Azure CLI 2.0](/cli/azure/install-azure-cli)
- An [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-portal.md) that will be used as the source server.

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MariaDB servers in the General Purpose or Memory Optimized pricing tiers. Ensure the source server is in one of these pricing tiers.

### Create a read replica

> [!IMPORTANT]
> When you create a replica for a source that has no existing replicas, the source will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

A read replica server can be created using the following command:

```azurecli-interactive
az mariadb server replica create --name mydemoreplicaserver --source-server mydemoserver --resource-group myresourcegroup
```

The `az mariadb server replica create` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server will be created to.  |
| name | mydemoreplicaserver | The name of the new replica server that is created. |
| source-server | mydemoserver | The name or ID of the existing source server to replicate from. |

To create a cross region read replica, use the `--location` parameter.

The CLI example below creates the replica in West US.

```azurecli-interactive
az mariadb server replica create --name mydemoreplicaserver --source-server mydemoserver --resource-group myresourcegroup --location westus
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md).

> [!NOTE]
> Read replicas are created with the same server configuration as the master. The replica server configuration can be changed after it has been created. It is recommended that the replica server's configuration should be kept at equal or greater values than the source to ensure the replica is able to keep up with the master.

### List replicas for a source server

To view all replicas for a given source server, run the following command:

```azurecli-interactive
az mariadb server replica list --server-name mydemoserver --resource-group myresourcegroup
```

The `az mariadb server replica list` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server will be created to.  |
| server-name | mydemoserver | The name or ID of the source server. |

### Stop replication to a replica server

> [!IMPORTANT]
> Stopping replication to a server is irreversible. Once replication has stopped between a source and replica, it cannot be undone. The replica server then becomes a standalone server and now supports both read and writes. This server cannot be made into a replica again.

Replication to a read replica server can be stopped using the following command:

```azurecli-interactive
az mariadb server replica stop --name mydemoreplicaserver --resource-group myresourcegroup
```

The `az mariadb server replica stop` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server exists.  |
| name | mydemoreplicaserver | The name of the replica server to stop replication on. |

### Delete a replica server

Deleting a read replica server can be done by running the **[az mariadb server delete](/cli/azure/mariadb/server)** command.

```azurecli-interactive
az mariadb server delete --resource-group myresourcegroup --name mydemoreplicaserver
```

### Delete a source server

> [!IMPORTANT]
> Deleting a source server stops replication to all replica servers and deletes the source server itself. Replica servers become standalone servers that now support both read and writes.

To delete a source server, you can run the **[az mariadb server delete](/cli/azure/mariadb/server)** command.

```azurecli-interactive
az mariadb server delete --resource-group myresourcegroup --name mydemoserver
```

## REST API

You can create and manage read replicas using the [Azure REST API](/rest/api/azure/).

### Create a read replica

You can create a read replica by using the [create API](/rest/api/mariadb/servers/create):

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMariaDB/servers/{replicaName}?api-version=2017-12-01
```

```json
{
  "location": "southeastasia",
  "properties": {
    "createMode": "Replica",
    "sourceServerId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMariaDB/servers/{masterServerName}"
  }
}
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md).

If you haven't set the `azure.replication_support` parameter to **REPLICA** on a General Purpose or Memory Optimized source server and restarted the server, you receive an error. Complete those two steps before you create a replica.

A replica is created by using the same compute and storage settings as the master. After a replica is created, several settings can be changed independently from the source server: compute generation, vCores, storage, and back-up retention period. The pricing tier can also be changed independently, except to or from the Basic tier.

> [!IMPORTANT]
> Before a source server setting is updated to a new value, update the replica setting to an equal or greater value. This action helps the replica keep up with any changes made to the master.

### List replicas

You can view the list of replicas of a source server using the [replica list API](/rest/api/mariadb/replicas/listbyserver):

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMariaDB/servers/{masterServerName}/Replicas?api-version=2017-12-01
```

### Stop replication to a replica server

You can stop replication between a source server and a read replica by using the [update API](/rest/api/mariadb/servers/update).

After you stop replication to a source server and a read replica, it can't be undone. The read replica becomes a standalone server that supports both reads and writes. The standalone server can't be made into a replica again.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMariaDB/servers/{masterServerName}?api-version=2017-12-01
```

```json
{
  "properties": {
    "replicationRole":"None"  
   }
}
```

### Delete a source or replica server

To delete a source or replica server, you use the [delete API](/rest/api/mariadb/servers/delete):

When you delete a source server, replication to all read replicas is stopped. The read replicas become standalone servers that now support both reads and writes.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMariaDB/servers/{serverName}?api-version=2017-12-01
```

## Next steps

- Learn more about [read replicas](concepts-read-replicas.md)
