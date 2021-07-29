---
title: Use Azure PowerShell to configure continuous backup and point in time restore in Azure Cosmos DB.
description: Learn how to provision an account with continuous backup and restore data using Azure PowerShell. 
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 07/29/2021
ms.author: govindk
ms.reviewer: sngun 
ms.custom: devx-track-azurepowershell

---

# Configure and manage continuous backup and point in time restore using Azure PowerShell
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Azure Cosmos DB's point-in-time restore feature helps you to recover from an accidental change within a container, to restore a deleted account, database, or a container or to restore into any region (where backups existed). The continuous backup mode allows you to do restore to any point of time within the last 30 days.

This article describes how to provision an account with continuous backup and restore data using Azure PowerShell.


## <a id="migrate-sql-api"></a>Migrate a SQL API account to continuous backup

See [migrate to continuous backup](migrate-continuous-backup.md#powershell) article on how to migrate a SQL API account with from periodic back up to continuous backup.

## <a id="migrate-mongodb-api"></a>Migrate an API for MongoDB account to continuous backup

See [migrate to continuous backup](migrate-continuous-backup.md#powershell) article on how to migrate a SQL API account with from periodic back up to continuous backup.

## Next steps

* Configure and manage continuous backup using [Azure CLI](continuous-backup-restore-command-line.md), [Resource Manager](continuous-backup-restore-template.md), or [Azure portal](continuous-backup-restore-portal.md).
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
