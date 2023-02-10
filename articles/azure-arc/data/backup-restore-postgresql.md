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

Automated backups can be enabled by including the `--storage-class-backups` argument when creating an Azure Arc-enabled PostgreSQL server. Specify the retention period for backups with the `--retention-days` parameter, when creating or updating an Arc-enabled PostgreSQL server. The retention period can be between 0 and 35 days. If backups are enabled but no retention period is specified, the default is 7 days.

Restore an Azure Arc-enabled PostgreSQL server to a new server with the `restore` command:
```azurecli
az postgres server-arc restore -n <destination-server-name> --source-server <source-server-name> --k8s-namespace <namespace> --use-k8s
```

For details about all the parameters available for restore review the output of the command:
```azurecli
az postgres server-arc restore --help
```

- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-server-using-cli.md) your server.
