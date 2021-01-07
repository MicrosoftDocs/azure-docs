---
title: Business continuity - Azure Database for MariaDB
description: Learn about business continuity (point-in-time restore, data center outage, geo-restore) when using Azure Database for MariaDB service.
author: savjani
ms.author: pariks
ms.service: mariadb
ms.topic: conceptual
ms.date: 7/7/2020
---

# Understand business continuity in Azure Database for MariaDB

This article describes the capabilities that Azure Database for MariaDB provides for business continuity and disaster recovery. Learn about options for recovering from disruptive events that could cause data loss or cause your database and application to become unavailable. Learn what to do when a user or application error affects data integrity, an Azure region has an outage, or your application requires maintenance.

## Features that you can use to provide business continuity

Azure Database for MariaDB provides business continuity features that include automated backups and the ability for users to initiate geo-restore. Each has different characteristics for Estimated Recovery Time (ERT) and potential data loss. Once you understand these options, you can choose among them, and use them together for different scenarios. As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after the disruptive event - this is your Recovery Time Objective (RTO). You also need to understand the maximum amount of recent data updates (time interval) the application can tolerate losing when recovering after the disruptive event - this is your Recovery Point Objective (RPO).

The following table compares the ERT and RPO for the available features:

| **Capability** | **Basic** | **General Purpose** | **Memory optimized** |
| :------------: | :-------: | :-----------------: | :------------------: |
| Point in Time Restore from backup | Any restore point within the retention period | Any restore point within the retention period | Any restore point within the retention period |
| Geo-restore from geo-replicated backups | Not supported | ERT < 12 h<br/>RPO < 1 h | ERT < 12 h<br/>RPO < 1 h |

> [!IMPORTANT]
> If you delete the server, all databases contained in the server are also deleted and cannot be recovered. You cannot restore a deleted server.

## Recover a server after a user or application error

You can use the service's backups to recover a server from various disruptive events. A user may accidentally delete some data, inadvertently drop an important table, or even drop an entire database. An application might accidentally overwrite good data with bad data due to an application defect, and so on.

You can perform a point-in-time-restore to create a copy of your server to a known good point in time. This point in time must be within the backup retention period you have configured for your server. After the data is restored to the new server, you can either replace the original server with the newly restored server or copy the needed data from the restored server into the original server.

## Recover from an Azure regional data center outage

Although rare, an Azure data center can have an outage. When an outage occurs, it causes a business disruption that might only last a few minutes, but could last for hours.

One option is to wait for your server to come back online when the data center outage is over. This works for applications that can afford to have the server offline for some period of time, for example a development environment. When data center has an outage, you do not know how long the outage might last, so this option only works if you don't need your server for a while.

The other option is to use the Azure Database for MariaDB's geo-restore feature that restores the server using geo-redundant backups. These backups are accessible even when the region your server is hosted in is offline. You can restore from these backups to any other region and bring your server back online.

> [!IMPORTANT]
> Geo-restore is only possible if you provisioned the server with geo-redundant backup storage.

## Cross-region read replicas

You can use cross region read replicas to enhance your business continuity and disaster recovery planning. Read replicas are updated asynchronously using MariaDB's binary log replication technology. Learn more about read replicas, available regions, and how to fail over from the [read replicas concepts article](concepts-read-replicas.md). 

## FAQ
### Where does Azure Database for MariaDB store customer data?
By default, Azure Database for MariaDB doesn't move or store customer data out of the region it is deployed in. However, customers can optionally chose to enable [geo-redundant backups](concepts-backup.md#backup-redundancy-options) or create [cross-region read replica](concepts-read-replicas.md#cross-region-replication) for storing data in another region.

## Next steps

- Learn more about the [automated backups in Azure Database for MariaDB](concepts-backup.md).
- Learn how to restore using [the Azure portal](howto-restore-server-portal.md) or [the Azure CLI](howto-restore-server-cli.md).
- Learn about [read replicas in Azure Database for MariaDB](concepts-read-replicas.md).