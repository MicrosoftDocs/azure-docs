---
title: Backup and restore – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Protecting data from accidental corruption or deletion
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 04/14/2020
---

# Backup and restore in Azure Database for PostgreSQL - Hyperscale (Citus)

Azure Database for PostgreSQL – Hyperscale (Citus) automatically creates
backups of each node and stores them in locally redundant storage. Backups can
be used to restore your Hyperscale (Citus) cluster to a point-in-time. Backup
and restore are an essential part of any business continuity strategy because
they protect your data from accidental corruption or deletion.

## Backups

Azure Database for PostgreSQL takes snapshot backups of the data files and the
transaction log.  Snapshot backups are taken at least once a day. These backups
allow you to restore a server to any point-in-time within backup retention
period. Currently all clusters have backup retention period is 35 days. All
backups are encrypted using AES 256-bit encryption.

In Azure regoins that support availability zones backup snapshots are stored in
3 availability zones. It means that you would be able to restore your
Hyperscale (Citus) cluster from backup as long as at least one availability
zone is online.

These backup files cannot be exported. The backups can only be used for restore
operations in Azure Database for PostgreSQL.

### Backup storage cost

See Azure Database for PostgreSQL -Hyperscale (Citus) [pricing
page](https://azure.microsoft.com/en-us/pricing/details/postgresql/hyperscale-citus/)
for current backup storage pricing. 

## Restore

In Azure Database for PostgreSQL, performing a restore creates a new Hyperscale
(Citus) cluster from the original nodes’ backups.

> [!IMPORTANT]
> Deleted Hyperscale (Citus) clusters cannot be restored. If you delete the
> cluster, all nodes that belong to the cluster are deleted and cannot be
> recovered. To protect cluster resources, post deployment, from accidental
> deletion or unexpected changes, administrators can leverage [management
> locks](/azure/azure-resource-manager/management/lock-resources).

### Point-in-time restore (PITR)

You can perform a restore to any point in time within 35 days. A new cluster is
created in the same Azure region, subscription, and resource group as the
original one. It is created with the original cluster's configuration for the
number of node, number of vCores, storage size, user roles, and server
parameters.

Point-in-time restore is useful in multiple scenarios. For example, when a user
accidentally deletes data, drops an important table or database, or if an
application accidentally overwrites good data with bad data due to an
application defect.

> [!IMPORTANT]
> You will need to open a support request to perform point-in-time restore of
> your Hyperscale (Citus) cluster.

### Post-restore tasks

After a restore from either recovery mechanism, you should perform the
following tasks to get your users and applications back up and running:

• If the new server is meant to replace the original server, redirect clients
  and client applications to the new server
• Ensure appropriate server-level firewall and VNet rules are in place for
  users to connect. These rules are not copied over from the original server.
• Ensure appropriate logins and database level permissions are in place
• Configure alerts, as appropriate

## Next steps

• Learn how to restore using [the Azure
  portal](/azure/postgresql/howto-restore-server-portal).
• Learn how to restore using [the Azure
  CLI](/azure/postgresql/howto-restore-server-cli).
• To learn more about business continuity, see the [business continuity
  overview](/azure/postgresql/concepts-business-continuity).
