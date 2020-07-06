---
title: Manage read replicas - Azure CLI, REST API - Azure Database for PostgreSQL - Single Server
description: Learn how to manage read replicas in Azure Database for PostgreSQL - Single Server from the Azure CLI and REST API
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/09/2020
---

# Create and manage read replicas from the Azure CLI, REST API

In this article, you learn how to create and manage read replicas in Azure Database for PostgreSQL by using the Azure CLI and REST API. To learn more about read replicas, see the [overview](concepts-read-replicas.md).

## Azure replication support
[Read replicas](concepts-read-replicas.md) and [logical decoding](concepts-logical.md) both depend on the Postgres write ahead log (WAL) for information. These two features need different levels of logging from Postgres. Logical decoding needs a higher level of logging than read replicas.

To configure the right level of logging, use the Azure replication support parameter. Azure replication support has three setting options:

* **Off** - Puts the least information in the WAL. This setting is not available on most Azure Database for PostgreSQL servers.  
* **Replica** - More verbose than **Off**. This is the minimum level of logging needed for [read replicas](concepts-read-replicas.md) to work. This setting is the default on most servers.
* **Logical** - More verbose than **Replica**. This is the minimum level of logging for logical decoding to work. Read replicas also work at this setting.

The server needs to be restarted after a change of this parameter. Internally, this parameter sets the Postgres parameters `wal_level`, `max_replication_slots`, and `max_wal_senders`.

## Azure CLI
You can create and manage read replicas using the Azure CLI.

### Prerequisites

- [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- An [Azure Database for PostgreSQL server](quickstart-create-server-up-azure-cli.md) to be the master server.


### Prepare the master server

1. Check the master server's `azure.replication_support` value. It should be at least REPLICA for read replicas to work.

   ```azurecli-interactive
   az postgres server configuration show --resource-group myresourcegroup --server-name mydemoserver --name azure.replication_support
   ```

2. If `azure.replication_support` is not at least REPLICA, set it. 

   ```azurecli-interactive
   az postgres server configuration set --resource-group myresourcegroup --server-name mydemoserver --name azure.replication_support --value REPLICA
   ```

3. Restart the server to apply the change.

   ```azurecli-interactive
   az postgres server restart --name mydemoserver --resource-group myresourcegroup
   ```

### Create a read replica

The [az postgres server replica create](/cli/azure/postgres/server/replica?view=azure-cli-latest#az-postgres-server-replica-create) command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group | myresourcegroup |  The resource group where the replica server will be created.  |
| name | mydemoserver-replica | The name of the new replica server that is created. |
| source-server | mydemoserver | The name or resource ID of the existing master server to replicate from. Use the resource ID if you want the replica and master's resource groups to be different. |

In the CLI example below, the replica is created in the same region as the master.

```azurecli-interactive
az postgres server replica create --name mydemoserver-replica --source-server mydemoserver --resource-group myresourcegroup
```

To create a cross region read replica, use the `--location` parameter. The CLI example below creates the replica in West US.

```azurecli-interactive
az postgres server replica create --name mydemoserver-replica --source-server mydemoserver --resource-group myresourcegroup --location westus
```

> [!NOTE]
> To learn more about which regions you can create a replica in, visit the [read replica concepts article](concepts-read-replicas.md). 

If you haven't set the `azure.replication_support` parameter to **REPLICA** on a General Purpose or Memory Optimized master server and restarted the server, you receive an error. Complete those two steps before you create a replica.

A replica is created by using the same compute and storage settings as the master. After a replica is created, several settings can be changed independently from the master server: compute generation, vCores, storage, and back-up retention period. The pricing tier can also be changed independently, except to or from the Basic tier.

> [!IMPORTANT]
> Before a master server setting is updated to a new value, update the replica setting to an equal or greater value. This action helps the replica keep up with any changes made to the master.

### List replicas
You can view the list of replicas of a master server by using [az postgres server replica list](/cli/azure/postgres/server/replica?view=azure-cli-latest#az-postgres-server-replica-list) command.

```azurecli-interactive
az postgres server replica list --server-name mydemoserver --resource-group myresourcegroup 
```

### Stop replication to a replica server
You can stop replication between a master server and a read replica by using [az postgres server replica stop](/cli/azure/postgres/server/replica?view=azure-cli-latest#az-postgres-server-replica-stop) command.

After you stop replication to a master server and a read replica, it can't be undone. The read replica becomes a standalone server that supports both reads and writes. The standalone server can't be made into a replica again.

```azurecli-interactive
az postgres server replica stop --name mydemoserver-replica --resource-group myresourcegroup 
```

### Delete a master or replica server
To delete a master or replica server, you use the [az postgres server delete](/cli/azure/postgres/server?view=azure-cli-latest#az-postgres-server-delete) command.

When you delete a master server, replication to all read replicas is stopped. The read replicas become standalone servers that now support both reads and writes.

```azurecli-interactive
az postgres server delete --name myserver --resource-group myresourcegroup
```

## REST API
You can create and manage read replicas using the [Azure REST API](/rest/api/azure/).

### Prepare the master server

1. Check the master server's `azure.replication_support` value. It should be at least REPLICA for read replicas to work.

   ```http
   GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{masterServerName}/configurations/azure.replication_support?api-version=2017-12-01
   ```

2. If `azure.replication_support` is not at least REPLICA, set it.

   ```http
   PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{masterServerName}/configurations/azure.replication_support?api-version=2017-12-01
   ```

   ```JSON
   {
    "properties": {
    "value": "replica"
    }
   }
   ```

2. [Restart the server](/rest/api/postgresql/servers/restart) to apply the change.

   ```http
   POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{masterServerName}/restart?api-version=2017-12-01
   ```

### Create a read replica
You can create a read replica by using the [create API](/rest/api/postgresql/servers/create):

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{replicaName}?api-version=2017-12-01
```

```json
{
  "location": "southeastasia",
  "properties": {
    "createMode": "Replica",
    "sourceServerId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{masterServerName}"
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
You can view the list of replicas of a master server using the [replica list API](/rest/api/postgresql/replicas/listbyserver):

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{masterServerName}/Replicas?api-version=2017-12-01
```

### Stop replication to a replica server
You can stop replication between a master server and a read replica by using the [update API](/rest/api/postgresql/servers/update).

After you stop replication to a master server and a read replica, it can't be undone. The read replica becomes a standalone server that supports both reads and writes. The standalone server can't be made into a replica again.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{masterServerName}?api-version=2017-12-01
```

```json
{
  "properties": {
    "replicationRole":"None"  
   }
}
```

### Delete a master or replica server
To delete a master or replica server, you use the [delete API](/rest/api/postgresql/servers/delete):

When you delete a master server, replication to all read replicas is stopped. The read replicas become standalone servers that now support both reads and writes.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DBforPostgreSQL/servers/{serverName}?api-version=2017-12-01
```

## Next steps
* Learn more about [read replicas in Azure Database for PostgreSQL](concepts-read-replicas.md).
* Learn how to [create and manage read replicas in the Azure portal](howto-read-replicas-portal.md).
