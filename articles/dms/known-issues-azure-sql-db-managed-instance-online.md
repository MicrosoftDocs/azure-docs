---
title: Known issues and limitations with online migrations to Azure SQL Managed Instance
description: Learn about known issues/migration limitations associated with online migrations to Azure SQL Managed Instance.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 02/20/2020
---

# Known issues/migration limitations with online migrations to Azure SQL Managed Instance

Known issues and limitations that are associated with online migrations from SQL Server to Azure SQL Managed Instance are described below.

> [!IMPORTANT]
> With online migrations of SQL Server to Azure SQL Database, migration of SQL_variant data types is not supported.

## Backup requirements

- **Backups with checksum**

    Azure Database Migration Service uses the backup and restore method to migrate your on-premises databases to SQL Managed Instance. Azure Database Migration Service only supports backups created using checksum.

    [Enable or Disable Backup Checksums During Backup or Restore (SQL Server)](https://docs.microsoft.com/sql/relational-databases/backup-restore/enable-or-disable-backup-checksums-during-backup-or-restore-sql-server?view=sql-server-2017)

    > [!NOTE]
    > If you take the database backups with compression, the checksum is a default behavior unless explicitly disabled.

    With offline migrations, if you choose **I will let Azure Database Migration Service…**, then Azure Database Migration Service will take the database backup with the checksum option enabled.

- **Backup media**

    Make sure to take every backup on a separate backup media (backup files). Azure Database Migration Service doesn't support backups that are appended to a single backup file. Take full backup and log backups to separate backup files.

## Data and log file layout

- **Number of log files**

    Azure Database Migration Service doesn’t support databases with multiple log files. If you have multiple log files, shrink and reorganize them into a single transaction log file. Because you can't remote to log files that aren't empty, you need to back up the log file first.

## SQL Server features

- **FileStream/FileTables**

    SQL Managed Instance currently doesn’t support FileStream and FileTables. For workloads dependent on these features, we recommend that you opt for SQL Servers running on Azure VMs as your Azure target.

- **In-memory tables**

    In-memory OLTP is available in the Premium and Business Critical tiers for SQL Managed Instance; the General Purpose tier doesn't support In-memory OLTP.

## Migration resets

- **Deployments**

    SQL Managed Instance is a PaaS service with automatic patching and version updates. During migration of your SQL Managed Instance, non-critical updates are help up to 36 hours. Afterwards (and for critical updates), if  the migration is disrupted, the process resets to a full restore state.

    Migration cutover can only be called after the full backup is restored and catches up with all log backups. If your production migration cutovers are affected, contact the [Azure DMS Feedback alias](mailto:dmsfeedback@microsoft.com).
