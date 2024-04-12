---
title: Business continuity - Azure Database for MariaDB
description: Learn about business continuity (point-in-time restore, datacenter outage, geo-restore) when you're using the Azure Database for MariaDB service.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: conceptual
ms.date: 06/24/2022
---

# Overview of business continuity with Azure Database for MariaDB

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

This article describes the capabilities that Azure Database for MariaDB provides for business continuity and disaster recovery. Learn about options for recovering from disruptive events that could cause data loss or cause your database and application to become unavailable. Learn what to do when a user error or application error affects data integrity, an Azure region has an outage, or your application needs maintenance.

## Features for business continuity

As you develop your business continuity plan, you need to understand your:

- **Recovery time objective (RTO)**: The maximum acceptable time before the application fully recovers after a disruptive event.
- **Recovery point objective (RPO)**: The maximum amount of recent data updates (time interval) that the application can tolerate losing when it's recovering after a disruptive event.

Azure Database for MariaDB provides business continuity and disaster recovery features that include geo-redundant backups with the ability to initiate geo-restore, and deploying read replicas in another region. Each has different characteristics for the recovery time and the potential data loss.

With [geo-restore](concepts-backup.md), Azure Database for MariaDB creates a new server by using the backup data that's replicated from another region. The overall time to restore and recover depends on the size of the database and the amount of log data to recover. The overall time to establish the server varies from few minutes to few hours.

With [read replicas](concepts-read-replicas.md), transaction logs from the primary database are asynchronously streamed to a replica. If there's a primary database outage due to a zone-level or a region-level fault, failing over to the replica provides a shorter RTO and reduced data loss.

> [!NOTE]
> The lag between the primary database and the replica depends on the latency between the sites, the amount of data to be transmitted, and (most important) the write workload of the primary server. Heavy write workloads can generate a significant lag.
>
> Because of the asynchronous nature of the replication that's used for read replicas, don't consider read replicas to be a high-availability solution. The higher lags can mean higher RTO and RPO. Read replicas can act as a high-availability alternative only for workloads where the lag remains smaller through the peak and off-peak times. Otherwise, read replicas are intended for true read scale for read-heavy workloads and for disaster recovery scenarios.

The following table compares RTO and RPO in a *typical workload* scenario:

| Capability | Basic | General purpose | Memory optimized |
| :------------: | :-------: | :-----------------: | :------------------: |
| Point-in-time restore from backup | Any restore point within the retention period <br/> RTO varies <br/>RPO is less than 15 minutes| Any restore point within the retention period <br/> RTO varies <br/>RPO is less than 15 minutes | Any restore point within the retention period <br/> RTO varies <br/>RPO is less than 15 minutes |
| Geo-restore from geo-replicated backups | Not supported | RTO varies <br/>RPO is greater than 24 hours | RTO varies <br/>RPO is greater than 24 hours |
| Read replicas | RTO is minutes <br/>RPO is less than 5 minutes | RTO is minutes <br/>RPO is less than 5 minutes| RTO is minutes <br/>RPO is less than 5 minutes|

RTO and RPO *can be much higher* in some cases, depending on factors like latency between sites, the amount of data to be transmitted, and the primary database's write workload.

## Recovery of a server after a user or application error

You can use the service's backups to recover a server from various disruptive events. For example, a user might accidentally delete some data, inadvertently drop an important table, or even drop an entire database. An application might accidentally overwrite good data with bad data because of an application defect.

You can perform a point-in-time-restore to create a copy of your server to a known good point in time. This point in time must be within the backup retention period that you configured for your server. After the data is restored to the new server, you can either replace the original server with the newly restored server or copy the needed data from the restored server to the original server.

> [!IMPORTANT]
> You can restore deleted servers only within *five days* of deletion. After five days, the backups are deleted. You can access and restore the database backup only from the Azure subscription that hosts the server. To restore a dropped server, refer to the [documented steps](howto-restore-dropped-server.md). To help protect server resources from accidental deletion or unexpected changes after deployment, administrators can use [management locks](../azure-resource-manager/management/lock-resources.md).

## Recovery from an Azure regional datacenter outage

Although it's rare, an Azure datacenter can have an outage. When an outage occurs, it causes a business disruption that might last only a few minutes but could last for hours.

One option is to wait for your server to come back online when the datacenter outage is over. When datacenter has an outage, you don't know how long the outage might last. So this option works only for applications that can afford to have the server offline for some time (for example, a development environment).

## Geo-restore

The geo-restore feature restores the server by using geo-redundant backups. The backups are hosted in your server's [paired region](../availability-zones/cross-region-replication-azure.md). These backups are accessible even when the region where your server is hosted is offline. You can restore from these backups to any other region and then bring your server back online. Learn more about geo-restore in the [article about backup and restore concepts](concepts-backup.md).

> [!IMPORTANT]
> Geo-restore is possible only if you provisioned the server with geo-redundant backup storage. If you want to switch from locally redundant to geo-redundant backups for an existing server, you must generate a backup of your existing server by using [mysqldump](howto-migrate-dump-restore.md). Then, restore to a newly created server that's configured with geo-redundant backups.

## Cross-region read replicas

You can use cross-region read replicas to enhance your planning for business continuity and disaster recovery. Read replicas are updated asynchronously through MySQL's replication technology for binary logs. Learn more about read replicas, available regions, and how to fail over in the [article about read replica concepts](concepts-read-replicas.md).

## FAQ

### Where does Azure Database for MariaDB store customer data?

By default, Azure Database for MariaDB doesn't move or store customer data out of the region where it's deployed. However, you can optionally choose to enable [geo-redundant backups](concepts-backup.md#backup-redundancy-options) or create [cross-region read replicas](concepts-read-replicas.md#cross-region-replication) for storing data in another region.

## Next steps

- Learn more about the [automated backups in Azure Database for MariaDB](concepts-backup.md).
- Learn how to restore by using [the Azure portal](howto-restore-server-portal.md) or [the Azure CLI](howto-restore-server-cli.md).
- Learn about [read replicas in Azure Database for MariaDB](concepts-read-replicas.md).
