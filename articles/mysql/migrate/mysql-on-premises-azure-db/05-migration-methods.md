---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Migration Methods"
description: "Getting the data from the source to target will require using tools or features of MySQL to accomplish the migration."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Migration Methods

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Planning](04-planning.md)

## Overview

Getting the data from the source to target requires using tools or features of MySQL to accomplish the migration.

It's important to complete the entire assessment and planning stages before starting the next stages. The decisions and data collected are migration path and tool selection dependencies.

We explore the following commonly used tools in this section:

  - MySQL Workbench

  - mysqldump

  - mydumper and myloader

  - Data-in replication (binlog)

### MySQL Workbench

[MySQL Workbench](https://www.mysql.com/products/workbench/) provides a rich GUI experience that allows developers and administrators to design, develop, and manage their MySQL instances.

The latest version of the MySQL Workbench provides sophisticated [object migration capabilities](https://www.mysql.com/products/workbench/migrate/) when moving a database from a source to target.

#### Data Import and Export

MySQL Workbench provides a wizard-based UI to do full or partial export and import of tables and database objects. For an example of how to use the MySQL Workbench, see [Migrate your MySQL database using import and export. ](../../concepts-migrate-import-export.md)

### Dump and restore (mysqldump)

`mysqldump` is typically provided as part of the MySQL installation. It's a [client utility](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) that can be run to create logical backups that equate to a set of SQL statements that can be replayed to rebuild the database to a point in time. `mysqldump` is not intended as a fast or scalable solution for backing up or migrating large amounts of data. Executing a large set of SQL insert statements can perform poorly due to the disk I/O required to update indexes. However, when combined with other tools that require the original schema, `mysqldump` is a great tool for generating the database and table schemas. The schemas can create the target landing zone environment.

The `mysqldump` utility provides useful features during the data migration phase. Performance considerations need to be evaluated before running the utility. See [Performance considerations](../../concepts-migrate-dump-restore.md#performance-considerations).

### mydumper and myloader

Environments with large databases requiring fast migration should use [mydumper and myloader.](https://github.com/maxbube/mydumper) These tools are written in C++ and utilize multi-threaded techniques to send the data as fast as possible to the target MySQL instance. `mydumper` and `myloader` take advantage of parallelism and can speed up the migration by a factor of 10x or more.

The tools’ binary releases available for public download have been compiled for Linux. To run these tools on Windows, the open-source projects would need to be recompiled. Compiling source code and creating releases is not a trivial task for most users.

### Data-in replication (binlog)

Similar to other database management systems, MySQL provides for a log replication feature called [binlog replication.](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html) The `binlog` replication feature helps with data migration and the creation of read replicas.

Utilize binlog replication to [migrate your data  to Azure Database for MySQL](../../concepts-data-in-replication.md) in an online scenario. The data replication helps to reduce the downtime required to make the final target data changes.

In order to use the `binlog` replication feature there are some setup [requirements:](../../howto-data-in-replication.md#link-source-and-replica-servers-to-start-data-in-replication)

  - Then master server is recommended to use the MySQL InnoDB engine. If you're using a storage engine other than InnoDB, you need to migrate those tables to InnoDB.

  - Migration users must have permissions to configure binary logging and create new users on the master server.

  - If the master server has SSL enabled, ensure the SSL CA certificate provided for the domain has been included in the mysql.az\_replication\_change\_master stored procedure. Refer to the following [examples](../../howto-data-in-replication.md#link-source-and-replica-servers-to-start-data-in-replication) and the master\_ssl\_ca parameter.

  - Ensure the master server’s IP address has been added to the Azure Database for MySQL replica server’s firewall rules. Update firewall rules using the Azure portal or Azure CLI.

  - Ensure the machine hosting the master server allows both inbound and outbound traffic on port 3306.

  - Ensure the master server has an accessible IP address (public or private) from the source to the targets.

To perform a migration using replication, review [How to configure Azure Database for MySQL Data-in Replication](../../howto-data-in-replication.md#link-source-and-replica-servers-to-start-data-in-replication) for details.

The `binlog` replication method has high CPU and extra storage requirements. Migration users should test the load placed on the source system during online migrations and determine if It's acceptable.

### Azure Database Migration Service (DMS)

The [Azure Database Migration Services (DMS)](https://azure.microsoft.com/services/database-migration/) is an Azure cloud-based tool that allows administrators to keep track of the various settings for migration and reuse them if necessary. DMS works by creating migration projects with settings that point to various sources and destinations. It supports [offline migrations](../../../dms/tutorial-mysql-azure-mysql-offline-portal.md). Additionally, it supports on-premises data workloads and cloud-based workloads such as Amazon Relational Database Service (RDS) MySQL.

Although the DMS service is an online tool, it does rely on the `binlog` replication feature of MySQL to complete its tasks. Currently, DMS partially automates the offline migration process. DMS requires the generation and application of the matching schema in the target Azure Database for MySQL instance. Schemas can be exported using the `mysqldump` client utility.

### Fastest/Minimum Downtime Migration

There are plenty of paths for migrating the data. Deciding which path to take is a function of the migration team’s skill set, and the amount of downtime the database and application owners are willing to accept. Some tools support multi-threaded parallel data migration approaches while other tools were designed for simple migrations of table data only.

The fastest and most complete path is to use `binlog` replication (either directly with MySQL or via DMS), but it comes with the costs of adding primary keys.

### Decision Table

There are many paths WWI can take to migrate their MySQL workloads. We've provided a table of the potential paths and the advantages and disadvantages of each:

| Objective | Description | Tool | Prerequisites | Advantages | Disadvantages |
|-----------|-------------|------|---------------|------------|---------------|
| **Fastest migration possible** | Parallel approach| mydumper and myloader | Linux | Highly parallelized | Target throttling |
| **Online migration** | Keep the source up for as long as possible | binlog | None | Seamless | Extra processing and storage |
| **Offline migration** | Keep the source up for as long as possible | Database Migration Service (DMS)| None | Repeatable process | Limited to data only, supports all MySQL versions |
| **Highly Customized Offline Migration** | Selectively export objects | mysqldump | None | Highly customizable | Manual |
| **Offline Migration Semi-automated** | UI-based export and import | MySQL Workbench | Download and Install | Semi-automated | Only common sets of switches are supported |

### WWI Scenario

WWI has selected its conference database as its first migration workload. The workload was chosen because it had the least risk and the most available downtime due to the gap in the annual conference schedule. In addition, based on the migration team’s assessment, they determined that they attempted to perform an offline migration using MySQL Workbench.

### Migration Methods Checklist

  - Ensure the right method is selected given the target and source environments.

  - Ensure the method can meet the business requirements.

  - Always verify if the data workload supports the method.  


## Next steps

> [!div class="nextstepaction"]
> [Test Plans](./06-test-plans.md)