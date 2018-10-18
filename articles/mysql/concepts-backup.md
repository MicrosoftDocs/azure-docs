---
title: Backup and restore in Azure Database for MySQL
description: Learn about automatic backups and restoring your Azure Database for MySQL server.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql
ms.topic: article
ms.date: 02/28/2018
---

# Backup and restore in Azure Database for MySQL

Azure Database for MySQL automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backups

Azure Database for MySQL takes full, differential, and transaction log backups. These backups allow you to restore a server to any point-in-time within your configured backup retention period. The default backup retention period is seven days. You can optionally configure it up to 35 days. All backups are encrypted using AES 256-bit encryption.

### Backup frequency

Generally, full backups occur weekly, differential backups occur twice a day, and transaction log backups occur every five minutes. The first full backup is scheduled immediately after a server is created. The initial backup can take longer on a large restored server. The earliest point in time that a new server can be restored to is the time at which the initial full backup is complete.

### Backup redundancy options

Azure Database for MySQL provides the flexibility to choose between locally redundant or geo-redundant backup storage in the General Purpose and Memory Optimized tiers. When the backups are stored in geo-redundant backup storage, they are not only stored within the region in which your server is hosted, but are also replicated to a [paired data center](https://docs.microsoft.com/azure/best-practices-availability-paired-regions). This provides better protection and ability to restore your server in a different region in the event of a disaster. The Basic tier only offers locally redundant backup storage.

> [!IMPORTANT]
> Configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you cannot change the backup storage redundancy option.

### Backup storage cost

Azure Database for MySQL provides up to 100% of your provisioned server storage as backup storage at no additional cost. Typically, this is suitable for a backup retention of seven days. Any additional backup storage used is charged in GB-month.

For example, if you have provisioned a server with 250 GB, you have 250 GB of backup storage at no additional charge. Storage in excess of 250 GB is charged.

## Restore

In Azure Database for MySQL, performing a restore creates a new server from the original server's backups.

There are two types of restore available:

- **Point-in-time restore** is available with either backup redundancy option and creates a new server in the same region as your original server.
- **Geo-restore** is available only if you configured your server for geo-redundant storage and it allows you to restore your server to a different region.

The estimated time of recovery depends on several factors including the database sizes, the transaction log size, the network bandwidth, and the total number of databases recovering in the same region at the same time. The recovery time is usually less than 12 hours.

> [!IMPORTANT]
> Deleted servers **cannot** be restored. If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. 

### Point-in-time restore

Independent of your backup redundancy option, you can perform a restore to any point in time within your backup retention period. A new server is created in the same Azure region as the original server. It is created with the original server's configuration for the pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option.

Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database, or if an application accidentally overwrites good data with bad data due to an application defect.

You may need to wait for the next transaction log backup to be taken before you can restore to a point in time within the last five minutes.

### Geo-restore

You can restore a server to another Azure region where the service is available if you have configured your server for geo-redundant backups. Geo-restore is the default recovery option when your server is unavailable because of an incident in the region where the server is hosted. If a large-scale incident in a region results in unavailability of your database application, you can restore a server from the geo-redundant backups to a server in any other region. There is a delay between when a backup is taken and when it is replicated to different region. This delay can be up to an hour, so, if a disaster occurs, there can be up to one hour data loss.

During geo-restore, the server configurations that can be changed include compute generation, vCore, backup retention period, and backup redundancy options. Changing pricing tier (Basic, General Purpose, or Memory Optimized) or storage size during geo-restore is not supported.

### Perform post-restore tasks

After a restore from either recovery mechanism, you should perform the following tasks to get your users and applications back up and running:

- If the new server is meant to replace the original server, redirect clients and client applications to the new server
- Ensure appropriate server-level firewall rules are in place for users to connect
- Ensure appropriate logins and database level permissions are in place
- Configure alerts, as appropriate

## Next steps

- To learn more about business continuity, see the [business continuity overview](concepts-business-continuity.md).
- To restore to a point in time using the Azure portal, see [restore database to a point in time using the Azure portal](howto-restore-server-portal.md).
- To restore to a point in time using Azure CLI, see [restore database to a point in time using CLI](howto-restore-server-cli.md).
