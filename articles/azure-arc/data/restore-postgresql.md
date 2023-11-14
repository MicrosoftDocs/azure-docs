---
title: Restore Azure Arc-enabled PostgreSQL server
description: Explains how to restore Arc-enabled PostgreSQL server. You can restore to a point-in-time or restore a whole server.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
ms.custom: devx-track-azurecli
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 03/13/2023
ms.topic: how-to
---

# Restore Azure Arc-enabled PostgreSQL servers

Restoring an Azure Arc-enable PostgreSQL server creates a new server by copying the configuration of the existing server (for example resource requests/limits, extensions etc.). Configurations that could cause conflicts (for example primary endpoint port) aren't copied. The storage configuration for the new resource can be defined by passing `--storage-class*` and `--volume-size-*` parameters to the `restore` command.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

Restore an Azure Arc-enabled PostgreSQL server to a new server with the `restore` command:

```azurecli
az postgres server-arc restore -n <destination-server-name> --source-server <source-server-name> --k8s-namespace <namespace> --use-k8s
```

## Examples

### Restore using latest backups

Create a new Arc-enabled PostgreSQL server `pg02` by restoring `pg01` using the latest backups:

```azurecli
az postgres server-arc restore -n pg02 --source-server pg01 --k8s-namespace arc --use-k8s
```

### Restore using latest backup and modify the storage requirement

Create a new Arc-enabled PostgreSQL server `pg02` by restoring `pg01` using the latest backups, defining new storage requirements for pg02:

```azurecli
az postgres server-arc restore -n pg02 --source-server pg01 --k8s-namespace arc --storage-class-data azurefile-csi-premium --volume-size-data 10Gi --storage-class-logs azurefile-csi-premium --volume-size-logs 2Gi--use-k8s --storage-class-backups azurefile-csi-premium --volume-size-backups 15Gi
```

### Restore to a specific point in time

Create a new Arc-enabled PostgreSQL server `pg02` by restoring `pg01` to its state at `2023-02-01T00:00:00Z`:
```azurecli
az postgres server-arc restore -n pg02 --source-server pg01 --k8s-namespace arc -t 2023-02-01T00:00:00Z --use-k8s
```

## Help

For details about all the parameters available for restore review the output of the command:
```azurecli
az postgres server-arc restore --help
```

## Next steps

- [Configure automated backup - Azure Arc-enabled PostgreSQL servers](backup-restore-postgresql.md)
- [Scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-server-using-cli.md) your server.
