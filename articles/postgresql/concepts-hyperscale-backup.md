---
title: Backup and restore – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Protecting data from accidental corruption or deletion
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 04/14/2021
---

# Backup and restore in Azure Database for PostgreSQL - Hyperscale (Citus)

Azure Database for PostgreSQL – Hyperscale (Citus) automatically creates
backups of each node and stores them in locally redundant storage. Backups can
be used to restore your Hyperscale (Citus) server group to a specified time.
Backup and restore are an essential part of any business continuity strategy
because they protect your data from accidental corruption or deletion.

## Backups

At least once a day, Azure Database for PostgreSQL takes snapshot backups of
data files and the database transaction log. The backups allow you to restore a
server to any point in time within the retention period. (The retention period
is currently 35 days for all server groups.) All backups are encrypted using
AES 256-bit encryption.

In Azure regions that support availability zones, backup snapshots are stored
in three availability zones. As long as at least one availability zone is
online, the Hyperscale (Citus) server group is restorable.

Backup files can't be exported. They may only be used for restore operations
in Azure Database for PostgreSQL.

### Backup storage cost

For current backup storage pricing, see the Azure Database for PostgreSQL -
Hyperscale (Citus) [pricing
page](https://azure.microsoft.com/pricing/details/postgresql/hyperscale-citus/).

## Restore

You can restore a Hyperscale (Citus) server group to any point in time within
the last 35 days.  Point-in-time restore is useful in multiple scenarios. For
example, when a user accidentally deletes data, drops an important table or
database, or if an application accidentally overwrites good data with bad data.

> [!IMPORTANT]
> Deleted Hyperscale (Citus) server groups can't be restored. If you delete the
> server group, all nodes that belong to the server group are deleted and can't
> be recovered. To protect server group resources, post deployment, from
> accidental deletion or unexpected changes, administrators can leverage
> [management locks](../azure-resource-manager/management/lock-resources.md).

The restore process creates a new server group in the same Azure region,
subscription, and resource group as the original. The server group has the
original's configuration: the same number of nodes, number of vCores, storage
size, user roles, PostgreSQL version, and version of the Citus extension.

Firewall settings and PostgreSQL server parameters are not preserved from the
original server group, they are reset to default values. The firewall will
prevent all connections. You will need to manually adjust these settings after
restore. In general, see our list of suggested [post-restore
tasks](howto-hyperscale-restore-portal.md#post-restore-tasks).

## Next steps

* See the steps to [restore a server group](howto-hyperscale-restore-portal.md)
  in the Azure portal.
* Learn about [Azure availability zones](../availability-zones/az-overview.md).
