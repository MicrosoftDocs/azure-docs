---
title: Replicate data into Azure Database for MySQL.
description: This article describes data-in replication for Azure Database for MySQL.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 05/18/2018
---

# Replicate data into Azure Database for MySQL

Data-in Replication allows you to synchronize data from a MySQL server that is running locally on-premises or in other hosted cloud locations into an Azure Database for MySQL server.

## When to use Data-in Replication
Data-in Replication can be used in cases where data needs to be kept up-to-date across Azure Database for MySQL or on-premises MySQL servers. The main scenarios to consider are:

- **Hybrid Data Synchronization:** With Data-in Replication, you can keep data synchronized between your on-premises servers and Azure Database for MySQL. This synchronization is useful for creating hybrid applications. This capability is appealing when you have an existing local database server, but want to move the data to a region closer to end users.
- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-in Replication to synchronize data between Azure Database for MySQL and different cloud providers, ISVs, or MySQL servers hosted in virtual machines.

## Limitations and considerations

### Data not replicated
The mysql system database on the primary server is not replicated. This includes changes to accounts and permissions on the primary server. If you create an account on the primary server and this account needs to access the replica server, then manually create the same account on the replica server side. To understand what tables are contained in the system database, please see the [MySQL manual](https://dev.mysql.com/doc/refman/5.7/en/system-database.html).

### Requirements
- The primary and replica server versions must be the same. For example, both must be MySQL 5.6 or both must be MySQL 5.7.
- Each table must have a primary key.
- Primary server should use the MySQL InnoDB engine.

### Other
- Global transaction identifiers (GTID) are not supported.

## Next steps
- Learn how to [set up data-in replication](howto-data-in-replication.md)