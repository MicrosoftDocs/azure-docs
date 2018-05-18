---
title: Replicate data from multi-cloud or on-prem databases to Azure Database for MySQL.
description: This article describes data-in replication for Azure Database for MySQL.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 5/18/2018
---

# Replicate data from multiple cloud or on-premises databases to Azure Database for MySQL

Data-in Replication allows you to synchronize data from a MySQL server that is running locally on-premises or in other hosted cloud locations into an Azure Database for MySQL server.

## When to use Data-in Replication
Data-in Replication is useful in cases where data needs to be kept up-to-date across multiple Azure Database for MySQL servers or on-premises MySQL servers. The main scenarios to consider are:

- **Hybrid Data Synchronization:** With Data-in Replication, you can keep data synchronized between your on-premises servers and Azure Database for MySQL. This synchronization is useful for creating hybrid applications. This capability is appealing when you have an existing local database server but want to move the data to a region closer to end users. It is also appealing when you consider migrating on-premises databases to the cloud and would like to host the application tiers in Azure as well.
- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-in Replication, to synchronize data between different cloud providers, ISV, or MySQL servers hosted in virtual machines into Azure Database for MySQL.

## Limitations and considerations

### Data not replicated
The mysql system database on the primary server is not replicated. This includes changes to accounts and permissions on the primary server. If you create an account on the primary server and this account needs to access the replica server, then manually create the same account on the replica server side. To understand what tables are contained in the system database, please see the [MySQL manual](https://dev.mysql.com/doc/refman/5.7/en/system-database.html).

### Requirements
- The primary and replica server versions must be the same. For example, both must be MySQL 5.6 or both must be MySQL 5.7.
- Each table must have a primary key.
- Primary server should use the MySQL InnoDB engine.

### Other
- Global transaction identifiers (GTID) are not supported

## Next steps
- Learn how to [set up data-in replication]()