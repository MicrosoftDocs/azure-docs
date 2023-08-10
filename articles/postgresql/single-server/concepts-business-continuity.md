---
title: Business continuity - Azure Database for PostgreSQL - Single Server
description: This article describes business continuity (point in time restore, data center outage, geo-restore, replicas) when using Azure Database for PostgreSQL.
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: alkuchar
author: AwdotiaRomanowna
ms.date: 06/24/2022
---

# Overview of business continuity with Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

This overview describes the capabilities that Azure Database for PostgreSQL provides for business continuity and disaster recovery. Learn about options for recovering from disruptive events that could cause data loss or cause your database and application to become unavailable. Learn what to do when a user or application error affects data integrity, an Azure region has an outage, or your application requires maintenance.

## Features that you can use to provide business continuity

As you develop your business continuity plan, you need to understand the maximum acceptable time before the application fully recovers after the disruptive event - this is your Recovery Time Objective (RTO). You also need to understand the maximum amount of recent data updates (time interval) the application can tolerate losing when recovering after the disruptive event - this is your Recovery Point Objective (RPO).

Azure Database for PostgreSQL provides business continuity features that include geo-redundant backups with the ability to initiate geo-restore, and deploying read replicas in a different region. Each has different characteristics for the recovery time and the potential data loss. With [Geo-restore](concepts-backup.md) feature, a new server is created using the backup data that is replicated from another region. The overall time it takes to restore and recover depends on the size of the database and the amount of logs to recover. The overall time to establish the server varies from few minutes to few hours. With [read replicas](concepts-read-replicas.md), transaction logs from the primary are asynchronously streamed to the replica. In the event of a primary database outage due to a zone-level or a region-level fault, failing over to the replica provides a  shorter RTO and reduced data loss.

> [!NOTE]
> The lag between the primary and the replica depends on the latency between the sites, the amount of data to be transmitted and most importantly on the write workload of the primary server. Heavy write workloads can generate significant lag. 
>
> Because of asynchronous nature of replication used for read-replicas, they **should not** be considered as a High Availability (HA) solution since the higher lags can mean higher RTO and RPO. Only for workloads where the lag remains smaller through the peak and non-peak times of the workload, read replicas can act as a HA alternative. Otherwise read replicas are intended for true read-scale for ready heavy workloads and for (Disaster Recovery) DR scenarios.

The following table compares RTO and RPO in a **typical workload** scenario:

| **Capability** | **Basic** | **General Purpose** | **Memory optimized** |
| :------------: | :-------: | :-----------------: | :------------------: |
| Point in Time Restore from backup | Any restore point within the retention period <br/> RTO - Varies <br/>RPO < 15 min| Any restore point within the retention period <br/> RTO - Varies <br/>RPO < 15 min | Any restore point within the retention period <br/> RTO - Varies <br/>RPO < 15 min |
| Geo-restore from geo-replicated backups | Not supported | RTO - Varies <br/>RPO < 1 h | RTO - Varies <br/>RPO < 1 h |
| Read replicas | RTO - Minutes* <br/>RPO < 5 min* | RTO - Minutes* <br/>RPO < 5 min*| RTO - Minutes* <br/>RPO < 5 min*|

\* RTO and RPO **can be much higher** in some cases depending on various factors including latency between sites, the amount of data to be transmitted, and importantly primary database write workload. 

## Recover a server after a user or application error

You can use the service’s backups to recover a server from various disruptive events. A user may accidentally delete some data, inadvertently drop an important table, or even drop an entire database. An application might accidentally overwrite good data with bad data due to an application defect, and so on.

You can perform a **point-in-time-restore** to create a copy of your server to a known good point in time. This point in time must be within the backup retention period you have configured for your server. After the data is restored to the new server, you can either replace the original server with the newly restored server or copy the needed data from the restored server into the original server.

We recommend that you use [Azure resource lock](../../azure-resource-manager/management/lock-resources.md) to help prevent accidental deletion of your server. If you accidentally deleted your server, you might be able to restore it if the deletion happened within the last 5 days. For more information, see [Restore a dropped Azure Database for PostgreSQL server](how-to-restore-dropped-server.md).

## Recover from an Azure data center outage

Although rare, an Azure data center can have an outage. When an outage occurs, it causes a business disruption that might only last a few minutes, but could last for hours.

One option is to wait for your server to come back online when the data center outage is over. This works for applications that can afford to have the server offline for some period of time, for example a development environment. When a data center has an outage, you do not know how long the outage might last, so this option only works if you don't need your server for a while.

## Geo-restore

The geo-restore feature restores the server using geo-redundant backups. The backups are hosted in your server's [paired region](../../availability-zones/cross-region-replication-azure.md). You can restore from these backups to any other region. The geo-restore creates a new server with the data from the backups. Learn more about geo-restore from the [backup and restore concepts article](concepts-backup.md).

> [!IMPORTANT]
> Geo-restore is only possible if you provisioned the server with geo-redundant backup storage. If you wish to switch from locally redundant to geo-redundant backups for an existing server, you must take a dump using pg_dump of your existing server and restore it to a newly created server configured with geo-redundant backups.

## Cross-region read replicas

You can use cross region read replicas to enhance your business continuity and disaster recovery planning. Read replicas are updated asynchronously using PostgreSQL's physical replication technology, and may lag the primary. Learn more about read replicas, available regions, and how to fail over from the [read replicas concepts article](concepts-read-replicas.md).

## FAQ

### Where does Azure Database for PostgreSQL store customer data?

By default, Azure Database for PostgreSQL doesn't move or store customer data out of the region it is deployed in. However, customers can optionally chose to enable [geo-redundant backups](concepts-backup.md#backup-redundancy-options) or create [cross-region read replica](concepts-read-replicas.md#cross-region-replication) for storing data in another region.

## Next steps

- Learn more about the [automated backups in Azure Database for PostgreSQL](concepts-backup.md). 
- Learn how to restore using [the Azure portal](how-to-restore-server-portal.md) or [the Azure CLI](how-to-restore-server-cli.md).
- Learn about [read replicas in Azure Database for PostgreSQL](concepts-read-replicas.md).
