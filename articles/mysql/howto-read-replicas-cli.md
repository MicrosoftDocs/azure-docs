---
title: Manage read replicas - Azure CLI, REST API - Azure Database for MySQL
description: Learn how to set up and manage read replicas in Azure Database for MySQL using the Azure CLI or REST API.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 6/10/2020
---

# How to create and manage read replicas in Azure Database for MySQL using the Azure CLI and REST API

In this article, you will learn how to create and manage read replicas in the Azure Database for MySQL service using the Azure CLI and REST API. To learn more about read replicas, see the [overview](concepts-read-replicas.md).

## Azure CLI
You can create and manage read replicas using the Azure CLI.

### Prerequisites

- [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md) that will be used as the master server. 

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MySQL servers in the General Purpose or Memory Optimized pricing tiers. Ensure the master server is in one of these pricing tiers.

### Create a read replica

> [!IMPORTANT]
> When you create a replica for a master that has no existing replicas, the master will first restart to prepare itself for replication. Take this into consideration and perform these operations during an off-peak period.

A read replica server can be created using the following command:

```azurecli-interactive
az mysql server replica create --name mydemoreplicaserver --source-server mydemoserver --resource-group myresourcegroup
```

The `az mysql server replica create` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server will be created to.  |
| name | mydemoreplicaserver | The name of the new replica server that is created. |
| source-server | mydemoserver | The name or ID of the existing master server to replicate from. |

To create a cross region read replica, use the `--location` parameter. The CLI example below creates the replica in West US.

```azurecli-interactive
az mysql server replica create --name mydemoreplicaserver --source-server mydemoserver --resource-group myresourcegroup --location westus
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md). 

> [!NOTE]
> Read replicas are created with the same server configuration as the master. The replica server configuration can be changed after it has been created. It is recommended that the replica server's configuration should be kept at equal or greater values than the master to ensure the replica is able to keep up with the master.


### List replicas for a master server

To view all replicas for a given master server, run the following command: 

```azurecli-interactive
az mysql server replica list --server-name mydemoserver --resource-group myresourcegroup
```

The `az mysql server replica list` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server will be created to.  |
| server-name | mydemoserver | The name or ID of the master server. |

### Stop replication to a replica server

> [!IMPORTANT]
> Stopping replication to a server is irreversible. Once replication has stopped between a master and replica, it cannot be undone. The replica server then becomes a standalone server and now supports both read and writes. This server cannot be made into a replica again.

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

### Delete a master server

> [!IMPORTANT]
> Deleting a master server stops replication to all replica servers and deletes the master server itself. Replica servers become standalone servers that now support both read and writes.

To delete a master server, you can run the **[az mysql server delete](/cli/azure/mysql/server)** command.

```azurecli-interactive
az mysql server delete --resource-group myresourcegroup --name mydemoserver
```


## REST API
You can create and manage read replicas using the [Azure REST API](/rest/api/azure/).

### Create a read replica
You can create a read replica by using the [create API](/rest/api/mysql/servers/create):

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

If you haven't set the `azure.replication_support` parameter to **REPLICA** on a General Purpose or Memory Optimized master server and restarted the server, you receive an error. Complete those two steps before you create a replica.

A replica is created by using the same compute and storage settings as the master. After a replica is created, several settings can be changed independently from the master server: compute generation, vCores, storage, and back-up retention period. The pricing tier can also be changed independently, except to or from the Basic tier.


> [!IMPORTANT]
> Before a master server setting is updated to a new value, update the replica setting to an equal or greater value. This action helps the replica keep up with any changes made to the master.

### List replicas
You can view the list of replicas of a master server using the [replica list API](/rest/api/mysql/replicas/listbyserver):

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{masterServerName}/Replicas?api-version=2017-12-01
```

### Stop replication to a replica server
You can stop replication between a master server and a read replica by using the [update API](/rest/api/mysql/servers/update).

After you stop replication to a master server and a read replica, it can't be undone. The read replica becomes a standalone server that supports both reads and writes. The standalone server can't be made into a replica again.

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

### Delete a master or replica server
To delete a master or replica server, you use the [delete API](/rest/api/mysql/servers/delete):

When you delete a master server, replication to all read replicas is stopped. The read replicas become standalone servers that now support both reads and writes.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforMySQL/servers/{serverName}?api-version=2017-12-01
```


## Next steps

- Learn more about [read replicas](concepts-read-replicas.md)
