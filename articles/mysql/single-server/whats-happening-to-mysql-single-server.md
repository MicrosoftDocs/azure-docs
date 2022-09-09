---
title: What's happening to Azure Database for MySQL Single Server?
description: The Azure Database for MySQL Single Server service is being deprecated.
ms.service: mysql
ms.subservice: single-server
ms.topic: overview
author: markingmyname
ms.author: maghan
ms.reviewer: 
ms.custom: deprecation
ms.date: 09/15/2022
---

# What's happening to Azure Database for MySQL - Single Server?

Hello! We have news to share - **Azure Database for MySQL - Single Server is on the retirement path**.

After years of evolving the Azure Database for MySQL - Single Server service, it can no longer handle all the new features, functions, and security needs. We recommend that you upgrade to the Azure Database for MySQL - Flexible Server service. 

MySQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about Flexible Server, visit **[Azure Database for MySQL - Flexible Server](../flexible-server/overview.md)**.

If you currently have an Azure Database for MySQL - Single Server service hosting production servers, we're glad to let you know that you can migrate your Azure Database for MySQL - Single Server servers to the Azure Database for MySQL - Flexible Server service.

However, we know change can be disruptive to any environment, as such we want to help you with this transition.  Review the different ways to [migrate from MySQL - Single Server to MySQL - Flexible Server.](#migrate-from-single-server-to-flexible-server)

## Migrate from Single Server to Flexible Server

Learn how to migrate to Azure Database for MySQL Flexible Server.

| Scenarios | Recommended Tools | Links |
|-------|------|------------|
| Single to Flexible Server Migrations | **Offline**: Custom shell script hosted in [GitHub](https://github.com/Azure/azure-mysql/tree/master/azuremysqltomysqlmigrate) This script also moves other server components such as security settings and server parameter configurations. <br><br> **Online**: **Mydumper/Myloader with Data-in replication** | [Migrate from Azure Database for MySQL - Single 
| Offline Migrations to move databases >= 1 TB | Dump and Restore using **MyDumper/MyLoader** + High Compute VM | [Migrate large databases to Azure Database for MySQL using mydumper/myloader](concepts-migrate-mydumper-myloader.md) <br><br> [Best Practices for migrating large databases to Azure Database for MySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/best-practices-for-migrating-large-databases-to-azure-database/ba-p/1362699)|
| Offline Migrations to move databases < 1 TB | If network bandwidth between source and target is good (e.g: High-speed express route), use **Azure DMS** (database migration service) <br><br> **-OR-** <br><br> If you have low network bandwidth between source and Azure, use **Mydumper/Myloader + High compute VM** to take advantage of compression settings to efficiently move data over low speed networks  <br><br> **-OR-** <br><br> Use **mysqldump** and **MySQL Workbench Export/Import** utility to perform offline migrations for smaller databases. | [[Tutorial: Migrate MySQL to Azure Database for MySQL offline using DMS - Azure Database Migration Service](../../dms/tutorial-mysql-azure-mysql-offline-portal.md)<br><br> [Migrate Amazon RDS for MySQL to Azure Database for MySQL using MySQL Workbench](../single-server/how-to-migrate-rds-mysql-workbench.md) <br><br> [Import and export - Azure Database for MySQL |
| Online Migration |  **Mydumper/Myloader with Data-in replication** <br><br> **Mysqldump with data-in replication** can be considered for small databases(less than 100 GB). These methods are applicable to both external and intra-platform migrations. | [Configure Data-in replication - Azure Database for MySQL Flexible Server](../flexible-server/how-to-data-in-replication.md) <br><br> [Tutorial: Migrate Azure Database for MySQL – Single Server to Azure Database for MySQL – Flexible Server with minimal downtime](how-to-migrate-single-flexible-minimum-downtime.md) |

For more information about what tools to use for migration, visit [Select the right tools for migration](../migrate/how-to-decide-on-right-migration-tools.md).

> [!Warning]
> This article is not for Azure Database for MySQL - Flexible Server users. It is for Azure Database for MySQL - Single Server customers who need to upgrade to MySQL - Flexible Server.

## Next steps

We know migrating services can be a frustrating experience and we're sorry we're asking you to make this change. There are multiple ways to [migrate to MySQL - Flexible Server](#migrate-from-single-server-to-flexible-server), you can choose what works best for you and your environment.
