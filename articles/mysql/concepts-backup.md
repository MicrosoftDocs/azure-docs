---
title: Backups in Azure Database for MySQL | Microsoft Docs
description: Learn about automatic backups for Azure Database for MySQL.
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

# Backups in Azure Database for MySQL

Azure Database for MySQL automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## Backups explained

Azure Database for MySQL takes full, differential, and transaction log backups. These backups allow you to restore a server to a specific point-in-time within your configured backup retention period. The default backup retention period is 7 days. You can optionally configure it up to 35 days. By default, backups are encrypted using AES 256-bit encryption.

You can use these backups to:

- Restore a server to a point-in-time within the retention period. This operation will create a new server with the original database.
- Restore a database to another geographical region if you have configured geo-redundant storage option for backup storage. This allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new server anywhere in the world.
- To perform a restore, see [restore database from backups](howto-restore-server-portal.md).

> [!IMPORTANT] 
> If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server.

## Backup redundancy options

Azure Database for MySQL provides the flexibility to choose between locally redundant or geo-redundant backup storage in the General Purpose and Memory Optimized tiers. The geo-redundant backup storage provides better protection and ability to recover your server using geo-redundantly stored backup in the event of a disaster. The Basic tier only offers locally redundant backup storage. 

## Backup frequency

Generally, full backups occur weekly, differential backups occur twice a day, and transaction log backups occur every five minutes. The first full backup is scheduled immediately after a server is created. For example, the initial backup can take longer on a restored database or a database copy.

## Backup storage cost

Azure Database for MySQL provides up to 100% of your maximum provisioned server storage as backup storage at no additional cost. Typically, this is suitable for a backup retention of 7 days. Any additional backup storage used is charged per GB-month.

For example, if you have provisioned a server with 250 GB, you have 250 GB of backup storage at no additional charge. Storage in excess of 250 GB is charged.

## Next steps

- Backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](concepts-business-continuity.md).
- To restore to a point in time using the Azure portal, see [restore database to a point in time using the Azure portal](howto-restore-server-portal.md).
- To restore to a point in time using Azure CLI, see [restore database to a point in time using CLI](howto-restore-server-cli.md).