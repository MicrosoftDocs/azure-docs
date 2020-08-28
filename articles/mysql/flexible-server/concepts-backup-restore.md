---
title: Backup and restore in Azure Database for MySQL Flexible Server
description: Learn about the concepts of backup and restore with Azure Database for MySQL Flexible Server
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 08/24/2020
---

# Backup and restore in Azure Database for MySQL - Flexible Server

Azure Database for MySQL Flexible Server, which is currently in preview, automatically creates server backups and securely stores them in zone redundant storage within the region. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backup overview

Flexible Server takes snapshot backups of the data files and stores them in a zone redundant storage. The server also performs continuous transaction logs backup and also stores them in zone redundant storage. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is 7 days. You can optionally configure the database backup from 1 to 35 days. All backups are encrypted using AES 256-bit encryption for the data stored at rest.

These backup files cannot be exported. The backups can only be used for restore operations in Flexible server. You can also use [pg_dump](https://docs.microsoft.com/azure/MySQL/howto-migrate-using-dump-and-restore) from a MySQL client to copy a database.

## Backup frequency

The first full snapshot backup is scheduled immediately after a database server is created. Subsequently, numerous daily snapshot backup is performed. Transaction log backups occur continuously. In case of the restore operation, where we restore the existing database server into a new one, the last most recent snapshot prior to restore time is taken and the transactions logs are applied till the restore point.

## Backup retention

Database backups are stored in a local redundant storage (LRS) -- which is stored in multiple copies within a region. Backups are retained based on the backup retention period setting on the server. You can select a retention period of 1 to 35 days with a default retention period is 7 days. You can set the retention period during server creation or later by updating the backup configuration using Azure portal.

The backup retention period governs how far back in time can a point-in-time restore operation be performed, since it's based on backups available. The backup retention period can also be treated as a recovery window from a restore perspective. All backups required to perform a point-in-time restore within the backup retention period are retained in backup storage. For example - if the backup retention period is set to 7 days, the recovery window is considered last 7 days. In this scenario, all the backups required to restore the server in last 7 days are retained. With a backup retention window of seven days, database snapshots and transaction log backups are stored for the last 7 days.

## Backup storage cost

Flexible server provides up to 100% of your provisioned server storage as backup storage at no additional cost. Any additional backup storage used is charged in GB per month. For example, if you have provisioned a server with 250 GB of storage, you have 250 GB of storage available for server backups at no additional charge. If the daily backup usage is 25GB, then you can have up to 10 days of free backup storage. Storage consumed for backups more than 250 GB is charged as per the [pricing model](https://azure.microsoft.com/pricing/details/mysql/).

You can use the [Backup Storage used](https://docs.microsoft.com/azure/mysql/concepts-monitoring) metric in Azure Monitor available in the Azure portal to monitor the backup storage consumed by a server. The **Backup Storage** used metric represents the sum of storage consumed by all the database backups and log backups retained based on the backup retention period set for the server. Heavy transactional activity on the server can cause backup storage usage to increase irrespective of the total database size.

The primary means of controlling the backup storage cost is by setting the appropriate backup retention period. You can select a retention period between 1 to 35 days.

> [!IMPORTANT]
> Backups from a database server configured in a zone redundant high availability configuration happens from the primary database server.

> [!IMPORTANT]
> Geo-redundant backups are currently not supported with flexible server.

## Point-in-time restore

In Azure Database for MySQL Flexible server, performing a point-in-time restore creates a new server from the flexible server's backups in the same region as your
source server. It is created with the original server's configuration for the pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option. Also, tags and settings such as virtual network and firewall are inherited from the source server.

Point-in-time restore is useful in multiple scenarios. Some of the use cases that quite common - 
-   When a user accidentally deletes data in the database
-   User drops an important table or database
-   User application accidentally overwrites good data with bad data due to an application defect.

You can choose between an latest restore point and a custom restore point.

-   **Latest restore point**: Depending on your retention period and when the last backup was taken, the latest restor point helps you to restore the server to most updated state of the server and will be auto-selected for you. The timestamp to which you can restore will also displayed on the portal.
-   **Custom restore point**: This will allow you to choose any point-in-time within the retention period defined for this flexible server.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time is usually less than 12 hours.


> [!IMPORTANT]
> If you are restoring a flexible server configured with zone redundant high availability, the restored server will be configured in the same region and zone as your primary server, and deployed as a single flexible server in a non-HA mode.

> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. To protect server resources, post deployment, from accidental deletion or unexpected changes, administrators can leverage [management locks](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-lock-resources).

## Perform post-restore tasks

After a restore from either recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

-   If the new server is meant to replace the original server, redirect clients and client applications to the new server.
-   Ensure appropriate server-level firewall and virtual network rules are in place for users to connect.
-   Ensure appropriate logins and database level permissions are in place.
-   Configure alerts, as appropriate.

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)