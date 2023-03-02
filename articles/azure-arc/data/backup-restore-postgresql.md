---
title: Backup and restore for Azure Database for PostgreSQL server
description: Explains how to back up and restore for Azure Database for PostgreSQL servers
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Back up and restore Azure Arc-enabled PostgreSQL servers

Automated backups can be enabled by including the `--storage-class-backups` argument when creating an Azure Arc-enabled PostgreSQL server. Specify the retention period for backups with the `--retention-days` parameter, when creating or updating an Arc-enabled PostgreSQL server. The retention period can be between 0 and 35 days. If backups are enabled but no retention period is specified, the default is seven days.

Restoring an Azure Arc-enable PostgreSQL server creates a new server by copying the configuration of the existing server (for example resource requests/limits, extensions etc.). Configurations that could cause conflicts (for example primary endpoint port) aren't copied. The storage configuration for the new resource can be defined by passing `--storage-class*` and `--volume-size-*` parameters to the `restore` command.

Restore an Azure Arc-enabled PostgreSQL server to a new server with the `restore` command:
```azurecli
az postgres server-arc restore -n <destination-server-name> --source-server <source-server-name> --k8s-namespace <namespace> --use-k8s
```

## Examples:

Create a new Arc-enabled PostgreSQL server `pg02` by restoring `pg01` using the latest backups:
```azurecli
az postgres server-arc restore -n pg02 --source-server pg01 --k8s-namespace arc --use-k8s
```

Create a new Arc-enabled PostgreSQL server `pg02` by restoring `pg01` using the latest backups, defining new storage requirements for pg02:
```azurecli
az postgres server-arc restore -n pg02 --source-server pg01 --k8s-namespace arc --storage-class-data azurefile-csi-premium --volume-size-data 10Gi --storage-class-logs azurefile-csi-premium --volume-size-logs 2Gi--use-k8s --storage-class-backups azurefile-csi-premium --volume-size-backups 15Gi
```

Create a new Arc-enabled PostgreSQL server `pg02` by restoring `pg01` to its state at `2023-02-01T00:00:00Z`:
```azurecli
az postgres server-arc restore -n pg02 --source-server pg01 --k8s-namespace arc -t 2023-02-01T00:00:00Z --use-k8s
```

For details about all the parameters available for restore review the output of the command:
```azurecli
az postgres server-arc restore --help
```

- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-server-using-cli.md) your server.
