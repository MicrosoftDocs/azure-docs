---
title: Backup and restore – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Protecting data from accidental corruption or deletion
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 04/28/2020
---

# Backup and restore in Azure Database for PostgreSQL - Hyperscale (Citus)

Azure Database for PostgreSQL – Hyperscale (Citus) automatically creates
backups of each node and stores them in locally redundant storage. Backups can
be used to restore your Hyperscale (Citus) cluster to a specified time. Backup
and restore are an essential part of any business continuity strategy because
they protect your data from accidental corruption or deletion.

## Backups

At least once a day, Azure Database for PostgreSQL takes snapshot backups of
data files and the database transaction log. The backups allow you to restore a
server to any point in time within the retention period. (The retention period
is currently 35 days for all clusters.) All backups are encrypted using AES
256-bit encryption.

In Azure regions that support availability zones, backup snapshots are stored
in three availability zones. As long as at least one availability zone is
online, the Hyperscale (Citus) cluster is restorable.

Backup files can't be exported. They may only be used for restore operations
in Azure Database for PostgreSQL.

### Backup storage cost

For current backup storage pricing, see the Azure Database for PostgreSQL -
Hyperscale (Citus) [pricing
page](https://azure.microsoft.com/pricing/details/postgresql/hyperscale-citus/).

## Restore

In Azure Database for PostgreSQL, restoring a Hyperscale (Citus) cluster
creates a new cluster from the original nodes' backups.

> [!IMPORTANT]
> Deleted Hyperscale (Citus) clusters can't be restored. If you delete the
> cluster, all nodes that belong to the cluster are deleted and can't be
> recovered. To protect cluster resources, post deployment, from accidental
> deletion or unexpected changes, administrators can leverage [management
> locks](/azure/azure-resource-manager/management/lock-resources).

### Point-in-time restore (PITR)

You can restore a cluster to any point in time within the last 35 days.
Point-in-time restore is useful in multiple scenarios. For example, when a user
accidentally deletes data, drops an important table or database, or if an
application accidentally overwrites good data with bad data.

The restore process creates a new cluster in the same Azure region,
subscription, and resource group as the original. The cluster has the
original's configuration: the same number of nodes, number of vCores, storage
size, user roles, PostgreSQL version, and version of the Citus extension.

Firewall settings and PostgreSQL server parameters are not preserved from the
original server group, they are reset to default values. The firewall will
prevent all connections. You will need to manually adjust these settings after
restore.

> [!IMPORTANT]
> You'll need to open a support request to perform point-in-time restore of
> your Hyperscale (Citus) cluster.

### Post-restore tasks

After a restore from either recovery mechanism, you should do the
following to get your users and applications back up and running:

* If the new server is meant to replace the original server, redirect clients
  and client applications to the new server
* Ensure appropriate server-level firewall and VNet rules are in place for
  users to connect. These rules aren't copied from the original server group.
* Adjust PostgreSQL server parameters as needed. The parameters aren't copied
  from the original server group.
* Ensure appropriate logins and database level permissions are in place
* Configure alerts, as appropriate

## Next steps

* Learn about [Azure availability zones](/azure/availability-zones/az-overview).
* Set [suggested alerts](/azure/postgresql/howto-hyperscale-alert-on-metric#suggested-alerts) on Hyperscale (Citus) server groups.
