---
title: Automated backup for Azure Arc-enabled PostgreSQL server
description: Explains how to configure backups for Azure Arc-enabled PostgreSQL server
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 03/12/2023
ms.topic: how-to
---

# Automated backup Azure Arc-enabled PostgreSQL servers

To enable automated backups, include the `--storage-class-backups` argument when you create an Azure Arc-enabled PostgreSQL server. Specify the retention period for backups with the `--retention-days` parameter. Use this parameter when you create or update an Arc-enabled PostgreSQL server. The retention period can be between 0 and 35 days. If backups are enabled but no retention period is specified, the default is seven days.

Additionally, if you set the retention period to zero, then automated backups are disabled. 

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Create server with automated backup

Create an Azure Arc-enabled PostgreSQL server with automated backups: 

```azurecli
az postgres server-arc create -n <name> -k <namespace> --storage-class-backups <storage-class> --retention-days <number of days> --use-k8s 
```

## Update a server to set retention period

Update the backup retention period for an Azure Arc-enabled PostgreSQL server: 

```azurecli
az postgres server-arc update -n pg01 -k test --retention-days <number of days> --use-k8s 
```

## Related content

- [Restore Azure Arc-enabled PostgreSQL servers](restore-postgresql.md)
- [Scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-server-using-cli.md) your server.
