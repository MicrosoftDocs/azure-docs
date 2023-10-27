---
title: Geo-disaster recovery - Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of Geo-disaster recovery with Azure Database for PostgreSQL - Flexible Server
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: alkuchar
author: AlicjaKucharczyk
ms.date: 10/23/2023
---

# Geo-disaster recovery in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Resilience against disastrous outages of data processing resources is a requirement for many enterprises and in some cases even required by industry regulations.



# Compare geo-replication with geo-redundant backup storage
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


Test application fault resiliency
regions
