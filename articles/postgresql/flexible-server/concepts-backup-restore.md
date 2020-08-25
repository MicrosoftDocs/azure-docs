---
title: Backup and restore in Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/24/2020
---
# Backup and restore in Azure Database for PostgreSQL - Flexible Server

Azure Database for PostgreSQL Flexible Server automatically creates
server backups and stores them in user configured locally redundant
storage. Backups can be used to restore your server to a point-in-time.
Backup and restore are an essential part of any business continuity
strategy because they protect your data from accidental corruption or
deletion.

## Backup overview

Flexible Server takes snapshot backups of the data files and performs
transaction log backups continuously. These backups allow you to restore
a server to any point-in-time within your configured backup retention
period. The default backup retention period is seven days. You can
optionally configure it up to 35 days. All backups are encrypted using
AES 256-bit encryption.

These backup files cannot be exported. The backups can only be used for
restore operations in Flexible server. You can also
use [pg_dump](https://docs.microsoft.com/en-us/azure/postgresql/howto-migrate-using-dump-and-restore) from
a PostgreSQL client to copy a database.

## Backup frequency

The first full snapshot backup is scheduled immediately after a database
server is created. Subsequently, a daily snapshot backup is performed.
Transaction log backups occur every five minutes.

## Backup redundancy and retention

Database backups are stored in a zone redundant storage (ZRS) -- which
is stored in multiple copies across availability zones and within a
region. Backups are retained based on the backup retention period
setting on the server. You can select a retention period of 7 to 35
days. The default retention period is 7 days. You can set the retention
period during server creation or later by updating the backup
configuration using [Azure portal](https://docs.microsoft.com/en-us/azure/postgresql/howto-restore-server-portal#set-backup-configuration) or [Azure CLI](https://docs.microsoft.com/en-us/azure/postgresql/howto-restore-server-cli#set-backup-configuration).

The backup retention period governs how far back in time a point-in-time
restore can be retrieved, since it\'s based on backups available. The
backup retention period can also be treated as a recovery window from a
restore perspective. All backups required to perform a point-in-time
restore within the backup retention period are retained in backup
storage. For example - if the backup retention period is set to 7 days,
the recovery window is considered last 7 days. In this scenario, all the
backups required to restore the server in last 7 days are retained. With
a backup retention window of seven days, database snapshots and
transaction log backups are stored for the last 8 days.

## Backup storage cost

Flexible server provides up to 100% of your provisioned server storage
as backup storage at no additional cost. Any additional backup storage
used is charged in GB per month. For example, if you have provisioned a
server with 250 GB of storage, you have 250 GB of additional storage
available for server backups at no additional charge. Storage consumed
for backups more than 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/postgresql/).

You can use the [Backup storage used](https://docs.microsoft.com/en-us/azure/postgresql/concepts-monitoring) metric
in Azure Monitor available in the Azure portal to monitor the backup
storage consumed by a server. The Backup Storage used metric represents
the sum of storage consumed by all the database backups and log backups
retained based on the backup retention period set for the server. The
frequency of the backups is service managed and explained earlier. Heavy
transactional activity on the server can cause backup storage usage to
increase irrespective of the total database size.

The primary means of controlling the backup storage cost is by setting
the appropriate backup retention period and choosing the right backup
redundancy options to meet your desired recovery goals. You can select a
retention period from a range of 7 to 35 days.

> [!IMPORTANT]
> Backups from a database server configured in a zone redundant
high availability configuration happens from the primary database
server.

> [!IMPORTANT]
> Geo-redundant backups are currently not supported with
Flexible server.

## Point in time restore

In Flexible server, performing a point-in-time restore creates a new
server from the flexible server\'s backups in the same region as your
original server. It is created with the original server\'s configuration
for the pricing tier, compute generation, number of vCores, storage
size, backup retention period, and backup redundancy option.

Point-in-time restore is useful in multiple scenarios. For example, when
a user accidentally deletes data, drops an important table or database,
or if an application accidentally overwrites good data with bad data due
to an application defect.

You may need to wait for the next transaction log backup to be taken
before you can restore to a point in time within the last five minutes

You can choose between an earliest restore point and a custom restore
point.

-   **Earliest restore point**: Depending on your retention period and
    when the last backup was taken, the earliest time that you can
    restore will be auto-selected for you. The timestamp to which you
    can restore will also displayed on the portal.

-   **Custom restore point**: This will allow you to choose any point in
    time within the retention period defined for this flexible server.

The estimated time of recovery depends on several factors including the
database sizes, the transaction log size, the network bandwidth, and the
total number of databases recovering in the same region at the same
time. The recovery time is usually less than 12 hours.


> [!IMPORTANT]
> If you are restoring a flexible server configured with zone
redundancy high availability, the restored server will be configured in
the same region and zone as your primary server, and deployed as a
single flexible server in a non-HA mode.

> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all
databases that belong to the server are also deleted and cannot be
recovered. To protect server resources, post deployment, from accidental
deletion or unexpected changes, administrators can
leverage [management locks](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-lock-resources).

## Perform post-restore tasks

After a restore from either recovery mechanism, you should perform the
following tasks to get your users and applications back up and running:

-   If the new server is meant to replace the original server, redirect clients and client applications to the new server

-   Ensure appropriate server-level firewall and VNet rules are in place for users to connect. These rules are not copied over from the original server.

-   Ensure appropriate logins and database level permissions are in place

-   Configure alerts, as appropriate

## Next steps

-   Learn how to restore using [the Azure portal](https://docs.microsoft.com/en-us/azure/postgresql/howto-restore-server-portal).

-   Learn how to restore using [the Azure CLI](https://docs.microsoft.com/en-us/azure/postgresql/howto-restore-server-cli).

-   To learn more about business continuity, see the [[business continuity overview](https://docs.microsoft.com/en-us/azure/postgresql/concepts-business-continuity).

## Feedback

Submit and view feedback 
