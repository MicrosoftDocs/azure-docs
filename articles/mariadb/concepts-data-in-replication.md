---
title: Replicate data into Azure Database for MariaDB.
description: This article describes data-in replication for Azure Database for MariaDB.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 07/11/2019
---

# Replicate data into Azure Database for MariaDB

Data-in Replication allows you to synchronize data from a MariaDB server running on-premises, in virtual machines, or database services hosted by other cloud providers into the Azure Database for MariaDB service. Data-in Replication is based on the binary log (binlog) file position-based replication native to MariaDB. To learn more about binlog replication, see the [binlog replication overview](https://mariadb.com/kb/en/library/replication-overview/).

## When to use Data-in Replication
The main scenarios to consider using Data-in Replication are:

- **Hybrid Data Synchronization:** With Data-in Replication, you can keep data synchronized between your on-premises servers and Azure Database for MariaDB. This synchronization is useful for creating hybrid applications. This method is appealing when you have an existing local database server, but want to move the data to a region closer to end users.
- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-in Replication to synchronize data between Azure Database for MariaDB and different cloud providers, including virtual machines and database services hosted in those clouds.

## Limitations and considerations

### Data not replicated
The [*mysql system database*](https://mariadb.com/kb/en/library/the-mysql-database-tables/) on the master server is not replicated. Changes to accounts and permissions on the master server are not replicated. If you create an account on the master server and this account needs to access the replica server, then manually create the same account on the replica server side. To understand what tables are contained in the system database, see the [MariaDB documentation](https://mariadb.com/kb/en/library/the-mysql-database-tables/).

### Requirements
- The master server version must be at least MariaDB version 10.2.
- The master and replica server versions must be the same. For example, both must be MariaDB version 10.2.
- Each table must have a primary key.
- Master server should use the InnoDB engine.
- User must have permissions to configure binary logging and create new users on the master server.

### Other
- Data-in replication is only supported in General Purpose and Memory Optimized pricing tiers.

## Next steps
- Learn how to [set up data-in replication](howto-data-in-replication.md).
