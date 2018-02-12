---
title: Learn about automatic backups for Azure Database for MySQL  | Microsoft Docs
description: Learn about automatic backups for Azure Database for MySQL.
services: mysql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonwhowell
ms.service: MySQL
ms.custom: mvc
ms.topic: article
ms.date: 02/08/2018
---

# Learn about automatic backups

Azure Database for MySQL automatically creates database backups and stores these backups in user configured locally redundant or geo-redundant storage. These backups are created automatically and at no additional charge. You don't need to do anything to make them happen. Database backups are an essential part of any business continuity strategy because they protect your data from accidental corruption or deletion.

## What is a backup?

Azure Database for MySQL takes full, differential, and transaction log backups. Transaction log backups, with full and differential backups, allow you to restore a server to a specific point-in-time. When you restore a server, the service figures out which full, differential, and transaction log backups need to be restored.

You can use these backups to:

- Restore a server to a point-in-time within the retention period. This operation will create a new server with the original database.
- Restore a database to another geographical region if you have configured geo-redundant storage option for backup storage. This allows you to recover from a geographic disaster when you cannot access your server and database. It creates a new server anywhere in the world.
- To perform a restore, see [restore database from backups](howto-restore-server-portal.md).

## How much backup storage is included at no cost?

Azure Database for MySQL provides up to 100% of your maximum provisioned server storage as backup storage at no additional cost. For example, if you have provisioned a server with 250 GB, you have 250 GB of backup storage at no additional charge. Typically, this is suitable for backup retention of 7 days.

## How to choose between locally redundant or geo-redundant backup storage?

Azure Database for MySQL provides the flexibility to choose between locally redundant or geo-redundant backup storage. For Basic tier, only locally redundant backup storage is offered. For General purpose and Memory optimized tier, you can optionally choose geo-redundant backup storage. The geo-redundant backup storage provides better protection and ability to recover your server using geo-redundantly stored backup in the event of a disaster.

## How often do backups happen?

Full database backups happen weekly, differential database backups generally happen twice a day, and transaction log backups generally happen every 5 minutes. The first full backup is scheduled immediately after a database is created. It usually completes within 30 minutes, but it can take longer when the database is of a significant size. For example, the initial backup can take longer on a restored database or a database copy. After the first full backup, all further backups are scheduled automatically and managed silently in the background. The exact timing of all database backups is determined by the service as it balances the overall system workload.

The backup storage geo-replication occurs based on the Azure Storage replication schedule.

## How long do you keep my backups?

Each server backup has a retention period for up to 35 days. The default retention of backup is 7 days. You can optionally configure it up to 35 days.

If you delete the server, all databases that belong to the server are also deleted and cannot be recovered. You cannot restore a deleted server.

## Are backups encrypted?

The service automatically encrypts the backup on storage by default using the Azure storage AES 256bit encryption.

## Next steps

- Backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](concepts-business-continuity.md).
- To restore to a point in time using the Azure portal, see [restore database to a point in time using the Azure portal](howto-restore-server-portal.md).
- To restore to a point in time using Azure CLI, see [restore database to a point in time using CLI](howto-restore-server-cli.md).