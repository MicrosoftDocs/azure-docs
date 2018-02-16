---
title: Backup and restore in Azure Database for MySQL | Microsoft Docs
description: Learn about automatic backups and restoring your Azure Database for MySQL server.
services: mysql
author: kamathsun
ms.author: sukamat
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.custom: mvc
ms.topic: article
ms.date: 02/08/2018
---

# Backup and restore in Azure Database for MySQL

Azure Database for MySQL automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to a point-in-time. Backup and restore are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion. 

## Backups

Azure Database for MySQL takes full, differential, and transaction log backups. These backups allow you to restore a server to a specific point-in-time within your configured backup retention period. The default backup retention period is 7 days. You can optionally configure it up to 35 days. By default, backups are encrypted using AES 256-bit encryption.

### Backup frequency

Generally, full backups occur weekly, differential backups occur twice a day, and transaction log backups occur every five minutes. The first full backup is scheduled immediately after a server is created. For example, the initial backup can take longer on a restored server.

### Backup redundancy options

Azure Database for MySQL provides the flexibility to choose between locally redundant or geo-redundant backup storage in the General Purpose and Memory Optimized tiers. The geo-redundant backup storage provides better protection and ability to recover your server using geo-redundantly stored backup in the event of a disaster. When the backups are stored in geo-redundant storage, they are also replicated to a [paired data center](https://docs.microsoft.com/azure/best-practices-availability-paired-regions) for protection against a data center outage. The Basic tier only offers locally redundant backup storage. 

> [!IMPORTANT]
> Configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you cannot change the backup storage redundancy option.

### Backup storage cost

Azure Database for MySQL provides up to 100% of your maximum provisioned server storage as backup storage at no additional cost. Typically, this is suitable for a backup retention of 7 days. Any additional backup storage used is charged per GB-month.

For example, if you have provisioned a server with 250 GB, you have 250 GB of backup storage at no additional charge. Storage in excess of 250 GB is charged.

## Restore
In Azure Database for MySQL, performing a restore creates a new server from the original server's backups. 

There are two types of restore available:
- **Point-in-time restore**: This type of restore is available with either backup redundancy option.
- **Geo-restore**: This restore option is available only if you configured your server for geo-redundant storage when you created the server. 

The estimated time of recovery depends on several factors including the total number of databases recovering in the same region at the same time, the database size, the transaction log size, and network bandwidth. The recovery time is usually less than 12 hours. When recovering to another data region, the potential data loss is up to 1 hour because of potential geo-replication delay.

> [!IMPORTANT] 
> If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server.

### Point-in-time restore 
Independent of your backup redundancy option, you can perform a point-in-time restore to any time within your backup retention period. The new server is created in the same Azure region as the original server. It is created with the original server's resource configuration (pricing tier, compute generation, number of vCores, storage size, backup retention period, and backup redundancy option). 

Point-in-time restore is useful in multiple scenarios. For example, when a user accidentally deletes data, drops an important table or database, or if an application accidentally overwrites good data with bad data due to an application defect.

If the point in time you want to restore to is within the last five minutes, you may need to wait for the transaction log backup to be taken before you can restore to that time. Transaction log backups are taken every five minutes.

### Geo-restore
You can restore a server to another Azure region where the service is available if you have configured your server for geo-redundant backups. Geo-restore is the default recovery option when your server is unavailable because of an incident in the region where the server is hosted. If a large-scale incident in a region results in unavailability of your database application, you can restore a server from the geo-redundant backups to a server in any other region. There is a delay between when a backup is taken and when it is replicated to an Azure blob in a different region. This delay can be up to an hour, so, if a disaster occurs, there can be up to one hour data loss. 

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