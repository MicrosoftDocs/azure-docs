---
title: Overview of business continuity with Azure Database for PostgreSQL  | Microsoft Docs
description: Overview of business continuity with Azure Database for PostgreSQL.
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql
ms.custom: mvc
ms.topic: article
ms.date: 02/08/2018
---

# Overview of business continuity with Azure Database for PostgreSQL

This overview describes the capabilities that Azure Database for PostgreSQL provides for business continuity and disaster recovery. Learn about options, recommendations, and tutorials for recovering from disruptive events that could cause data loss or cause your database and application to become unavailable. Learn what to do when a user or application error affects data integrity, an Azure region has an outage, or your application requires maintenance.

## Azure Database for PostgreSQL features that you can use to provide business continuity

Azure Database for PostgreSQL provides business continuity features that includes automated backups and an ability for users to initiate Geo-restore. Each has different characteristics for estimated recovery time (ERT) and potential data loss for recent transactions. Once you understand these options, you can choose among them - and, in most scenarios, use them together for different scenarios. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after the disruptive event - this is your recovery time objective (RTO). You also need to understand the maximum amount of recent data updates (time interval) the application can tolerate losing when recovering after the disruptive event - this is your recovery point objective (RPO).

The following table compares the ERT and RPO for the available features:

| **Capability** | **Basic** | **General Purpose** | **Memory optimized** |
| :------------: | :-------: | :-----------------: | :------------------: |
| Point in Time Restore from backup | Any restore point within the retention period | Any restore point within the retention period | Any restore point within the retention period |
| Geo-restore from geo-replicated backups | Not supported | ERT < 12h, RPO < 1h | ERT < 12h, RPO < 1h |

## Use backups to recover a server

Azure Database for PostgreSQL automatically performs a combination of full database backups weekly, differential database backups two times a day, and transaction log backups every five minutes to protect your business from data loss. These backups are stored in locally redundant storage, or optionally geo-redundant storage when you create the server, with an option to configure backup retention between 7 (default) and 35 days for General purpose and Memory optimized tiers. For Basic tier, the backups are stored in locally redundant storage with an option to configure backup retention between 7 (default) and 35 days. For more information, see [pricing tiers](concepts-pricing-tiers.md). When the backups are stored in geographically redundant storage, the full, differential and transaction logs are also replicated to a [paired data center](https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions) for protection against a data center outage. For more information, see [automatic database backups](concepts-backup.md).

> [!IMPORTANT]
> Configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you cannot change the backup storage redundancy option.

You can use these automatic backups to recover a server from various disruptive events, both within your data center using locally redundant backup storage and to another data center if your server is configured to use geo-redundant backup storage. Using automatic backups, the estimated time of recovery depends on several factors including the total number of databases recovering in the same region at the same time, the database size, the transaction log size, and network bandwidth. The recovery time is usually less than 12 hours. When recovering to another data region, the potential data loss is limited to 1 hour by the geo-redundant storage.

> [!IMPORTANT]
> Configuring locally redundant or geo-redundant storage for backup is only allowed during server create. Once the server is provisioned, you cannot change the backup storage redundancy option.

## Recover a database after a user or application error

*No one is perfect! A user might accidentally delete some data, inadvertently drop an important table, or even drop an entire database. Or, an application might accidentally overwrite good data with bad data due to an application defect.

In this scenario, you can perform a point-in-time-restore and use the automated backups to restore a copy of your database to a known good point in time, provided that time is within the database retention period. After the database is restored, you can either replace the original database with the restored database or copy the needed data from the restored data into the original database.

For more information and for detailed steps for restoring a database to a point in time, see [restore using Azure portal](howto-restore-server-cli.md) or [restore using Azure CLI](howto-restore-server-portal.md).

## Restore a server to another region from an Azure regional data center outage

Although rare, an Azure data center can have an outage. When an outage occurs, it causes a business disruption that might only last a few minutes or might last for hours.

- One option is to wait for your server to come back online when the data center outage is over. This works for applications that can afford to have the server offline. For example, a development project or free trial you don't need to work on constantly. When a data center has an outage, you do not know how long the outage might last, so this option only works if you don't need your database for a while.
- Another option is to restore the server using geo-redundant backups (geo-restore).

> [!IMPORTANT]
> Geo-restore is possible if you provisioned the server with geo-redundant backup storage.

## Perform a geo-restore

If you are using automated backups with geo-redundant backup storage as your recovery mechanism, initiate a database server restore using geo-restore. Restore usually takes place within 12 hours - with data loss of up to one hour determined by the time it takes to replicate the backups to the geo-redundant region.  Until the restore completes, the database server is unable to record any transactions or respond to any queries. While this restores a database server to the last available point in time, restoring the geo-secondary to any point in time is not currently supported.

> [!NOTE]
> If the data center comes back online before you switch your application over to the recovered database, you can cancel the recovery.

## Perform post failover / restore tasks

After restore from either recovery mechanism, you must perform the following additional tasks before your users and applications are back up and running:

- Redirect clients and client applications to the new server and restored database
- Ensure appropriate server-level firewall rules are in place for users to connect (or use [database-level firewalls](concepts-firewall-rules.md))
- Ensure appropriate logins and database level permissions are in place
- Configure alerts, as appropriate

## Next steps

TBD