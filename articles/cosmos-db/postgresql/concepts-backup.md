---
title: Backup and restore – Azure Cosmos DB for PostgreSQL
description: Protecting data from accidental corruption or deletion
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 04/14/2021
---

# Backup and restore in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL automatically creates
backups of each node and stores them in locally redundant storage. Backups can
be used to restore your cluster to a specified time.
Backup and restore are an essential part of any business continuity strategy
because they protect your data from accidental corruption or deletion.

## Backups

At least once a day, Azure Cosmos DB for PostgreSQL takes snapshot backups of
data files and the database transaction log. The backups allow you to restore a
server to any point in time within the retention period. (The retention period
is currently 35 days for all clusters.) All backups are encrypted using
AES 256-bit encryption.

In Azure regions that support availability zones, backup snapshots are stored
in three availability zones. As long as at least one availability zone is
online, the cluster is restorable.

Backup files can't be exported. They may only be used for restore operations
in Azure Cosmos DB for PostgreSQL.

### Backup storage cost

For current backup storage pricing, see the Azure Cosmos DB for PostgreSQL
[pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/).

## Restore

You can restore a cluster to any point in time within
the last 35 days.  Point-in-time restore is useful in multiple scenarios. For
example, when a user accidentally deletes data, drops an important table or
database, or if an application accidentally overwrites good data with bad data.

> [!IMPORTANT]
> Deleted clusters can't be restored. If you delete the
> cluster, all nodes that belong to the cluster are deleted and can't
> be recovered. To protect cluster resources, post deployment, from
> accidental deletion or unexpected changes, administrators can leverage
> [management locks](../../azure-resource-manager/management/lock-resources.md).

The restore process creates a new cluster in the same Azure region,
subscription, and resource group as the original. The cluster has the
original's configuration: the same number of nodes, number of vCores, storage
size, user roles, PostgreSQL version, and version of the Citus extension.

Firewall settings and PostgreSQL server parameters are not preserved from the
original cluster, they are reset to default values. The firewall will
prevent all connections. You will need to manually adjust these settings after
restore. In general, see our list of suggested [post-restore
tasks](howto-restore-portal.md#post-restore-tasks).

## Next steps

* See the steps to [restore a cluster](howto-restore-portal.md)
  in the Azure portal.
* Learn about [Azure availability zones](../../availability-zones/az-overview.md).
