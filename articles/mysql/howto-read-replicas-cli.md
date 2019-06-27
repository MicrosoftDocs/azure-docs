---
title: Create and manage read replicas in Azure Database for MySQL
description: This article describes how to set up and manage read replicas in Azure Database for MySQL using the Azure CLI.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 05/28/2019
---

# How to create and manage read replicas in Azure Database for MySQL using the Azure CLI

In this article, you will learn how to create and manage read replicas within the same Azure region as the master in the Azure Database for MySQL service using the Azure CLI.

> [!IMPORTANT]
> You can create a read replica in the same region as your master server, or in any other Azure region of your choice. Cross-region replication is currently in public preview.

## Prerequisites

- [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md) that will be used as the master server. 

> [!IMPORTANT]
> The read replica feature is only available for Azure Database for MySQL servers in the General Purpose or Memory Optimized pricing tiers. Ensure the master server is in one of these pricing tiers.

## Create a read replica

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
> Read replicas are created with the same server configuration as the master. The replica server configuration can be changed after it has been created. It is recommended that the replica server's configuration should be kept at equal or greater values than the master to ensure the replica is able to keep up with the master.

## Stop replication to a replica server

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

## Delete a replica server

Deleting a read replica server can be done by running the **[az mysql server delete](/cli/azure/mysql/server)** command.

```azurecli-interactive
az mysql server delete --resource-group myresourcegroup --name mydemoreplicaserver
```

## Delete a master server

> [!IMPORTANT]
> Deleting a master server stops replication to all replica servers and deletes the master server itself. Replica servers become standalone servers that now support both read and writes.

To delete a master server, you can run the **[az mysql server delete](/cli/azure/mysql/server)** command.

```azurecli-interactive
az mysql server delete --resource-group myresourcegroup --name mydemoserver
```

## List replicas for a master server

To view all replicas for a given master server, run the following command: 

```azurecli-interactive
az mysql server replica list --server-name mydemoserver --resource-group myresourcegroup
```

The `az mysql server replica list` command requires the following parameters:

| Setting | Example value | Description  |
| --- | --- | --- |
| resource-group |  myresourcegroup |  The resource group where the replica server will be created to.  |
| server-name | mydemoserver | The name or ID of the master server. |

## Next steps

- Learn more about [read replicas](concepts-read-replicas.md)
