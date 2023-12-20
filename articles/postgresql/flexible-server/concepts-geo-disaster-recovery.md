---
title: Geo-disaster recovery - Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of Geo-disaster recovery with Azure Database for PostgreSQL - Flexible Server
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.author: alkuchar
author: AlicjaKucharczyk
ms.date: 10/23/2023
---

# Geo-disaster recovery in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

If there's a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](../../site-recovery/azure-to-azure-architecture.md).

Flexible server provides features that protect data and mitigates downtime for your mission-critical databases during planned and unplanned downtime events. Built on top of the Azure infrastructure that offers robust resiliency and availability, flexible server offers business continuity features that provide fault-protection, address recovery time requirements, and reduce data loss exposure. As you architect your applications, you should consider the downtime tolerance - the recovery time objective (RTO), and data loss exposure - the recovery point objective (RPO). For example, your business-critical database requires stricter uptime than a test database.

## Compare geo-replication with geo-redundant backup storage
Both geo-replication with read replicas and geo-backup are solutions for geo-disaster recovery. However, they differ in the details of their offerings. To choose the right solution for your system, it's important to understand and compare their features.

| **Feature**                                            | **Geo-replication** | **Geo-backup** |
|--------------------------------------------------------|--------------------|----------------|
| <b> Automatic failover                                 | No                 | No             |
| <b> User must update connection string after failover	 | No                 | Yes            |
| <b> Can be in non-paired region                        | Yes                | No             |
| <b> Supports read scale                                | Yes                | No             |
| <b> Can be configured after the creation of the server | Yes                | No             |
| <b> Restore to specific point in time                  | No                 | Yes            |
| <b> Capacity guaranteed                                | Yes                | No             |    


## Geo-redundant backup and restore

Geo-redundant backup and restore allows you to restore your server in a different region in the event of a disaster. It also provides at least 99.99999999999999 percent (16 nines) durability of backup objects over a year.

Geo-redundant backup can be configured only at the time of server creation. When the server is configured with geo-redundant backup, the backup data and transaction logs are copied to the paired region asynchronously through storage replication.

For more information on geo-redundant backup and restore, see [geo-redundant backup and restore](/azure/postgresql/flexible-server/concepts-backup-restore#geo-redundant-backup-and-restore).

## Read replicas

Cross region read replicas can be deployed to protect your databases from region-level failures. Read replicas are updated asynchronously using PostgreSQL's physical replication technology, and can lag the primary. Read replicas are supported in general purpose and memory optimized compute tiers.

For more information on read replica features and considerations, see [Read replicas](/azure/postgresql/flexible-server/concepts-read-replicas).

## Outage detection, notification, and management

If your server is configured with geo-redundant backup, you can perform geo-restore in the paired region. A new server is provisioned and recovered to the last available data that was copied to this region.

You can also use cross region read replicas. In the event of region failure you can perform disaster recovery operation by promoting your read replica to be a standalone read-writeable server. RPO is expected to be up to 5 minutes (data loss possible) except if there's severe regional failure, the RPO can be close to the replication lag at the time of failure.

For more information on unplanned downtime mitigation and recovery after regional disaster, see [Unplanned downtime mitigation](/azure/postgresql/flexible-server/concepts-business-continuity#unplanned-downtime-mitigation).

## Next steps

> [!div class="nextstepaction"]
> [Azure Database for PostgreSQL documentation](/azure/postgresql/)

> [!div class="nextstepaction"]
> [Reliability in Azure](../../reliability/availability-zones-overview.md)
