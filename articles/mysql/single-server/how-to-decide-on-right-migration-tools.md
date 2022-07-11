---
title: "Select the right tools for migration to Azure Database for MySQL"
description: "This topic provides a decision table which helps customers in picking the right tools for migrating into Azure Database for MySQL"
ms.service: mysql
ms.subservice: single-server
author: shriram-muthukrishnan
ms.author: shriramm
ms.reviewer: maghan
ms.topic: how-to
ms.custom:
ms.date: 10/12/2021
---

# Select the right tools for migration to Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

## Overview

Migrations are multi-step projects that are tough to pull off. Migrating database servers across platforms involves more than data and schema migration. There are also several other components, such as server configuration parameters, networking, access control rules, etc., to move. These are required to ensure that the functionality of the database server in the new target platform mimics the source. 

For detailed information and use cases about migrating databases to Azure Database for MySQL, you can refer to the [Database Migration Guide](../migrate/mysql-on-premises-azure-db/01-mysql-migration-guide-intro.md). This document provides pointers that will help you successfully plan and execute a MySQL migration to Azure. 

In general, migrations can be categorized as either offline or online. 

- With an offline migration, the source server is taken offline and a dump and restore of the databases is performed on the target server. 

- With an online migration (migration with minimal downtime), the source server allows updates, and the migration solution will take care of replicating the ongoing changes between the source and target server along with the initial dump and restore on the target. 

If your application can afford some downtime, offline migrations are always the preferred choice, as they are simple and easy to execute. However, if your application can only afford minimal downtime, an online migration is the best choice. Migrations of the majority of OLTP systems, such as payment processing and e-commerce, fall into this category. 

## Decision table

To help you with selecting the right tools for migrating to Azure Database for MySQL, consider the detail in the following table. 

| Scenarios | Recommended Tools | Links |
|-------|------|------------|
| Offline Migrations to move databases >= 1 TB | Dump and Restore using **MyDumper/MyLoader** + High Compute VM | [Migrate large databases to Azure Database for MySQL using mydumper/myloader](concepts-migrate-mydumper-myloader.md) <br><br> [Best Practices for migrating large databases to Azure Database for MySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/best-practices-for-migrating-large-databases-to-azure-database/ba-p/1362699)|
| Offline Migrations to move databases < 1TB  | If network bandwidth between source and target is good (e.g: Highspeed express route), use **Azure DMS** (database migration service)  <br><br>   **-OR-** <br><br> If you have low network bandwidth between source and Azure, use **Mydumper/Myloader + High compute VM** to take advantage of compression settings to efficiently move data over low speed networks  <br><br> **-OR-** <br><br> Use **mysqldump** and **MySQL Workbench Export/Import** utility to perform offline migrations for smaller databases.  | [Tutorial: Migrate MySQL to Azure Database for MySQL offline using DMS - Azure Database Migration Service](../../dms/tutorial-mysql-azure-mysql-offline-portal.md)<br><br>  [Migrate Amazon RDS for MySQL to Azure Database for MySQL using MySQL Workbench](how-to-migrate-rds-mysql-workbench.md)<br><br>  [Import and export - Azure Database for MySQL](concepts-migrate-import-export.md)|
| Online Migration |  **Mydumper/Myloader with Data-in replication** <br><br> **Mysqldump with data-in replication** can be considered for small databases( less than 100GB).  These methods are applicable to both external and intra-platform migrations. | [Configure Data-in replication - Azure Database for MySQL Flexible Server](../flexible-server/how-to-data-in-replication.md) <br><br> [Tutorial: Migrate Azure Database for MySQL – Single Server to Azure Database for MySQL – Flexible Server with minimal downtime](how-to-migrate-single-flexible-minimum-downtime.md) |
|Single to Flexible Server Migrations |  **Offline**: Custom shell script hosted in [GitHub](https://github.com/Azure/azure-mysql/tree/master/azuremysqltomysqlmigrate) This script also moves other server components such as security settings and server parameter configurations. <br><br>**Online**: **Mydumper/Myloader with Data-in replication** |  [Migrate from Azure Database for MySQL - Single Server to Flexible Server in 5 easy steps!](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/migrate-from-azure-database-for-mysql-single-server-to-flexible/ba-p/2674057)<br><br>   [Tutorial: Migrate Azure Database for MySQL – Single Server to Azure Database for MySQL – Flexible Server with minimal downtime](how-to-migrate-single-flexible-minimum-downtime.md)| 

## Next steps
* [Migrate MySQL on-premises to Azure Database for MySQL](../migrate/mysql-on-premises-azure-db/01-mysql-migration-guide-intro.md)

<br><br>
